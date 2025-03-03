/**
 * Copyright 2025, SumUp Ltd.
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

export const extensions = {
  javascript: ['.js', '.jsx', '.cjs', '.mjs'],
  typescript: ['.ts', '.tsx', '.cts', '.mts'],
};

export const files = {
  javascript: toGlobPattern(extensions.javascript),
  typescript: toGlobPattern(extensions.typescript),
  tests: [
    '**/*.spec.*',
    '**/jest*',
    '**/setupTests.*',
    '**/test-utils.*',
    '**/*Fixtures.*',
    '**/__fixtures__/**/*',
    '**/__mocks__/**/*',
  ],
};

function toGlobPattern(exts: string[]) {
  return exts.map((extension) => `**/*${extension}`);
}
