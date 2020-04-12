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

import { Preset, Language, Environment, Framework, CI } from '../types/shared';
import { enumToChoices } from '../lib/choices';

import { run, RunParams } from './run';
import { init, InitParams } from './init';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs
  .command(
    'init',
    "Initialize Foundry's tools in your project",
    (yrgs) =>
      yrgs
        .option('presets', {
          alias: 'p',
          desc:
            'A preset configures a group of tools that solve a common problem',
          choices: enumToChoices(Preset),
          type: 'array',
        })
        .option('language', {
          alias: 'l',
          desc: 'The programming language the project uses',
          choices: enumToChoices(Language),
        })
        .option('environments', {
          alias: 'e',
          desc: 'The environment(s) that the code runs in',
          choices: enumToChoices(Environment),
          type: 'array',
        })
        .option('frameworks', {
          alias: 'f',
          desc: 'The frameworks the project uses',
          choices: enumToChoices(Framework),
          type: 'array',
        })
        .option('ci', {
          desc: 'The CI platform the project uses',
          choices: enumToChoices(CI),
        })
        .option('openSource', {
          alias: 'o',
          desc: 'Whether the project is open source',
          type: 'boolean',
        })
        .option('publish', {
          desc: 'Whether to publish to NPM',
          type: 'boolean',
        })
        .option('configDir', {
          alias: 'c',
          desc: 'The directory to write configs to',
          type: 'string',
          default: '.',
        })
        .option('overwrite', {
          desc: 'Whether to overwrite existing config files',
          type: 'boolean',
          default: false,
        }),
    (args: InitParams) => execute('init', args),
  )
  .command(
    'run <tool> [...tool options]',
    'Run any of the bundled tools.',
    (args: RunParams) => execute('run', args),
  )
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .version().argv;

type CommandType = 'init' | 'run';

function execute(command: CommandType, args: any): void {
  const commands = { run, init };
  const commandFn = commands[command];

  commandFn(args);
}
