import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as debug from 'debug';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import {FilesRoutes} from './files/files.routes.config';
import {NodesRoutes} from './nodes/nodes.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

routes.push(new UsersRoutes(app));
routes.push(new FilesRoutes(app));
routes.push(new NodesRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
