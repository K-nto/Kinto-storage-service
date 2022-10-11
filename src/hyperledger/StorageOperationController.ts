import {HyperledgerController} from './HyperledgerController';
import {StorageOperation} from './contracts/StorageOperation.interface';

export class StorageOperationController {
  //TODO we can use this to show / check history
  public async getAllFileOperations(
    walletAddress: string
  ): Promise<StorageOperation[]> {
    const transactionResultPayload = await (
      await HyperledgerController.create()
    ).executeTransaction(
      walletAddress,
      'mychannel',
      'kinto',
      'queryAllFileOperations'
    );
    console.log(
      '[DEBUG] getAllFileOperations payload:',
      transactionResultPayload
    );
    return JSON.parse(transactionResultPayload);
  }

  public async getFileOperation(
    walletAddress: string,
    ID: string
  ): Promise<StorageOperation> {
    const transactionResultPayload = await (
      await HyperledgerController.create()
    ).executeTransaction(
      walletAddress,
      'mychannel',
      'kinto',
      'queryFileOperation',
      ID
    );
    console.log(
      '[DEBUG] queryFileOperation payload:',
      transactionResultPayload
    );
    return JSON.parse(transactionResultPayload);
  }

  public async createFileOperation(
    walletAddress: string,
    fileHash: string,
    operation: string
  ) {
    const transactionResultPayload = await (
      await HyperledgerController.create()
    ).executeTransaction(
      walletAddress,
      'mychannel',
      'kinto',
      'createFileOperation',
      fileHash,
      walletAddress,
      operation
    );
    console.log('[DEBUG] createFileOperation:', transactionResultPayload);
    return '';
  }

  public async modifyFile(
    walletAddress: string,
    operationId: string,
    fileHash: string
  ) {
    const transactionResultPayload = await (
      await HyperledgerController.create()
    ).executeTransaction(
      walletAddress,
      'mychannel',
      'kinto',
      'modifyFile',
      operationId,
      fileHash
    );
    console.log('[DEBUG] modifyFile:', transactionResultPayload);
    return JSON.parse(transactionResultPayload);
  }
}
