import type { Config } from 'jest';
import cfg from './jest.config';


const config: Config = Object.assign(cfg, {
  displayName: 'ENTITIES',
  testMatch: [
    '**/entities/**/*.test.ts'
  ]
});

export default config;
