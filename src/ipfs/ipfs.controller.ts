import {MFSEntry} from 'ipfs-core-types/src/files';
import {CID, create, IPFSHTTPClient} from 'ipfs-http-client';
import all from 'it-all';

/** Probably a service instead of a controller
 * @TODO: Better error handling
 */
export class IPFSController {
  private static ipfsHttpClient: IPFSHTTPClient;
  /**
   * Immutable vs mutable FS debate needs to happen
   * Better to decide it once we figure out IPFS node architecture
   */

  constructor() {
    // @TBD: Network url
    if (!IPFSController.ipfsHttpClient)
      IPFSController.ipfsHttpClient = create();
  }

  /**
   * Writes files in the node. By default, it creates them in the '/' dir.
   * If another dir is prefered, should be added to the file name
   * Don't forget file extension in the name
   * Since files.write returns void, a files.ls call is done for each new file to return its IPFS data
   * @param filesArray
   * @returns Array<MFSEntry> w/ the results from the node
   * @TODO: test if JS File native type is cool with IPFS
   */
  public async createFiles(filesArray: Array<File>) {
    const filePaths: Array<string> = [];
    const result: Array<MFSEntry> = [];
    await filesArray.forEach(file => {
      // adds to the root dir
      filePaths.push('/' + file.name);
      IPFSController.ipfsHttpClient.files.write('/' + file.name, file, {
        create: true,
      });
    });
    await filePaths.forEach(async path =>
      result.push(...(await all(IPFSController.ipfsHttpClient.files.ls(path))))
    );
    return result;
  }

  /**
   * Reads the file chuncks from ipfs and returns a buffer
   * WARNING: Immutable read: CID is required. If wanted to implement search with path, this needs to be modified/replaced.
   * Chose this method because its assumed the CID will be available on query.
   * But I fear it's inconsistent with the other methods
   * @param cid file CID
   * @returns Buffer
   */
  public async readFile(cid: CID) {
    const fileChunks = [];
    for await (const chunk of IPFSController.ipfsHttpClient.cat(cid)) {
      fileChunks.push(chunk);
    }
    return Buffer.concat(fileChunks);
    // return Buffer.from(fileChunks.toString())
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
    const result: Array<MFSEntry> = [];
    IPFSController.ipfsHttpClient.files.write('/' + file.name, file);
    result.push(
      ...(await all(IPFSController.ipfsHttpClient.files.ls(file.name)))
    );
    return result;
  }

  /**
   * Not _really_ possible, but done through MFS
   * Deleting by path/filename will not be a good idea if multiple nodes exist.
   * @param path: Path to file as string. Don't forget extension.
   * @returns string on success, otherwise throws error
   */
  public async deleteFile(path: string) {
    return await IPFSController.ipfsHttpClient.files
      .rm(path)
      .then(() => `FILE ON PATH ${path} DELETED`)
      .catch(error => {
        throw error;
      });
  }
}
