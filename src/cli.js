#!/usr/bin/env node

import yargs from 'yargs';

import bootstrap from './cli/bootstrap';

const commands = { bootstrap };

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
    args => run('bootstrap', args)
  )
  .help()
  .version().argv;

function run(command, args) {
  const commandFn = commands[command];

  if (!commandFn) {
    throw new TypeError(`Unknown command ${command}`);
  }

  commandFn(args);
}
