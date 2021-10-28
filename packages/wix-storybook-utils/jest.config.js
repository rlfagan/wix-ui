module.exports = {
  transform: {
    '\\.(ts|tsx|js)$': 'ts-jest',
    '\\.st\\.css?$': require.resolve('@stylable/jest'),
  },
  moduleNameMapper: {
    '\\.(scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['wix-ui-test-utils/jest-setup'],
  setupFiles: ['raf/polyfill', '<rootDir>/test/enzyme-setup'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testRegex: '/src/.*\\.(spec|test)\\.([tj]sx?)$',
};
