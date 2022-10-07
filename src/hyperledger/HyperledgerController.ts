import {Gateway, Wallet, Wallets} from 'fabric-network';
import * as fs from 'fs';
import {Authenticator} from './Auithenticator';
import * as grpc from '@grpc/grpc-js';
import path from 'path';
import {
  connect,
  Contract,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';

const cryptoPath = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'hyperledger',
    'fabric-samples',
    'test-network',
    'organizations',
    'peerOrganizations',
    'org1.example.com'
  )
);
const certPath = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
    'User1@org1.example.com-cert.pem'
  )
);
const keyDirectoryPath = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore')
);
const tlsCertPath = envOrDefault(
  'TLS_CERT_PATH',
  path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
);
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export class HyperledgerController {
  private networkConfiguration: any;
  private wallet: Wallet;
  private authenticator: Authenticator;

  private constructor(walletInstance: Wallet, networkConfiguration: any) {
    this.networkConfiguration = networkConfiguration;
    this.wallet = walletInstance;
    this.authenticator = new Authenticator(
      this.wallet,
      this.networkConfiguration,
      String(process.env.CA_ORG_ID)
    );
  }

  async newIdentity(): Promise<Identity> {
    const credentials = await fs.readFileSync(certPath);
    return {mspId, credentials};
  }

  async newSigner(): Promise<Signer> {
    const files = await fs.readdirSync(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFileSync(keyPath);
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
  }

  private async newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFileSync(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
      'grpc.ssl_target_name_override': peerHostAlias,
    });
  }

  /**
   * @method create
   * @async
   * @description factory to generate hyperEdgerController
   */
  public static async create(): Promise<HyperledgerController> {
    const walletInstance = await Wallets.newFileSystemWallet(
      String(process.env.WALLET_PATH)
    ); // Create a new file system based wallet for managing identities.

    const networkConfiguration = JSON.parse(
      fs.readFileSync(String(process.env.CCP_PATH), 'utf8')
    ); // load the network configuration

    return new HyperledgerController(walletInstance, networkConfiguration);
  }

  /**
   * @method executeTransaction
   * @async
   * @description executes a transaction
   * @param walletAddress
   * @param channel
   * @param contractName
   * @param transaction - One ore more transaction querries
   */
  public async executeTransaction(
    walletAddress: string,
    channel: string,
    contractName: string,
    transaction: string,
    ...transactionArgs: string[]
  ): Promise<string> {
    try {
      console.debug(
        '[DEBUG] Connecting to gateway: ',
        this.networkConfiguration,
        this.wallet,
        walletAddress
      );
      const client = await this.newGrpcConnection();

      const gateway = connect({
        client,
        identity: await this.newIdentity(),
        signer: await this.newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
          return {deadline: Date.now() + 5000}; // 5 seconds
        },
        endorseOptions: () => {
          return {deadline: Date.now() + 15000}; // 15 seconds
        },
        submitOptions: () => {
          return {deadline: Date.now() + 5000}; // 5 seconds
        },
        commitStatusOptions: () => {
          return {deadline: Date.now() + 60000}; // 1 minute
        },
      }); // Create a new gateway for connecting to our peer node.

      /* await gateway.connect(this.networkConfiguration, {
        wallet: this.wallet,
        identity: walletAddress,
        discovery: {enabled: true, asLocalhost: true},
      }); */
      console.debug('[DEBUG] Connection successful');

      console.debug('[DEBUG] Getting network: ', channel);
      const network = await gateway.getNetwork(channel);

      console.debug('[DEBUG] Getting contract:', contractName);
      const contract = network.getContract(contractName);

      console.debug(
        '[DEBUG] Evaluating transaction:',
        transaction,
        transactionArgs
      );
      const result =
        transactionArgs.length > 0
          ? await contract.evaluateTransaction(transaction, ...transactionArgs)
          : await contract.evaluateTransaction(transaction);
      console.debug('[DEBUG] Disconnecting gateway');
      await gateway.close();
      return result.toString();
    } catch (error) {
      console.log('[ERROR] Transaction failed: ', error);
      return '';
    }
  }

  public getAuthenticator(): Authenticator {
    return this.authenticator;
  }
}
