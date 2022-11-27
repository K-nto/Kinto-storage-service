import {UploadedFile} from 'express-fileupload';
import {MFSEntry} from 'ipfs-core-types/src/files';
import {create, IPFSHTTPClient} from 'ipfs-http-client';
import all from 'it-all';
import {KFSEntry} from '../files/files.interfaces';
import {IEncryptedFile} from '../files/interfaces/IEncryptedFile.interface';

const IPFS_DEFAULT_URL = 'http://127.0.0.1:5001/api/v0';

class IPFSService {
  private static ipfsHttpClient: IPFSHTTPClient;
  /**
   * Immutable vs mutable FS debate needs to happen
   * Better to decide it once we figure out IPFS node architecture
   */

  constructor() {
    // @TBD: Network url
    if (!IPFSService.ipfsHttpClient)
      IPFSService.ipfsHttpClient = create({
        url: process.env.IPFS_API ?? IPFS_DEFAULT_URL,
      });
  }

  /**
   * Writes files in the node. By default, it creates them in the '/' dir.
   * If another dir is prefered, should be added to the file name
   * Don't forget file extension in the name
   * Since files.write returns void, a files.ls call is done for each new file to return its IPFS data
   * @param filesArray
   * @returns Array<MFSEntry> w/ the results from the node
   * @TODO: test if JS File native type is cool with IPFS
   * @TODO: add userId to file?? <- In theory, ipfs stores annonymous, encrypted chunks of the files.
   */
  public async createFile(
    userId: string,
    file: IEncryptedFile
  ): Promise<KFSEntry[]> {
    const userPath = `/${userId}`;
    const filePath = `${userPath}/${file.name}`;
    console.log('[DEBUG] IPFSService - createFile', userId, file.name);
    await IPFSService.ipfsHttpClient.files.write(
      filePath,
      JSON.stringify(file),
      {
        create: true,
        parents: true,
      }
    );
    return await this.listFiles(userId);
  }

  /**
   * lists all the files in a directory
   * @param dir defaults to '/' (node root)
   * @returns Array<MFSEntry> w/ the results from the node
   * @TODO: will have to change once userId is implemented
   */
  public async listFiles(userId: string, dir = '/'): Promise<KFSEntry[]> {
    const baseDir = `/${userId}${dir}`;
    console.log('[DEBUG] IPFSService - listFiles', baseDir);
    return await (
      await all(IPFSService.ipfsHttpClient.files.ls(baseDir)).catch(err => [])
    ).map(file => this.ipfsToKinto(file));
  }

  /**
   * Reads the file chuncks from ipfs and returns a buffer
   * WARNING: Immutable read: CID is required. If wanted to implement search with path, this needs to be modified/replaced.
   * Chose this method because its assumed the CID will be available on query.
   * But I fear it's inconsistent with the other methods
   * @param cid file CID
   * @returns Buffer
   */
  public async readFile(cid: string) {
    const fileChunks = [];
    for await (const chunk of IPFSService.ipfsHttpClient.cat(cid)) {
      fileChunks.push(chunk);
    }
    return Buffer.concat(fileChunks).toString().split('}')[0].concat('}');
  }
  /**
   * Overwrites a file that already exists (AKA, has the same name) in the root dir
   * similar implementation to write file wo create:true
   * a files.ls request is done to return the information from the new file
   * WARNING: CID of the file is modified.
   * Maybe we should do the updates 'softly' in other systems
   * @param file
   * @returns
   */
  public async updateFile(file: File) {
    const result: Array<KFSEntry> = [];
    // IPFSService.ipfsHttpClient.files.write('/' + file.name, file);
    // result.push(...(await all(IPFSService.ipfsHttpClient.files.ls(file.name))));
    return result;
  }

  /**
   * Not _really_ possible, but done through MFS
   * Deleting by path/filename will not be a good idea if multiple nodes exist.
   * @param path: Path to file as string. Don't forget extension.
   * @returns string on success, otherwise throws error
   */
  public async deleteFile(path: string) {
    return await IPFSService.ipfsHttpClient.files
      .rm(path)
      .then(() => `FILE ON PATH ${path} DELETED`)
      .catch(error => {
        throw error;
      });
  }

  private ipfsToKinto(file: MFSEntry) {
    return {...file, id: file.cid.toString()};
  }
}

export default new IPFSService();
