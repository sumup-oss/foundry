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

import { deepmergeCustom } from 'deepmerge-ts';
import type { Config as StylelintConfig } from 'stylelint';
import { flow, isEmpty, uniq } from '../../lib/helpers.js';
import { getOptions } from '../../lib/options.js';
import { Plugin } from '../../types/shared.js';

export const customizeConfig = deepmergeCustom({
  mergeArrays: (values) => {
    const [baseValue, sourceValue] = values;
    return uniq([...baseValue, ...sourceValue]);
  },
  mergeRecords: (values, utils, meta) => {
    const [baseValue, sourceValue] = values;
    if (meta?.key === 'rules') {
      return { ...baseValue, ...sourceValue };
    }
    return utils.actions.defaultMerge;
  },
});

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
    [Plugin.CIRCUIT_UI_OSS]: {
      plugins: ['@sumup-oss/stylelint-plugin-circuit-ui'],
      rules: {
        'circuit-ui/no-invalid-custom-properties': true,
        'circuit-ui/no-deprecated-custom-properties': true,
      },
    },
  };

  return (config: StylelintConfig): StylelintConfig => {
    if (!plugins || isEmpty(plugins)) {
      return config;
    }

    return plugins.reduce((acc, plugin: Plugin) => {
      const overrides = pluginMap[plugin];
      return overrides ? customizeConfig(acc, overrides) : config;
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
