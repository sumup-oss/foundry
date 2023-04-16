# @sumup/foundry

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
