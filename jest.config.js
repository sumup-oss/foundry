module.exports = {
  clearMocks: true,
  rootDir: 'src',
  coverageDirectory: '../__reports__',
  reporters: ['default', 'jest-junit'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: '../testSetup.js'
};
