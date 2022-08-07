import {Gateway, Wallet, Wallets} from 'fabric-network';
import * as fs from 'fs';
import path from 'path';
import {Authenticator} from './Auithenticator';

export class HyperledgerController {
  private networkConfiguration: any;
  private wallet: Wallet;
  private authenticator: Authenticator;

  constructor(walletInstance: Wallet, networkConfiguration: any) {
    this.networkConfiguration = networkConfiguration;
    this.wallet = walletInstance;
    this.authenticator = new Authenticator(
      this.wallet,
      this.networkConfiguration,
      String(process.env.CA_ORG_ID)
    );
  }

  public static async create(): Promise<HyperledgerController> {
    const ccpPath = path.resolve(__dirname, String(process.env.CCP_PATH));

    const walletInstance = await Wallets.newFileSystemWallet(`${process.env.WALLET_PATH}`); // Create a new file system based wallet for managing identities.

    const networkConfiguration = JSON.parse(
      fs.readFileSync(String(process.env.CCP_PATH), 'utf8')
    ); // load the network configuration

    return new HyperledgerController(walletInstance, networkConfiguration);
  }


  public async executeTransaction(
    walletAddress: string,
    channel: string,
    contractName: string,

    transaction: string
  ): Promise<string> {
    const gateway = new Gateway(); // Create a new gateway for connecting to our peer node.
    await gateway.connect(this.networkConfiguration, {
      wallet: this.wallet,
      identity: walletAddress,
      discovery: {enabled: true, asLocalhost: process.env.ENV ? true : false},
    });

    const network = await gateway.getNetwork(channel); // Channel network.

    const contract = network.getContract(contractName);

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction(transaction);
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );

    await gateway.disconnect();
    return result.toString();
  }

  public getAuthenticator(): Authenticator {
    return this.authenticator;
  }
}
