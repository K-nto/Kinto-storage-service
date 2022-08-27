import {Application, Request, Response, NextFunction} from 'express';
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
        next();
      })
      .get(filesController.listFiles)
      .post(filesController.createFile);

    this.app
      .route(`/${USERS}/:userId/${FILES}/:fileId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: User authentication @TODO: Register on Hyperledger
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
