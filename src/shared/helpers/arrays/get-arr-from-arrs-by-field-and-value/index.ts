
/**
 * Get arr from arrs into arr by field
 *  Contact: {
 *   companies: [id1, id2 ...]
 *  }
 */
export function getArrFromArrsByFieldAndValue<T extends object & { [k: string]: Array<unknown> }>(
  arr      : T[],
  fieldArr : string,
  value    : string
): T[] {
  if (! arr?.length) return [];

  return arr?.reduce((acc, item) => {
    item[fieldArr].forEach(it => {
      // @ts-ignore
      if (it === value) acc.push(item)
    });

    return acc
  }, []);
}
