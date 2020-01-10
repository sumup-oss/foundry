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

import { Preset, Language, Target } from '../types/shared';
import { enumToChoices } from '../lib/choices';

import { run, RunParams } from './run';
import { init, InitParams } from './init';

yargs
  .command(
    'init',
    "Initialize Foundry's tools in your project",
    (yrgs) =>
      yrgs
        .option('presets', {
          desc:
            'A preset configures a group of tools that solve a common problem',
          choices: enumToChoices(Preset),
          type: 'array'
        })
        .option('language', {
          desc: 'The programming language the project uses',
          choices: enumToChoices(Language)
        })
        .option('target', {
          desc: 'The platform that the project targets',
          choices: enumToChoices(Target)
        })
        .option('publish', {
          desc: 'Whether to publish to NPM',
          type: 'boolean'
        })
        .option('configDir', {
          desc: 'The directory to write configs to',
          type: 'string',
          default: '.'
        }),
    (args: InitParams) => execute('init', args)
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

type CommandType = 'init' | 'run';

function execute(command: CommandType, args: any) {
  const commands = { run, init };
  const commandFn = commands[command];

  commandFn(args);
}
