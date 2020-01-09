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

import { Options as PrettierConfig, BuiltInParserName } from 'prettier';

import { Language } from '../../types/shared';

type PrettierOptions = {
  language: Language;
};

type Parsers = {
  [key in Language]: BuiltInParserName;
};

const PARSERS: Parsers = {
  [Language.JAVASCRIPT]: 'babel',
  [Language.TYPESCRIPT]: 'typescript'
};

export function config(
  options: PrettierOptions = { language: Language.TYPESCRIPT },
  overrides: PrettierConfig = {}
) {
  const { language } = options;
  const base: PrettierConfig = {
    parser: PARSERS[language],
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'consistent',
    trailingComma: 'none',
    jsxSingleQuote: false,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'always',
    endOfLine: 'lf'
  };
  return { ...base, ...overrides };
}
