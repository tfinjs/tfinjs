import keys from 'lodash/keys';
/* a dev dependency */
import * as core from '@babel/core';
import is from '@sindresorhus/is';

export default async () => {
  console.log('log from lambda');

  const u = keys({ wef: 123 });
  console.log(u);

  console.log(core);

  console.log(is);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      hello: 'world',
    }),
  };

  return response;
};
