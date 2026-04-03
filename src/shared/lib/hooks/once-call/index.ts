import * as React from 'react';
/* eslint-disable */

export const useOnceCall = (func: Function) => {
  const [state, setState] = React.useState(false);

  const execute = () => setState(prev => {
    // console.log('PREV: ', prev);
    !prev && func()

    return true
  });

  return { execute }
};
