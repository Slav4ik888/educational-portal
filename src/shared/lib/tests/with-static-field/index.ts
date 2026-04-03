export function withStaticField(obj: any, field: string, fieldValue: string) {
  if (! obj || ! field) return {};

  obj[field] = fieldValue;
  return obj;
}
