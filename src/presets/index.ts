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
  prompts: [Prompt.LANGUAGE, Prompt.TARGET]
};

const templates = {
  name: formatName(
    'Templates',
    'Bootstrap common files such as React components'
  ),
  value: Preset.TEMPLATES,
  short: 'Templates',
  tools: [Tool.PLOP],
  prompts: [Prompt.LANGUAGE]
};

const release = {
  name: formatName(
    'Release',
    'Automatically generate release notes and publish to a package registry'
  ),
  value: Preset.RELEASE,
  short: 'Templates',
  tools: [Tool.SEMANTIC_RELEASE],
  prompts: [Prompt.PUBLISH]
};

function formatName(name: string, description: string): string {
  return [`${chalk.bold(name)}:`, description].join(' ');
}

export const presets = { lint, templates, release };
export const presetChoices = [lint, templates, release];