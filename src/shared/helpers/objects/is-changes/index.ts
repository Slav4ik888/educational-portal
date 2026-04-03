import { deepEqual } from '../deep-equal';


// function checkIsChanges<T>(first: T, second: T) {
//   // console.log('second: ', second);
//   // console.log('first: ', first);
//   let result = false; // Нет изменений

//   if (! first && second) return true;

//   for (const key in second) {
//     if (Object.prototype.hasOwnProperty.call(second, key)) {
//       // console.log('second[key]: ', second[key]);

//       if (isObj(second[key])) { // Ищем string | number | boolean
//         const res = isChanges(first?.[key], second?.[key]);
//         if (res) {
//           result = true;
//           // console.log(`result IN1: ${key}: `, first?.[key], ` - `, second?.[key]);
//         }
//       }
//       else if (second?.[key] !== first?.[key]) {
//         // console.log('second[key]: ', second[key]);
//         // console.log('first[key]: ', first?.[key]);
//         // console.log(`result IN2: ${key}: `, second?.[key], ` - `, first?.[key]);

//         result = true;
//       }
//     }
//   }

//   return result;
// }


/**
 * v.2025-01-11
 * Проверяет были ли изменения в новом объекте
 * @param prevObj - первоначальный объект
 * @param newObj  - новый объект
 */
export function isChanges<T>(prevObj: T, newObj: T): boolean {
  return ! deepEqual(prevObj, newObj);

  // const result1 = checkIsChanges(prevObj, newObj);
  // const result2 = checkIsChanges(newObj, prevObj);

  // if (result1 || result2) {
  //   console.log('newObj: ', newObj);
  //   console.log('prevObj: ', prevObj);
  //   console.log('result1: ', result1);
  //   console.log('result2: ', result2);
  // }

  // return result1 || result2;
}
