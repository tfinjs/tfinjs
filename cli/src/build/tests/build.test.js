/* eslint-env jest */
import MemoryFileSystem from 'memory-fs';
import project, { table } from '../../../mocks/sampleProject';
import build from '../index';
import getDeploymentSchema from '../../getDeploymentSchema';

const fs = new MemoryFileSystem();

test('project', async () => {
  await build(project, {
    outputFolderPath: '/',
    fs,
  });
  const files = Object.keys(fs.data);
  expect(files.sort()).toEqual([
    'latest_deploy.json',
    'tijpetshop19qdr42',
    'tijpetshopmjubxt',
  ]);
  const schema1 = getDeploymentSchema(project);
  expect(schema1).toEqual({
    add: ['tijpetshopmjubxt', 'tijpetshop19qdr42'],
    deployedResources: {},
    graph: { tijpetshop19qdr42: [], tijpetshopmjubxt: [] },
    previousResources: {},
    remove: [],
    resources: {
      tijpetshop19qdr42: {
        contentHash: '1o40x0m',
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/customers',
      },
      tijpetshopmjubxt: {
        contentHash: '1yrf1ba',
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
      },
    },
    update: [],
  });

  table.updateBody('read_capacity', 60);
  const schema2 = getDeploymentSchema(project);
  expect(schema2).toEqual({
    add: ['tijpetshopmjubxt', 'tijpetshop19qdr42'],
    deployedResources: {},
    graph: { tijpetshop19qdr42: [], tijpetshopmjubxt: [] },
    previousResources: {},
    remove: [],
    resources: {
      tijpetshop19qdr42: {
        contentHash: 'foe5fz',
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/customers',
      },
      tijpetshopmjubxt: {
        contentHash: '1yrf1ba',
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
      },
    },
    update: [],
  });

  table.name = 'other_name';

  const schema3 = getDeploymentSchema(project);
  expect(schema3).toEqual({
    add: ['tijpetshopmjubxt', 'tijpetshop1lr7f2m'],
    deployedResources: {},
    graph: { tijpetshop1lr7f2m: [], tijpetshopmjubxt: [] },
    previousResources: {},
    remove: [],
    resources: {
      tijpetshop1lr7f2m: {
        contentHash: 'ka42wv',
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/other_name',
      },
      tijpetshopmjubxt: {
        contentHash: '1yrf1ba',
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
      },
    },
    update: [],
  });

  fs.writeFileSync(
    '/tijpetshopmjubxt/deployment_status.txt',
    JSON.parse(fs.data['latest_deploy.json'].toString()).resources
      .tijpetshopmjubxt.contentHash,
  );

  await build(project, {
    outputFolderPath: '/',
    fs,
  });

  const schema4 = getDeploymentSchema(project);
  expect(schema4).toEqual({
    add: ['tijpetshopmjubxt', 'tijpetshop1lr7f2m'],
    deployedResources: {},
    graph: { tijpetshop1lr7f2m: [], tijpetshopmjubxt: [] },
    previousResources: {},
    remove: [],
    resources: {
      tijpetshop1lr7f2m: {
        contentHash: 'ka42wv',
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/other_name',
      },
      tijpetshopmjubxt: {
        contentHash: '1yrf1ba',
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
      },
    },
    update: [],
  });
});
