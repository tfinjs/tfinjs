import { resolve } from 'path';
import mkdrip from 'mkdirp';
import { writeFileSync, readFileSync } from 'fs';
import JsToHcl, { Provisioner } from '../JsToHcl';
import hclPrettify from '../statics/hclPrettify';

/* eslint-env jest */

const testObject = {
  glossary: {
    title: 'example glossary',
    GlossDiv: {
      title: 'S',
      value: 729,
      repeat: true,
      GlossList: {
        GlossEntry: {
          ID: 'SGML',
          SortAs: 'SGML',
          GlossTerm: 'Standard Generalized Markup Language',
          Acronym: 'SGML',
          Abbrev: 'ISO 8879:1986',
          GlossDef: {
            para:
              'A meta-markup language, used to create markup languages such as DocBook.',
            GlossSeeAlso: ['GML', 'XML'],
          },
          GlossSee: 'markup',
        },
      },
    },
  },
};

test('JsToHcl default', async () => {
  const jsToHcl = new JsToHcl();
  const result = jsToHcl.stringify(testObject);

  const prettyResult = await hclPrettify(result);

  expect(prettyResult).toMatchSnapshot();
});

/* add provisioner */

test('JsToHcl with provisioner', async () => {

  const js = {
    'provisioner "local-exec"': [
      {
        command: 'echo first',
      },
      {
        command: 'echo second',
      },
    ],
  };
  const jsToHcl = new JsToHcl();
  const result = jsToHcl.stringify(js);

  const prettyResult = await hclPrettify(result);

  expect(prettyResult).toMatchSnapshot();
});
