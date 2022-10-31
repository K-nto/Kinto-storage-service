import {CommonRoutesConfig} from '../common/common.routes.config';
import {Application, Request, Response, NextFunction} from 'express';
import {USERS} from '../common/common.routes.consts';
import {authorized, getUserInfo} from '../common/authorization.service';

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
        if (!authorized(req.params.userId, req.headers.authorization)) {
          console.debug(
            '[Authorization] Failed authentication for user: ',
            req.params.userId
          );

          res.status(403).send('Invalid credentials');
          return;
        }
        console.debug(
          '[Authorization] Authenticated user: ',
          req.params.userId
        );

        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(getUserInfo(req.params.userId));
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
