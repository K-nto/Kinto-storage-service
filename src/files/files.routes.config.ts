import {Application, Request, Response, NextFunction} from 'express';
import fileUpload from 'express-fileupload';
import {CommonRoutesConfig} from '../common/common.routes.config';
import {FILES, USERS} from '../common/common.routes.consts';
import filesController from './files.controller';

export class FilesRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'FilesRoutes');
  }
  configureRoutes() {
    this.app
      .route(`/${USERS}/:userId/${FILES}`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation  @TODO: User authentication @TODO: Register on Hyperledger
        console.debug('[Hyperledeger] Authenticated user: ', req.params.userId);

        console.debug(
          '[Hyperledeger] Generated transaction: ',
          Math.random().toString(16).substr(16)
        );
        next();
      })
      .get((req: Request, res: Response) =>
        filesController
          .listFiles(req.params.userId)
          .then(fileList => res.status(201).send(fileList))
          .catch(error =>
            res.status(500).send('Something went wrong on IPFS listFiles')
          )
      )
      .post((req: Request, res: Response) => {
        const file = <fileUpload.UploadedFile>req.files?.file;

        if (!file) res.status(400).send('Missing file');

        filesController
          .createFile(req.params.userId, file)
          .then(result => res.status(200).send(result))
          .catch(error =>
            res.status(500).send('Something went wrong on IPFS createFile')
          );
      });

    this.app
      .route(`/${USERS}/:userId/${FILES}/:fileId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: User authentication @TODO: Register on Hyperledger
        console.debug('[Hyperledeger] Authenticated user: ', req.params.userId);

        console.debug(
          '[Hyperledeger] Generated transaction: ',
          Math.random().toString(16).substr(16)
        );
        next();
      })
      .get(filesController.getFile)
      // @TODO: Define if possible
      .patch((req: Request, res: Response) => {
        res.status(200).send(`TODO: PATCH file for id ${req.params.fileId}`);
      })
      // @TODO: this uses filename and it's not really usable in a multiple-node context.
      // @TODO: will make more sense for it to use :fileId BUT you can't delete files with the CID... not really sure why
      .delete(filesController.deleteFile);

    return this.app;
  }
}
