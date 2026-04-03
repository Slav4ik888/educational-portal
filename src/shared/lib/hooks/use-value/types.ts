
export interface UseValue<V> {
  value                          : V
  setValue(v: V, open?: boolean) : void
  clearValue()                   : void

  open                           : boolean
  setOpen(isChanges?: boolean)   : void
  setClose(isChanges?: boolean)  : void

  isChanges                      : boolean
  setIsChanges(v: boolean)       : void

  isConfirm                      : boolean
  setIsConfirm(v: boolean)       : void
}
