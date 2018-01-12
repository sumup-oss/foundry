#!/usr/bin/env node

import yargs from 'yargs';

import bootstrap from './cli/bootstrap';
import run from './cli/run';

const commands = { bootstrap, run };

// eslint-disable-next-line
yargs
  .command(
    'bootstrap',
    'Set up configurations for babel, eslint, prettier, etc.',
    yrgs =>
      yrgs
        .option('eslint', {
          coerce: val => (val === true ? 'base' : undefined),
          desc: 'Write eslint config. Optionally specify which one.',
          type: 'string'
        })
        .option('babel', {
          coerce: val => (val === true ? 'base' : undefined),
          desc: 'Write babel config. Optionally specify which one.',
          type: 'string'
        })
        .option('prettier', {
          coerce: val => (val === true ? 'base' : undefined),
          desc: 'Write prettier config. Optionally specify which one.',
          type: 'string'
        })
        .option('targetDir', {
          coerce: val => val || process.cwd(),
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
  const commandFn = commands[command];

  if (!commandFn) {
    throw new TypeError(`Unknown command ${command}`);
  }

  commandFn(args);
}
