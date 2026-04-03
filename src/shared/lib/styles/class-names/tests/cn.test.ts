import { cn } from '..'

describe('cn', () => {
  test('With only first param', () => {
    expect(cn('anyClass')).toBe('anyClass')
  });

  test('First param with additional', () => {
    const expected = 'anyClass secondClass thirdClass';
    expect(cn('anyClass', {}, ['secondClass', 'thirdClass'])).toBe(expected)
  });

  test('All params with 2 mods = true', () => {
    const expected = 'anyClass secondClass thirdClass hovered scrollabled';
    expect(cn(
      'anyClass',
      { hovered: true, scrollabled: true },
      ['secondClass', 'thirdClass']
    )).toBe(expected)
  });

  test('All params with 1 mod = true, 2 mod = false', () => {
    const expected = 'anyClass secondClass thirdClass hovered';
    expect(cn(
      'anyClass',
      { hovered: true, scrollabled: false },
      ['secondClass', 'thirdClass']
    )).toBe(expected)
  });

  test('All params with 1 mod = undefined, 2 mod = true', () => {
    const expected = 'anyClass secondClass thirdClass scrollabled';
    expect(cn(
      'anyClass',
      { hovered: false, scrollabled: true },
      ['secondClass', 'thirdClass']
    )).toBe(expected)
  });
})

// npm run test:unit cn.test.ts
