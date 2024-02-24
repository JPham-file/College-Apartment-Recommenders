import type { Config } from 'jest';

const config: Config = {
    // include expo preset
    preset: "jest-expo",
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    clearMocks: true,
    // collect coverage results
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/components/**/*.{ts,tsx}',
        '<rootDir>/src/lib/**/*.{ts,tsx}',
        '!<rootDir>/src/types/*.{d.ts}',
        '!<rootDir>/coverage/**',
        '!<rootDir>/out/**',
        '!<rootDir>/.next/**',
        '!<rootDir>/docs/**',
        '!<rootDir>/*.config.js',
        '!<rootDir>/.github/**',
        '!<rootDir>/.circleci/**',
        '!<rootDir>/node_modules/**',
        '!<rootDir>/assets/**',
    ],
    coveragePathIgnorePatterns: [
        'index.(ts)?(tsx)?',
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageProvider: "v8"
};

export default config;