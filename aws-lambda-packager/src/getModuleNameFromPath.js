import get from 'lodash/get';

const getModuleNameFromPath = (path) => {
  const re = /node_modules\/((:?.(?!\/node_modules\/))+)$/g;
  const requiredPath = get(re.exec(path), 1);
  if (!requiredPath) {
    return false;
  }
  const moduleName = get(requiredPath.match(/^(@[^/]+\/[^/]+|[^/]+)/), 0);
  if (!moduleName) {
    return false;
  }
  return moduleName;
};

export default getModuleNameFromPath;
