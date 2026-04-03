
export function getArrContainValueByField<O extends object & { [k: string]: string }>(
  arr: Array<O>, field: string, regexp: RegExp
): Array<O> {
  return arr.filter(item => regexp.test(item[field]))
}
