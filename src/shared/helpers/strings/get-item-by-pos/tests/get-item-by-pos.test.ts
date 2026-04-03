import { getItemByPos, Pos } from '..';


describe('getItemByPos', () => {
  const str = '.get.Item.By.Divs';
  test(`"${str}" div = "."`, () => {
    expect(getItemByPos(str, '.', 0)).toEqual('');
    expect(getItemByPos(str, '.', 1)).toEqual('get');
    expect(getItemByPos(str, '.', 10)).toEqual(undefined);
    expect(getItemByPos(str, '.', -1)).toEqual(undefined);
    expect(getItemByPos(str, '.', -3)).toEqual(undefined);
    expect(getItemByPos(str, '.', 'last')).toEqual('Divs');
    expect(getItemByPos(str, '.', 'first')).toEqual('');
    expect(getItemByPos(str, '.', 'second')).toEqual('get');
    expect(getItemByPos(str, '.', 'third')).toEqual('Item');
    expect(getItemByPos(str, '.', 'prev')).toEqual('By');
    expect(getItemByPos(str, '.', 'prev-prev')).toEqual('Item');
    expect(getItemByPos(str, '.', 'undefined' as Pos)).toEqual(undefined);
  });

  test(`"${str}" div = "/"`, () => {
    expect(getItemByPos(str, '/', 0)).toEqual(str);
    expect(getItemByPos(str, '/', 1)).toEqual(undefined);
  });

  test('splitter is undefined', () => {
    expect(getItemByPos(str, undefined as unknown as string, 0)).toEqual(str);
    expect(getItemByPos(str, true as unknown as string, 0)).toEqual(str);
  });

  test('pos is undefined', () => {
    expect(getItemByPos(str, '.', undefined as unknown as Pos)).toEqual(str);
  });

  test('str is undefined', () => {
    expect(getItemByPos(undefined as unknown as string, '.', 0)).toEqual(undefined);
  });
  test('str is number', () => {
    expect(getItemByPos(123 as unknown as string, '.', 0)).toEqual(undefined);
  });
});

// npm run test:unit get-item-by-pos.test.ts
