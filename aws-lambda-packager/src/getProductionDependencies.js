import get from 'lodash/get';
import { resolve } from 'path';
import fs from 'fs';
import * as lockfile from '@yarnpkg/lockfile';
import eol from 'eol';


const getProductionDependencies = (projectFolder) => {
  const packageJsonString = fs.readFileSync(
    resolve(projectFolder, 'package.json'),
    'utf8',
  );

  const yarnLockString = fs.readFileSync(
    resolve(projectFolder, 'yarn.lock'),
    'utf8',
  );

  const projectProdDependencies = get(JSON.parse(packageJsonString), 'dependencies') || {};

  const yarnLockNormalized = eol.lf(yarnLockString);
  const yarn = lockfile.parse(yarnLockNormalized).object;

  const prodDeps = new Set();

  const addDepsToProdDeps = (jsonDependencies) =>
    Object.entries(jsonDependencies)
      .filter(([key]) => !prodDeps.has(key))
      .map(([key, val]) => ({ dep: `${key}@${val}`, key }))
      .forEach(({ dep, key }) => {
        const m = yarn[dep];
        if (m) {
          prodDeps.add(key);
        }
        if (m && m.dependencies) {
          addDepsToProdDeps(m.dependencies);
        }
      });

  addDepsToProdDeps(projectProdDependencies);

  return [...prodDeps];
};
export default getProductionDependencies;
