#!/usr/bin/env node

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

import yargs from 'yargs';

import { bootstrap, BootstrapParams } from './cli/bootstrap';
import { run, RunParams } from './cli/run';

import { eslint, semanticRelease } from './configs';

const { ESLINT_CONFIGS } = eslint;
const { SEMANTIC_RELEASE_CONFIGS } = semanticRelease;

// eslint-disable-next-line
yargs
  .command(
    'bootstrap-config',
    'Set up custom configurations for Eslint, Prettier, Semantic Release etc.',
    (yrgs) =>
      yrgs
        .option('eslint', {
          desc: 'The eslint config to write.',
          choices: [true, ...ESLINT_CONFIGS],
          coerce: (val) => (val === true ? 'base' : val)
        })
        .option('prettier', {
          desc: 'Write the prettier config.',
          coerce: (val) => (val === true ? 'base' : val)
        })
        .option('plop', {
          desc: 'Write the plop config.',
          coerce: (val) => (val === true ? 'base' : val)
        })
        .option('husky', {
          desc: 'Write the husky config.',
          coerce: (val) => (val === true ? 'base' : val)
        })
        .option('lint-staged', {
          desc: 'Write the lint-staged config.',
          coerce: (val) => (val === true ? 'base' : val)
        })
        .option('semantic-release', {
          desc: 'Write the semantic-release config.',
          coerce: (val) => (val === true ? 'base' : val),
          choices: [true, ...SEMANTIC_RELEASE_CONFIGS]
        })
        .option('targetDir', {
          default: process.cwd(),
          desc: 'Directory to write configs to.',
          type: 'string'
        })
        .option('all', {
          default: false,
          desc: 'Write all base configurations.',
          type: 'boolean'
        }),
    (args: BootstrapParams) => execute('bootstrap', args)
  )
  .command(
    'run <tool> [...tool options]',
    'Run any of the bundled tools.',
    (args: RunParams) => execute('run', args)
  )
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .version().argv;

type CommandType = 'bootstrap' | 'run';

function execute(command: CommandType, args: any) {
  const commands = { bootstrap, run };
  const commandFn = commands[command];

  commandFn(args);
}
