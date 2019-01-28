/* eslint-env jest */
import makeProject from '../mocks/sampleProject';
import getDeploymentSchema from './getDeploymentSchema';

test('getDeploymentSchema', () => {
  const {
    project, vol, fs, table,
  } = makeProject();

  const schema = getDeploymentSchema(project, fs);
  expect(schema).toMatchSnapshot();
});

test('getDeploymentSchema ', () => {
  const {
    project, vol, fs, table,
  } = makeProject();

  const schema = getDeploymentSchema(project, fs);

  expect(schema).toMatchSnapshot();
});
