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

import inquirer from 'inquirer';
import PathPrompt from 'inquirer-fuzzy-path';
import { isEmpty } from 'lodash/fp';

import { Tool, Language, Target } from '../types/shared';

interface Answers {
  tools: Tool[];
  language?: Language;
  target?: Target;
}

export function init() {
  const questions = [
    {
      type: 'checkbox',
      name: 'tools',
      message: 'Which tools to you want to configure?',
      choices: enumToChoices(Tool),
      validate: (tools: Tool[]): string | boolean => {
        if (isEmpty(tools)) {
          return 'You must choose at least one tool.';
        }
        if (tools.includes(Tool.PRETTIER) && !tools.includes(Tool.ESLINT)) {
          return 'Prettier requires Eslint to be configured as well.';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'language',
      message: 'Which programming language does the project use?',
      choices: enumToChoices(Language),
      when: whenToolsSelected([Tool.ESLINT, Tool.PLOP, Tool.LINT_STAGED])
    },
    {
      type: 'list',
      name: 'target',
      message: 'Which platform does the project target?',
      choices: enumToChoices(Target),
      when: whenToolsSelected([Tool.ESLINT, Tool.PLOP, Tool.SEMANTIC_RELEASE])
    },
    {
      type: 'confirm',
      name: 'publish',
      message: 'Would you like to publish your package to NPM?',
      when: whenToolsSelected([Tool.PLOP, Tool.SEMANTIC_RELEASE]),
      default: false
    },
    {
      type: 'path',
      name: 'targetDir',
      message: 'Where should the config files be placed?',
      default: '.',
      depthLimit: 3,
      itemType: 'directory',
      excludePath: (nodePath: string) => nodePath.startsWith('node_modules'),
      excludeFilter: (nodePath: string) => nodePath.startsWith('.')
    }
  ];

  inquirer.registerPrompt('path', PathPrompt);
  inquirer.prompt(questions).then((answers) => {
    console.log(JSON.stringify(answers, null, 2));
  });
}

export function enumToChoices(enums: { [key: string]: string }) {
  return Object.values(enums);
}

export function whenToolsSelected(tools: Tool[]) {
  return (answers: Answers) => {
    return tools.some((tool) => answers.tools.includes(tool));
  };
}
