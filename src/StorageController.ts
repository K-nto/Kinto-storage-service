import {HyperledgerControler} from "./hyperledger/HyperledgerController";

    //TODO improve error messages
export class StorageController {
    private hyperledgerController: HyperledgerControler;
    constructor() {
        this.hyperledgerController = new HyperledgerControler();
    }

    /**
     * SaveFile
     */
    public saveFile(walletAddress: string, file: any) {
        if (!this.hyperledgerController.checkUserExists(walletAddress)) return false; //TODO Return some error or sth
        
        //TODO define contract name
        //TODO define channel name
        const constract = this.hyperledgerController.getContract(walletAddress, "write", "some_channel") 
        
        //TODO execute some transaction
        const response = this.hyperledgerController.executeTransaction(constract, "{}")
        console.log("SAVED FILE", response);

        /*
        //TODO Implement IPFS 
        */
    }

    
    /**
     * @method getFile
     * @param walletAddress 
     * @param fileLocation
     */

    //TODO define file location
    public getFile(walletAddress: string, fileLocation: any) {
        if (!this.hyperledgerController.checkUserExists(walletAddress)) return false; //TODO Return some error or sth
        
        //TODO define contract name
        //TODO define channel name
        const constract = this.hyperledgerController.getContract(walletAddress, "read", "some_channel") 
        
        //TODO execute some transaction
        const response = this.hyperledgerController.executeTransaction(constract, "{}")
        console.log("SAVED FILE", response);

        /*
        //TODO Implement IPFS 
        */
    }
}