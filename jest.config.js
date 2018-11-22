module.exports = {
  clearMocks: true,
  rootDir: 'src',
  coverageDirectory: '../__reports__/jest',
  coverageReporters: ['default', 'junit'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: '../testSetup.js'
};
