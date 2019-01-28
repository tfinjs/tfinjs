import prettyPrint from '../prettyPrint';

/* eslint-env jest */

const resources = {
  a: {
    uri: 'tfinjs/a',
    contentHash: '1',
  },
  b: {
    uri: 'tfinjs/b',
    contentHash: '2',
  },
  c: {
    uri: 'tfinjs/c',
    contentHash: '3',
  },
  d: {
    uri: 'tfinjs/d',
    contentHash: '4',
  },
  e: {
    uri: 'tfinjs/e',
    contentHash: '5',
  },
};

test('prettyPrint cyclic', () => {
  const output = prettyPrint(
    {
      resources,
      add: ['a'],
      graph: { a: ['a'], b: [] },
      remove: [],
      update: [],
    },
    '/',
  );
  expect(output).toMatchSnapshot();
});

test('prettyPrint normal', () => {
  const output = prettyPrint(
    {
      resources,
      add: ['a'],
      graph: { a: [], b: [] },
      remove: [],
      update: [],
    },
    '/',
  );
  expect(output).toMatchSnapshot();
});
test('prettyPrint remove', () => {
  const output = prettyPrint(
    {
      resources,
      add: ['a'],
      graph: { a: [], b: [] },
      remove: ['c', 'd'],
      update: [],
    },
    '/',
  );
  expect(output).toMatchSnapshot();
});

test('prettyPrint normal with graph', () => {
  const output = prettyPrint(
    {
      resources,
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
  expect(output).toMatchSnapshot();
});
