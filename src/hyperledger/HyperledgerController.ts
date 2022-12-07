import {Gateway, Wallet, Wallets, X509Identity} from 'fabric-network';
import * as fs from 'fs';
import {Authenticator} from './Auithenticator';
const path = require('path');

export class HyperledgerController {
  private networkConfiguration: any;
  private wallet: Wallet;
  private authenticator: Authenticator;

  private constructor(walletInstance: Wallet, networkConfiguration: any) {
    this.networkConfiguration = networkConfiguration;
    this.wallet = walletInstance;
    this.authenticator = new Authenticator(
      this.wallet,
      this.networkConfiguration,
      String(process.env.CA_ORG_ID)
    );
  }

  /**
   * @method create
   * @async
   * @description factory to generate hyperEdgerController
   */
  public static async create(): Promise<HyperledgerController> {
    const walletInstance = await Wallets.newFileSystemWallet(
      String(process.env.WALLET_PATH)
    ); // Create a new file system based wallet for managing identities.

    const networkConfiguration = JSON.parse(
      fs.readFileSync(String(process.env.CCP_PATH), 'utf8')
    ); // load the network configuration

    return new HyperledgerController(walletInstance, networkConfiguration);
  }

  /**
   * @method executeTransaction
   * @async
   * @description executes a transaction
   * @param walletAddress
   * @param channel
   * @param contractName
   * @param transaction - One ore more transaction querries
   */
  public async executeTransaction(
    walletAddress: string,
    channel: string,
    contractName: string,
    transaction: string,
    ...transactionArgs: string[]
  ): Promise<string> {
    try {
      console.log('[INFO] Transaction', transaction, transactionArgs);
      console.debug(
        '[DEBUG] Connecting to gateway: ',
        this.networkConfiguration,
        this.wallet,
        walletAddress
      );
      const gateway: Gateway = await this.connectGateway();

      console.debug('[DEBUG] Connection successful');

      console.debug(
        '[DEBUG] Getting network:',
        channel,
        process.env.CHANNEL_ID
      );
      const network = await gateway.getNetwork(channel);

      console.debug('[DEBUG] Getting contract:', contractName);
      const contract = network.getContract(contractName);

      console.debug(
        '[INFO] Evaluating transaction:',
        transaction,
        transactionArgs,
        contract
      );
      const resultBytes =
        transactionArgs.length > 0
          ? await contract.submitTransaction(transaction, ...transactionArgs)
          : await contract.evaluateTransaction(transaction);

      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      const utf8Decoder = new TextDecoder();

      const resultJson = utf8Decoder.decode(resultBytes);
      console.debug('[DEBUG] Disconnecting gateway');
      await gateway.disconnect();

      return resultJson;
    } catch (error) {
      console.log('[ERROR] Transaction failed: ', error);
      return '{}';
    }
  }

  private async registerWallet() {
    try {
      console.log('[INFO] Registering wallet');
      const ADMIN_CERT = await fs.readFileSync(
        String(process.env.ADMIN_CERT),
        'utf8'
      );
      const ADMIN_PRIVATE_KEY = await fs.readFileSync(
        String(process.env.ADMIN_PRIVATE_KEY),
        'utf8'
      );

      const wallet = this.wallet;
      const identityLabel = String(process.env.IDENTITY_LABEL);

      const existingIdentity = await wallet.get(identityLabel);
      if (existingIdentity) {
        await wallet.remove(identityLabel);
      }

      const identity: X509Identity = {
        credentials: {
          certificate: ADMIN_CERT,
          privateKey: ADMIN_PRIVATE_KEY,
        },
        mspId: String(process.env.MSP_ID),
        type: 'X.509',
      };
      await wallet.put(identityLabel, identity);
    } catch (error: any) {
      console.log(`[ERROR] Error adding to wallet. ${error}`);
      console.log(error.stack);
    }
  }

  private async connectGateway(): Promise<Gateway> {
    const gateway = new Gateway();
    await this.registerWallet();
    const wallet = await Wallets.newFileSystemWallet(
      path.join(process.cwd(), process.env.WALLET_PATH)
    );

    console.log('[INFO] CONNECT GATEWAY');
    await gateway.connect(this.networkConfiguration, {
      identity: 'Admin',
      wallet: wallet,
      discovery: {enabled: true, asLocalhost: false},
    });
    console.log('[DEBUG] success');
    return gateway;
  }

  public getAuthenticator(): Authenticator {
    return this.authenticator;
  }
}
