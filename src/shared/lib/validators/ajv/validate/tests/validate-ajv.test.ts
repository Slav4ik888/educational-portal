import { MOCK_FIX_DATE } from 'entities/base/mocks';
import { validate } from '..';
import { SCHEMA_NAME } from '../../schemas';



describe('validate', () => {
  it('Invalid SCHEMA_NAME', () => {
    const res = validate('validate' as SCHEMA_NAME, {}, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({ general: 'Поле "validate" не является одним из допустимых значений.' });
  });

  it('Valid SCHEMA_NAME & valid data', () => {
    expect(validate(SCHEMA_NAME.FIX_DATE, MOCK_FIX_DATE, '').valid).toEqual(true);
  });

  it('Valid SCHEMA_NAME but invalid data - UserId', () => {
    const res = validate(SCHEMA_NAME.FIX_DATE, {
      userId : undefined,
      date   : 1640995200000
    }, '');

    expect(res.valid).toEqual(false);
    expect(res.errors).toEqual({ userId: 'Отсутствует обязательное поле "userId".' });
  });
});

// npm run test:unit validate-ajv.test.ts
