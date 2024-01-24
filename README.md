<div align="center">

# Foundry

[![NPM version](https://img.shields.io/npm/v/@sumup/foundry)](https://www.npmjs.com/package/@sumup/foundry) [![Code coverage](https://img.shields.io/codecov/c/github/sumup-oss/foundry)](https://codecov.io/gh/sumup-oss/foundry) [![License](https://img.shields.io/github/license/sumup-oss/foundry)](https://github.com/sumup-oss/foundry/blob/main/LICENSE) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.1%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

A toolkit that makes it a breeze to set up and maintain JavaScript + TypeScript applications. Foundry has tools for [🔍 linting](#lint-preset) and currently supports [Next.js](https://nextjs.org), [React](https://reactjs.org), [Emotion](https://emotion.sh/), [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/), [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev/) and [Node](https://nodejs.org/en/).

</div>

## Table of contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Initialization](#initialization)
  - [Configuration](#configuration)
- [Lint preset](#lint-preset)
- [Running a tool](#running-a-tool)
- [Why?](#why)
- [Code of conduct (CoC)](#code-of-conduct-coc)
- [About SumUp](#about-sumup)

## Getting Started

### Installation

Foundry needs to be installed as a dev-dependency via the [npm](https://www.npmjs.com) or [Yarn](https://classic.yarnpkg.com) package managers. The npm CLI ships with [Node](https://nodejs.org/en/). You can read how to install the Yarn CLI in [their documentation](https://classic.yarnpkg.com/en/docs/install). Foundry requires Node `^18.12 || >=20`.

Depending on your preference, run one of the following.

```sh
# With npm
$ npm install --save-dev @sumup/foundry

# With Yarn v1
$ yarn add --dev @sumup/foundry
```

### Initialization

Foundry exposes customizable configurations for the CLI tools it supports. Use the `init` command to initialize a configuration file for the tools you would like to use:

```sh
# With npm
$ npx foundry init

# With Yarn v1
$ yarn run foundry init
```

Foundry will launch an interactive prompt to ask you questions about your project, such as whether you are planning to open source it. Once you have answered all questions, Foundry will write the config files (don't worry, it asks before overwriting existing files) and will add scripts to your `package.json` file to conveniently run the tools.

Alternatively, you can pass your answers to the `init` command directly as flags. This is useful for environments such as CI where interactive prompts cannot be used. Here is an overview of all available options (you can view this help menu by running `npx foundry init --help`):

```sh
  -o, --openSource  Whether the project is open-source                 [boolean]
      --publish     Whether to publish to NPM                          [boolean]
  -c, --configDir   The directory to write configs to    [string] [default: "."]
      --overwrite   Whether to overwrite existing config files
                                                      [boolean] [default: false]
      --version     Show version number                                [boolean]
      --help        Show this help menu                                [boolean]
```

## Configuration

All config files that are generated by Foundry follow the same format. They import a configuration function, optionally call it with overrides, and export the result. Here's an example:

```js
module.exports = require('@sumup/foundry/<tool>')(overrides);

// Example for .eslintrc.js:
module.exports = require('@sumup/foundry/eslint')({
  rules: {
    '@emotion/jsx-import': 'error',
  },
});
```

The overrides are merged with Foundry's default configuration. The overrides follow each tool's configuration schema, please refer to their official documentation.

Foundry analyzes your project's `package.json` file to tailor the configurations to your project. If the automatic detection is inaccurate, [please open an issue](https://github.com/sumup-oss/foundry/issues/new/choose) so we can improve it for everyone. Alternatively, you can explicitly set the options under the `foundry` property in your `package.json` file:

```json
// package.json
{
  "foundry": {
    "environments": ["Browser"]
  }
}
```

The supported options are:

| Name         | Type    | Options                                                                           | Default        |
| ------------ | ------- | --------------------------------------------------------------------------------- | -------------- |
| language     | string  | 'TypeScript', 'JavaScript'                                                        | _autodetected_ |
| environments | array   | 'Browser', 'Node'                                                                 | _autodetected_ |
| frameworks   | array   | 'React', 'Next.js', 'Emotion', 'Jest', 'Testing Library', 'Cypress', 'Playwright' | _autodetected_ |
| openSource   | boolean | true, false                                                                       | _autodetected_ |

## Lint preset

Check code for syntax errors and format it automatically. The preset adds the following scripts to your `package.json`:

- `lint`: check files for problematic patterns and report them
- `lint:fix`: same as `lint`, but also try to fix the issues

The preset includes the following tools:

- **[ESLint](https://www.npmjs.com/package/eslint)** identifies and fixes problematic patterns in your code so you can spot mistakes early.
- **[Stylelint](https://www.npmjs.com/package/stylelint)** identifies and fixes problematic patterns in your styles so you can spot mistakes early.
- **[Prettier](https://prettier.io)** is our code formatter of choice. It makes all our code look the same after every save.
- **[lint-staged](https://www.npmjs.com/package/lint-staged)** is a tool for running linters on files staged for your next commit in git. Together with Husky (see below) it prevents problematic code from being committed.
- **[Husky](https://github.com/typicode/husky)** makes setting up git hooks very easy. Whenever someone installs your project, Husky will automatically set up git hooks as part of its `postinstall` script.

## Running a tool

Foundry manages all supported tools for you and exposes them via the `run` command. As an example, to run ESLint through Foundry, execute:

```sh
# With npm
$ npx foundry run eslint src

# With Yarn v1
$ yarn foundry run eslint src
```

Here, `src` is the folder you want ESLint to check. Note that you can use any of the command-line flags and arguments supported by ESLint and other tools. Foundry forwards them so they get handled by the tool. For example, to have ESLint fix your linting errors, run `npx foundry run eslint --fix src`.

## Why?

> ##### TL;DR
>
> Creating and maintaining a JavaScript project can be very tedious. There are tools, configurations, dependency management, and boilerplate. With Foundry, you can fix all of that with a single dependency. It lints, creates files, and keeps the tools up to date. And the best part? You can still get down and dirty with your configurations. But only if you want.

### The problem

Setting up and maintaining a complex JavaScript project can be very tedious. There are many different dependencies to install (linters, testing frameworks, bundlers) and configurations to set up. Once you have a running project, you end up writing a lot of boilerplate code when creating commonly used files. For example, a React component might come with a spec file (test), a Storybook file (isolated component development), and a service for handling business logic.

It gets much, much worse when you have several (many?) projects. What happens when there is a breaking change in a tooling dependency? What if a team decides you need to add a new linting rule? Nobody wants to go through every project and update those files all the time. And who knows, if they are even the same? Syncing configurations is terrible. Or think about that new engineer you are onboarding. How are they supposed to know how you structure your project, how your components are supposed to look, which files they need to create?

You might think you could solve these issues with a boilerplate repository and some snippets or templates. But you cannot. At least the maintenance problem will not go away.

### The solution

Toolkits are a way to mitigate these kinds of problems. They encapsulate as much as possible of the toolchain into a single dependency and expose it through a CLI. Doing so gets you the following, probably more!

- You don't need to set up any tooling when creating a new project. Bootstrap it and start coding. :rocket:
- When you need to update a tooling dependency or change a configuration, do it in the toolkit and update the toolkit dependency in your projects &mdash; preferably in an automated fashion. That's it. :sparkles:
- Make the way you write JavaScript more consistent. All your projects will work exactly the same. :straight_ruler:
- Easy onboarding. New colleagues will be able to get productive much more quickly. 🙇‍♂️
- The number of direct dependencies becomes _much_ smaller and your `package.json` shorter. :spider_web:

### But what makes Foundry different?

We were inspired by many toolkit projects, such as [create-react-app](https://github.com/facebook/create-react-app/) and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts). These projects are opinionated, and so is Foundry. But Foundry is different, in our opinion, because:

- It encapsulates tools and their configuration, but also lets you get down and dirty with the configs in your project.
- It merely proxies the tools you use on a CLI level instead of talking to them through their Node.js APIs. We literally execute the binaries and forward any options you provided.

So please, go ahead and try it.

## Code of Conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our maintainers. We will enforce the CoC.

### Maintainers

- [Connor Bär](mailto:connor.baer@sumup.com)
- [Felix Jung](mailto:felix.jung@sumup.com)

## About SumUp

![SumUp logo](https://raw.githubusercontent.com/sumup-oss/assets/master/sumup-logo.svg?sanitize=true)

It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries already. Our engineers work in Berlin, Cologne, Sofia, and Sāo Paulo. They write code in TypeScript, Swift, Ruby, Go, Java, Erlang, Elixir, and more. Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
