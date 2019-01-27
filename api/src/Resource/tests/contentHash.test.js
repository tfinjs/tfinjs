/* eslint-env jest */

import Resource from '..';
import deploymentConfig from './deploymentConfig';

test('circular dependencies', async () => {
  const one = new Resource(deploymentConfig, 'aws_dynamodb_table', '1', {
    resourceId: 1,
  });
  const two = new Resource(deploymentConfig, 'aws_dynamodb_table', '2', {
    resourceId: 2,
  });

  expect(one.getContentHash()).toMatchSnapshot();
  expect(two.getContentHash()).toMatchSnapshot();

  two.addContentHashSeed('newSeed', () => 123);
  expect(two.getContentHash()).toMatchSnapshot();
  two.removeContentHashSeed('newSeed');
  expect(two.getContentHash()).toMatchSnapshot();
});
