import assertExactKeys from './assertExactKeys';
import throwError from '../statics/throwError';
import requiredParam from '../statics/requiredParam';

const signature = JSON.stringify(
  {
    project: 'string',
    environment: 'string',
    version: 'string',
  },
  null,
  2,
);

const assertDeploymentParamsSignature = (
  deploymentParams = requiredParam('deploymentParams'),
  stacktraceFunction = requiredParam('stacktraceFunction'),
) => {
  if (!deploymentParams) {
    throwError('You must include deployment params', stacktraceFunction);
  }
  const {
    project, environment, version,
  } = deploymentParams;

  if (
    typeof project !== 'string'
    || typeof environment !== 'string'
    || typeof version !== 'string'
  ) {
    throwError(
      `The deployment params ${JSON.stringify(
        deploymentParams,
        null,
        2,
      )} does not follow the signature ${signature}`,
      stacktraceFunction,
    );
  }
  assertExactKeys(deploymentParams, [
    'project',
    'environment',
    'version',
  ]);
};

export default assertDeploymentParamsSignature;
