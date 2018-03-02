#!/usr/bin/env node

import yargs from 'yargs';

import bootstrap from './cli/bootstrap';
import run from './cli/run';

import { eslint, babel } from './configs';

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;

// eslint-disable-next-line
yargs
  .command(
    'bootstrap-config',
    'Set up custom configurations for babel, eslint, prettier, etc.',
    yrgs =>
      yrgs
        .option('eslint', {
          desc: 'The eslint config to write.',
          choices: [true, ...ESLINT_CONFIGS],
          coerce: val => (val === true ? 'base' : val)
        })
        .option('babel', {
          desc: 'The eslint config to write.',
          coerce: val => (val === true ? 'base' : val),
          choices: [true, ...BABEL_CONFIGS]
        })
        .option('prettier', {
          desc: 'Write the prettier config.',
          coerce: val => (val === true ? 'base' : val),
          default: false,
          type: 'boolean'
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
    args => execute('bootstrap', args)
  )
  .command(
    'run <tool> [...tool options]',
    'Run any of the bundled tools.',
    args => execute('run', args)
  )
  .help()
  .version().argv;

function execute(command, args) {
  const commands = { bootstrap, run };
  const commandFn = commands[command];

  if (!commandFn) {
    throw new TypeError(`Unknown command ${command}`);
  }

  commandFn(args);
}
