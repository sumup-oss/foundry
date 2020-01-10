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

import * as logger from '../../lib/logger';
// TODO: Import from node modules once https://github.com/plopjs/node-plop/issues/140 has been resolved.
// eslint-disable-next-line import/no-unresolved
import { NodePlopAPI, ActionConfig } from '../../types/plop';
import { Language } from '../../types/shared';

interface PlopOptions {
  templateDir?: string;
  language: Language;
}

type ComponentType = 'styled' | 'functional' | 'class';

interface ActionOptions {
  componentName: string;
  componentType: ComponentType;
  files: string[];
  destinationPath: string;
}

export function config(options: PlopOptions) {
  return (plop: NodePlopAPI): void => {
    plop.setHelper('eq', (a: any, b: any): boolean => a === b);
    plop.setHelper('not', (a: any, b: any): boolean => a !== b);

    const pascalCase = plop.getHelper('pascalCase');

    const COMPONENT_TYPES = {
      STYLED: 'styled',
      FUNCTIONAL: 'functional',
      CLASS: 'class',
    };

    const COMPONENT_FILES = {
      COMPONENT: 'component',
      COMPONENT_SPEC: 'component-spec',
      STORY: 'story',
      SERVICE: 'service',
      SERVICE_SPEC: 'service-spec',
      INDEX: 'index',
    };

    const JS_EXTENSIONS = {
      [Language.JAVASCRIPT]: 'js',
      [Language.TYPESCRIPT]: 'ts',
    };

    const JSX_EXTENSIONS = {
      [Language.JAVASCRIPT]: 'js',
      [Language.TYPESCRIPT]: 'tsx',
    };

    const TEMPLATE_DIR = `${__dirname}/plop-templates/react`;

    const ERRORS = {
      INVALID_FILE_TYPE: (file: string): string =>
        `We don't have templates for "${file}" files, 😞.`,
      INVALID_DESTINATION: (path: string): string =>
        `We couldn't find the destination folder ${path} in your project, 🤷.`,
    };

    const raiseErrorAndExit = (message: string): never => {
      logger.error([message, 'Please try again. 👋'].join(' '));
      process.exit(1);
    };

    const getComponentTemplateName = (type: ComponentType): string => {
      const templateNameMap = {
        [COMPONENT_TYPES.STYLED]: 'styled-component.hbs',
        [COMPONENT_TYPES.FUNCTIONAL]: 'functional-component.hbs',
        [COMPONENT_TYPES.CLASS]: 'class-component.hbs',
      };
      return templateNameMap[type];
    };

    const getFileName = (file: string, name: string): string => {
      const { language } = options;
      const jsExtension = JS_EXTENSIONS[language];
      const jsxExtension = JSX_EXTENSIONS[language];
      const fileNameMap = {
        [COMPONENT_FILES.COMPONENT]: `${name}.${jsxExtension}`,
        [COMPONENT_FILES.COMPONENT_SPEC]: `${name}.spec.${jsExtension}`,
        [COMPONENT_FILES.STORY]: `${name}.story.${jsxExtension}`,
        [COMPONENT_FILES.SERVICE]: `${name}Service.${jsExtension}`,
        [COMPONENT_FILES.SERVICE_SPEC]: `${name}Service.spec.${jsExtension}`,
        [COMPONENT_FILES.INDEX]: `index.${jsExtension}`,
      };
      return fileNameMap[file];
    };

    const getTemplatePath = (templateFileName: string): string => {
      if (options.templateDir) {
        const customPath = join(
          plop.getPlopfilePath(),
          options.templateDir,
          templateFileName,
        );
        if (existsSync(customPath)) {
          return customPath;
        }
      }

      return join(TEMPLATE_DIR, templateFileName);
    };

    /**
     * Generating React components and helper files.
     */
    plop.setGenerator('component', {
      description: 'React component',
      prompts: [
        // Component name
        {
          type: 'input',
          name: 'componentName',
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
              value: COMPONENT_TYPES.STYLED,
            },
            {
              name: 'Functional',
              value: COMPONENT_TYPES.FUNCTIONAL,
            },
            {
              name: 'Class',
              value: COMPONENT_TYPES.CLASS,
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
              value: COMPONENT_FILES.COMPONENT,
              checked: true,
            },
            {
              name: 'Component spec',
              value: COMPONENT_FILES.COMPONENT_SPEC,
              checked: true,
            },
            {
              name: 'Story',
              value: COMPONENT_FILES.STORY,
              checked: false,
            },
            {
              name: 'Service',
              value: COMPONENT_FILES.SERVICE,
              checked: false,
            },
            {
              name: 'Service spec',
              value: COMPONENT_FILES.SERVICE_SPEC,
              checked: false,
            },
          ],
        },
      ],
      actions: ({
        componentName,
        componentType,
        files,
        destinationPath,
      }: ActionOptions): ActionConfig[] => {
        const absDestPath = `${plop.getPlopfilePath()}/${destinationPath}`;
        const capitalizedName = pascalCase(componentName);
        const allFiles = files.includes(COMPONENT_FILES.COMPONENT)
          ? files.concat(COMPONENT_FILES.INDEX)
          : files;

        return allFiles.reduce(
          (acc, file) => {
            if (!Object.values(COMPONENT_FILES).includes(file)) {
              raiseErrorAndExit(ERRORS.INVALID_FILE_TYPE(file));
            }

            const templateFileName =
              file === COMPONENT_FILES.COMPONENT
                ? getComponentTemplateName(componentType)
                : `${file}.hbs`;

            return [
              ...acc,
              {
                type: 'add',
                path: join(
                  absDestPath,
                  capitalizedName,
                  getFileName(file, templateFileName),
                ),
                templateFile: getTemplatePath(templateFileName),
              },
            ];
          },
          [] as ActionConfig[],
        );
      },
    });
  };
}
