<div align="center">

# Foundry

[![NPM version](https://img.shields.io/npm/v/@sumup/foundry)](https://www.npmjs.com/package/@sumup/foundry) [![Code coverage](https://img.shields.io/codecov/c/github/sumup-oss/foundry)](https://codecov.io/gh/sumup-oss/foundry) [![License](https://img.shields.io/github/license/sumup-oss/foundry)](https://github.com/sumup-oss/foundry/blob/master/LICENSE) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

A toolkit that makes it a breeze to set up and maintain JavaScript + TypeScript applications. Foundry has presets for [🔍 linting](#-lint), [🚀 releasing](#-release), and [🖇️ templates](#-templates) and currently supports [React](https://reactjs.org), [Emotion](https://emotion.sh/), [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/), and [Node](https://nodejs.org/en/).

</div>

**Table of contents**

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Initialization](#initialization)
  - [Automation](#automation)
- [Presets](#presets)
  - [🔍 Lint](#-lint)
  - [🚀 Release](#-release)
  - [🖇️ Templates](#-templates)
- [Running a tool](#running-a-tool)
- [Why?](#why)
- [Code of conduct (CoC)](#code-of-conduct-coc)
- [About SumUp](#about-sumup)

## Getting Started

### Installation

Foundry needs to be installed as a dev-dependency via the [Yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com) package managers. The npm CLI ships with [Node](https://nodejs.org/en/). You can read how to install the Yarn CLI in [their documentation](https://yarnpkg.com/en/docs/install). Foundry requires Node v10+.

Depending on your preference, run one of the following.

```sh
# With Yarn
$ yarn add --dev @sumup/foundry

# With npm
$ npm install --save-dev @sumup/foundry
```

### Initialization

Foundry exposes customizable configuration presets for the CLI tools it supports. To make use of these presets, you need to initialize a configuration file for each tool you would like to use. This is done with the `init` command.

```sh
$ npx foundry init
```

Foundry will launch an interactive prompt to ask you questions about your project, such as in which language it is written, which frameworks it uses, or whether you are planning to open source it. Once you have answered all questions, Foundry will write the config files (don't worry, it asks before overwriting existing files) and will add scripts to your `package.json` file to conveniently run the tools.

Alternatively, you can pass your answers to the `init` command directly as flags. This is useful for environments such as CI where interactive prompts cannot be used. Here is an overview of all available options (you can view this help menu by running `npx foundry init --help`):

```sh
--presets, -p       A preset configures a group of tools that solve a common
                    problem  [array] [options: "lint", "release", "templates"]
--language, -l      The programming language in which the project is written
                                         [options: "TypeScript", "JavaScript"]
--environments, -e  The environment(s) in which the code runs
                                          [array] [options: "Node", "Browser"]
--frameworks, -f    The framework(s) that the project uses
                                 [array] [options: "React", "Emotion", "Jest"]
--openSource, -o    Whether the project is open source               [boolean]
--publish           Whether to publish to NPM                        [boolean]
--configDir, -c     The directory to write the configs to   
                                                       [string] [default: "."]
--help              Show this help menu                              [boolean]
```

### Automation

...

## Presets

A preset includes the configurations and scripts that are needed for a certain task.

### 🔍 Lint

Check code for syntax errors and format it automatically. The preset includes: 

- [**ESLint**](https://www.npmjs.com/package/eslint) identifies and fixes problematic patterns in your JavaScript code so you can spot mistakes early.
- [**Prettier**](https://prettier.io) is our code formatter of choice. It makes all our code look the same after every save.
- [**lint-staged**](https://www.npmjs.com/package/lint-staged) is a tool for running linters on files staged for your next commit in git. Together with Husky (see below) it prevents bad code from being committed.
- [**Husky**](https://github.com/typicode/husky) makes setting up git hooks very easy. Whenever someone installs your project, Husky will automatically set up git hooks as part of its `postinstall` script.

The preset adds the following scripts to your `package.json`:

- `lint`: check files for problematic patterns and report them
- `lint:fix`: same as `lint`, but also try to fix the issues
- `lint:ci`: same as `lint`, but also save the report to a file

### 🚀 Release

Automatically generate release notes and (optionally) publish to NPM. The preset includes:

- [**semantic-release**](https://www.npmjs.com/package/semantic-release) automates the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

The preset adds the following script to your `package.json`:

- `release`: release and publish a new version

### 🖇️ Templates

Generate boilerplate code e.g. for React components. The preset includes:

- [**Plop**](https://plopjs.com) generates common files from templates. This is very helpful when creating similar files repeatedly and reduces the boilerplate you have to write as a developer.

The preset adds the following script to your `package.json`:

- `create:component`: generate the files for a React component

#### Custom templates

⭐ _This is an advanced use case._

Plop uses [Handlebar](http://handlebarsjs.com/) templates to generate the files. If you'd like to override a built-in template, you can specify a custom template directory. Plop will first check if a custom template exists, otherwise, it will fallback to the default template.

In order to specify the template directory, you need to modify the config file (`plopfile.js`) that was generated by `npx foundry init`, like so:

```diff
module.exports = require('@sumup/foundry/plop')({
  language: <language>,
+  // The path should be relative to the location of plopfile.js
+  templateDir: <path-to-templates>,
});
```

To see which variables are available for use in a Handlebars template, have a look at the [default templates](https://github.comsumup-oss/foundry/tree/master/src/configs/plop/templates).

## Running a tool

Foundry manages all supported tools for you and exposes them via the `run` command. As an example: to run ESLint through Foundry execute:

```sh
npx foundry run eslint src
```

Here, `src` is the folder you want ESLint to check. Note that you can use any of the command line flags and arguments supported by ESLint and other tools. Foundry simply forwards them and they get handled by the tool. For example, to have ESLint fix your linting errors, run `npx foundry run eslint --fix src`.

## Why?

> ##### TLDR
>
> Creating and maintaining a JavaScript project can be very tedious. There are tools, configurations, dependency management, and boilerplate. With Foundry, you can fix all of that with a single dependency. It lints, creates files, and keeps the tools up to date. And the best part? You can still get down and dirty with your configurations. But only if you want.

### The problem

Setting up and maintaining a complex JavaScript project can be very tedious.There are many different dependencies to install (linters, testing frameworks, bundlers) and configurations to set up. Once you have a running project, you end up writing a lot of boilerplate code when creating commonly used files. For example, a React component might come with a spec file (test), a Storybook file (isolated component development), and a service for handling business logic.

It gets much, much worse when you have several (many?) projects. What happens, when there is a breaking change in a tooling dependency? What if team decides you need to add a new linting rule? Nobody wants to go through every project and update those files all the time. And who knows, if they are even the same? Syncing configurations is terrible. Or think about that new engineer you are onboarding. How are they supposed to know how you structure your project, how your components are supposed to look, which files they need to create?

You might think you could solve these issues with a boilerplate repository and some snippets or templates. But you cannot. At least the maintenance problem will not go away.

### The solution

Toolkits are a way to mitigate these kinds of problems. They encapsulate as much as possible of the your toolchain into a single dependency and expose it through a CLI. Doing so gets you the following, probably more!

- You don't need to set up any tooling when creating a new project. Bootstrap it and start coding. :rocket:
- When you need to update a tooling dependency or change a configuration, do it in the toolkit and update the toolkit dependency in your projects &mdash; preferably in an automated fashion. That's it. :sparkles:
- Make the way you write JavaScript more consistent. All your projects will work exactly the same. :straight_ruler:
- Easy onboarding. New colleagues will be able to get productive much more quickly. 🙇‍♂️
- The number of direct dependencies becomes _much_ smaller and your `package.json` shorter. :spider_web:

### But what makes Foundry different?

We were inspired by many toolkit projects, such as [create-react-app](https://github.com/facebook/create-react-app/) and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts). These projects are opinionated, and so is Foundry. But Foundry is different, in our opinion, because:

- It encapsulates tools and their configurations, but also lets you get down and dirty with the configs in your project.
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

It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries, already. Our engineers work in Berlin, Cologne, Sofia and Sāo Paulo. They write code in JavaScript, Swift, Ruby, Go, Java, Erlang, Elixir and more. Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
