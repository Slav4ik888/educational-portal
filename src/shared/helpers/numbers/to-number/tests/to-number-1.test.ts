import { toNumber } from '..';


describe('toNumber', () => {
  // Корректные числа
  it('возвращает число для валидных строк с точкой', () => {
    expect(toNumber('12.456')).toBe(12.456);
    expect(toNumber('0.5')).toBe(0.5);
    expect(toNumber('-3.14')).toBe(-3.14);
    expect(toNumber('--5')).toBe(-5);
  });

  it('конвертирует запятые в точки', () => {
    expect(toNumber('12,456')).toBe(12.456);
    expect(toNumber('1,000.5')).toBe(1.0005); // смешанный формат
  });

  it('игнорирует пробелы и лишние символы', () => {
    expect(toNumber(' 1 234.5 ')).toBe(1234.5);
    expect(toNumber('$1,000')).toBe(1);
    expect(toNumber('12a.34')).toBe(12.34);
  });

  // Граничные случаи
  it('обрабатывает пустую строку', () => {
    expect(toNumber('')).toBe(0);
    expect(toNumber(' ', 42)).toBe(42);
  });

  it('возвращает defaultValue для нечисловых строк', () => {
    expect(toNumber('abc')).toBe(0);
    expect(toNumber(NaN, 100)).toBe(100);
    expect(toNumber('number 12')).toBe(12);
    expect(toNumber('number 12.456')).toBe(12.456);
    expect(toNumber('string 12,456')).toBe(12.456);
    expect(toNumber('string -12,456')).toBe(-12.456);
    expect(toNumber('undefined')).toBe(0);
    expect(toNumber(' 1 234.5 ')).toBe(1234.5);
    expect(toNumber('12a.34')).toBe(12.34);
  });

  // Специальные значения
  it('обрабатывает null/undefined', () => {
    expect(toNumber(null)).toBe(0);
    expect(toNumber(undefined, 10)).toBe(10);
  });

  it('обрабатывает NaN, true, false', () => {
    expect(toNumber(NaN)).toBe(0);
    expect(toNumber(true)).toBe(0);
    expect(toNumber(false, -1)).toBe(-1);
  });

  // Другие типы
  it('возвращает defaultValue для объектов и массивов', () => {
    expect(toNumber({})).toBe(0);
    expect(toNumber([1, 2], 42)).toBe(42);
    expect(toNumber(() => {}, 100)).toBe(100);
  });

  // Кастомный defaultValue
  it('использует переданный defaultValue', () => {
    expect(toNumber('abc', 999)).toBe(999);
    expect(toNumber(null, -Infinity)).toBe(-Infinity);
  });

  // Числа на входе
  it('возвращает число как есть', () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber(-0.5)).toBe(-0.5);
    expect(toNumber(1e3)).toBe(1000);
  });
});

// npm run test:unit to-number-1.test.ts
