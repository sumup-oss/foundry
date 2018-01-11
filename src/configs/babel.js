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
  presets: ['env']
};

export const react = {
  plugins: ['transform-object-rest-spread', 'transform-class-properties'],
  presets: ['react']
};

export const node = overwriteEnvPreset(base, {
  presets: [['env', { targets: { node: '8.4.0' } }]]
});

export const webpack = {
  plugins: ['syntax-dynamic-import'],
  presets: [['env', { modules: false }]]
};

export const lodash = {
  plugins: ['lodash']
};

export const defaultReactSpa = overwriteEnvPreset(base, react, webpack, lodash);

export const BABEL_CONFIGS = ['base', 'react', 'node', 'webpack', 'lodash'];
