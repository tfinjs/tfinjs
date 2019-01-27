/* eslint-env jest */
import { Volume, createFsFromVolume } from 'memfs';
import Project from '../Project';
import Backend from '../Backend';
import Provider from '../Provider';
import awsProviderUri from '../Provider/uris/aws';
import Resource from '../Resource';
import Namespace from '../Namespace';
import DeploymentConfig from '../DeploymentConfig';
import { versionedName } from '../helpers';

const vol = new Volume();
const fs = createFsFromVolume(vol);

test('addHooks', async () => {
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

  const project = new Project('pet-shop', backend, '/', fs);

  const namespace = new Namespace(project, 'customers');

  const staticConfig = new DeploymentConfig(namespace, {
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
      awsProviderUri(awsAccoundId, 'eu-north-1'),
    ),
  });
  const table = new Resource(staticConfig, 'aws_dynamodb_table', 'customers', {
    name: versionedName(),
    read_capacity: 20,
    write_capacity: 20,
    hash_key: 'CustomerId',
  });
  table.addPreSerializingHook((r) => {
    r.updateBody('read_capacity', 40);
  });
  await project.build();
  expect(vol.toJSON()).toMatchSnapshot();
});
