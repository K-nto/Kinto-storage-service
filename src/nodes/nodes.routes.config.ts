import {Application, Request, Response, NextFunction} from 'express';
import {CommonRoutesConfig} from '../common/common.routes.config';
import {NODES, USERS} from '../common/common.routes.consts';

export class NodesRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'NodesRoutes');
  }
  configureRoutes() {
    this.app
      .route(`/${USERS}/:userId/${NODES}/`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication @TODO: Hyperledger (some)
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`TODO: GET node List for ${req.params.userId}`);
      })
      .post((req: Request, res: Response) => {
        res.status(200).send(`TODO: POST new node for ${req.params.userId}`);
      });

    this.app
      .route(`/${USERS}/:userId/${NODES}/:nodeId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication @TODO: Hyperledger (some)
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`TODO: GET node info for ${req.params.nodeId}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`TODO: PATCH node info for ${req.params.nodeId}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`TODO: DELETE node info for ${req.params.nodeId}`);
      });

    return this.app;
  }
}
