# Contributing

## Don't work at SumUp?

In an effort to give back to the community from which we learn so much, our documentation and code are public. However, the intended use case for Foundry is internal, so please treat this as a read-only project and inspiration only.

## Code of Conduct (CoC)

We want to foster an inclusive and friendly community around our Open Source efforts. Like all SumUp Open Source projects, this project follows the Contributor Covenant Code of Conduct. Please, [read it and follow it](CODE_OF_CONDUCT.md).

If you feel another member of the community violated our CoC or you are experiencing problems participating in our community because of another individual's behavior, please get in touch with our [maintainers](README.md#maintainers). We will enforce the CoC.

## Workflows

### Submitting an issue

1. Check existing issues and verify that your issue is not already submitted. If a similar issue already exists, we highly recommend to add your report to that issue.
2. Open issue
3. Be as detailed as possible - include the Node version, what you did, what you expected to happen, and what actually happened.

### Submitting a PR

_Before you get started, make sure you have [Node](https://nodejs.org/en/) v18+ installed on your computer._

1. Find an existing issue to work on or follow `Submitting an issue` to create one that you're also going to fix. Make sure to notify that you're working on a fix for the issue you picked.
2. Branch out from latest `main`.
3. Code, add, commit and push your changes in your branch.
4. Make sure that tests and linter(s) pass locally for you.
5. Submit a PR.
6. Collaborate with the codeowners/reviewers to merge this to `main`.

### Development

For development and local testing we recommend the following.

1. Run `npm run dev`. This will clean the `dist` folder and copy over all relevant files.
2. Run `npm install` inside the `dist` folder. This will ensure all dependencies are present in the dist folder when linking.
3. Inside the `dist` folder run `npm link`. This will make the compiled version of Foundry available for linking in projects you want to test your changes in, for example changes to the ESLint config.
4. Inside the project you want to test your local changes to Foundry, run `npm link @sumup-oss/foundry`.

Refer to the [npm docs](https://docs.npmjs.com/cli/v9/commands/npm-link) to learn more about linking local dependencies.

## Release process

Foundry follows semantic versioning. In short, this means we use patch versions for bugfixes, minor versions for new features, and major versions for breaking changes.

### Changesets

Foundry uses [changesets](https://github.com/atlassian/changesets) to do versioning. A changeset is a piece of information about changes made in a branch or commit. It holds three bits of information:

- What needs to be released
- What version the packages should be released at (using a [semver bump type](https://semver.org/))
- A changelog entry for the released packages

Refer to the [official documentation](https://github.com/atlassian/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-multi-package-repository-a-mono-repo) for more information.

### Release branches

We have a couple of special branches that are used for stable releases and [pre-releases](#pre-releases).

- **`main`** - The code in the `main` branch is stable and production-tested. When a PR is merged to `main` that contains a new changeset, `changesets` opens a PR and keeps it up to date with the latest changes. When the PR is merged, a new version is automatically published to NPM and the changesets since the last release are added to `CHANGELOG.md` files in GitHub.
- **`canary`** - This is a branch you can use to publish a prerelease version if you need to deploy the changes somewhere to test them. `canary` is a throw-away branch that can be recreated from `main` at any time. **Hint**: If you only need to test your changes locally, you can use `npm install ./path-to-foundry` to link the development version.
- **`next`** — This branch is used to develop the next major version in parallel. It is the only branch that can contain breaking changes.

To install the most recent version from a release channel in your project, run:

```sh
npm install --dev @sumup-oss/foundry@<release-channel>
```

#### Pre-releases

Pre-releases can be done for either the `next` or the `canary` release channels.

To publish a pre-release version, check out on the branch for your release channel and run the `changesets pre enter` command:

```sh
git checkout next # or `canary`
npx changeset pre enter next # or `canary`
```

This will generate a `pre.json` file in the `.changeset` directory.

Push it to the branch, then verify and merge the `changesets` "Version Packages" PR for your release channel. `changesets` will publish the pre-release version in CI.
