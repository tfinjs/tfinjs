import fromPairs from 'lodash/fromPairs';
import { join } from 'path';
import getHistoryDiff from './getHistoryDiff';

const getDeploymentSchema = (project, fs) => {
  /*
    add: everything that should be desployed (no deployment_status.txt),
    update: with deployment_status.txt
    remove: everything that has deployment_status.txt and deployment_status.txt !== DESTROYED
  */

  const dist = project.getDist();

  const resources = fromPairs(
    project.getResources().map((resource) => [
      resource.versionedName(),
      {
        uri: resource.getUri(),
        contentHash: resource.getContentHash(),
      },
    ]),
  );

  let previousResources = {};
  try {
    ({ resources: previousResources = {} } = JSON.parse(
      fs.readFileSync(join(dist, 'latest_deploy.json')),
    ));
  } catch (err) {
    /* err */
  }

  const deployedResources = fromPairs(
    Object.entries(previousResources).filter(([key]) => {
      const fpath = join(dist, key, 'deployment_status.txt');
      return (
        fs.existsSync(fpath) && fs.readFileSync(fpath, 'utf8') !== 'DESTROYED'
      );
    }),
  );


  const { add, remove, update } = getHistoryDiff(deployedResources, resources);
  const graph = project.getDependencyGraph();

  return {
    previousResources,
    deployedResources,
    resources,
    add,
    remove,
    update,
    graph,
  };
};

export default getDeploymentSchema;
