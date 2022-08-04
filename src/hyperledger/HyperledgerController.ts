import { Gateway, Wallets } from 'fabric-network';
import * as fs from 'fs';

export class HyperledgerControler {
    private networkConfiguration: any;
    private wallet: any;

    constructor() {
        this.networkConfiguration = JSON.parse(fs.readFileSync(`${process.env.CCP_PATH}`, 'utf8')); // load the network configuration
        this.wallet = Wallets.newFileSystemWallet(`${process.env.WALLET_PATH}`); // Create a new file system based wallet for managing identities.
    }

    /**
     *  @method checkUserExists
     *  @description Checks if wallet address is registered on hyperledger network
     *  @param walletAddress 
     */
    public async checkUserExists(walletAddress: string): Promise<boolean> {
        const identity = await this.wallet.get(walletAddress);
        if (identity) {
            return true;
        }
        console.log("There is no identity for \""+walletAddress+"\" does not exist in the network");
        return false;
    }

    /**
     *  @method getContract
     *  @description Gets specific contract for a walletAddress, idenitty name in a channel
     *  @param walletAddress 
     */
    public async getContract(walletAddress: string, contractName: string, channel: string): Promise<any> {
        const gateway = new Gateway(); // Create a new gateway for connecting to our peer node.
        await gateway.connect(this.networkConfiguration, { wallet: this.wallet, identity: walletAddress, discovery: { enabled: true, asLocalhost: process.env.ENV ? true : false } });

        const network = await gateway.getNetwork(channel);// Channel network.

        return network.getContract(contractName);
    }

    public async executeTransaction(contract: any, transaction: string): Promise<string> {
        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction(transaction);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result.toString();
    }
}
