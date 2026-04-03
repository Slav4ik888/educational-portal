import { changeSequence } from '..';


describe('ChangeSequence - arr with some elements', () => {
  const ARR = ['11', '22', '33', '44', '55'];

  test('"after" is 1 element, "id" after 1 - must be not changes', () => {
    expect(changeSequence(ARR, '22', '11')).toEqual(ARR);
  });

  test('"after" is 1 element, "id" is last element', () => {
    expect(changeSequence(ARR, '55', '11')).toEqual(['11', '55', '22', '33', '44']);
  });

  test('"after" is 3 element, "id" is new element', () => {
    expect(changeSequence(ARR, '77', '33')).toEqual(['11', '22', '33', '77', '44', '55']);
  });
});


describe('ChangeSequence - not consistent ass', () => {
  test('ARR is [], "after" is apsent, "id" is new element', () => {
    expect(changeSequence([], '22', '11')).toEqual(['22']);
  });
  test('ARR is undefined, "after" is apsent, "id" is new element', () => {
    expect(changeSequence(undefined as unknown as any[], '22', '11')).toEqual(['22']);
  });
});

// npm run test:unit change-sequence.test.ts
