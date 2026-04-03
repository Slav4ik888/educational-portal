import type { Config } from 'jest';
import cfg from './jest.config';


const config: Config = Object.assign(cfg, {
  displayName: 'FEATURES',
  testMatch: [
    '**/features/**/*.test.ts'
  ]
});

export default config;
