import {CommonRoutesConfig} from '../common/common.routes.config';
import {Application, Request, Response, NextFunction} from 'express';
import {USERS} from '../common/common.routes.consts';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UsersRoutes');
  }
  configureRoutes() {
    // @TODO: User CRUD routes
    this.app
      .route(`/${USERS}`)
      .get((req: Request, res: Response) => {
        res.status(200).send('TODO: List of users');
      })
      .post((req: Request, res: Response) => {
        res.status(200).send('TODO: Post new user');
      });

    this.app
      .route(`/${USERS}/:userId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // Middleware executed on every route. @TODO: Validation @TODO: Authentication
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`TODO: GET user info for ${req.params.userId}`);
      })
      .patch((req: Request, res: Response) => {
        res
          .status(200)
          .send(`TODO: PATCH user info for id ${req.params.userId}`);
      })
      .delete((req: Request, res: Response) => {
        res
          .status(200)
          .send(`TODO: DELETE user info for id ${req.params.userId}`);
      });

    return this.app;
  }
}