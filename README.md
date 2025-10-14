<div align="center">

# Foundry

[![NPM version](https://img.shields.io/npm/v/@sumup-oss/foundry)](https://www.npmjs.com/package/@sumup-oss/foundry) [![Code coverage](https://img.shields.io/codecov/c/github/sumup-oss/foundry)](https://codecov.io/gh/sumup-oss/foundry) [![License](https://img.shields.io/github/license/sumup-oss/foundry)](https://github.com/sumup-oss/foundry/blob/main/LICENSE) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.1%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

A toolkit that makes it a breeze to format and lint JavaScript, TypeScript, CSS, and GraphQL files.

</div>

## Table of contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Initialization](#initialization)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Tools](#tools)
- [Why?](#why)
- [Code of conduct](#code-of-conduct)
- [About SumUp](#about-sumup)

## Getting Started

### Installation

Foundry should be installed as a dev-dependency. Run the following command in your terminal:

```sh
npm install --save-dev @sumup-oss/foundry
```

### Initialization

Foundry exposes customizable configurations for the CLI tools it supports. Use the `init` command to initialize a configuration file for the tools you would like to use:

```sh
npx foundry init
```

Foundry will launch an interactive prompt to ask you questions about your project, such as whether you are planning to open source it. Once you have answered all questions, Foundry will write the config files (don't worry, it asks before overwriting existing files) and will add scripts to your `package.json` file to conveniently run the tools.

Alternatively, you can pass your answers to the `init` command directly as flags. This is useful for environments such as CI where interactive prompts cannot be used. Here is an overview of all available options (you can view this help menu by running `npx foundry init --help`):

```sh
  --configDir  The directory to write configs to         [string] [default: "."]
  --overwrite  Whether to overwrite existing configs  [boolean] [default: false]
  --version    Show version number                                     [boolean]
  --help       Show this help menu                                     [boolean]
```

## Scripts

Foundry adds the following scripts to your `package.json` file:

- `lint`: format JavaScript & TypeScript files and check them for problematic patterns
- `lint:fix`: same as `lint`, but also try to fix the issues
- `lint:ci`: same as `lint`, but optimized for continuous integration workflows
- `lint:css`: check CSS files for problematic patterns

## Tools

### Biome

[Biome](https://biomejs.dev/) formats your code to look the same after every save and identifies & fixes problematic patterns in your code so you can spot mistakes early. It works on JavaScript, TypeScript, JSON, CSS, and GraphQL files.

Foundry exposes a default config for Biome to extend. Refer to [Biome's documentation](https://biomejs.dev/guides/configure-biome/) to learn how to customize the config to your needs.

```json
// biome.jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "extends": ["@sumup-oss/foundry/biome"]
}
```

Foundry also generates an [`.editorconfig` file](https://editorconfig.org/) that is used by Biome, IDEs, and other tools to apply consistent formatting to a variety of supported filetypes.

### ESLint

[ESLint](https://www.npmjs.com/package/eslint) identifies and fixes problematic patterns in your code so you can spot mistakes early. It is slower than Biome, but can detect a larger number of issue types and has an established plugin ecosystem. It works on JavaScript and TypeScript files.

Foundry exposes a number ESLint configs to be composed together based on the language, environment, and frameworks used. Refer to [ESLint's documentation](https://eslint.org/docs/latest/use/configure/) to familiarize yourself with the configuration format.

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";

export default defineConfig([
  configs.ignores,
  configs.javascript,
  configs.browser,
  configs.tests,
]);
```

Foundry exports the following configuration objects:

- [Ignored files](https://eslint.org/docs/latest/use/configure/ignore): `ignores`
- Languages: `javascript`, `typescript`
- Environments: `browser`, `node`
- Frameworks: `next`, `react`, `storybook`, `tests`
- Open source: `open-source`

<details>
<summary>

**TypeScript**

</summary>

Note that the `typescript` config includes the `javascript` config, so it doesn't need to be added separately.

```js
// eslint.config.js
import { defineConfig, configs, files } from "@sumup-oss/foundry/eslint";

export default defineConfig([
  configs.ignores,
  {
    extends: [configs.typescript],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Optionally, disable TypeScript rules in JavaScript files
  {
    files: files.javascript,
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
]);
```

</details>

<details>
<summary>

**Node**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";

export default defineConfig([
  configs.ignores,
  {
    extends: [configs.node],
    // Specify which files are executed in Node
    files: ["src/app/**/*", "src/pages/api/**/*", "**/server/**/*"],
    // Optionally, customize the lint rules
    rules: {
      "no-console": "off",
    },
  },
]);
```

</details>

<details>
<summary>

**Next.js**

</summary>

Note that the `next` config includes the `react` config, so it doesn't need to be added separately.

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import next from "@next/eslint-plugin-next";

export default defineConfig([
  configs.ignores,
  {
    extends: [next.flatConfig.recommended, configs.next],
  },
]);
```

</details>

<details>
<summary>

**React**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import react from "eslint-plugin-react";

export default defineConfig([
  configs.ignores,
  configs.browser,
  {
    extends: [react.configs.flat.recommended, configs.react],
  },
]);
```

</details>

<details>
<summary>

**Circuit UI**

</summary>

```js
// eslint.config.js
import { defineConfig, configs, files } from "@sumup-oss/foundry/eslint";
import circuitUI from "@sumup-oss/eslint-plugin-circuit-ui";

export default defineConfig([
  configs.ignores,
  configs.browser,
  {
    extends: [circuitUI.configs.recommended],
    files: [...files.javascript, ...files.typescript],
  },
]);
```

</details>

<details>
<summary>

**Storybook**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
  configs.ignores,
  {
    extends: [storybook.configs["flat/recommended"], configs.stories],
  },
]);
```

</details>

<details>
<summary>

**Jest**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import jest from "eslint-plugin-jest";

export default defineConfig([
  configs.ignores,
  {
    extends: [jest.configs["flat/recommended"], configs.tests],
  },
]);
```

</details>

<details>
<summary>

**Vitest**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import vitest from "@vitest/eslint-plugin";

export default defineConfig([
  configs.ignores,
  {
    extends: [vitest.configs.recommended, configs.tests],
  },
]);
```

</details>

<details>
<summary>

**Testing Library**

</summary>

```js
// eslint.config.js
import { defineConfig, configs } from "@sumup-oss/foundry/eslint";
import testingLibrary from "eslint-plugin-testing-library";

export default defineConfig([
  configs.ignores,
  {
    extends: [testingLibrary.configs["flat/react"], configs.tests],
    // Optionally, configure a custom test utils file
    settings: {
      "testing-library/utils-module": "test-utils",
    },
  },
]);
```

</details>

### Stylelint

[Stylelint](https://www.npmjs.com/package/stylelint) identifies and fixes problematic patterns in your styles so you can spot mistakes early. It is slower than Biome, but can detect a larger number of issue types. It works on CSS files.

Foundry exposes a default Stylelint config that can be extended and overridden. Refer to [Stylelint's documentation](https://stylelint.io/user-guide/configure/) to familiarize yourself with the configuration format.

```js
// stylelint.config.js
import { defineConfig } from "@sumup-oss/foundry/stylelint";

export default defineConfig();
```

<details>
<summary>

**CSS Modules**

</summary>

```js
// stylelint.config.js
import { defineConfig } from "@sumup-oss/foundry/stylelint";

export default defineConfig({
  extends: ["stylelint-config-css-modules"],
});
```

</details>

### Lint staged

[lint-staged](https://www.npmjs.com/package/lint-staged) is a tool for running linters on files staged for your next commit in `git`. Together with [Husky](#husky) (see below) it prevents problematic code from being committed.

Foundry exposes a default lint-staged config that can be extended and overridden. Refer to [lint-staged's documentation](https://github.com/lint-staged/lint-staged/#configuration) to familiarize yourself with the configuration format.

```js
// lint-staged.config.js
import { defineConfig } from "@sumup-oss/foundry/lint-staged";

export default defineConfig();
```

<details>
<summary>

**Optimize SVGs**

</summary>

```js
import { defineConfig } from "@sumup-oss/foundry/lint-staged";

export default defineConfig({
  "*.svg": ["svgo --config svgo.config.js --pretty"],
});
```

</details>

### Husky

[Husky](https://github.com/typicode/husky) makes setting up [`git` hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) easy. Whenever someone installs your project, Husky will automatically set up `git` hooks as part of its `postinstall` script.

Note that Foundry uses Husky v4, the last version to support a JavaScript configuration file.

```js
// husky.config.cjs
const { defineConfig } = require("@sumup-oss/foundry/husky");

module.exports = defineConfig();
```

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

## Code of Conduct

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our Code of Conduct or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our maintainers. We will enforce the Code of Conduct.

### Maintainers

- [Connor Bär](mailto:connor.baer@sumup.com)
- [Felix Jung](mailto:felix.jung@sumup.com)

## About SumUp

![SumUp logo](https://raw.githubusercontent.com/sumup-oss/assets/master/sumup-logo.svg?sanitize=true)

It is our mission to make easy and fast card payments a reality across the _entire_ world. You can pay with SumUp in more than 30 countries already. Our engineers work in Berlin, Cologne, Sofia, and Sāo Paulo. They write code in TypeScript, Swift, Ruby, Go, Java, Erlang, Elixir, and more. Want to come work with us? [Head to our careers page](https://sumup.com/careers) to find out more.
