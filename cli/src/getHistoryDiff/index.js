import intersection from 'lodash/intersection';
import keys from 'lodash/keys';

const getHistoryDiff = (a, b) => {
  const ak = keys(a);
  const bk = keys(b);

  const add = bk.filter((k) => !ak.includes(k));
  const remove = ak.filter((k) => !bk.includes(k));

  const unchanged = intersection(ak, bk);

  const update = unchanged.filter((k) => a[k].contentHash !== b[k].contentHash);

  return {
    add,
    remove,
    update,
  };
};

export default getHistoryDiff;
