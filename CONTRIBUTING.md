# Contributing

## Prerequisites

- **Signed and verified CLA**
- Node 8+ and `yarn`

## Code of Conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our [maintainers](README.md#maintainers). We will enforce the CoC.

## Workflows

### Submitting an issue

1. Check existing issues and verify that your issue is not already submitted. If a similar issue already exists, we highly recommend to add your report to that issue.
2. Open issue
3. Be as detailed as possible - include the `node` version, what you did, what you expected to happen, and what actually happened.

### Submitting a PR

1. Find an existing issue to work on or follow `Submitting an issue` to create one that you're also going to fix. Make sure to notify that you're working on a fix for the issue you picked.
2. Branch out from latest `master`.
3. Code, add, commit and push your changes in your branch.
4. Make sure that tests and linter(s) pass locally for you.
5. Submit a PR.
6. Collaborate with the codeowners/reviewers to merge this in `master`.

## Common commands

### Running the tests

```sh
yarn start
```

### Running the tests

```sh
yarn test
# or continuously:
yarn test:watch
```

### Running the linter

```sh
yarn lint
```
