const merge = require('webpack-merge');

export const withoutPreset = preset => arr =>
  arr.filter(el => {
    const isStringPreset = typeof el === 'string' && el === preset;
    const isArrayPreset = el.constructor.name === 'Array' && el[0] === preset;
    return !isStringPreset && !isArrayPreset;
  });

export const overwriteEnvPreset = merge({
  customizeArray(a, b, key) {
    if (key === 'presets') {
      const aWithoutEnv = withoutPreset('env')(a);
      return Object.values(merge(aWithoutEnv, b));
    }

    return undefined;
  }
});

export const base = {
  presets: ['@babel/preset-env']
};

export const react = {
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties'],
  presets: ['@babel/preset-react', { development:
  process.env.BABEL_ENV === 'development' }],
};

export const node = overwriteEnvPreset(base, {
  presets: [['@babel/preset-env', { targets: { node: '8.4.0' }, modules: false }]]
});

export const webpack = {
  plugins: ['@babel/plugin-syntax-dynamic-import'],
  presets: [['@babel/preset-env', { modules: false }]]
};

export const lodash = {
  plugins: ['lodash']
};

export const defaultReactSpa = overwriteEnvPreset(base, react, webpack, lodash);

export const BABEL_CONFIGS = ['base', 'react', 'node', 'webpack', 'lodash'];
