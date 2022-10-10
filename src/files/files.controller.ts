import {Response, Request} from 'express';
import fileUpload from 'express-fileupload';
import {HyperledgerController} from '../hyperledger/HyperledgerController';
import {StorageOperationController} from '../hyperledger/StorageOperationController';
import ipfsService from '../ipfs/ipfs.service';
import {StorageController} from '../StorageController';
class FilesController {
  async createFile(userId: string, file: fileUpload.UploadedFile) {
    console.log(
      `[INFO] files.controller - createFile: Create file for user with id ${userId}`
    );
    try {
      return await ipfsService
        .createFile(userId, file)
        .then(files => {
          console.log('[DEBUG] files.controller - createFile: files', files);
          new StorageOperationController().createFileOperation(
            userId,
            '###',
            'write'
          );
          return files;
        })
        .catch(error => error);
    } catch (error) {
      console.log('[ERROR] files controller - createFile:', error);
      throw error;
    }
  }

  async listFiles(userId: string) {
    console.log(
      `[INFO] files.controller - listFiles: Listing files for userId ${userId}`
    );
    try {
      return await ipfsService.listFiles().then(files => {
        console.log('[DEBUG] files.controller - listFiles: files', files);
        new StorageOperationController().createFileOperation(
          userId,
          '###',
          'READ'
        );
        return files;
      });
    } catch (error) {
      console.log(
        '[ERROR] files controller - listFiles:',
        JSON.stringify(error)
      );
      throw error;
    }
  }

  async getFile(req: Request, res: Response) {
    console.log(`Download file with id ${req.params.fileId}`);
    const fileCID = req.params.fileId;
    if (!fileCID) res.status(400).send('File CID must be set!');
    await ipfsService
      .readFile(fileCID)
      .then(file => {
        console.log('File returned');
        res.status(200).send(file);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        res.status(500).send('Something went wrong on IPFS readFile');
      });
  }

  async deleteFile(req: Request, res: Response) {
    const fileName = req.body.fileName;
    if (!fileName) res.status(400).send('Missing fileName');
    await ipfsService
      .deleteFile(`/${fileName}`)
      .then(message => res.status(200).send(message))
      .catch(err => {
        console.log(JSON.stringify(err));
        res.status(500).send('Something went wrong on IPFS deleteFile');
      });
  }
}

export default new FilesController();
