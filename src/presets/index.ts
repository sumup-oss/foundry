import chalk from 'chalk';

import { Preset, Tool } from '../types/shared';

function formatName(name: string, description: string): string {
  return [`${chalk.bold(name)}:`, description].join(' ');
}

const lint = {
  name: formatName(
    'Lint',
    'Check code for syntax errors and format it automatically'
  ),
  value: Preset.LINT,
  short: 'Lint',
  tools: [Tool.ESLINT, Tool.PRETTIER, Tool.HUSKY, Tool.LINT_STAGED]
};

const templates = {
  name: formatName(
    'Templates',
    'Bootstrap common files such as React components'
  ),
  value: Preset.TEMPLATES,
  short: 'Templates',
  tools: [Tool.PLOP]
};

const release = {
  name: formatName(
    'Release',
    'Automatically generate release notes and publish to a package registry'
  ),
  value: Preset.RELEASE,
  short: 'Templates',
  tools: [Tool.SEMANTIC_RELEASE]
};

export = [lint, templates, release];
