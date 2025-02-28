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

import type { ESLint, Linter } from 'eslint';

export function next({ plugins }: { plugins: { next: ESLint.Plugin } }) {
  return {
    name: 'foundry/next',
    // TODO:
    // files: [],
    plugins,
    settings: {
      // This is needed for eslint-plugin-compat: https://www.npmjs.com/package/eslint-plugin-compat#adding-polyfills
      // The list is based on https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js
      polyfills: [
        'Array.prototype.copyWithin',
        'Array.prototype.fill',
        'Array.prototype.find',
        'Array.prototype.findIndex',
        'Array.prototype.flagMap',
        'Array.prototype.flat',
        'Array.from',
        'Array.prototype.includes',
        'Array.of',
        'Function.name',
        'Map',
        'Number.EPSILON',
        'Number.isFinite',
        'Number.isInteger',
        'Number.isNaN',
        'Number.isSafeInteger',
        'Number.MAX_SAFE_INTEGER',
        'Number.MIN_SAFE_INTEGER',
        'Number.parseFloat',
        'Number.parseInt',
        'Object.assign',
        'Object.entries',
        'Object.getOwnPropertyDescriptors',
        'Object.keys',
        'Object.is',
        'Object.values',
        'Reflect',
        'RegExp',
        'Set',
        'Symbol',
        'String.prototype.codePointAt',
        'String.prototype.endsWith',
        'String.prototype.fromCodePoint',
        'String.prototype.includes',
        'String.prototype.padStart',
        'String.prototype.padEnd',
        'String.prototype.raw',
        'String.prototype.repeat',
        'String.prototype.startsWith',
        'String.prototype.trimLeft',
        'String.prototype.trimRight',
        'URL',
        'URLSearchParams',
        'WeakMap',
        'WeakSet',
        'Promise',
        'fetch',
      ],
    },
  } satisfies Linter.Config;
}
