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

import { getFileExtension } from '../../lib/files.js';
import {
  Environment,
  type File,
  Framework,
  Language,
  type Options,
  Plugin,
} from '../../types/shared.js';

const languageConfigMap = {
  [Language.JavaScript]: 'configs.javascript',
  [Language.TypeScript]: 'configs.typescript',
};

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

export function files(options: Required<Options>): File[] {
  const configs = ['configs.ignores'];
  const imports = [];

  configs.push(languageConfigMap[options.language]);

  options.environments.forEach((environment) => {
    const config = environmentConfigMap[environment];
    configs.push(config);
  });

  if (options.openSource) {
    configs.push('configs.openSource');
  }

  if (options.frameworks.includes(Framework.Nextjs)) {
    // TODO: Add support for Next.js' ESLint plugin?
    configs.push('configs.next');
  } else if (options.frameworks.includes(Framework.React)) {
    imports.push("import react from 'eslint-plugin-react'");
    configs.push(
      "{ extends: [ react.configs.recommended, react.configs['jsx-runtime'], configs.react], plugins: { react }}",
    );
  }

  if (options.plugins.some((plugin) => testPlugins.includes(plugin))) {
    // TODO: Add built-in support for plugin-specific ESLint plugins (e.g. eslint-plugin-jest)?
    configs.push('configs.tests');
  }

  if (options.plugins.includes(Plugin.Storybook)) {
    // TODO: Add built-in support for Storybook's ESLint plugin?
    configs.push('configs.stories');
  }

  return [
    {
      name: getFileExtension('eslint.config', 'module', options.packageType),
      content: dedent`
      import { configs, defineConfig } from '@sumup-oss/foundry/eslint';
      ${imports.join('')}

      export default defineConfig([
        ${configs.join(', ')}
      ]);
    `,
    },
  ];
}
