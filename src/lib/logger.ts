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

import chalk from 'chalk';

import { isArray } from './type-check.js';

type LogMessage = string | string[];

const IS_DEBUG =
  process.argv.includes('--debug') || process.env.NODE_ENV === 'DEBUG';

function getMessage(arg: LogMessage): string {
  const message = isArray(arg) ? arg.join('\n') : arg;
  return message;
}

export function error(arg: LogMessage): void {
  const msg = getMessage(arg);
  console.error(`🚨 ${chalk.red(msg)}`);
}

export function warn(arg: LogMessage): void {
  const msg = getMessage(arg);
  console.warn(`⚠️ ${chalk.yellow(msg)}`);
}

export function log(arg: LogMessage): void {
  const msg = getMessage(arg);
  console.log(msg);
}

export function info(arg: LogMessage): void {
  const msg = getMessage(arg);
  console.log(`ℹ️ ${msg}`);
}

export function debug(arg: LogMessage): void {
  if (!IS_DEBUG) {
    return;
  }

  const msg = getMessage(arg);
  console.debug(`🛠️ ${chalk.cyan(msg)}`);
}

export function empty(): void {
  console.log('');
}

export function table(obj: Record<string, unknown>): void {
  console.table(obj);
}
