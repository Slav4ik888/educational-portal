import type { Item } from '../../arrays';

const calcBytes = (d: string): number => d.length * 2;

export function sizeOf(data: Item | number | string): number {
  let bytes = 0;

  if (!data || data === null || data === undefined) return bytes;

  switch (typeof data) {
    case 'number':
      bytes += 8;
      break;

    case 'string':
      bytes += calcBytes(data);
      break;

    case 'boolean':
      bytes += 4;
      break;

    case 'object':
      // eslint-disable-next-line
      for (const key in data) {
        bytes += sizeOf(key);
        bytes += sizeOf(data[key] as Item);
      }
      break;

    default: break;
  }

  return bytes;
}
