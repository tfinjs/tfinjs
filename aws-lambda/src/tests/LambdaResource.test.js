/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import { Volume, createFsFromVolume } from 'memfs';
import { resolve } from 'path';
import {
  Backend,
  Provider,
  Resource,
  Project,
  Namespace,
  DeploymentConfig,
  providerUris,
} from '@tfinjs/api';
import packager from '@tfinjs/aws-lambda-packager';
import LambdaResource from '..';

const vol = new Volume();
const fs = createFsFromVolume(vol);

test('index', async () => {
  const backendBucketName = 'some-backend-bucket';
  const backendBucketRegion = 'eu-north-1';
  const awsAccoundId = '13371337';

  const backend = new Backend('s3', {
    backendConfig: (name) => ({
      bucket: backendBucketName,
      key: `${name}.terraform.tfstate`,
      region: backendBucketRegion,
    }),
    dataConfig: (name) => ({
      bucket: backendBucketName,
      key: `${name}.terraform.tfstate`,
      region: backendBucketRegion,
    }),
    provider: new Provider(
      'aws',
      {
        region: backendBucketRegion,
        assume_role: {
          role_arn: `arn:aws:iam::${awsAccoundId}:role/DeploymentRole`,
        },
      },
      providerUris.aws(awsAccoundId, backendBucketRegion),
    ),
    create: (deploymentConfig) =>
      new Resource(deploymentConfig, 'aws_s3_bucket', 'terraform_state_prod', {
        bucket: backendBucketName,
        acl: 'private',
        versioning: {
          enabled: true,
        },
      }),
  });

  const project = new Project('pet-shop', backend, '/', fs);

  const namespace = new Namespace(project, 'customers');

  const deploymentConfig = new DeploymentConfig(namespace, {
    environment: 'prod',
    version: 'static',
    provider: new Provider(
      'aws',
      {
        region: 'eu-north-1',
        assume_role: {
          role_arn: `arn:aws:iam::${awsAccoundId}:role/DeploymentRole`,
        },
      },
      providerUris.aws(awsAccoundId, 'eu-north-1'),
    ),
  });
  const lambdaDeploymentBucket = new Resource(
    deploymentConfig,
    'aws_s3_bucket',
    'terraform_state_prod',
    {
      bucket: 'lambda-deployment-bucket',
      acl: 'private',
      versioning: {
        enabled: true,
      },
    },
  );

  const { zipUpload } = new LambdaResource(
    deploymentConfig,
    'petLambdas',
    {
      // cloudwatch: true,
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

  await Promise.all(
    project.getResources().map(async (resource) => {
      await resource.build();
    }),
  );
  expect(project.getDependencyGraph()).toMatchSnapshot();
  const snapshot = vol.toJSON();
  const zipPath = `/${zipUpload.versionedName()}/aws_lambda_package.zip`;
  snapshot[zipPath] = 'the zip file';

  expect(snapshot).toMatchSnapshot();
});
