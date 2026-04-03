import { __devLog } from '..';

// Мокаем console.log и глобальные переменные
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const originalIsDev = (global as any).__IS_DEV__;

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  (global as any).__IS_DEV__ = originalIsDev;
  mockConsoleLog.mockRestore();
});

describe('__devLog', () => {
  describe('в development режиме (__IS_DEV__ = true)', () => {
    beforeAll(() => {
      (global as any).__IS_DEV__ = true;
    });

    it('должен вызывать console.log с переданными аргументами', () => {
      __devLog('test', 123, { key: 'value' });
      expect(mockConsoleLog).toHaveBeenCalledWith('test', 123, { key: 'value' });
    });

    it('не должен фильтровать аргументы без флага --force', () => {
      __devLog('simple message');
      expect(mockConsoleLog).toHaveBeenCalledWith('simple message');
    });

    it('должен фильтровать флаг --force если он есть', () => {
      __devLog('message', '--force');
      expect(mockConsoleLog).toHaveBeenCalledWith('message');
      expect(mockConsoleLog).not.toHaveBeenCalledWith('message', '--force');
    });

    it('должен обрабатывать несколько аргументов с флагом --force', () => {
      __devLog('arg1', 'arg2', '--force', 'arg3');
      expect(mockConsoleLog).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });

  describe('в production режиме (__IS_DEV__ = false)', () => {
    beforeAll(() => {
      (global as any).__IS_DEV__ = false;
    });

    it('не должен вызывать console.log без флага --force', () => {
      __devLog('production message');
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('должен вызывать console.log при наличии флага --force', () => {
      __devLog('forced message', '--force');
      expect(mockConsoleLog).toHaveBeenCalledWith('forced message');
    });

    it('должен правильно фильтровать флаг --force в production', () => {
      __devLog('arg1', 'arg2', '--force', 'arg3');
      expect(mockConsoleLog).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('не должен логировать если флага --force нет', () => {
      __devLog('arg1', 'arg2', 'arg3');
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('специальные случаи', () => {
    it('должен корректно обрабатывать пустые вызовы', () => {
      (global as any).__IS_DEV__ = true;
      expect(mockConsoleLog).toHaveBeenCalledWith();
    });

    it('должен корректно обрабатывать только флаг --force', () => {
      (global as any).__IS_DEV__ = false;
      __devLog('--force');
      expect(mockConsoleLog).toHaveBeenCalledWith();
    });

    it('должен фильтровать все вхождения --force', () => {
      (global as any).__IS_DEV__ = true;
      __devLog('--force', 'msg', '--force');
      expect(mockConsoleLog).toHaveBeenCalledWith('msg');
    });
  });
});

// npm run test:unit dev-log.test.ts
