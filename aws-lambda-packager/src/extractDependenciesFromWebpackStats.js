import getModuleNameFromPath from './getModuleNameFromPath';

const extractDependenciesFromWebpackStats = (stats) =>
  [
    ...new Set(
      stats
        .toJson()
        .modules.map(({ name }) => name)
        .filter(
          (name) => !name.match(/^external/) && name.match(/node_modules/),
        )
        .map((path) => {
          // if (!name.match(/lodash/)) {
          //   console.log(name);
          // }
          const moduleName = getModuleNameFromPath(path);

          return moduleName;
        }),
    ),
  ].filter((name) => name !== 'aws-sdk' && name);

export default extractDependenciesFromWebpackStats;
