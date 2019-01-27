import { Project } from '@tfinjs/api';
import assert from 'assert';
import defaultFsModule from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import getDeploymentSchema from '../getDeploymentSchema';

const build = async (project, { outputFolderPath, fs = defaultFsModule }) => {
  assert(project instanceof Project, 'project must be an instance of Project');

  project.setFs(fs);

  project.setDist(outputFolderPath);

  mkdirp.sync(outputFolderPath, {
    fs,
  });


  /* build */
  const resources = project.getResources();

  const schema = getDeploymentSchema(project, fs);

  fs.writeFileSync(
    join(outputFolderPath, 'latest_deploy.json'),
    JSON.stringify(schema, null, 2),
  );


  await Promise.all(
    resources.map(async (resource) => {
      await resource.build();
    }),
  );
  return schema;
};

export default build;
