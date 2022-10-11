import {CID} from 'multiformats/cid';
import {KFSEntry} from '../files.interfaces';

export const mockListOfFiles: Array<KFSEntry> = [
  {
    name: 'Picture.jpg',
    type: 'file',
    size: 39393993,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqasf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqasf3oclgtqy55fbzdi',
  },
  {
    name: 'movie.mov',
    type: 'file',
    size: 123123,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26df3efuylqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26df3efuylqabf3oclgtqy55fbzdi',
  },
  {
    name: 'file.doc',
    type: 'file',
    size: 448389289,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3eduylqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3eduylqabf3oclgtqy55fbzdi',
  },
  {
    name: 'excel.xslx',
    type: 'file',
    size: 123123123,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nfrefuylqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nfrefuylqabf3oclgtqy55fbzdi',
  },
  {
    name: 'printer.pdf',
    type: 'file',
    size: 123123123154,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nv3efuylqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nv3efuylqabf3oclgtqy55fbzdi',
  },
  {
    name: 'MyFolder',
    type: 'directory',
    size: 8,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3qfuylqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3qfuylqabf3oclgtqy55fbzdi',
  },
];

export const mockSingleFile = mockListOfFiles[0];

export const mocksNewFileList = [
  ...mockListOfFiles,
  {
    name: 'Extrafile.png',
    type: 'file',
    size: 12312312345,
    cid: CID.parse(
      'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efualqabf3oclgtqy55fbzdi'
    ),
    id: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efualqabf3oclgtqy55fbzdi',
  },
];
