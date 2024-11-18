/**
 * Copyright 2024, SumUp Ltd.
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

import { isArray, isObject, isString } from './type-check';

export function isEmpty(value: unknown): boolean {
  if (!value) {
    return true;
  }
  if (isString(value) || isArray(value)) {
    return !value.length;
  }
  if (isObject(value)) {
    return !Object.keys(value).length;
  }
  return false;
}

export function flow<T>(...fns: ((value: T) => T)[]) {
  return (value: T) =>
    fns.reduce((currentValue, fn) => fn(currentValue), value);
}

export function uniq<T>(values: T[]): T[] {
  const set = new Set(values);
  return Array.from(set);
}
