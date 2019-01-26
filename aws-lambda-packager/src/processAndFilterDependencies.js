import assert from 'assert';
import findUp from 'find-up';
import { resolve, dirname } from 'path';
import requireResolve from 'resolve';
import getProductionDependencies from './getProductionDependencies';

const processAndFilterDependencies = ({ entryFilePath, dependencyNames }) => {
  const prodDependencies = {};
  const resolved = dependencyNames.reduce((c, dependencyName) => {
    const requiredFilePath = requireResolve.sync(dependencyName, {
      basedir: dirname(entryFilePath),
    });
    const dependencyFolderPath = dirname(
      findUp.sync('package.json', {
        cwd: requiredFilePath,
      }),
    );
    const yarnLockFilePath = findUp.sync('yarn.lock', {
      cwd: resolve(dependencyFolderPath, '../'),
    });

    const packageJsonFilePath = findUp.sync('package.json', {
      cwd: resolve(dependencyFolderPath, '../'),
    });

    const result = {
      dependencyName,
      dependencyFolderPath,
      yarnLockFilePath,
      packageJsonFilePath,
    };

    assert(
      dirname(packageJsonFilePath) === dirname(yarnLockFilePath),
      `You must have a yarn.lock and a package.json in the same folder, error when resolving: ${JSON.stringify(
        result,
        null,
        2,
      )}`,
    );

    const projectFolder = dirname(yarnLockFilePath);
    result.projectFolder = projectFolder;

    if (!prodDependencies[projectFolder]) {
      prodDependencies[projectFolder] = getProductionDependencies(
        projectFolder,
      );
    }

    if (!prodDependencies[projectFolder].includes(dependencyName)) {
      return c;
    }

    return [...c, result];
  }, []);

  return resolved;
};

export default processAndFilterDependencies;
