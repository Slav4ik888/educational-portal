import { TowardType } from 'shared/ui/configurators-components';



/**
 * Расчёт нового ордер при перемещении chart между собой.
 * Для line & bar
 */
export function getArrByToward<T>(
  type       : TowardType,
  data       : T[] | undefined,
  currentIdx : number,
): T[] {
  if (! data || ! data.length) return []

  const lastIdx = data.length - 1;

  if (type === 'up') {
    if (currentIdx === 0) { // Если первый сверху => делаем последним
      return [...data.slice(1), data[currentIdx]]
    }
    if (currentIdx === 1) { // Если второй сверху => делаем первым
      return [data[currentIdx], data[0], ...data.slice(2)]
    }
     // Если третий или ниже сверху => ставим между двумя предыдущими
      return  [
        ...data.slice(0, currentIdx - 1),
        data[currentIdx],
        data[currentIdx - 1],
        ...data.slice(currentIdx + 1),
      ]
  }
    // type === 'down'
    if (currentIdx === lastIdx) { // Если последний снизу => делаем первым
      return [data[currentIdx], ...data.slice(0, currentIdx)]
    }
    if (currentIdx === lastIdx - 1) { // Если второй снизу => делаем последним
      return [
        ...data.slice(0, currentIdx),
        data[currentIdx + 1],
        data[currentIdx]
      ]
    }
      // Если третий или выше снизу => ставим между двумя нижестоящими
      return [
        ...data.slice(0, currentIdx),
        data[currentIdx + 1],
        data[currentIdx],
        data[currentIdx + 2],
        ...data.slice(currentIdx + 3)
      ]
}
