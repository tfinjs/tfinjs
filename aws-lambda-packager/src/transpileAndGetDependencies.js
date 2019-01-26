import extractDependenciesFromWebpackStats from './extractDependenciesFromWebpackStats';
import Compiler from './Compiler';
import processAndFilterDependencies from './processAndFilterDependencies';

const transpileAndGetDependencies = async (entryFilePath) => {
  const compilerWithDeps = new Compiler('analyzeDeps', {
    entry: entryFilePath,
    withNodeExternals: false,
  });

  const compiler = new Compiler('noDeps', {
    entry: entryFilePath,
    withNodeExternals: true,
  });

  const [noDeps, withDeps] = await Promise.all([
    compiler.run(),
    compilerWithDeps.run(),
  ]);

  const dependencyNames = extractDependenciesFromWebpackStats(withDeps.stats);

  const dependencies = processAndFilterDependencies({
    dependencyNames,
    entryFilePath,
  });

  return {
    data: noDeps.fs.data[Object.keys(noDeps.fs.data)[0]],
    dependencies,
  };
};

export default transpileAndGetDependencies;
