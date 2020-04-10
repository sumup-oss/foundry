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
name: Continous Integration

on: [push]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Use Node.js v10
        uses: actions/setup-node@v1
        with:
          node-version: 10.x
      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"
      - name: Cache dependencies
        uses: actions/cache@v1
        id: yarn-cache
        with:
          path: $\\{{ steps.yarn-cache-dir-path.outputs.dir }}
          key: $\\{{ runner.os }}-yarn-$\\{{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            $\\{{ runner.os }}-yarn-
      - name: Install dependencies
        run: |
          npm install -g yarn
          yarn --pure-lockfile
{{#includes presets "lint"}}
      - name: Lint
        run: yarn lint:ci
{{/includes}}
      - name: Upload code coverage
        uses: codecov/codecov-action@v1.0.3
        with:
          token: $\\{{ secrets.CODECOV_TOKEN }}
{{#includes presets "release"}}
      - name: Release
        env:
          GITHUB_TOKEN: $\\{{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: $\\{{ secrets.NPM_TOKEN }}
        run: yarn release
{{/includes}}
`;
