import {Gateway, Wallet, Wallets, X509Identity} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { Console } from 'console';

export class Authenticator {
  private networkConfiguration: any; 
  private wallet: Wallet;
  private certificateAuthorityInfo: any;

  constructor(walletInstance: Wallet, networkConfiguration: any, organizationId: string) {
    this.wallet = walletInstance;
    this.networkConfiguration = networkConfiguration;
    this.certificateAuthorityInfo =
      this.networkConfiguration.certificateAuthorities[organizationId];
  }


  /**
   *  @method checkUserExists
   *  @async
   *  @description Checks if wallet address is registered on hyperledger network
   *  @param walletAddress
   *  @return boolean
   */
  public async checkUserExists(walletAddress: string): Promise<boolean> {
    const identity = await this.wallet.get(walletAddress);
    if (identity) {
      return true;
    }
    console.log(
      'There is no identity for "' +
        walletAddress +
        '" does not exist in the network'
    );
    return false;
  }

  /**
   * @method registerUser
   * @async
   * @param userWalletAddress
   * @param organization
   * @param mspid
   * @description registers user wallet in network
   */
  public async registerUser(
    userWalletAddress: string,
    organization: string,
    mspId: string
  ) {
    // Register the user, enroll the user, and import the new identity into the wallet.
    // Organization = 'org1.department1'
    try {
      const certificateAuthority = new FabricCAServices(
        this.certificateAuthorityInfo.url
      );

      //TODO check this logic
      /*if (await this.checkUserExists(userWalletAddress))
        throw new Error(
          'A user is already registered with the following wallet address: ' +
            userWalletAddress
        );*/

      const adminUser = await this.getAdminContext();
      const secret = await certificateAuthority.register(
        {
          affiliation: organization,
          enrollmentID: userWalletAddress,
          role: 'client',
        },
        adminUser
      );

      return await this.enrollIdentity(
        certificateAuthority,
        userWalletAddress,
        secret,
        mspId
      );
    } catch (error) {
      console.log('An error ocurred while registering user: ', error);
      return false;
    }
  }

  /**
   * @method registerAdmin
   * @async
   * @param mspId
   * @description registers admin wallet in network
   */
  public async registerAdmin(mspId: string): Promise<boolean> {
    try {
      // organization = ca.org1.example.com
      const TLSCertificate = this.certificateAuthorityInfo.tlsCACerts.pem;
      const certificateAuthority: FabricCAServices = new FabricCAServices(
        this.certificateAuthorityInfo.url,
        {trustedRoots: TLSCertificate, verify: false},
        this.certificateAuthorityInfo.caName
      );


      //await this.getAdminIdentity(); //Check identity exists

      // Enroll the admin user, and import the new identity into the wallet.
      return await this.enrollIdentity(
        certificateAuthority,
        String(process.env.ADMIN_WALLET),
        String(process.env.ADMIN_WALLET_SECRET),
        mspId
      );
    } catch (error) {
      console.log('An issue ocurred while registering admin: ', error);
      return false;
    }
  }

  /**
   * @method enrollIdentity
   * @async
   * @param (FabricCAServices) Ceritificate authority client
   * @param (string) walletAddress - User id
   * @param (string) secret
   * @param (string) mspId
   * @description enrolls an identiity into the network
   * @returns boolean
   */
  private async enrollIdentity(
    client: FabricCAServices,
    walletAddress: string,
    secret: string,
    mspId: string
  ): Promise<boolean> {
    try {
        //TODO issue with admin wallet address and secret
      const enrollment = await client.enroll({
        enrollmentID: walletAddress,
        enrollmentSecret: secret,
      });
      const x509Identity: X509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: mspId,
        type: 'X.509',
      };
      await this.wallet.put(walletAddress, x509Identity);
      console.log(
        'Successfully enrolled wallet ' +
          walletAddress +
          ' and imported it into the wallet'
      );

      return true;
    } catch (error) {
      console.log(
        'An error ocurred while trying to enrol identity: ' + walletAddress
      );
      return false;
    }
  }

  /**
   * @method getAdminIdentity
   * @async
   * @description gets admin identity
   */
  private async getAdminIdentity(): Promise<any> {
    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await this.wallet.get(`${process.env.ADMIN_WALLET}`);
    if (!adminIdentity)
      throw new Error(
        'There is not an admin identity registered with the foillowing address: ' +
          String(process.env.ADMIN_WALLET)
      );
    return adminIdentity;
  }

  /**
   * @method getAdminContext
   * @async
   * @description gets admin context
   * @returns adminContext
   */
  private async getAdminContext(): Promise<any> {
    try {
      const adminIdentity = await this.getAdminIdentity();

      const provider = this.wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      return await provider.getUserContext(
        adminIdentity,
        `${process.env.ADMIN_WALLET}`
      );
    } catch (error) {
      console.log('An error ocurred while getting admin context: ', error);
      throw new Error("Coudln't get admin context.");
    }
  }
}
