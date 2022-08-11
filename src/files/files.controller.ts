import {Response, Request} from 'express';

import fileUpload from 'express-fileupload';
import ipfsService from '../ipfs/ipfs.service';
class FilesController {
  async createFile(req: Request, res: Response) {
    try {
      console.log(`Create file for user with id ${req.params.userId}`);
      const file = <fileUpload.UploadedFile>req.files?.file;
      if (!file) res.status(400).send('Missing file');
      console.log('file received ok');
      const result = await ipfsService.createFile(req.params.userId, file);
      res.status(200).send(result);
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(500).send('Something went wrong on IPFS upload');
    }
  }
}

export default new FilesController();
