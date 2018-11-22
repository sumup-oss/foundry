module.exports = {
  clearMocks: true,
  coverageDirectory: '__coverage__',
  coveragePathIgnorePatterns: ['/node_modules/', 'plop/templates'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  collectCoverageFrom: ['src/**/*.js'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: './testSetup.js'
};
