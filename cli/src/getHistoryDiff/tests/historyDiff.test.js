/* eslint-env jest */
import {
  hashDiff,
  renameDiff,
  deleteDiff,
  addDiff,
  totalUpdate,
} from './historyDiff.input';
import getHistoryDiff from '..';

test('historyDiff hashDiff', () => {
  const { a, b } = hashDiff;

  const result = getHistoryDiff(a, b);

  expect(result).toEqual({
    add: [],
    remove: [],
    update: ['tijpetshop6b06a203'],
  });
});

test('historyDiff renamed', () => {
  const { a, b } = renameDiff;

  const result = getHistoryDiff(a, b);

  expect(result).toEqual({
    add: ['tijpetshop6b06a1337'],
    remove: ['tijpetshop6b06a203'],
    update: [],
  });
});

test('historyDiff deleteDiff', () => {
  const { a, b } = deleteDiff;

  const result = getHistoryDiff(a, b);

  expect(result).toEqual({
    add: [],
    remove: ['tijpetshop6b06a203'],
    update: [],
  });
});

test('historyDiff addDiff', () => {
  const { a, b } = addDiff;

  const result = getHistoryDiff(a, b);

  expect(result).toEqual({
    add: ['wefwefwef'],
    remove: [],
    update: [],
  });
});

test('historyDiff totalUpdate', () => {
  const { a, b } = totalUpdate;

  const result = getHistoryDiff(a, b);

  expect(result).toEqual({
    add: ['wefwefwef'],
    remove: ['tijpetshop843a92ca'],
    update: ['tijpetshop6b06a203'],
  });
});
