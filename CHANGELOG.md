# @sumup/foundry

## 7.0.0-next.2

### Major Changes

- [#923](https://github.com/sumup-oss/foundry/pull/923) [`ea7c264`](https://github.com/sumup-oss/foundry/commit/ea7c264f9122f2ad44c5d83308f32c827768ac0f) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the ESLint plugins for [Cypress](https://www.npmjs.com/package/eslint-plugin-cypress), [Emotion](https://www.npmjs.com/package/@emotion/eslint-plugin), [Jest](https://www.npmjs.com/package/eslint-plugin-jest), [Next.js](https://www.npmjs.com/package/eslint-config-next), [Playwright](https://www.npmjs.com/package/eslint-plugin-playwright), [Storybook](https://www.npmjs.com/package/eslint-plugin-storybook), and [Testing Library](https://www.npmjs.com/package/eslint-plugin-testing-library) from the dependencies. Install the plugins as dev dependencies in your project. Foundry still enables and configures them automatically.

## 7.0.0-next.1

### Major Changes

- [#912](https://github.com/sumup-oss/foundry/pull/912) [`df2477b`](https://github.com/sumup-oss/foundry/commit/df2477b745e71ded9bb6bc4abf7bcfe36a914f62) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded to Prettier v3. [Read the release announcement](https://prettier.io/blog/2023/07/05/3.0.0.html).

## 7.0.0-next.0

### Major Changes

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Raised the minimum Node version to ^18.12 || >=20 (i.e. Node 19 is not supported).

- [#904](https://github.com/sumup-oss/foundry/pull/904) [`d937ac3`](https://github.com/sumup-oss/foundry/commit/d937ac3ed6782a2e86951f46eecda85e41ca2431) Thanks [@hilleer](https://github.com/hilleer)! - Added [`eslint-plugin-security`](https://github.com/eslint-community/eslint-plugin-security) for Node environments. This plugin helps identify potential security hotspots, but finds a lot of false positives which need triage by a human.

- [#911](https://github.com/sumup-oss/foundry/pull/911) [`9e9d2c2`](https://github.com/sumup-oss/foundry/commit/9e9d2c278ca3a949390090acbfedc78bcbdce5ae) Thanks [@connor-baer](https://github.com/connor-baer)! - Added [`eslint-plugin-storybook`](https://github.com/storybookjs/eslint-plugin-storybook) for projects that use [Storybook](https://storybook.js.org/). This plugin helps conform to Storybook's best practices.

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `@typescript-eslint/typescript-eslint` to v6. Read the [changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/CHANGELOG.md).

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `eslint-plugin-testing-library` to v6. Read the [migration guide](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/migration-guides/v6.md).

## 6.2.0

### Minor Changes

- [#916](https://github.com/sumup-oss/foundry/pull/916) [`b3b5cfe`](https://github.com/sumup-oss/foundry/commit/b3b5cfe3355493fb19cf4f74ac7213e56b61c971) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for linting CSS files with [Stylelint](https://stylelint.io/).

## 6.1.0

### Minor Changes

- [#862](https://github.com/sumup-oss/foundry/pull/862) [`ab39701`](https://github.com/sumup-oss/foundry/commit/ab3970167451217b3ede70826c96f33ef8c7ac1b) Thanks [@connor-baer](https://github.com/connor-baer)! - Remove the `presets` CLI option. The only remaining preset is "lint" which is now selected by default.

## 6.0.0

### Major Changes

- [#841](https://github.com/sumup-oss/foundry/pull/841) [`286d98d`](https://github.com/sumup-oss/foundry/commit/286d98d5606b6e45efb75cf2ad41e61a974084d5) Thanks [@connor-baer](https://github.com/connor-baer)! - Changed the [package entry points](https://nodejs.org/api/packages.html#package-entry-points) to use the `exports` instead of the `main` field in the `package.json` file.

- [#752](https://github.com/sumup-oss/foundry/pull/752) [`f6ef551`](https://github.com/sumup-oss/foundry/commit/f6ef551c39e27e9fd62f5f57dc140fc024b4171c) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `release` preset and the `semantic-release` config. We recommend [`changesets`](https://github.com/changesets/changesets) as a more flexible alternative.

- [#754](https://github.com/sumup-oss/foundry/pull/754) [`88be0df`](https://github.com/sumup-oss/foundry/commit/88be0dffbd7b62b40690868314ff15ef7a7d8223) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `ci` preset. Refer to the official [GitHub Actions documentation](https://docs.github.com/en/actions) to write your own workflow.

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the Jest globals from the ESLint config. Import the functions from your test utils file instead.

### Patch Changes

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the [`jest/unbound-method`](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md) ESLint rule as it requires type information to work.

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the [`import/no-anonymous-default-export`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-anonymous-default-export.md) ESLint rule in Storybook files.

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Set a [maximum depth](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md#maxdepth) for the expansion of dependency trees in the [`import/no-cycle`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md) ESLint rule.

- [#846](https://github.com/sumup-oss/foundry/pull/846) [`5c4d73c`](https://github.com/sumup-oss/foundry/commit/5c4d73cddc5a53532de8003dde6760baa1849882) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the `react/no-unknown-property` ESLint rule for Emotion.js' `css` prop.

## 6.0.0-next.6

### Major Changes

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the Jest globals from the ESLint config. Import the functions from your test utils file instead.

### Patch Changes

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the [`jest/unbound-method`](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md) ESLint rule as it requires type information to work.

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the [`import/no-anonymous-default-export`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-anonymous-default-export.md) ESLint rule in Storybook files.

- [#854](https://github.com/sumup-oss/foundry/pull/854) [`8f3630f`](https://github.com/sumup-oss/foundry/commit/8f3630f9b8f24af5834114891a2cf12012572be9) Thanks [@connor-baer](https://github.com/connor-baer)! - Set a [maximum depth](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md#maxdepth) for the expansion of dependency trees in the [`import/no-cycle`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md) ESLint rule.

## 6.0.0-next.5

### Patch Changes

- [`d2a58ef`](https://github.com/sumup-oss/foundry/commit/d2a58ef41cb710399168ddf4809e6421bc0270f9) Thanks [@connor-baer](https://github.com/connor-baer)! - Downgraded `lint-staged` to restore compatibility with Node 16.x.

## 6.0.0-next.4

### Patch Changes

- [#846](https://github.com/sumup-oss/foundry/pull/846) [`5c4d73c`](https://github.com/sumup-oss/foundry/commit/5c4d73cddc5a53532de8003dde6760baa1849882) Thanks [@connor-baer](https://github.com/connor-baer)! - Disabled the `react/no-unknown-property` rule for Emotion.js' `css` prop.

## 6.0.0-next.3

### Patch Changes

- [#844](https://github.com/sumup-oss/foundry/pull/844) [`bcee0a8`](https://github.com/sumup-oss/foundry/commit/bcee0a8ef98c43af2f1e38574c5c16335814d912) Thanks [@connor-baer](https://github.com/connor-baer)! - Enabled type checking for unit test files to provide required type information to the `jest/unbound-method` rule.

## 6.0.0-next.2

### Patch Changes

- [`56b4235`](https://github.com/sumup-oss/foundry/commit/56b42352b8867e5530af6fe3acfd8edd2487402f) Thanks [@connor-baer](https://github.com/connor-baer)! - Fixed the `exports` paths.

## 6.0.0-next.1

### Major Changes

- [#841](https://github.com/sumup-oss/foundry/pull/841) [`286d98d`](https://github.com/sumup-oss/foundry/commit/286d98d5606b6e45efb75cf2ad41e61a974084d5) Thanks [@connor-baer](https://github.com/connor-baer)! - Changed the [package entry points](https://nodejs.org/api/packages.html#package-entry-points) to use the `exports` instead of the `main` field in the `package.json` file.

## 6.0.0-next.0

### Major Changes

- [#752](https://github.com/sumup-oss/foundry/pull/752) [`f6ef551`](https://github.com/sumup-oss/foundry/commit/f6ef551c39e27e9fd62f5f57dc140fc024b4171c) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `release` preset and the `semantic-release` config. We recommend [`changesets`](https://github.com/changesets/changesets) as a more flexible alternative.

- [#754](https://github.com/sumup-oss/foundry/pull/754) [`88be0df`](https://github.com/sumup-oss/foundry/commit/88be0dffbd7b62b40690868314ff15ef7a7d8223) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `ci` preset. Refer to the official [GitHub Actions documentation](https://docs.github.com/en/actions) to write your own workflow.
