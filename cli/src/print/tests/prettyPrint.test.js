import prettyPrint from '../prettyPrint';

/* eslint-env jest */


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
  expect(output).toMatchSnapshot();
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
  expect(output).toMatchSnapshot();
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
  expect(output).toMatchSnapshot();
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
  expect(output).toMatchSnapshot();
});
