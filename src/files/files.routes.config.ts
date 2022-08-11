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
      .get((req: Request, res: Response) => {
        res
          .status(200)
          .send(`TODO: GET list of files for ${req.params.userId}`);
      })
      .post(filesController.createFile);

    this.app
      .route(`/${USERS}/:userId/${FILES}/:fileId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: User authentication @TODO: Register on Hyperledger
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`TODO: GET file for ${req.params.fileId}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`TODO: PATCH file for id ${req.params.fileId}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`TODO: DELETE file for id ${req.params.fileId}`);
      });

    return this.app;
  }
}
