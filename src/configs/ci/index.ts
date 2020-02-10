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

import { includes } from 'lodash/fp';
import Handlebars from 'handlebars';

import { Options, File, CI } from '../../types/shared';

import * as githubActions from './github-actions';

// eslint-disable-next-line no-confusing-arrow
Handlebars.registerHelper('includes', (array, value, options) =>
  includes(value, array) ? options.fn(options.data.root) : null,
);

const PLATFORM_MAP = {
  [CI.GITHUB_ACTIONS]: githubActions,
};

export const files = (options: Options): File[] => {
  const { ci = CI.GITHUB_ACTIONS } = options;
  const platform = PLATFORM_MAP[ci];
  const template = Handlebars.compile(platform.template);
  const content = template(options);
  return [
    {
      name: platform.fileName,
      content,
    },
  ];
};
