import {IPFSHTTPClient} from 'ipfs-http-client';
import {IPFSController} from './ipfs.controller';
import {mock} from 'ts-mockito';

describe('IPFS Controller', () => {
  let controller: IPFSController;
  let ipfsHttpClientMock: IPFSHTTPClient;

  beforeEach(() => {
    ipfsHttpClientMock = mock<IPFSHTTPClient>();

    controller = new IPFSController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
