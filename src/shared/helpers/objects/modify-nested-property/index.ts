import { removePropertyIfDefined } from '../remove-property-if-defined';
import { setValueByScheme } from '../set-value-by-scheme';
import { isArr, isStr } from 'shared/lib/validators';



interface OptionArray extends Array<string | any> {
  0: string
  1: any
}

export type Option = string | OptionArray

/**
 * Очищает объект от ненужных свойств
 *
 * Если передан путь и значение, то устанавливает значение по указанному пути
 * (если путь не существует, он его сделает и добавит значение)
 * если только путь, то удаляет свойство по указанному пути
 * Мутирует исходный объект!
 * @param obj
 * @returns
 */
export const modifyNestedProperty = (obj: any, options: Option[]): void => {
  if (! obj || ! options) return

  options.forEach(option => {
    if (isStr(option)) removePropertyIfDefined(obj, option as string)
    else if (isArr(option)) setValueByScheme(obj, option[0], option[1])
  });
};
