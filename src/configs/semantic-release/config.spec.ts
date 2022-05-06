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

import { getOptions as getOptionsMock } from '../../lib/options';

import { config } from './config';

jest.mock('../../lib/options', () => ({
  getOptions: jest.fn(() => ({})),
}));

const getOptions = getOptionsMock as jest.Mock;

describe('semantic-release', () => {
  it('should return a default config', () => {
    const actual = config();
    expect(actual).toMatchSnapshot();
  });

  it('should return a config to publish to NPM', () => {
    const options = { publish: true };
    getOptions.mockReturnValue(options);
    const actual = config();
    expect(actual).toMatchSnapshot();
  });

  it('should override the default config', () => {
    const overrides = {
      branches: ['main'],
    };
    const actual = config(overrides);
    expect(actual).toEqual(expect.objectContaining({ branches: ['main'] }));
  });
});
