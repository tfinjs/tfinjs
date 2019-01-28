/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import packager from '@tfinjs/aws-lambda-packager';
import LambdaResource from '..';
import makeProject from './mocks/project';

test('package', async () => {
  const {
    project,
    vol,
    deploymentConfig,
    lambdaDeploymentBucket,
    fs,
  } = makeProject();
  const { zipUpload } = new LambdaResource(
    deploymentConfig,
    'petLambdas',
    {
      cloudwatch: false,
      // apigw: {
      //   enabled: true,
      //   cors: true,
      //   path: '*/*',
      // },
      lambdaDeploymentBucket,
      /* byotranspiler */
      /* given the input file path, transpile the
       input into some output file content which
       path should be returned */
      /* if you dont want to transpile the file,
       just return the fs.readFileSync(inputFilePath, 'binary'); buffer */
      /* If you use some env files you can transpile
       using webpack and the env provider plugin such
       that you can use the api during runtime */
      package: async (zipFilePath) => {
        await packager(resolve(__dirname, 'service.js'), zipFilePath, fs);
      },
    },
    fs,
  );

  await project.build();
  expect(project.getDependencyGraph()).toMatchSnapshot();
  const snapshot = vol.toJSON();
  const zipPath = `/${zipUpload.versionedName()}/aws_lambda_package.zip`;
  snapshot[zipPath] = 'the zip file';

  expect(snapshot).toMatchSnapshot();
});

test('with cloudwatch', async () => {
  const {
    project,
    vol,
    deploymentConfig,
    lambdaDeploymentBucket,
    fs,
  } = makeProject();

  const { zipUpload } = new LambdaResource(
    deploymentConfig,
    'petLambdas',
    {
      cloudwatch: true,
      lambdaDeploymentBucket,
      package: async (zipFilePath) => {
        await packager(resolve(__dirname, 'service.js'), zipFilePath, fs);
      },
    },
    fs,
  );

  await project.build();
  expect(project.getDependencyGraph()).toMatchSnapshot();
  const snapshot = vol.toJSON();
  const zipPath = `/${zipUpload.versionedName()}/aws_lambda_package.zip`;
  snapshot[zipPath] = 'the zip file';

  expect(snapshot).toMatchSnapshot();
});
