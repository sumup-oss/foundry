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

/* eslint-disable no-useless-escape */

export const fileName = '.github/workflows/ci.yaml';

export const template = `
name: Continuous Integration

on: [push]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Use Node.js v16
        uses: actions/setup-node@v2
        with:
          node-version: 16.x
      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "dir=$(yarn cache dir)" >> $GITHUB_OUTPUT
      - name: Cache dependencies
        uses: actions/cache@v2
        id: yarn-cache
        with:
          path: $\\{{ steps.yarn-cache-dir-path.outputs.dir }}
          key: $\\{{ runner.os }}-yarn-$\\{{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            $\\{{ runner.os }}-yarn-
      - name: Install dependencies
        run: yarn --pure-lockfile --prefer-offline
{{#includes presets "lint"}}
      - name: Lint
        run: yarn lint
{{/includes}}
{{#includes presets "release"}}
      - name: Release
        env:
          GITHUB_TOKEN: $\\{{ secrets.GITHUB_TOKEN }}
{{#if publish}}
          NPM_TOKEN: $\\{{ secrets.NPM_TOKEN }}
{{/if}}
        run: yarn release
{{/includes}}
`;
