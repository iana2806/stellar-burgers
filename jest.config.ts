import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@api': '<rootDir>/src/utils/burger-api'
  }
};

export default config;
