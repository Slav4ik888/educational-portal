import { ArrWithId, sortingArrByIds } from '..';


describe('sortingArrByIds', () => {
  const MOCK_ARR: ArrWithId = [
    { id: '111' },
    { id: '222' },
    { id: '333' },
    { id: '444' },
    { id: '555' }
  ];

  const MOCK_ARR_WITHOUT_ITEM: ArrWithId = [
    { id: '222' },
    { id: '333' },
    { id: '444' },
    { id: '555' }
  ];


  // UNCHANGED SEQUENCE
  test('Arr is undefined', () => {
    const ids = ['111', '222', '333', '444', '555'];

    expect(sortingArrByIds(undefined as unknown as ArrWithId, ids))
      .toEqual([]);
  });

  test('Ids is undefined', () => {
    expect(sortingArrByIds(MOCK_ARR, undefined as unknown as string[]))
      .toEqual([]);
  });

  test('Arr & Ids is undefined', () => {
    expect(sortingArrByIds(undefined as unknown as ArrWithId, undefined as unknown as string[]))
      .toEqual([]);
  });


  test('Unchanged sequence & arr contains ids only in Ids', () => {
    const ids = ['111', '222', '333', '444', '555'];

    expect(sortingArrByIds(MOCK_ARR, ids))
      .toEqual([
        { id: '111' },
        { id: '222' },
        { id: '333' },
        { id: '444' },
        { id: '555' }
      ]);
  });

  test('Item absent & unchanged sequence', () => {
    const ids = ['111', '222', '333', '444', '555', '666'];

    expect(sortingArrByIds(MOCK_ARR_WITHOUT_ITEM, ids))
      .toEqual([
        { id: '222' },
        { id: '333' },
        { id: '444' },
        { id: '555' },
      ]);
  });

  test('Id absent & unchanged sequence', () => {
    const ids = ['111', '555', '222', '444', '666', '777'];

    expect(sortingArrByIds(MOCK_ARR, ids))
      .toEqual([
        { id: '111' },
        { id: '555' },
        { id: '222' },
        { id: '444' }
      ]);
  });


  // CHANGED SEQUENCE

  test('Changed sequence & arr contains ids only in Ids', () => {
    const ids = ['555', '111', '222', '333', '444'];

    expect(sortingArrByIds(MOCK_ARR, ids))
      .toEqual([
        { id: '555' },
        { id: '111' },
        { id: '222' },
        { id: '333' },
        { id: '444' }
      ]);
  });


  test('Item absent & changed sequence', () => {
    const ids = ['111', '555', '222', '333', '444', '666'];

    expect(sortingArrByIds(MOCK_ARR_WITHOUT_ITEM, ids))
      .toEqual([
        { id: '555' },
        { id: '222' },
        { id: '333' },
        { id: '444' }
      ]);
  });

  test('Id absent & changed sequence', () => {
    const ids = ['111', '555', '222', '444', '666'];

    expect(sortingArrByIds(MOCK_ARR, ids))
      .toEqual([
        { id: '111' },
        { id: '555' },
        { id: '222' },
        { id: '444' }
      ]);
  });
});

// npm run test:unit sorting-arr-by-ids.test.ts
