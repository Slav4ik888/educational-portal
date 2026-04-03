export function withStaticLastChange(obj: any, lastChange: string) {
  if (! obj || ! lastChange) return {};

  obj.lastChange = lastChange;
  return obj;
}
