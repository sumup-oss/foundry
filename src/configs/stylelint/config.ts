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
import { getPlugins } from '../../lib/options.js';
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
  extends: ['stylelint-config-standard'],
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

    // Covered by Biome
    'at-rule-no-unknown': null,
    'block-no-empty': null,
    'custom-property-no-missing-var-function': null,
    'declaration-block-no-duplicate-custom-properties': null,
    'declaration-block-no-duplicate-properties': null,
    'declaration-block-no-shorthand-property-overrides': null,
    'declaration-no-important': null,
    'font-family-no-duplicate-names': null,
    'font-family-no-missing-generic-family-keyword': null,
    'function-linear-gradient-no-nonstandard-direction': null,
    'function-no-unknown': null,
    'keyframe-block-no-duplicate-selectors': null,
    'keyframe-declaration-no-important': null,
    'media-feature-name-no-unknown': null,
    'named-grid-areas-no-invalid': null,
    'no-duplicate-at-import-rules': null,
    'no-invalid-position-at-import-rule': null,
    'no-irregular-whitespace': null,
    'property-no-unknown': null,
    'selector-anb-no-unmatchable': null,
    'selector-pseudo-element-no-unknown': null,
    'selector-type-no-unknown': null,
    'unit-no-unknown': null,
  },
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};

function customizePlugin(plugins: Plugin[]) {
  const pluginMap: { [Key in Plugin]?: StylelintConfig } = {
    [Plugin.CircuitUI]: {
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

export function defineConfig(overrides: StylelintConfig = {}): StylelintConfig {
  const plugins = getPlugins();

  return flow(customizePlugin(plugins), applyOverrides(overrides))(base);
}
