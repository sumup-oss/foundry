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

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  clearMocks: true,
  rootDir: 'src',
  coverageDirectory: '../__reports__',
  reporters: ['default', 'jest-junit'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended']
};
