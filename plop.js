const { resolve } = require('path');

const configPath = resolve(__dirname, './dist');

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(configPath).configs.plop;
