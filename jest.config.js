module.exports = {
  clearMocks: true,
  coverageDirectory: '__coverage__',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: './testSetup.js'
};
