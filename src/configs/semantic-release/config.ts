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

import { Options } from '../../types/shared';

type SemanticReleaseOptions = Pick<Options, 'publish'>;

type Branch = string | { name: string; prerelease: boolean };

interface SemanticReleaseConfig {
  extends?: string | string[];
  branches?: Branch[];
  plugins?: string[];
  tagFormat?: string;
  repositoryUrl?: string;
  dryRun?: boolean;
  ci?: boolean;
}

const base: SemanticReleaseConfig = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'master',
    'next',
    { name: 'alpha', prerelease: true },
    { name: 'beta', prerelease: true },
    { name: 'canary', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
  ],
};

const npm: SemanticReleaseConfig = {
  ...base,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
};

export function config(
  options: SemanticReleaseOptions = {},
  overrides: SemanticReleaseConfig = {},
): SemanticReleaseConfig {
  const { publish = false } = options;
  const baseConfig = publish ? npm : base;
  return { ...baseConfig, ...overrides };
}
