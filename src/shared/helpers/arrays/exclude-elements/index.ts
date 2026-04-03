
/** Убрать элементы, которые присутствуют в другом массиве */
export function excludeElements(mainArray: string[], excludeArray: string[]): string[] {
  return mainArray.filter(item => ! excludeArray.includes(item));
}

// Пример использования
// const mainArray = ["apple", "banana", "cherry", "date"];
// const excludeArray = ["banana", "date"];
// const result = excludeElements(mainArray, excludeArray);
// console.log(result); // ["apple", "cherry"]
