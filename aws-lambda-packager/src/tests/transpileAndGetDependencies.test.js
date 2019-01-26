/* eslint-env jest */
import { resolve, relative } from 'path';
import transpileAndGetDependencies from '../transpileAndGetDependencies';

test('transpileAndGetDependencies', async () => {
  const entryFilePath = resolve(__dirname, 'src/service.js');
  const { dependencies } = await transpileAndGetDependencies(entryFilePath);
  const projectRootFolderPath = resolve(__dirname, '../../');
  const normalizedDeps = dependencies.map((ob) => ({
    ...ob,
    ...[
      'dependencyFolderPath',
      'yarnLockFilePath',
      'packageJsonFilePath',
      'projectFolder',
    ].reduce(
      (c, key) => ({
        ...c,
        [key]: relative(projectRootFolderPath, ob[key]),
      }),
      {},
    ),
  }));
  expect(normalizedDeps).toEqual([
    {
      dependencyFolderPath: 'src/tests/src/node_modules/lodash',
      dependencyName: 'lodash',
      packageJsonFilePath: 'src/tests/src/package.json',
      projectFolder: 'src/tests/src',
      yarnLockFilePath: 'src/tests/src/yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/source-map',
      dependencyName: 'source-map',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/debug',
      dependencyName: 'debug',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/resolve',
      dependencyName: 'resolve',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/json5',
      dependencyName: 'json5',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'src/tests/src/node_modules/@sindresorhus/is',
      dependencyName: '@sindresorhus/is',
      packageJsonFilePath: 'src/tests/src/package.json',
      projectFolder: 'src/tests/src',
      yarnLockFilePath: 'src/tests/src/yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/ms',
      dependencyName: 'ms',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/path-parse',
      dependencyName: 'path-parse',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
    {
      dependencyFolderPath: 'node_modules/safe-buffer',
      dependencyName: 'safe-buffer',
      packageJsonFilePath: 'package.json',
      projectFolder: '',
      yarnLockFilePath: 'yarn.lock',
    },
  ]);
});
