export default plop => {
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
            value: 'styled'
          },
          {
            name: 'Functional',
            value: 'functional'
          },
          {
            name: 'Stateful',
            value: 'stateful'
          }
        ],
        default: 'functional'
      },
      // Files
      {
        type: 'checkbox',
        name: 'files',
        message: 'Which files does your component need?',
        choices: [
          {
            name: 'Component',
            value: 'component',
            checked: true
          },
          {
            name: 'Component spec',
            value: 'comp-spec',
            checked: true
          },
          {
            name: 'Story',
            value: 'story',
            checked: false
          },
          {
            name: 'Service',
            value: 'service',
            checked: false
          },
          {
            name: 'Service spec',
            value: 'service-spec',
            checked: false
          }
        ]
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{name}}.js',
        templateFile: 'plop-templates/controller.hbs'
      }
    ]
  });

  /**
   * Generating a Ladda API.
   */
  plop.setGenerator('api', {
    description: 'Ladda API',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What's the name of your API?"
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{name}}.js',
        templateFile: 'plop-templates/controller.hbs'
      }
    ]
  });
};
