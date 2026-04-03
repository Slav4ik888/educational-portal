import type { Config } from 'jest';
import path from 'path';
import { BuildProject } from '../build/types';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: Config = {
  displayName: 'UNIT',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$'     : 'ts-jest',
    '^.+\\.(js|jsx)$' : 'babel-jest'
  },
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    'node_modules', 'src'
  ],

  modulePaths: [
    '<rootDir>src'
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '../../'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    // '<rootDir>src/**/*(*.)@(spec|test).[tj]s?(x)',
    // '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/'
  ],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: undefined,

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>setup-tests.ts'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(scss|css)$'               : 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg)$'      : path.resolve(__dirname, 'mocks', 'jest-empty-component.tsx'),
    '\\.svg'                       : path.resolve(__dirname, 'mocks', 'jest-empty-component.tsx'),
    'react-markdown'               : path.resolve(__dirname, 'mocks', 'jest-react-markdown-component.tsx'),
    'remark-gfm'                   : path.resolve(__dirname, 'mocks', 'jest-remark-gfm.ts'),
    'src/(.*)'                     : '<rootDir>/../../src/$1',
    'entities/(.*)'                : '<rootDir>/../../src/entities/$1'
  },
  resolver: undefined,

  // A set of global variables that need to be available in all test environments
  globals: {
    __IS_DEV__  : true,
    __API_URL__ : '',
    __PROJECT__ : BuildProject.JEST
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(react-markdown|remark-gfm)/)'
  ]
};

export default config;
