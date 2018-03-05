const { resolve } = require('path');

const configPath = resolve(__dirname, './dist');

module.exports = require(configPath).configs.prettier;
