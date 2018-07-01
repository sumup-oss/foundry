import yargs from 'yargs';

import bootstrap from './cli/bootstrap';
import bootstrapConfig from './cli/bootstrap-config';
import run from './cli/run';

import { eslint, babel } from './configs';

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;

// eslint-disable-next-line
yargs
  .command(
    'bootstrap <type> <category>',
    'Bootstrap configurations and package.json for a project',
    yrgs =>
      yrgs
        .positional('type', {
          desc: 'The type of project you are starting',
          choices: ['node', 'react', 'vanilla'],
          type: 'string'
        })
        .positional('category', {
          desc: 'The category of project you are starting',
          choices: ['app', 'library'],
          type: 'string'
        }),
    args => execute('bootstrap', args)
  )
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
        })
        .option('plop', {
          desc: 'Write the plop config.',
          coerce: val => (val === true ? 'base' : val),
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
    args => execute('bootstrapConfig', args)
  )
  .command(
    'run <tool> [...tool options]',
    'Run any of the bundled tools.',
    args => execute('run', args)
  )
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .version();

/**
 * Fallback, if an unsupported command was specified
 */
const registeredCommands = yargs.getCommandInstance().getCommands();
const currentCommand = yargs.argv._[0];

if (!registeredCommands.includes(currentCommand)) {
  yargs.showHelp();
  process.exit(1);
}

function execute(command, args) {
  const commands = { bootstrapConfig, run };
  const commandFn = commands[command];

  commandFn(args);
}
