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

import { describe, expect, it, vi } from 'vitest';

import { flow, uniq } from './helpers.js';

describe('helpers', () => {
  describe('flow', () => {
    it('should call each function', () => {
      const fn1 = vi.fn((value: string) => value);
      const fn2 = vi.fn((value: string) => value);
      const fn3 = vi.fn((value: string) => value);
      const value = 'foo';
      const actual = flow(fn1, fn2, fn3)(value);

      expect(fn1).toHaveBeenCalledWith(value);
      expect(fn2).toHaveBeenCalledWith(value);
      expect(fn3).toHaveBeenCalledWith(value);
      expect(actual).toBe(value);
    });

    it('should call the next function with the previous return value', () => {
      const fn1 = vi.fn((value: number) => value + 1);
      const fn2 = vi.fn((value: number) => value + 2);
      const fn3 = vi.fn((value: number) => value + 3);
      const value = 0;
      const actual = flow(fn1, fn2, fn3)(value);

      expect(fn1).toHaveBeenCalledWith(0);
      expect(fn2).toHaveBeenCalledWith(1);
      expect(fn3).toHaveBeenCalledWith(3);
      expect(actual).toBe(6);
    });
  });

  describe('uniq', () => {
    it('should return an array of unique values', () => {
      const values = [1, 3, 3, 4, 5, 1, 'foo', 'bar', 'foo'];
      const actual = uniq(values);
      expect(actual).toEqual([1, 3, 4, 5, 'foo', 'bar']);
    });
  });
});
