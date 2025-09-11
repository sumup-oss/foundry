/**
 * Copyright 2020, SumUp Ltd.
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

import dedent from 'dedent';

import {
  Environment,
  type File,
  Framework,
  type InitOptions,
  Language,
  Plugin,
} from '../../types/shared.js';

const environmentConfigMap = {
  [Environment.Browser]: 'configs.browser',
  [Environment.Node]: 'configs.node',
};

const testPlugins = [
  Plugin.Cypress,
  Plugin.Jest,
  Plugin.Playwright,
  Plugin.TestingLibrary,
];

export const files = (options: InitOptions): File[] => {
  const configs = ['configs.ignores', 'configs.javascript'];
  const imports = [];

  if (options.language === Language.TypeScript) {
    configs.push('configs.typescript');
  }

  options.environments?.forEach((environment) => {
    const config = environmentConfigMap[environment];
    configs.push(config);
  });

  if (options.openSource) {
    configs.push('configs.openSource');
  }

  // TODO: Check how this was handled before. Are next and react mutually exclusive?
  if (options.frameworks?.includes(Framework.Nextjs)) {
    // TODO: Import next plugin
    imports.push("import react from 'eslint-plugin-react'");
    configs.push(
      "{ extends: [ react.configs.recommended, react.configs['jsx-runtime'], configs.react], plugins: { react }}",
      'configs.next',
    );
  } else if (options.frameworks?.includes(Framework.React)) {
    imports.push("import react from 'eslint-plugin-react'");
    configs.push(
      "{ extends: [ react.configs.recommended, react.configs['jsx-runtime'], configs.react], plugins: { react }}",
    );
  }

  if (options.plugins?.some((plugin) => testPlugins.includes(plugin))) {
    // TODO: import any plugins?
    configs.push('configs.tests');
  }

  if (options.plugins?.includes(Plugin.Storybook)) {
    // TODO: import any plugins?
    configs.push('configs.stories');
  }

  return [
    {
      name: 'eslint.config.mjs',
      content: dedent`
      import { configs, defineConfig } from '@sumup-oss/foundry/eslint';
      ${imports.join('')}

      export default defineConfig([
        ${configs.join(', ')}
      ]);
    `,
    },
  ];
};
