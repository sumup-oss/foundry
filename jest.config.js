module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: './testSetup.js'
};
