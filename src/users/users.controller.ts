import {HyperledgerControler} from './../hyperledger/HyperledgerController';

//TODO improve error messages
export class UsersController {
  private hyperledgerController: HyperledgerControler;
  constructor(hyperledgerControllerInstance: HyperledgerControler) {
    this.hyperledgerController = hyperledgerControllerInstance;
  }

  /**
   * @method registerUser
   * @param walletAddress
   * @param fileLocation
   */

  //TODO define file location
  public async registerUser(walletAddress: string, fileLocation: any) {
    if (
      !this.hyperledgerController
        .getAuthenticator()
        .checkUserExists(walletAddress)
    )
      return; //TODO Return some error or sth
    if (
      !this.hyperledgerController
        .getAuthenticator()
        .checkUserExists(`${process.env.ADMIN_WALLET}`)
    )
      return; //TODO Return some error or sth
  }
}
