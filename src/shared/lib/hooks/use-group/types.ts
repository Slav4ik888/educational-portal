export interface UseGroupConfig {
  isChanges? : boolean
  open?      : boolean
}


/** v.2023-12-13 */
export interface UseGroup<O> {
  group                       : O
  setGroup(v: O, cfg?: UseGroupConfig) : void
  updateGroup(v: Partial<O>, cfg?: UseGroupConfig) : void
  getGroup()                  : Promise<O>

  open                        : boolean
  setOpen()                   : void
  setClose(isClear?: boolean) : void

  isChanges                   : boolean
  setIsChanges(v?: boolean)   : void

  isConfirm                   : boolean
  setIsConfirm(v: boolean)    : void
}


export interface TupleGroup {
  scheme: string,
  value: any
}


export type TuplesGroup = TupleGroup[]
