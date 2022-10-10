import fileUpload from 'express-fileupload';
import {StorageOperationController} from '../hyperledger/StorageOperationController';
import ipfsService from '../ipfs/ipfs.service';
import {KFSEntry} from './files.interfaces';

class FilesController {
  async createFile(userId: string, file: fileUpload.UploadedFile) {
    console.log(
      `[INFO] files.controller - createFile: Create file for user with id ${userId}`
    );
    try {
      return await ipfsService
        .createFile(userId, file)
        .then((files: KFSEntry[]) => {
          console.log('[DEBUG] files.controller - createFile: files', files);

          files.forEach((file: KFSEntry) => {
            new StorageOperationController().createFileOperation(
              userId,
              file.id,
              'WRITE'
            );
          });

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
      return await ipfsService.listFiles().then((files: KFSEntry[]) => {
        console.log('[DEBUG] files.controller - listFiles: files', files);

        files.forEach((file: KFSEntry) => {
          new StorageOperationController().createFileOperation(
            userId,
            file.id,
            'READ'
          );
        });

        return files;
      });
    } catch (error) {
      console.log('[ERROR] files controller - listFiles:', error);
      throw error;
    }
  }

  async getFile(userId: string, fileCID: string) {
    console.log(
      `[INFO] files.controller - getFile: Download file with id ${fileCID}`
    );
    try {
      return await ipfsService
        .readFile(fileCID)
        .then(file => {
          console.log('[DEBUG] files.controller - getFile: ', file);
          new StorageOperationController().createFileOperation(
            userId,
            fileCID,
            'READ'
          );
          return file;
        })
        .catch(error => {
          throw error;
        });
    } catch (error) {
      console.log('[ERROR] files controller - getFile:', error);
      throw error;
    }
  }

  async deleteFile(userId: string, fileName: string): Promise<string | void> {
    console.log(
      `[INFO] files.controller - deleteFile: delete file with name ${fileName}`
    );
    try {
      return await ipfsService
        .deleteFile(`/${fileName}`)
        .then(message => {
          console.log('[DEBUG] files.controller - deleteFile: ', fileName);
          new StorageOperationController().createFileOperation(
            userId,
            '###',
            'DELETE'
          );
          message;
        })
        .catch(error => {
          throw error;
        });
    } catch (error) {
      console.log('[ERROR] files controller - deleteFile:', error);
      throw error;
    }
  }
}

export default new FilesController();
