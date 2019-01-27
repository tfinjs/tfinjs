import { resolve } from 'path';
import { Volume, createFsFromVolume } from 'memfs';
import Resource from '..';
import awsProviderUri from '../../Provider/uris/aws';
import Provider from '../../Provider';
import Backend from '../../Backend';
import Project from '../../Project';
import Namespace from '../../Namespace';
import DeploymentConfig from '../../DeploymentConfig';

const awsAccoundId = 13371337;
const awsRegion = 'eu-north-1';
const backendBucketName = 'terraform-state-prod';
const backendBucketRegion = 'us-east-1';

const vol = new Volume();
const fs = createFsFromVolume(vol);

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
    awsProviderUri(awsAccoundId, backendBucketRegion),
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

export const project = new Project('pet-shop', backend, '/', fs);

const provider = new Provider(
  'aws',
  {
    region: awsRegion,
    assume_role: {
      role_arn: `arn:aws:iam::${awsAccoundId}:role/DeploymentRole`,
    },
  },
  awsProviderUri(awsAccoundId, awsRegion),
);

const namespace = new Namespace(project, 'services/lambdas/add-pet');

const deploymentConfig = new DeploymentConfig(namespace, {
  environment: 'stage',
  version: 'v1',
  provider,
});

export default deploymentConfig;
