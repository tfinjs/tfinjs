/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import { dirname } from 'path';

const snapshot = (referenceFile, output, newSnapshot = true) => {
  mkdirpSync(dirname(referenceFile));

  if (newSnapshot || !existsSync(referenceFile)) {
    writeFileSync(referenceFile, output);
  }

  expect(output).toBe(
    readFileSync(referenceFile, 'utf8').toString(),
  );
};
export default snapshot;
