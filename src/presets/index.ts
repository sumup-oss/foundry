import chalk from 'chalk';

import { Preset, Tool, Prompt } from '../types/shared';

const lint = {
  name: formatName(
    'Lint',
    'Check code for syntax errors and format it automatically'
  ),
  value: Preset.LINT,
  short: 'Lint',
  tools: [Tool.ESLINT, Tool.PRETTIER, Tool.HUSKY, Tool.LINT_STAGED],
  prompts: [
    Prompt.LANGUAGE,
    Prompt.ENVIRONMENTS,
    Prompt.FRAMEWORKS,
    Prompt.OPEN_SOURCE
  ]
};

const templates = {
  name: formatName(
    'Templates',
    'Generate boilerplate code e.g. for React components'
  ),
  value: Preset.TEMPLATES,
  short: 'Templates',
  tools: [Tool.PLOP],
  prompts: [Prompt.LANGUAGE]
};

const release = {
  name: formatName(
    'Release',
    'Automatically generate release notes and (optionally) publish to NPM'
  ),
  value: Preset.RELEASE,
  short: 'Release',
  tools: [Tool.SEMANTIC_RELEASE],
  prompts: [Prompt.PUBLISH]
};

function formatName(name: string, description: string): string {
  return [`${chalk.bold(name)}:`, description].join(' ');
}

export const presets = { lint, templates, release };
export const presetChoices = [lint, templates, release];
