const { node, test } = require('@sumup/foundry/eslint');
const { merge } = require('@sumup/foundry');

module.exports = merge(node, test);
