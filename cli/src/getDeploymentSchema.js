import fromPairs from 'lodash/fromPairs';
import getBuiltResources, {
  STATUS_DESTROYED,
  STATUS_OUTDATED,
  STATUS_UNDEPLOYED,
} from './getBuiltResources';

const getDeploymentSchema = (project, fs) => {
  /*
    add: everything that should be desployed (no deployment_status.txt),
    update: with deployment_status.txt
    remove: everything that has deployment_status.txt and deployment_status.txt !== DESTROYED
  */

  const dist = project.getDist();
  
  const graph = project.getDependencyGraph();

  const resources = fromPairs(
    project.getResources().map((resource) => [
      resource.versionedName(),
      {
        uri: resource.getUri(),
        contentHash: resource.getContentHash(),
      },
    ]),
  );
  const currentResourceKeys = Object.keys(resources);

  const builtResources = Object.entries(getBuiltResources(dist, fs));

  const m = ([a]) => a;

  const add = builtResources
    .filter(
      ([name, { status }]) =>
        [STATUS_UNDEPLOYED].includes(status)
        && currentResourceKeys.includes(name),
    )
    .map(m);

  const update = builtResources
    .filter(
      ([name, { status }]) =>
        [STATUS_OUTDATED].includes(status) && currentResourceKeys.includes(name),
    )
    .map(m);

  const remove = builtResources
    .filter(
      ([name, { status }]) =>
        ![STATUS_DESTROYED, STATUS_UNDEPLOYED].includes(status)
        && !currentResourceKeys.includes(name),
    )
    .map(m);


  return {
    resources,
    add,
    remove,
    update,
    graph,
  };
};

export default getDeploymentSchema;
