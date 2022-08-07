import {Gateway, Wallets} from 'fabric-network';
import * as fs from 'fs';
import {Authenticator} from './Auithenticator';

export class HyperledgerControler {
  private networkConfiguration: any;
  private wallet: any;
  private authenticator: Authenticator;

  constructor() {
    this.networkConfiguration = JSON.parse(
      fs.readFileSync(`${process.env.CCP_PATH}`, 'utf8')
    ); // load the network configuration
    this.wallet = Wallets.newFileSystemWallet(`${process.env.WALLET_PATH}`); // Create a new file system based wallet for managing identities.
    this.authenticator = new Authenticator(
      this.networkConfiguration,
      String(process.env.ORG_ID)
    );
  }

  /**
   *  @method getContract
   *  @description Gets specific contract for a walletAddress, idenitty name in a channel
   *  @param walletAddress
   */
  public async getContract(
    walletAddress: string,
    contractName: string,
    channel: string
  ): Promise<any> {
    const gateway = new Gateway(); // Create a new gateway for connecting to our peer node.
    await gateway.connect(this.networkConfiguration, {
      wallet: this.wallet,
      identity: walletAddress,
      discovery: {enabled: true, asLocalhost: process.env.ENV ? true : false},
    });

    const network = await gateway.getNetwork(channel); // Channel network.

    const contract = network.getContract(contractName);

    await gateway.disconnect();
    return contract;
  }

  public async executeTransaction(
    contract: any,
    transaction: string
  ): Promise<string> {
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction(transaction);
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    return result.toString();
  }

  public getAuthenticator(): Authenticator {
    return this.authenticator;
  }
}
