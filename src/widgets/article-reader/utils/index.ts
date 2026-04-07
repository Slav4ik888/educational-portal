/**
 * Разделяет строку на буквенную и числовую части, затем уменьшает число на 1 и склеивает обратно
 */
export function decrementString(input: string): string {
  // Разделяем строку на буквенную и числовую части
  const match = input.match(/^([a-zA-Z]+)(\d+)$/);

  if (!match) {
    throw new Error('Неверный формат строки. Ожидается формат: буквы + число');
  }

  const letters = match[1];  // буквенная часть
  const number = parseInt(match[2], 10);  // числовая часть

  // Уменьшаем число на 1
  const newNumber = number - 1;

  // Склеиваем результат
  return `${letters}${newNumber}`;
}

// Примеры использования:
// console.log(decrementString('b2'));  // 'b1'
// console.log(decrementString('a10')); // 'a9'
// console.log(decrementString('xyz5')); // 'xyz4'
