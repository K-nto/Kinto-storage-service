import debug from 'debug';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import {FilesRoutes} from './files/files.routes.config';
import {NodesRoutes} from './nodes/nodes.routes.config';
import express from 'express';
import * as http from 'http';
import {HyperledgerController} from './hyperledger/HyperledgerController';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {StorageOperationController} from './hyperledger/StorageOperationController';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

require('dotenv').config();

app.use(fileUpload());
app.use(express.json());
app.use(cors());

routes.push(new UsersRoutes(app));
routes.push(new FilesRoutes(app));
routes.push(new NodesRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Healthcheck: OK!');
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
/*
const abc = async () => {
  try {
    const hyperledgerController = await HyperledgerController.create();
    const mspid = 'Org1MSP';
    const user = 'appUser';

    console.log('Registering admin');
    //await hyperledgerController.getAuthenticator().registerAdmin(mspid);
    console.log('OK');

    console.log('Registering user');
    //await hyperledgerController.getAuthenticator().registerUser(user, 'org1.department1', mspid);
    console.log('OK');

    /*
    console.log('Executing transaction createFileOperation');
    const transactionResult_1 = await hyperledgerController.executeTransaction(
      user,
      'mychannel',
      'kinto',
      'createFileOperation',
      '#THISISAFILEHASHFEDEPUTO',
      'walletxd',
      'WRITE'
    );
    console.log('Transaction Result: ', transactionResult_1); 
    */

/*
    console.log('Executing getAllFileOperations');
    await storageOperationController.getAllFileOperations(user);
    console.log('Executing getFileOperation');

    await storageOperationController.getFileOperation(
      user,
      '30b32cb55beb33df54c29bcc15caafd21114f5eaa89e81194864c2abe1bfd709'
    );


    console.log('Executing transaction queryAllFileOperations');
    const transactionResult = await hyperledgerController.executeTransaction(
      user,
      'mychannel',
      'kinto',
      'createFileOperation',
      '###',
      '###',
      '###'
    );
    console.log('Transaction Result: ', transactionResult);

    const storageOperationController: StorageOperationController =
      new StorageOperationController();
    console.log('Executing createFileOperations');
    await storageOperationController.createFileOperation(
      user,
      'ESTOESUNFILEHASH',
      'WRITE'
    );

    console.log('Executing getAllFileOperations');
    await storageOperationController.getAllFileOperations(user);
  } catch (error) {
    console.log(error);
  }
};
abc().then(response => console.log('FINISHED'));

*/
