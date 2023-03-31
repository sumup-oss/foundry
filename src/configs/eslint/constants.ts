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

export const UNIT_TEST_FILES = [
  '**/*.spec.*',
  '**/jest*',
  '**/setupTests.*',
  '**/test-utils.*',
  '**/*Fixtures.*',
  '**/__fixtures__/**/*',
  '**/__mocks__/**/*',
];

export const NODE_FILES = ['api/**/*', 'pages/api/**/*', 'src/pages/api/**/*'];

// These lists are not exhaustive and should be expanded if necessary.
export const NODE_LIBRARIES = [
  'next',
  '@sveltejs/kit',
  'nuxt',
  'express',
  'koa',
];

export const BROWSER_LIBRARIES = ['next', 'react', 'preact', 'svelte', 'vue'];
