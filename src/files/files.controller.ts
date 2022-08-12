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
      res.status(500).send('Something went wrong on IPFS createFile');
    }
  }

  async listFiles(req: Request, res: Response) {
    // @TODO: Implement user authentication.
    console.log(`Listing files for userId ${req.params.userId}`);
    await ipfsService
      .listFiles()
      .then(files => {
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
