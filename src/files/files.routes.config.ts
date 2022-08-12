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
      .post(filesController.createFile)
      // @TODO: this uses filename and it's not really usable in a multiple-node context.
      .delete(filesController.deleteFile);

    this.app
      .route(`/${USERS}/:userId/${FILES}/:fileId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: User authentication @TODO: Register on Hyperledger
        next();
      })
      .get(filesController.getFile)
      .patch((req: Request, res: Response) => {
        // @TODO: Define if possible
        res.status(200).send(`TODO: PATCH file for id ${req.params.fileId}`);
      });

    return this.app;
  }
}
