import {Gateway, Wallet, Wallets} from 'fabric-network';
import * as fs from 'fs';
import {Authenticator} from './Auithenticator';

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
    const walletInstance = await Wallets.newFileSystemWallet(String(process.env.WALLET_PATH)); // Create a new file system based wallet for managing identities.

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
    const gateway = new Gateway(); // Create a new gateway for connecting to our peer node.
    
    await gateway.connect(this.networkConfiguration, {
      wallet: this.wallet,
      identity: walletAddress,
      discovery: {enabled: true, asLocalhost: true},
    }); 

    const network = await gateway.getNetwork(channel);

    const contract = network.getContract(contractName);

    const result = await contract.evaluateTransaction(transaction, transactionArgs.toString());
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );

    await gateway.disconnect();
    return result.toString();
  } catch (error) {
    console.log("[ERROR] Transaction failed: ", error);
    return ""
  }
  }

  public getAuthenticator(): Authenticator {
    return this.authenticator;
  }
}
