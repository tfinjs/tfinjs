/* eslint-env jest */
import MemoryFileSystem from 'memory-fs';
import sampleProject from '../mocks/sampleProject';
import getDeploymentSchema from './getDeploymentSchema';
import prettyPrint from './print/prettyPrint';

const fs = new MemoryFileSystem();

test('getDeploymentSchema', () => {
  const schema = getDeploymentSchema(sampleProject, fs);
  expect(schema).toEqual({
    previousResources: {},
    deployedResources: {},
    resources: {
      tijpetshopmjubxt: {
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
        contentHash: '1yrf1ba',
      },
      tijpetshop19qdr42: {
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/customers',
        contentHash: '1o40x0m',
      },
    },
    add: ['tijpetshopmjubxt', 'tijpetshop19qdr42'],
    remove: [],
    update: [],
    graph: { tijpetshopmjubxt: [], tijpetshop19qdr42: [] },
  });
});

test('getDeploymentSchema ', () => {
  const schema = getDeploymentSchema(sampleProject, fs);
  expect(schema).toEqual({
    previousResources: {},
    deployedResources: {},
    resources: {
      tijpetshopmjubxt: {
        uri:
          'pet-shop/_/_/aws/13371337/eu-central-1/__tfinjs__backend__/aws_s3_bucket/terraform_state_prod',
        contentHash: '1yrf1ba',
      },
      tijpetshop19qdr42: {
        uri:
          'pet-shop/prod/static/aws/13371337/eu-north-1/customers/aws_dynamodb_table/customers',
        contentHash: '1o40x0m',
      },
    },
    add: ['tijpetshopmjubxt', 'tijpetshop19qdr42'],
    remove: [],
    update: [],
    graph: { tijpetshopmjubxt: [], tijpetshop19qdr42: [] },
  });
});
