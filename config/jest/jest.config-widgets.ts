import type { Config } from 'jest';
import cfg from './jest.config';


const config: Config = Object.assign(cfg, {
  displayName: 'WIDGETS',
  testMatch: [
    '**/widgets/**/*.test.ts'
  ]
});

export default config;
