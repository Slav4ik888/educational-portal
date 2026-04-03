/* eslint-disable */
import { useState } from 'react';
import { isNotUndefined, isObj } from '../../validators';
import { cloneObj } from '../../../helpers/objects';
import { UseGroup, TuplesGroup, UseGroupConfig } from './types';
import { __devLog } from '../../tests/__dev-log';

export { UseGroup, TuplesGroup };


const trueIfUndefined = (v: boolean | undefined): boolean => isNotUndefined(v) ? v as boolean : true;

/** v.2024-01-05 */
export function useGroup<O>(
  initGroup    = {} as O,
  initOpen     = false,
  initIsChange = false,
  devId? : string // For show console
): UseGroup<O>  {
  const DEV_ID = 'AiudfexHuuqieu1WAeLd';

  // IS_CHANGES
  const [isChanges, _setIsChanges] = useState(initIsChange || false);
  const setIsChanges = (v?: boolean) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setIsChanges');
    _setIsChanges((prev) => isNotUndefined(v) ? v as boolean : false);
  };

  // GROUP
  const [group, _setGroup] = useState(() => isObj(initGroup) ? cloneObj(initGroup) : initGroup);

  // OPEN
  const [open, _setOpen] = useState(initOpen || false);
  const setOpen = () => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setOpen');
    _setOpen(true);
  };
  const setClose = (isClear?: boolean, isChanges?: boolean) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setClose 1');
    isClear && _setGroup({} as O); // Очищаем старое состояние

    _setOpen((prev) => {
      if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setClose 2: ', prev);
      return false
    });
    // setIsChanges(trueIfUndefined(isChanges));
    setIsChanges(isChanges);
  },
  updateOpen = (open: boolean | undefined) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG updateOpen');
    if (isNotUndefined(open)) _setOpen(open as boolean);
  };


  // IS_CONFIRM
  const [isConfirm, _setIsConfirm] = useState(false);
  const setIsConfirm = (v: boolean) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setIsConfirm');
    _setIsConfirm((prev) => v);
  };


  const setGroup = (group: O, cfg: UseGroupConfig) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG setGroup');
    _setGroup((prev) => cloneObj(group));
    _setIsChanges(trueIfUndefined(cfg?.isChanges));
    updateOpen(cfg?.open);
  };

  /** Update with Partial group */
  const updateGroup = (group: Partial<O>, cfg: UseGroupConfig) => {
    if (devId && devId === DEV_ID) __devLog('useGroup', 'UG updateGroup');
    _setGroup((prev) => ({
      ...prev,
      ...cloneObj(group)
    }));
    _setIsChanges(trueIfUndefined(cfg?.isChanges));
    updateOpen(cfg?.open);
  };

  function getGroup(): Promise<O> {
    // if (devId && devId === DEV_ID) __devLog('useGroup', 'Start getGroupPromise');
    return new Promise((resolve, reject) => {
      // if (devId && devId === DEV_ID) __devLog('useGroup', 'Start Promise');

      _setGroup((prev) => {
        // if (devId && devId === DEV_ID) __devLog('useGroup', 'End Promise _setGroup', prev);
        resolve(cloneObj(prev));
        return prev
      });
    })
  }


  return {
    open,
    setOpen,
    setClose,
    group,
    setGroup,
    updateGroup,
    getGroup,
    isChanges,
    setIsChanges,
    isConfirm,
    setIsConfirm
  }
}
