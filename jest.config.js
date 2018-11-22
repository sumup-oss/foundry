module.exports = {
  clearMocks: true,
  rootDir: 'src',
  coverageDirectory: '../__reports__',
  reporters: ['jest-junit'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: '../testSetup.js'
};
