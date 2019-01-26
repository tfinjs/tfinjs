import MemoryFs from 'memory-fs';
import webpack from 'webpack';
import makeWebpackConfig from './makeWebpackConfig';

class Compiler {
  constructor(id, { entry, withNodeExternals }) {
    this.compiler = webpack(
      makeWebpackConfig({
        entry,
        withNodeExternals,
      }),
    );
    this.fs = new MemoryFs();
    this.compiler.outputFileSystem = this.fs;
    this.id = id;
  }

  run() {
    const { id } = this;
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          reject(err);
          return;
        }

        if (!process.env.NODE_ENV === 'test') {
          const info = stats.toJson();

          if (stats.hasErrors()) {
            console.error(info.errors);
          }

          if (stats.hasWarnings()) {
            console.warn(info.warnings);
          }
          console.log(
            stats.toString({
              chunks: false, // Makes the build much quieter
              colors: true, // Shows colors in the console
            }),
          );
        }
        resolve({
          id,
          stats,
          fs: this.fs,
        });
      });
    });
  }
}

export default Compiler;
