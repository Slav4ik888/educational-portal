import { deepEqual } from '..';


describe('deepEqual', () => {
  const prevObj = {
    id: 1,
    obj: {
      f: {
        str: '1'
      },
      arr: [{ a: 1 }, { b: 2 }]
    }
  };

  test('Not changes, without array', () => {
    const newObj = {
      id: 1,
      obj: {
        f: {
          str: '1'
        },
        arr: [{ a: 1 }, { b: 2 }]
      }
    };

    expect(deepEqual(prevObj, newObj)).toEqual(true);
  });

  test('With changes - in field, without array', () => {
    const newObj = {
      id: 1,
      obj: {
        f: {
          str: '11'
        },
        arr: [{ a: 1 }, { b: 2 }]
      }
    };

    expect(deepEqual(prevObj, newObj)).toEqual(false);
  });

  test('With changes - added new field, without array', () => {
    const newObj = {
      id: 1,
      obj: {
        f: {
          str: '1',
          newField: 123,
        },
        arr: [{ a: 1 }, { b: 2 }]
      }
    };

    expect(deepEqual(prevObj, newObj)).toEqual(false);
  });

  test('With changes in array', () => {
    const newObj = {
      id: 1,
      obj: {
        f: {
          str: '1',
        },
        arr: [{ a: 1 }, { b: 333 }]
      }
    };

    expect(deepEqual(prevObj, newObj)).toEqual(false);
  });
});

// npm run test:unit deep-equal.test.ts
