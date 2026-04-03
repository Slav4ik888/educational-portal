import { formatDate } from 'shared/helpers/dates';
import { __devLog } from 'shared/lib/tests/__dev-log';
import cfg from '.';


describe('config.js', () => {
  it('ASSEMBLY_TIME', () => {
    const currentDate = formatDate(new Date().getTime(), 'YYYY-MM-DD');
    __devLog('currentDate: ', currentDate);
    expect(currentDate).toEqual(cfg.ASSEMBLY_DATE);
  });
})

// npm run test:unit config.test.ts
