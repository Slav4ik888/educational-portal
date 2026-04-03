import { isNum, isUndefined, isNotStr } from 'shared/lib/validators';


/** Position */
export type Pos = 'first' | 'second' | 'third' | number | 'last' | 'prev' | 'prev-prev'


/**
 * Example:
 *  - str: 'get.third.item.from.this.text'
 *
 *  - splitter: '.'
 *
 *  - pos: 'third'
 *
 * **result** => 'item'
 * @param str
 * @param splitter - string: '.' | ',' | '/'
 * @param pos - first = 0, second = 1
 */
export const getItemByPos = (str: string, splitter: string, pos: Pos) => {
  if (! str || isNotStr(str)) return undefined
  if (! splitter) return str
  if (isUndefined(pos) || (! pos && pos !== 0)) return str

  const res = str.split(splitter) || [];

  if (isNum(pos)) return res[pos as number]

  const l = res.length;

  switch (pos) {
    case 'first':     return res[0]
    case 'second':    return res[1]
    case 'third':     return res[2]

    case 'prev-prev': return res[l - 3]
    case 'prev':      return res[l - 2]
    case 'last':      return res[l - 1]

    default: return undefined
  }
}
