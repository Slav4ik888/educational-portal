import { getCurrentMs } from '../..';
import { isTimeOut } from '..';


describe('isTimeOut', () => {
  // lastTime is string
  test('lastTime is string & time isn`t out', () => {
    const
      lastTime = new Date().toISOString(),
      waiting = 1000;

    expect(isTimeOut(lastTime, waiting)).toEqual(false);
  });

  test('lastTime is string & time is out', () => {
    const
      lastTime = new Date(getCurrentMs() - 1).toISOString(),
      waiting = 0;

    expect(isTimeOut(lastTime, waiting)).toEqual(true);
  });

  // lastTime is number
  test('lastTime is number & time isn`t out', () => {
    const
      lastTime = getCurrentMs(),
      waiting = 1000;

    expect(isTimeOut(lastTime, waiting)).toEqual(false);
  });

   test('lastTime is number & time is out', () => {
    const
      lastTime = getCurrentMs() - 1,
      waiting = 0;

    expect(isTimeOut(lastTime, waiting)).toEqual(true);
  });
});

// npm run test:unit is-time-out.test.ts
