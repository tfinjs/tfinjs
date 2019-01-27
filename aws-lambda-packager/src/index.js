import assert from 'assert';
import AdmZip from 'adm-zip';
import fs from 'fs';
import { isAbsolute } from 'path';
import transpileAndGetDependencies from './transpileAndGetDependencies';

const packager = async (entryFilePath, zipFilePath, fileSystem = fs) => {
  assert(
    fileSystem.writeFileSync
    && fileSystem.readFileSync
    && fileSystem.mkdir
    && fileSystem.stat,
    'fileSystem must be implemented as the node fs module',
  );
  assert(
    typeof entryFilePath === 'string'
      && isAbsolute(entryFilePath)
      && fs.existsSync(entryFilePath),
    'entryFilePath must be a string, must be an absolute path and must point to an existing file',
  );
  assert(
    typeof zipFilePath === 'string' && isAbsolute(zipFilePath),
    'zipFilePath must be a string and must be an absolute path',
  );

  const { data, dependencies } = await transpileAndGetDependencies(
    entryFilePath,
  );

  const zipFile = new AdmZip();
  // add file directly
  zipFile.addFile('service.js', data);
  const packagedPackageJson = {
    name: 'tfinjs-aws-lambda-package',
    version: '1.0.0',
    description: 'Packaged using the tfinjs/aws-lambda-packager',
    private: true,
    scripts: {},
    dependencies: {},
  };

  dependencies.forEach(
    ({ dependencyFolderPath, dependencyName, packageJsonFilePath }) => {
      packagedPackageJson.dependencies[dependencyName] = JSON.parse(
        fileSystem.readFileSync(packageJsonFilePath, 'utf8'),
      ).version;
      zipFile.addLocalFolder(
        dependencyFolderPath,
        `node_modules/${dependencyName}`,
      );
    },
  );
  zipFile.addFile('package.json', JSON.stringify(packagedPackageJson, null, 2));
  const buffer = zipFile.toBuffer();
  fileSystem.writeFileSync(zipFilePath, buffer);
  return { data, dependencies };
};
export default packager;
