import {CID, create} from 'ipfs-http-client';

/** Probably a service instead of a controller */
export class IPFSController {
  private ipfsHttpClient;

  constructor() {
    // @TODO: set new url
    this.ipfsHttpClient = create();
  }

  // @TODO: determine file properties
  public async createFiles(filesArray: Array<any>) {
    await filesArray.forEach(file => {
      this.ipfsHttpClient.files.write('/' + file.name, file, {
        create: true,
      });
    });
  }

  public readFile(cid: string) {
    return cid;
  }

  public async updateFile(file: any) {
    return file;
  }

  public async deleteFile(cid: CID) {
    return cid;
  }
}
