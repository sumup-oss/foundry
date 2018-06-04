const { configs, merge } = require('@sumup/eslint');
const { node, test } = configs.eslint;

module.exports = merge(node, test);
