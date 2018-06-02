<div align="center">

## :construction: Under construction :construction:

This project is still at an early stage. We are testing it internally and hope to add more powerful features as well as tools.

</div>

<div align="center">

# Foundry

An opinionated but configurable CLI (Command Line Interface) toolkit for writing JavaScript. We currently support [React](https://reactjs.org), [Node](https://nodejs.org/en/), and vanilla JavaScript with varying feature breadth.

</div>

##### Table of contents

- [Examples](#examples)
- [Installation](#installation)
- [Why?](#why?)
- [Usage](#usage)
- [Commands](#commands)
- [Contribute](#contribute)
- [About SumUp](#about-sumup)

### Examples

```bash
# Bootstrapping a project with configurations for react
$ npx --package @sumup/foundry foundry bootstrap --eslint react --babel react --prettier react --plop react

# Running ESlint with fix flag
$ npx --package @sumup/foundry foundry run eslint --fix

# Creating a React component
$ npx --package @sumup/foundry foundry create component
```

### Installation

Foundry is supposed to be installed as a project dependency via the [npm](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) package managers. The npm CLI ships with [Node](https://nodejs.org/en/). You can read how to install the Yarn CLI in [their documentation](https://yarnpkg.com/en/docs/install).

Depending on your preference, run one of the following.

```bash
# With npm
$ npm install --save-dev @sumup/foundry

# With yarn
$ yarn add --dev @sumup/foundry
```

### Why?

> ##### TLDR
>
> Creating and maintaining a JavaScript project can be very tedious. There are tools, configurations, dependency management, and boilerplate. With Foundry, you can fix all of that with a single dependency. It lints, creates files, links configurations, and (soon) runs your build. And the best part? You can still get down and dirty with your configurations. But only if you want.

#### The problem

Setting up and maintaining a complex JavaScript project can be very tedious.There are many different dependencies to install (linters, testing frameworks, bundlers) and configurations to set up. Once you have a running project, you end up writing a lot of boilerplate code when creating commonly used files. For example, a React component might come with a spec file (test), a Storybook file (isolated component development), and a service for handling business logic.

It gets much, much worse when you have several (many?) projects. What happens, when there is a breaking change in a tooling dependency? What if team decides you need to add a new linting rule? Nobody wants to go through every project and update those files all the time. And who knows, if they are even the same? Syncing configurations is terrible. Or think about that new engineer you are onboarding. How are they supposed to know how you structure your project, how your components are supposed to look, which files they need to create?

You might think you could solve these issues with a boilerplate repository and some snippets or templates. But you cannot. At least the maintenance problem will not go away.

#### The solution

Toolkits are a way to mitigate these kinds of problems. They encapsulate as much as possible of the your toolchain into a single dependency and expose it through a CLI. Doing so gets you the following, probably more!

- You don't need to set up any tooling when creating a new project. Bootstrap it and start coding. :rocket:
- When you need to update a tooling dependency or change a configuration, do it in the toolkit and update the toolkit dependency in your projects &mdash; preferably in an automated fashion. That's it. :sparkles:
- Make the way you write JavaScript more consistent. All your projects will work exactly the same. :straight_ruler:
- Easy onboarding. New colleagues will be able to get productive much more quickly. 🙇‍♂️
- The number of direct dependencies becomes *much* smaller and your  `package.json` shorter. :spider_web:

#### But what makes Foundry different?

We were inspired by many toolkit projects, such as [create-react-app](https://github.com/facebook/create-react-app/) and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts). These projects are opinionated, and so is Foundry. But Foundry is different, in our opinion, because:

- It encapsulates tools and their configurations, but also lets you get down and dirty with the configs in your project.
- It merely proxies the tools you use on a CLI level instead of talking to them through their Node.js APIs. We literally execute the binaries and forward any options you provided.

So please, go ahead and try it.

### Usage

Foundry is supposed to be installed as a dev-dependency (development) in your project. Once installed, you may bootstrap a project with corresponding configurations

### Commands

At the moment, Foundry supports two commands; `bootstrap` and `run`. They allow you to create configurations and run the cooresponding tools. The tools we support are [Babel](https://babeljs.io), [ESlint](https://eslint.org) (with [Prettier](https://prettier.io)), and [Plop](https://plopjs.com). We will add more documentation here. For now, you can try `foundry --help` or `foundry {command} --help` to se your options.



### Contribute

We are currently not ready for contributions. If you have questions, feature requests, or want to report a *new* bug, please file an issue.



### About SumUp

[SumUp](https://sumup.com) is a mobile-point of sale provider. It is our mission to make easy and fast card payments a reality across the *entire* world. You can pay with SumUp in more than 30 countries, already. Our engineers work in Berlin, Cologne, Sofia, and Sāo Paulo. They write code in JavaScript, Swift, Ruby, Elixir, Erlang, and much more. Want to come work and with us? [Head to our careers page](https://sumup.com/careers) to find out more.