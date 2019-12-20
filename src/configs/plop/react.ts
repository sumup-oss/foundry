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

// TODO: Import from node modules once https://github.com/plopjs/node-plop/issues/140 has been resolved.
import { NodePlopAPI, ActionConfig } from '../../types/plop';

interface PlopOptions {
  templateDir?: string;
  templateExtension?: 'js' | 'jsx' | 'ts' | 'tsx';
}

type ComponentType = 'styled' | 'functional' | 'class';

interface ActionOptions {
  componentName: string;
  componentType: ComponentType;
  files: string[];
  destinationPath: string;
}

export default (plop: NodePlopAPI, opts: PlopOptions = {}) => {
  plop.setHelper('eq', (a: any, b: any): boolean => a === b);
  plop.setHelper('not', (a: any, b: any): boolean => a !== b);

  const pascalCase = plop.getHelper('pascalCase');

  const COMPONENT_TYPES = {
    STYLED: 'styled',
    FUNCTIONAL: 'functional',
    CLASS: 'class'
  };

  const COMPONENT_FILES = {
    COMPONENT: 'component',
    COMPONENT_SPEC: 'component-spec',
    STORY: 'story',
    SERVICE: 'service',
    SERVICE_SPEC: 'service-spec',
    INDEX: 'index'
  };

  const TEMPLATE_DIR = `${__dirname}/plop-templates/react`;

  const ERRORS = {
    INVALID_COMPONENT_TYPE: (type: string) => {
      const supportedTypes = pascalCase(
        Object.keys(COMPONENT_TYPES).join(', ')
      );
      return [
        `We don't support "${type}" components, sorry.`,
        `You may try one of: ${supportedTypes}, instead.`
      ].join(' ');
    },
    INVALID_FILE_TYPE: (file: string) =>
      `We don't have templates for "${file}" files, 😞.`,
    INVALID_DESTINATION: (path: string) =>
      `We couldn't find the destination folder ${path} in your project, 🤷.`
  };

  const raiseErrorAndExit = (message: string) => {
    // eslint-disable-next-line no-console
    console.error([message, 'Please try again. 👋'].join(' '));
    process.exit(1);
  };

  const getComponentTemplateName = (type: ComponentType) => {
    switch (type) {
      case COMPONENT_TYPES.STYLED:
        return 'styled-component.hbs';
      case COMPONENT_TYPES.FUNCTIONAL:
        return 'functional-component.hbs';
      case COMPONENT_TYPES.CLASS:
        return 'class-component.hbs';
      default:
        return raiseErrorAndExit(ERRORS.INVALID_COMPONENT_TYPE(type));
    }
  };

  const getFileName = (file: string, name: string): string => {
    const extension = opts.templateExtension || 'js';
    const fileNameMap = {
      [COMPONENT_FILES.COMPONENT]: `${name}.${extension}`,
      [COMPONENT_FILES.COMPONENT_SPEC]: `${name}.spec.${extension}`,
      [COMPONENT_FILES.STORY]: `${name}.story.${extension}`,
      [COMPONENT_FILES.SERVICE]: `${name}Service.${extension}`,
      [COMPONENT_FILES.SERVICE_SPEC]: `${name}Service.spec.${extension}`,
      [COMPONENT_FILES.INDEX]: `index.${extension}`
    };
    return fileNameMap[file];
  };

  const getTemplatePath = (templateFileName: string): string => {
    if (opts.templateDir) {
      const customPath = join(
        plop.getPlopfilePath(),
        opts.templateDir,
        templateFileName
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
        message: "What's the name of your component?"
      },
      // Component type
      {
        type: 'list',
        name: 'componentType',
        message: 'What type of component do you need?',
        choices: [
          {
            name: 'Styled',
            value: COMPONENT_TYPES.STYLED
          },
          {
            name: 'Functional',
            value: COMPONENT_TYPES.FUNCTIONAL
          },
          {
            name: 'Class',
            value: COMPONENT_TYPES.CLASS
          }
        ],
        default: 'functional'
      },
      // Get the path
      {
        type: 'input',
        name: 'destinationPath',
        message: 'Where would you like to put your component?',
        default: relative(
          process.cwd(),
          `${plop.getPlopfilePath()}/src/components`
        )
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
            checked: true
          },
          {
            name: 'Component spec',
            value: COMPONENT_FILES.COMPONENT_SPEC,
            checked: true
          },
          {
            name: 'Story',
            value: COMPONENT_FILES.STORY,
            checked: false
          },
          {
            name: 'Service',
            value: COMPONENT_FILES.SERVICE,
            checked: false
          },
          {
            name: 'Service spec',
            value: COMPONENT_FILES.SERVICE_SPEC,
            checked: false
          }
        ]
      }
    ],
    actions: ({
      componentName,
      componentType,
      files,
      destinationPath
    }: ActionOptions): ActionConfig[] => {
      const absDestinationPath = `${plop.getPlopfilePath()}/${destinationPath}`;
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
                absDestinationPath,
                capitalizedName,
                getFileName(file, name)
              ),
              templateFile: getTemplatePath(templateFileName)
            }
          ];
        },
        [] as ActionConfig[]
      );
    }
  });
};
