const { configs, merge } = require('@sumup/sumup-js');
const { node, test } = configs.eslint;

module.exports = merge(node, test);
