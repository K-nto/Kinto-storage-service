import {CommonRoutesConfig} from '../common/common.routes.config';
import {Application, Request, Response, NextFunction} from 'express';
import {USERS} from '../common/common.routes.consts';
import {UsersController} from './users.controller';
import logger from 'node-color-log';
import {UserInterface} from './User.entity';

export class UsersRoutes extends CommonRoutesConfig {
  private usersController: UsersController;

  constructor(app: Application) {
    super(app, 'UsersRoutes');
    this.usersController = new UsersController();
  }
  configureRoutes() {
    // @TODO: User CRUD routes
    this.app
      .route(`/${USERS}`)
      .get((req: Request, res: Response) => {
        res.status(200).send('TODO: List of users');
      })
      .post((req: Request, res: Response) => {
        logger.info('Registering user:', req.body);
        this.usersController
          .registerUser(req.body.address, req.body.secret)
          .then((registeredUser: boolean) => {
            if (!registeredUser) {
              logger.warn('User could not be created', req.body);
              res.status(500).send(false);
            }
            res.status(200).send(true);
          })
          .catch((error: any) => {
            logger.error('Something went wrong at registering user', error);
            res.status(500).send();
          });
      });

    this.app
      .route(`/${USERS}/:userId`)
      .get((req: Request, res: Response) => {
        logger.info('Authenticating user:', req.params.userId);
        this.usersController
          .loginUser(req.params.userId, '')
          .then((userInfo: UserInterface) => {
            if (!userInfo) {
              logger.warn('User not found', req.params.userId, req.params);
              res.status(500).send({
                address: '',
                name: '',
                availableSpace: 0,
                usedSpace: 0,
              });
            }
            res.status(200).send({
              address: userInfo.address,
              name: userInfo.name,
              availableSpace: userInfo.availableSpace,
              usedSpace: userInfo.usedSpace,
            });
          })
          .catch((error: any) => {
            logger.error(
              'Something went wrong at get request on user.routes',
              error
            );
            res.status(500).send();
          });
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
