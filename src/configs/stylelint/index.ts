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

import dedent from 'dedent';

import { Script, File } from '../../types/shared';

export const files = (): File[] => [
  {
    name: '.stylelintrc.js',
    content: `
    module.exports = require('@sumup-oss/foundry/stylelint')()`,
  },
  {
    name: '.stylelintignore',
    content: `${dedent`
      node_modules/
      build/
      dist/
      .next/
      .out/
      static/
      public/
      coverage/
      __coverage__/
      __reports__/
    `}\n`,
  },
];

export const scripts = (): Script[] => [
  {
    name: 'lint:css',
    command: "foundry run stylelint '**/*.css'",
    description: 'check files for problematic patterns and report them',
  },
];
