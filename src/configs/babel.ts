/**
 * Copyright 2019, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import merge from 'webpack-merge';

export const withoutPreset = (preset: string) => (arr: any[]) =>
  arr.filter((el) => {
    const isStringPreset = typeof el === 'string' && el === preset;
    const isArrayPreset = el.constructor.name === 'Array' && el[0] === preset;
    return !isStringPreset && !isArrayPreset;
  });

export const overwriteEnvPreset = merge({
  customizeArray(a: any[], b: any[], key: string) {
    if (key === 'presets') {
      const aWithoutEnv = withoutPreset('@babel/preset-env')(a);
      return Object.values(merge(aWithoutEnv, b));
    }

    return undefined;
  }
});

export const base = {
  presets: ['@babel/preset-env']
};

export const react = {
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ],
  presets: [
    '@babel/preset-react',
    {
      development: process.env.BABEL_ENV === 'development'
    }
  ]
};

export const node = overwriteEnvPreset(base, {
  // FIXME: this disables module transpilation in normal node environments. Needs
  //        to be fixed! potentially by editing this project's .babelrc.js accordingly.
  presets: [
    ['@babel/preset-env', { targets: { node: '8.4.0' }, modules: false }]
  ]
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
