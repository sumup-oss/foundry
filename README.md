![Build status](https://circleci.com/gh/sumup/foundry.svg?style=shield&circle-token=736b00da66fa4b46701da7cd184b23ded097e49c)
![Code coverage](https://codecov.io/gh/sumup/foundry/branch/master/graph/badge.svg?token=3fxP3TZEAN)
[![npm version](https://badge.fury.io/js/%40sumup%2Ffoundry.svg)](https://www.npmjs.com/package/@sumup/foundry)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/sumup/foundry/blob/master/LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](https://github.com/sumup/foundry/blob/master/CODE_OF_CONDUCT.md)

<div align="center">

# Foundry

An opinionated but configurable CLI (Command Line Interface) toolkit for writing JavaScript. We currently support [React](https://reactjs.org), [Node](https://nodejs.org/en/), and vanilla JavaScript with varying feature breadth.

</div>

> **TLDR;**
>
> 1. Set up desired configuration files, `npx foundry bootstrap-config —eslint —prettier`.
>
> 2. Add commands to `package.json`
>
>    ```
>    "scripts": {
>        "lint": "foundry run eslint src"
>    }
>    ```
>
> 3. Be productive and don’t worry about tooling dependencies.

##### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [List of commands](#list-of-commands)
- [List of configuration presets](#list-of-configuration-presets)
- [Why?](#why?)
- [Code of conduct (CoC)](#code-of-conduct-coc)
- [About SumUp](#about-sumup)

## Installation

Foundry is supposed to be installed as a dev-dependency (development) via the [npm](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) package managers. The npm CLI ships with [Node](https://nodejs.org/en/). You can read how to install the Yarn CLI in [their documentation](https://yarnpkg.com/en/docs/install).

Depending on your preference, run one of the following.

```bash
# With npm
$ npm install --save-dev @sumup/foundry

# With yarn
$ yarn add --dev @sumup/foundry
```

## Usage

Once you have installed Foundry, you should bootstrap configuration files the CLI tools you would like to use through Foundry and set up scripts in you `package.json` to actually run them.

### Bootstrap configuration files

Foundry exposes customizable configuration presets for the CLI tools it supports. To make use of these presets, you need to bootstrap a configuration file for each tool you would like to use. This is done with the `bootstrap-config` command. Foundry supports different presets for each tool, `base` being the default preset. You can specify the tool you would like to use as a flag, the preset as the flag’s value.

```bash
# Bootstraps the eslint and prettier config files using the react preset for ESLint and the default (base) preset for prettier.
$ npx foundry bootstrap-config --eslint react --prettier
```

### Running a tool through Foundry

Foundry manages all supported CLI tools for you and exposes them via the `run` command. To run ESLint through Foundry execute `npx foundry run eslint src` from the terminal. Here, `src` is the folder you want ESLint to check. Note that you can use any of the command line flags and arguments supported by ESLint and other tools. Foundry simply forwards them and they get handled by the tool. For example, to have ESLint fix your linting errors, run `npx foundry run eslint --fix src`.

### Use Foundry for your `package.json` scripts

For automation purposes and easier access, you will want to alias frequently used commands as scripts in your `package.json`. Here are some examples.

```json
"scripts": {
    "lint": "foundry run eslint --fix src",
    "create-component": "foundry run plop component"
}
```

## List of commands

At the moment, Foundry supports two commands; `bootstrap-config` and `run`. They allow you to create configurations and run the cooresponding tools. The tools we support are [ESlint](https://eslint.org) (with [Prettier](https://prettier.io)), [Plop](https://plopjs.com), [Husky](https://github.com/typicode/husky), and [lint-staged](https://www.npmjs.com/package/lint-staged). We will add more documentation here. For now, you can try `foundry --help` or `foundry {command} --help` to se your options.

## List of configuration presets

Here is a list of supported presets for the `bootstrap-config` command, grouped by CLI tool.

### ESLint (`--eslint` flag)

We lint our code with [ESLint](https://www.npmjs.com/package/eslint). Linting our code helps us spot mistakes early. You can inspect all presets in the [respective config file](https://github.com/sumup/foundry/blob/master/src/configs/eslint.js).

- `base`: the default preset. Uses the `airbnb-base`, `prettier`, and `jest/recommended` presets, `prettier` and `jest` plugins and some configurations.
- `node`: like `base` but specifies `node` as environment.
- `react`: like `base` but adding the `react/recommended`, `jsx-a11y/recommended`, and `prettier/react` presets.

### Prettier (`--prettier` flag)

[Prettier](https://www.npmjs.com/package/prettier) is our code formatter of choice. It makes all our code look the same after every save. We only have a `base` preset, which follows our [default formatting rules](https://github.com/sumup/foundry/blob/master/src/configs/prettier.js).

### Plop (`--plop` flag)

[Plop](https://plopjs.com) allows us to quickly create a set of files, e.g. for a React component, with a single command. This is very helpful when creating a lot of components and reduces the boilerplate you have to write as a developer.

Currently, we only have a plop generator for React components. Use the `react` preset for that.

### lint-staged (`--lint-staged` flag)

[lint-staged](https://www.npmjs.com/package/lint-staged) is a tool for running linters on files staged for your next commit in git. Together with [Husky](https://github.com/typicode/husky), it makes ensuring bad code gets committed very easy.

`lint-staged` only comes with a `base` preset.

### Husky (`--husky` flag)

Husky makes setting up git hooks consistently very easy. Whenever someone installs your project, husky will automatically set up git hooks as part of its postinstall script.

Husky only comes with a `base` preset.

### semantic-release (`--semantic-release` flag)

[`semantic-release`](https://www.npmjs.com/package/semantic-release) automates the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

- `base`: the default preset. Analyzes the commit history, generates release notes and publishes them to GitHub.
- `modules`: like `base` but also publishes the code to `npm`. For node modules.

## Why?

> ##### TLDR
>
> Creating and maintaining a JavaScript project can be very tedious. There are tools, configurations, dependency management, and boilerplate. With Foundry, you can fix all of that with a single dependency. It lints, creates files, links configurations, and (soon) runs your build. And the best part? You can still get down and dirty with your configurations. But only if you want.

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

## Code of conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our maintainers. We will enforce the CoC.

### Maintainers

- [Felix Jung](mailto:felix.jung@sumup.com)
- [Connor Bär](mailto:connor.baer@sumup.com)

## About SumUp

![SumUp logo](https://raw.githubusercontent.com/sumup-oss/assets/master/sumup-logo.svg?sanitize=true)

It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries, already. Our engineers work in Berlin, Cologne, Sofia and Sāo Paulo. They write code in JavaScript, Swift, Ruby, Go, Java, Erlang, Elixir and more. Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
