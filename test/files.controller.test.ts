import FilesController from '../src/files/files.controller';

describe('Test files.controller.ts', () => {
  const filesController = FilesController;
  const USER_ID = 'appUser';

  test('listFiles', async () => {
    const fileList = await filesController.listFiles(USER_ID);
    console.log(fileList);
  });
});
