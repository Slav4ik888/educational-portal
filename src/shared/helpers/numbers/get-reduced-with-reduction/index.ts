import { isNotNum } from 'shared/lib/validators';



export interface ValueAndReduction {
  value     : number | undefined
  reduction : string
}

// Это метрические префиксы, обозначающие кратные единицы измерения.
export function getReducedWithReduction(value?: number): ValueAndReduction {
  if (! value || isNotNum(value)) return { value, reduction: '' };

  if (value >= 1e12 || value <= -1e12) return { value: (value / 1e12), reduction: 'трлн' }; // триллионы
  if (value >= 1e9  || value <= -1e9)  return { value: (value / 1e9),  reduction: 'млрд' }; // миллиарды
  if (value >= 1e6  || value <= -1e6)  return { value: (value / 1e6),  reduction: 'млн' };  // миллионы
  if (value >= 1e3  || value <= -1e3)  return { value: (value / 1e3),  reduction: 'тыс' };  // тысячи
  return { value, reduction: '' }; // если число меньше 1000
}

// Пример использования:
// console.log(getReducedWithReduction(1234567));   // "1.2 млн"
// console.log(getReducedWithReduction(1670000000)); // "1.6 млрд"
