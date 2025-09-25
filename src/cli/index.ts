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
import { hideBin } from 'yargs/helpers';

import { debug } from './debug.js';
import { DEFAULT_ARGS } from './defaults.js';
import { type InitParams, init } from './init.js';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .command(
    'init',
    "Initialize Foundry's tools in your project",
    {
      configDir: {
        desc: 'The directory to write configs to',
        type: 'string',
        default: DEFAULT_ARGS.configDir,
      },
      overwrite: {
        desc: 'Whether to overwrite existing configs',
        type: 'boolean',
        default: DEFAULT_ARGS.overwrite,
      },
    },
    execute('init'),
  )
  .command(
    'debug',
    'See which packages and plugins Foundry has detected in your project',
    execute('debug'),
  )
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .version().argv;

type CommandType = 'init' | 'debug';

function execute(command: CommandType) {
  const commands = { init, debug };
  const commandFn = commands[command];

  return async (args: unknown): Promise<void> => {
    try {
      await commandFn(args as InitParams);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Can't use custom logger for error objects
      console.error(error);
    }
  };
}
