import {Response, Request} from 'express';
import fileUpload from 'express-fileupload';
import {StorageOperationController} from '../hyperledger/StorageOperationController';
import ipfsService from '../ipfs/ipfs.service';
import {mockListOfFiles, mockSingleFile, mocksNewFileList} from './mock/files';
class FilesController {
  private storageOperationController: StorageOperationController;

  constructor() {
    this.storageOperationController = new StorageOperationController();
  }

  async createFile(req: Request, res: Response) {
    try {
      console.log(`[INFO] Create file for user with id ${req.params.userId}`);
      if (!req.files) {
        console.log(`[ERROR] Missing file`);
        return res.status(500).send('Missing file');
      }
      const file = <fileUpload.UploadedFile>req.files?.file;
      console.log(file);

      // return res.status(200).send(mocksNewFileList);
      // TODO Add filehash
      let fileHash = 'TODO_FILEHASH';
      this.storageOperationController.createFileOperation(
        req.params.userId,
        fileHash,
        'WRITE'
      );

      const result = await ipfsService.createFile(req.params.userId, file);
      res.status(200).send(result);
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).send('Something went wrong on IPFS createFile');
    }
  }

  async listFiles(req: Request, res: Response) {
    // @TODO: Implement user authentication.
    console.log(`Listing files for userId ${req.params.userId}`);
    // res.status(200).send(mockListOfFiles);
    await ipfsService
      .listFiles()
      .then(files => {
        //TODO IMPLEMEHTT THIS THING
        this.storageOperationController.createFileOperation(
          req.params.userId,
          req.params.userId,
          'READ'
        );
        res.status(200).send(files);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        res.status(500).send('Something went wrong on IPFS listFiles');
      });
  }

  async getFile(req: Request, res: Response) {
    console.log(`Download file with id ${req.params.fileId}`);
    const fileCID = req.params.fileId;
    if (!fileCID) res.status(400).send('File CID must be set!');
    // res.status(200).send(mockSingleFile);
    await ipfsService
      .readFile(fileCID)
      .then(file => {
        this.storageOperationController.createFileOperation(
          req.params.userId,
          fileCID,
          'READ'
        );
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
      .then(message => {
        //TODO RESOLVE THIS
        const fileCID = fileName;
        this.storageOperationController.createFileOperation(
          req.params.userId,
          fileCID,
          'DELETE'
        );
        res.status(200).send(message);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        res.status(500).send('Something went wrong on IPFS deleteFile');
      });
  }
}

export default new FilesController();
