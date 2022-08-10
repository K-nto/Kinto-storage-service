import debug from 'debug';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import {FilesRoutes} from './files/files.routes.config';
import {NodesRoutes} from './nodes/nodes.routes.config';
import express from 'express';
import * as http from 'http';
import cors = require('cors');
import { HyperledgerController } from './hyperledger/HyperledgerController';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

require('dotenv').config();
/*

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
*/

console.log('ALO');
const abc = async () => {
  try {
    const hyperledgerController = await HyperledgerController.create();
    const mspid = "Org1MSP";
    const user = "appUser";

    console.log("Registering admin")
    //await hyperledgerController.getAuthenticator().registerAdmin(mspid);
    console.log("OK")

    console.log("Registering user")
    //await hyperledgerController.getAuthenticator().registerUser(user, "org1.department1", mspid);
    console.log("OK")

    console.log("Executing transaction")
    const transactionResult = await hyperledgerController.executeTransaction(user, "mychannel", "fabcar", "queryCar", "CAR4");
    
    console.log("Transaction Result: ", transactionResult)
  } catch (error) {
    console.log(error);
  }
}
abc().then((response) => console.log("FINISHED"));