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

import { existsSync } from 'fs';
import { relative, join } from 'path';

import { NodePlopAPI, ActionType } from 'plop';
import { Answers } from 'inquirer';

import * as logger from '../../lib/logger';
import { Language } from '../../types/shared';

interface PlopOptions {
  templateDir?: string;
  language: Language;
}

enum ComponentType {
  STYLED = 'styled',
  FUNCTIONAL = 'functional',
  CLASS = 'class',
}

enum FileType {
  COMPONENT = 'component',
  COMPONENT_SPEC = 'component-spec',
  STORY = 'story',
  SERVICE = 'service',
  SERVICE_SPEC = 'service-spec',
  INDEX = 'index',
}

interface ActionOptions {
  name: string;
  componentType: ComponentType;
  files: FileType[];
  destinationPath: string;
}

const ERRORS = {
  INVALID_FILE_TYPE: (file: string): string =>
    `We don't have templates for "${file}" files, 😞.`,
  INVALID_DESTINATION: (path: string): string =>
    `We couldn't find the destination folder ${path} in your project, 🤷.`,
};

export function config(options: PlopOptions) {
  return (plop: NodePlopAPI): void => {
    plop.setHelper('eq', (a: any, b: any): boolean => a === b);
    plop.setHelper('not', (a: any, b: any): boolean => a !== b);

    const pascalCase = plop.getHelper('pascalCase');

    /**
     * Generating React components and helper files.
     */
    plop.setGenerator('component', {
      description: 'React component',
      prompts: [
        // Component name
        {
          type: 'input',
          name: 'name',
          message: "What's the name of your component?",
        },
        // Component type
        {
          type: 'list',
          name: 'componentType',
          message: 'What type of component do you need?',
          choices: [
            {
              name: 'Styled',
              value: ComponentType.STYLED,
            },
            {
              name: 'Functional',
              value: ComponentType.FUNCTIONAL,
            },
            {
              name: 'Class',
              value: ComponentType.CLASS,
            },
          ],
          default: 'functional',
        },
        // Get the path
        {
          type: 'input',
          name: 'destinationPath',
          message: 'Where would you like to put your component?',
          default: relative(
            process.cwd(),
            `${plop.getPlopfilePath()}/src/components`,
          ),
        },
        // Files
        {
          type: 'checkbox',
          name: 'files',
          message: 'Which files does your component need?',
          choices: [
            {
              name: 'Component',
              value: FileType.COMPONENT,
              checked: true,
            },
            {
              name: 'Component spec',
              value: FileType.COMPONENT_SPEC,
              checked: true,
            },
            {
              name: 'Story',
              value: FileType.STORY,
              checked: false,
            },
            {
              name: 'Service',
              value: FileType.SERVICE,
              checked: false,
            },
            {
              name: 'Service spec',
              value: FileType.SERVICE_SPEC,
              checked: false,
            },
          ],
        },
      ],
      actions: (data?: Answers): ActionType[] => {
        if (!data) {
          return [];
        }
        const {
          name: componentName,
          componentType,
          files,
          destinationPath,
        } = data;
        const plopfilePath = plop.getPlopfilePath();
        const absDestPath = join(plopfilePath, destinationPath);

        if (!existsSync(absDestPath)) {
          raiseErrorAndExit(ERRORS.INVALID_DESTINATION(absDestPath));
        }

        const capitalizedName = pascalCase(componentName);
        const allFiles = files.includes(FileType.COMPONENT)
          ? files.concat(FileType.INDEX)
          : files;

        return allFiles.reduce((acc: ActionType[], file: FileType) => {
          if (!Object.values(FileType).includes(file)) {
            raiseErrorAndExit(ERRORS.INVALID_FILE_TYPE(file));
          }

          const templateFileName =
            file === FileType.COMPONENT
              ? getComponentTemplateName(componentType)
              : `${file}.hbs`;

          return [
            ...acc,
            {
              type: 'add',
              path: join(
                absDestPath,
                capitalizedName,
                getFileName(options.language, file, componentName),
              ),
              templateFile: getTemplatePath(
                options.language,
                options.templateDir,
                plopfilePath,
                templateFileName,
              ),
            },
          ];
        }, [] as ActionType[]);
      },
    });
  };
}

function raiseErrorAndExit(message: string): never {
  logger.error([message, 'Please try again. 👋'].join(' '));
  process.exit(1);
}

function getComponentTemplateName(type: ComponentType): string {
  const templateNameMap = {
    [ComponentType.STYLED]: 'styled-component.hbs',
    [ComponentType.FUNCTIONAL]: 'functional-component.hbs',
    [ComponentType.CLASS]: 'class-component.hbs',
  };
  return templateNameMap[type];
}

const JS_EXTENSIONS = {
  [Language.JAVASCRIPT]: 'js',
  [Language.TYPESCRIPT]: 'ts',
};

const JSX_EXTENSIONS = {
  [Language.JAVASCRIPT]: 'js',
  [Language.TYPESCRIPT]: 'tsx',
};

function getFileName(
  language: Language,
  fileType: FileType,
  componentName: string,
): string {
  const jsExtension = JS_EXTENSIONS[language];
  const jsxExtension = JSX_EXTENSIONS[language];
  const fileNameMap = {
    [FileType.COMPONENT]: `${componentName}.${jsxExtension}`,
    [FileType.COMPONENT_SPEC]: `${componentName}.spec.${jsxExtension}`,
    [FileType.STORY]: `${componentName}.story.${jsxExtension}`,
    [FileType.SERVICE]: `${componentName}Service.${jsExtension}`,
    [FileType.SERVICE_SPEC]: `${componentName}Service.spec.${jsExtension}`,
    [FileType.INDEX]: `index.${jsExtension}`,
  };
  return fileNameMap[fileType];
}

const LANGUAGE_DIRS = {
  [Language.JAVASCRIPT]: 'js',
  [Language.TYPESCRIPT]: 'ts',
};

function getTemplatePath(
  language: Language,
  templateDir: string | undefined,
  plopDir: string,
  templateFileName: string,
): string {
  if (templateDir) {
    const customPath = join(plopDir, templateDir, templateFileName);
    if (existsSync(customPath)) {
      return customPath;
    }
  }

  const languageDir = LANGUAGE_DIRS[language];

  return join(__dirname, 'templates', languageDir, templateFileName);
}
