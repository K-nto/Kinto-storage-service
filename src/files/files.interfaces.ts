import {MFSEntry} from 'ipfs-core-types/src/files';

export interface KFSEntry extends MFSEntry {
  // Kinto File System Entry
  id: string;
  txHistory?: Array<any>;
}
