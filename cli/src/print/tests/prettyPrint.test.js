import { join } from 'path';
import prettyPrint from '../prettyPrint';
import snapshot from './snapshot';

/* eslint-env jest */

const getName = (id) => join(__dirname, `refs/prettyPrint.${id}.txt`);

test('prettyPrint cyclic', () => {
  const output = prettyPrint(
    {
      add: ['tijpetshop1lr7f2m'],
      graph: { tijpetshop1lr7f2m: ['tijpetshop1lr7f2m'], tijpetshopmjubxt: [] },
      remove: [],
      update: [],
    },
    '/',
  );
  snapshot(getName('cyclic'), output);
});

test('prettyPrint normal', () => {
  const output = prettyPrint(
    {
      add: ['tijpetshop1lr7f2m'],
      graph: { tijpetshop1lr7f2m: [], tijpetshopmjubxt: [] },
      remove: [],
      update: [],
    },
    '/',
  );
  // console.log(JSON.stringify(output));
  // expect(output).toBe(normal);
  snapshot(getName('normal'), output);
});
test('prettyPrint remove', () => {
  const output = prettyPrint(
    {
      add: ['tijpetshop1lr7f2m'],
      graph: { tijpetshop1lr7f2m: [], tijpetshopmjubxt: [] },
      remove: ['wefwef', 'fewfew'],
      update: [],
    },
    '/',
  );
  // console.log(JSON.stringify(output));
  // expect(output).toBe(remove);
  snapshot(getName('remove'), output);
});

test('prettyPrint normal with graph', () => {
  const output = prettyPrint(
    {
      add: ['a', 'b', 'c', 'd'],
      graph: {
        a: ['b'],
        b: ['c', 'd'],
        c: [],
        d: [],
        e: [],
      },
      remove: [],
      update: [],
    },
    '/',
  );
  // console.log(JSON.stringify(output));
  // expect(output).toBe(normal);
  snapshot(getName('normal-graph'), output);
});
