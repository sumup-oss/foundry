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

import type { Linter } from 'eslint';
import noticePlugin from 'eslint-plugin-notice';
import {
  JAVASCRIPT_EXTENSIONS,
  TYPESCRIPT_EXTENSIONS,
  toGlobPattern,
} from './shared.js';

export const openSource = {
  name: 'foundry/open-source',
  files: toGlobPattern([...JAVASCRIPT_EXTENSIONS, ...TYPESCRIPT_EXTENSIONS]),
  plugins: {
    notice: noticePlugin,
  },
  rules: {
    'notice/notice': [
      'error',
      {
        template: `/**
 * Copyright <%= YEAR %>, <%= NAME %>
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

`,
        templateVars: { NAME: 'SumUp Ltd.' },
        varRegexps: { NAME: /SumUp Ltd\./ },
        onNonMatchingHeader: 'prepend',
      },
    ],
  },
} satisfies Linter.Config;
