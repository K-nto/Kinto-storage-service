import {HyperledgerController} from './HyperledgerController';
import {StorageOperation} from './contracts/StorageOperation.interface';

require('dotenv').config();
const CHAINCODE_NAME = process.env.CHAINCODE_NAME ?? '';
const CHANNEL_ID = process.env.CHANNEL_ID ?? '';

export class StorageOperationController {
  //TODO we can use this to show / check history
  public async getAllFileOperations(
    walletAddress: string
  ): Promise<StorageOperation[]> {
    const transactionResultPayload = await (
      await HyperledgerController.create()
    ).executeTransaction(
      walletAddress,
      CHANNEL_ID,
      CHAINCODE_NAME,
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
      CHANNEL_ID,
      CHAINCODE_NAME,
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
      CHANNEL_ID,
      CHAINCODE_NAME,
      'createFileOperation',
      fileHash,
      walletAddress.toString(),
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
      CHANNEL_ID,
      CHAINCODE_NAME,
      'modifyFile',
      operationId,
      fileHash
    );
    console.log('[DEBUG] modifyFile:', transactionResultPayload);
    return JSON.parse(transactionResultPayload);
  }
}
