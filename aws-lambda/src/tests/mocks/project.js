/* eslint-disable import/no-extraneous-dependencies */
import { Volume, createFsFromVolume } from 'memfs';
import {
  Backend,
  Provider,
  Resource,
  Project,
  Namespace,
  DeploymentConfig,
  providerUris,
} from '@tfinjs/api';

export default () => {
  const vol = new Volume();
  const fs = createFsFromVolume(vol);

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

  return {
    vol,
    fs,
    project,
    deploymentConfig,
    lambdaDeploymentBucket,
  };
};
