/**
 * Copyright 2023, SumUp Ltd.
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

import { Config as StylelintConfig } from 'stylelint';
import { flow, mergeWith, isArray, isObject, uniq, isEmpty } from 'lodash/fp';

import { getOptions } from '../../lib/options';
import { Plugin } from '../../types/shared';

export const customizeConfig = mergeWith(customizer);

function isArrayTypeGuard(array: unknown): array is unknown[] {
  return isArray(array);
}

function customizer(
  objValue: unknown,
  srcValue: unknown,
  key: string,
): unknown {
  if (isArrayTypeGuard(objValue) && isArrayTypeGuard(srcValue)) {
    return uniq([...objValue, ...srcValue]);
  }
  if (isObject(objValue) && isObject(srcValue)) {
    return key === 'rules' ? { ...objValue, ...srcValue } : undefined;
  }
  return undefined;
}

const base: StylelintConfig = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-no-unsupported-browser-features'],
  rules: {
    'declaration-block-no-redundant-longhand-properties': null,
    'media-feature-range-notation': ['prefix'],
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'selector-not-notation': ['simple'],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
    'plugin/no-unsupported-browser-features': [
      true,
      { severity: 'warning', ignorePartialSupport: true },
    ],
  },
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};

function customizePlugin(plugins: Plugin[]) {
  const pluginMap: { [key in Plugin]?: StylelintConfig } = {
    [Plugin.CIRCUIT_UI]: {
      plugins: ['@sumup/stylelint-plugin-circuit-ui'],
      rules: {
        'circuit-ui/no-invalid-custom-properties': true,
      },
    },
  };

  return (config: StylelintConfig): StylelintConfig => {
    if (!plugins || isEmpty(plugins)) {
      return config;
    }

    return plugins.reduce((acc, plugin: Plugin) => {
      const overrides = pluginMap[plugin];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function applyOverrides(overrides: StylelintConfig) {
  return (config: StylelintConfig): StylelintConfig =>
    customizeConfig(config, overrides);
}

export function createConfig(overrides: StylelintConfig = {}): StylelintConfig {
  const options = getOptions();

  return flow(
    customizePlugin(options.plugins),
    applyOverrides(overrides),
  )(base);
}
