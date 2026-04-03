
export interface UseBase {
  open                        : boolean
  setOpen(changes?: boolean)  : void
  setClose(changes?: boolean) : void

  isChanges                   : boolean
  setIsChanges(v: boolean)    : void

  isConfirm                   : boolean
  setIsConfirm(v: boolean)    : void
}
