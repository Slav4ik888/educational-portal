import { sortingArr } from '..';
import * as m from './mocks';


describe('SORTING.JS - sortingArr', () => {
  it('Сортируем по полю id', () => {
    expect(sortingArr(m.mockArrayStart, 'id')).toEqual(m.mockArrayEndSort);
  });
});



// npm run test:unit sorting.test.ts
