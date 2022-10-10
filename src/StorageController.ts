import {HyperledgerController} from './hyperledger/HyperledgerController';

//TODO improve error messages
export class StorageController {
  private hyperledgerController: HyperledgerController;

  constructor(hyperledgerControllerInstance: HyperledgerController) {
    this.hyperledgerController = hyperledgerControllerInstance;
  }

  /**
   * SaveFile
   */
  public saveFile(walletAddress: string, file: any): void {
    if (
      !this.hyperledgerController
        .getAuthenticator()
        .checkUserExists(walletAddress)
    )
      return; //TODO Return some error or sth

    //TODO define contract name
    //TODO define channel name
    //const constract = this.hyperledgerController.getContract()

    //TODO execute some transaction
    //const response = this.hyperledgerController.executeTransaction();

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
    if (
      !this.hyperledgerController
        .getAuthenticator()
        .checkUserExists(walletAddress)
    )
      return; //TODO Return some error or sth

    //TODO define contract name
    //TODO define channel name
    //const constract = this.hyperledgerController.getContract()

    //TODO execute some transaction
    //const response = this.hyperledgerController.executeTransaction();
    /*
        //TODO Implement IPFS
        */
  }
}
