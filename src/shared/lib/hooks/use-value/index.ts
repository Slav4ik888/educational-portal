import { useState } from 'react';
import { isNotUndefined, isStr } from '../../validators';
import { UseValue } from './types';

export { UseValue };

/**
 * v.2023-09-19
 */
export function useValue<I>(initValue?: I, initOpen?: boolean, initIsChange?: boolean): UseValue<I>  {
  const
    [value, _setValue] = useState((initValue as I)),
    [open, _setOpen] = useState(initOpen || false),
    setValue = (value: I, open?: boolean) => {
      _setValue(prev => value);
      if (isNotUndefined(open)) _setOpen(open as boolean);
    },
    clearValue = () => _setValue((isStr(initValue) ? '' : 0) as unknown as I),

    [isChanges, _setIsChange] = useState(initIsChange || false),
    setIsChanges = (v: boolean) => _setIsChange(v),

    setOpen = (c?: boolean) => {
      _setOpen(true);
      if (isNotUndefined(c)) setIsChanges(c as boolean);
    },
    setClose = (c?: boolean) => {
      _setOpen(false);
      if (isNotUndefined(c)) setIsChanges(c as boolean);
    },

    [isConfirm, _setIsConfirm] = useState(false),
    setIsConfirm = (v: boolean) => _setIsConfirm(v);


  return {
    value,
    setValue,
    clearValue,
    open,
    setOpen,
    setClose,
    isChanges,
    setIsChanges,
    isConfirm,
    setIsConfirm
  }
}
