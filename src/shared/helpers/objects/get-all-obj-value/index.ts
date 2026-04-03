/**
 * All values in string separated by commas
 */
export function getAllObjValue<O extends object>(obj: O): string {
  let str = '';

  if (!obj || typeof obj !== 'object') {
    // console.log(`obj - не является объектом. ${obj}`);
    return str;
  }


  const values = Object.values(obj);
  if (!values.length) {
    // console.log(`obj - пустой. ${obj}`);
    return str;
  }

  values.forEach(v => {
    if (v) {
      str += `${v}, `
    }
  });

  return str.slice(0, str.length - 2);
}
