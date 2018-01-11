const { configs, merge } = require('./dist');
const { node, test } = configs.eslint;

module.exports = merge(node, test);
console.log(module.exports.overrides)
