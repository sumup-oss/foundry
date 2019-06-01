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

import { relative, join } from 'path';

export default plop => {
  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('not', (a, b) => a !== b);

  const pascalCase = plop.getHelper('pascalCase');

  const ERRORS = {
    INVALID_COMPONENT_TYPE: (type, supportedTypes) => [
      `We don't support "${type}" components, sorry.`,
      `You may try one of: ${pascalCase(supportedTypes.join(', '))}, instead.`
    ],
    INVALID_FILE_TYPE: file =>
      `We don't have templates for "${file}" files, 😞.`,
    INVALID_DESTINATION: path =>
      `We couldn't find the destination folder ${path} in your project, 🤷.`
  };

  const COMPONENT_TYPES = {
    STYLED: 'styled',
    FUNCTIONAL: 'functional',
    STATEFUL: 'stateful'
  };

  const COMPONENT_FILES = {
    COMPONENT: 'component',
    COMPONENT_SPEC: 'component-spec',
    STORY: 'story',
    SERVICE: 'service',
    SERVICE_SPEC: 'service-spec',
    INDEX: 'index'
  };

  const TEMPLATE_DIR = `${__dirname}/plop-templates`;

  const raiseErrorAndExit = message => {
    // eslint-disable-next-line no-console
    console.error([message, 'Please try again. 👋'].join(' '));
    process.exit(1);
  };

  const getComponentTemplateName = type => {
    switch (type) {
      case COMPONENT_TYPES.STYLED:
        return 'styled-component.hbs';
      case COMPONENT_TYPES.FUNCTIONAL:
        return 'functional-component.hbs';
      case COMPONENT_TYPES.STATEFUL:
        return 'stateful-component.hbs';
      default:
        return raiseErrorAndExit(ERRORS.INVALID_COMPONENT_TYPE);
    }
  };

  const getFileName = (file, name) => {
    const fileNameMap = {
      [COMPONENT_FILES.COMPONENT]: `${name}.js`,
      [COMPONENT_FILES.COMPONENT_SPEC]: `${name}.spec.js`,
      [COMPONENT_FILES.STORY]: `${name}.story.js`,
      [COMPONENT_FILES.SERVICE]: `${name}Service.js`,
      [COMPONENT_FILES.SERVICE_SPEC]: `${name}Service.spec.js`,
      [COMPONENT_FILES.INDEX]: 'index.js'
    };
    return fileNameMap[file];
  };

  /**
   * Generating React components and
   */
  plop.setGenerator('component', {
    description: 'React component',
    prompts: [
      // Component name
      {
        type: 'input',
        name: 'name',
        message: "What's the name of your component?"
      },
      // Component type
      {
        type: 'list',
        name: 'type',
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
            name: 'Stateful',
            value: COMPONENT_TYPES.STATEFUL
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
    actions: ({ name, type, files, destinationPath }) => {
      const absDestinationPath = `${plop.getPlopfilePath()}/${destinationPath}`;
      const capitalizedName = pascalCase(name);
      const allFiles = files.includes(COMPONENT_FILES.COMPONENT)
        ? files.concat(COMPONENT_FILES.INDEX)
        : files;

      const actions = allFiles.reduce((acc, file) => {
        if (!Object.values(COMPONENT_FILES).includes(file)) {
          raiseErrorAndExit(ERRORS.INVALID_FILE);
        }

        const templateFileName =
          file === COMPONENT_FILES.COMPONENT
            ? getComponentTemplateName(type)
            : `${file}.hbs`;

        return acc.concat({
          type: 'add',
          path: join(
            absDestinationPath,
            capitalizedName,
            getFileName(file, name)
          ),
          templateFile: join(TEMPLATE_DIR, 'react', templateFileName)
        });
      }, []);

      return actions;
    }
  });
};
