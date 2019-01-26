/* eslint-env jest */
import packager from '..';
import { resolve } from 'path';

test('Packager', async () => {
  const entryFilePath = resolve(__dirname, 'src/service.js');
  const zipFilePath = resolve(__dirname, 'dist/service.zip');
  await packager(entryFilePath, zipFilePath);
});
