import * as React from 'react';


export interface UseBool {
  bool       : boolean
  setTrue()  : void
  setFalse() : void
}


export function useBool(initValue?: boolean): UseBool  {
  const [bool, _setBool] = React.useState(initValue || false);

  const setTrue = () => _setBool(true);
  const setFalse = () => _setBool(false);

  return {
    bool, setTrue, setFalse
  }
}
