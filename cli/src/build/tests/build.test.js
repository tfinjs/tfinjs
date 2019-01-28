/* eslint-env jest */
import makeProject from '../../../mocks/sampleProject';
import build from '../index';
import getDeploymentSchema from '../../getDeploymentSchema';

test('project', async () => {
  const {
    project, vol, fs, table,
  } = makeProject();
  await build(project, {
    outputFolderPath: '/',
    fs,
  });
  expect(vol.toJSON()).toMatchSnapshot();

  const schema1 = getDeploymentSchema(project, fs);
  expect(schema1).toMatchSnapshot();

  table.updateBody('read_capacity', 60);

  const schema2 = getDeploymentSchema(project, fs);
  expect(schema2).toMatchSnapshot();

  table.name = 'other_name';

  const schema3 = getDeploymentSchema(project, fs);

  expect(schema3).toMatchSnapshot();

  fs.writeFileSync(
    '/tijpetshopmjubxt/deployment_status.txt',
    JSON.parse(fs.readFileSync('/schema.json', 'utf8')).resources
      .tijpetshopmjubxt.contentHash,
  );

  await build(project, {
    outputFolderPath: '/',
    fs,
  });

  const schema4 = getDeploymentSchema(project, fs);
  expect(schema4).toMatchSnapshot();
});
