# @sumup-oss/foundry

## 8.0.0

### Major Changes

- [#974](https://github.com/sumup-oss/foundry/pull/974) [`1018616`](https://github.com/sumup-oss/foundry/commit/10186164db60df7aec124208e173bffd3fc9278a) Thanks [@connor-baer](https://github.com/connor-baer)! - Renamed the package from `@sumup/foundry` to `@sumup-oss/foundry`. Update the name in your `package.json` and tooling config files. We recommend running a global search-and-replace in your project.

- [#973](https://github.com/sumup-oss/foundry/pull/973) [`bf86e86`](https://github.com/sumup-oss/foundry/commit/bf86e86cb8730d0f0b8e69611350bf518288b138) Thanks [@connor-baer](https://github.com/connor-baer)! - Raised the minimum Node version to ^18.18 || ^20.9 || >=22.

- [#963](https://github.com/sumup-oss/foundry/pull/963) [`46a67f9`](https://github.com/sumup-oss/foundry/commit/46a67f927dcfc415ebc72869dfead6d342136b84) Thanks [@davilima6](https://github.com/davilima6)! - Upgraded `@typescript-eslint/*` to v7. Read the [changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/CHANGELOG.md).

- [#963](https://github.com/sumup-oss/foundry/pull/963) [`46a67f9`](https://github.com/sumup-oss/foundry/commit/46a67f927dcfc415ebc72869dfead6d342136b84) Thanks [@davilima6](https://github.com/davilima6)! - Upgraded `eslint-config-airbnb-typescript` to v18. Read the [release notes](https://github.com/iamturns/eslint-config-airbnb-typescript/releases/tag/v18.0.0).

- [#973](https://github.com/sumup-oss/foundry/pull/973) [`bf86e86`](https://github.com/sumup-oss/foundry/commit/bf86e86cb8730d0f0b8e69611350bf518288b138) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `eslint-plugin-security` to v3. Read the [changelog](https://github.com/eslint-community/eslint-plugin-security/blob/main/CHANGELOG.md).

## 7.2.0

### Minor Changes

> [!WARNING]  
> `@sumup/foundry` will be renamed to `@sumup-oss/foundry` in the next major release.
> v7.2 has been published under both names, so you can already migrate by updating the package name in your `package.json` file.

- [#970](https://github.com/sumup-oss/foundry/pull/970) [`07cd253`](https://github.com/sumup-oss/foundry/commit/07cd2534800e8acd9325c8581d05540a4f4f7957) Thanks [@connor-baer](https://github.com/connor-baer)! - Extended the supported version range for `eslint-plugin-jest` to include v28.x.

## 7.1.1

### Patch Changes

- [`b9544b3`](https://github.com/sumup-oss/foundry/commit/b9544b370940d0c8c798fca1e0e6a430b28de876) Thanks [@connor-baer](https://github.com/connor-baer)! - Fixed the config for Circuit UI's Stylelint plugin.

## 7.1.0

### Minor Changes

- [#954](https://github.com/sumup-oss/foundry/pull/954) [`08122eb`](https://github.com/sumup-oss/foundry/commit/08122eb1d6b4f9a9dbf4292001bc83d1eaec16fe) Thanks [@connor-baer](https://github.com/connor-baer)! - Extended the supported version range for `eslint-plugin-playwright` to include v1.x.

- [#956](https://github.com/sumup-oss/foundry/pull/956) [`1855159`](https://github.com/sumup-oss/foundry/commit/18551591bfd030c47ad0ace8d07adf499c88ebb9) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for [Circuit UI's Stylelint plugin](https://circuit.sumup.com/?path=/docs/packages-stylelint-plugin-circuit-ui--docs).

## 7.0.1

### Patch Changes

- [#952](https://github.com/sumup-oss/foundry/pull/952) [`2cc9640`](https://github.com/sumup-oss/foundry/commit/2cc96407b5dfe31b8a729d5e0ec9af700db9b023) Thanks [@connor-baer](https://github.com/connor-baer)! - Reduced the scope of the integration test file globs to prevent false positive lint issues in unit test files. Integration tests must be located in the `e2e/` or `tests/` folders in the repo or [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces) root directories.

## 7.0.0

### Major Changes

- [#923](https://github.com/sumup-oss/foundry/pull/923) [`ea7c264`](https://github.com/sumup-oss/foundry/commit/ea7c264f9122f2ad44c5d83308f32c827768ac0f) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the ESLint plugins for [Cypress](https://www.npmjs.com/package/eslint-plugin-cypress), [Emotion](https://www.npmjs.com/package/@emotion/eslint-plugin), [Jest](https://www.npmjs.com/package/eslint-plugin-jest), [Next.js](https://www.npmjs.com/package/eslint-config-next), [Playwright](https://www.npmjs.com/package/eslint-plugin-playwright), [Storybook](https://www.npmjs.com/package/eslint-plugin-storybook), and [Testing Library](https://www.npmjs.com/package/eslint-plugin-testing-library) from the dependencies. Install the plugins as dev dependencies in your project. Foundry still enables and configures them automatically.

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Raised the minimum Node version to ^18.12 || >=20 (i.e. Node 19 is not supported).

- [#912](https://github.com/sumup-oss/foundry/pull/912) [`df2477b`](https://github.com/sumup-oss/foundry/commit/df2477b745e71ded9bb6bc4abf7bcfe36a914f62) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded to Prettier v3. [Read the release announcement](https://prettier.io/blog/2023/07/05/3.0.0.html).

- [#926](https://github.com/sumup-oss/foundry/pull/926) [`7a39c58`](https://github.com/sumup-oss/foundry/commit/7a39c58ceed4146b1858ebc997d8da9ba83735fc) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded to [Stylelint 16](https://github.com/stylelint/stylelint/blob/main/CHANGELOG.md#1600). Refer to the [migration guide](https://github.com/stylelint/stylelint/blob/main/docs/migration-guide/to-16.md).

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `@typescript-eslint/typescript-eslint` to v6. Read the [changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/CHANGELOG.md).

- [#910](https://github.com/sumup-oss/foundry/pull/910) [`f392d28`](https://github.com/sumup-oss/foundry/commit/f392d28f9ab54dfe9eae203fdb8b4de4a3ede5a8) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `eslint-plugin-testing-library` to v6. Read the [migration guide](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/migration-guides/v6.md).

- [#929](https://github.com/sumup-oss/foundry/pull/929) [`20d1be5`](https://github.com/sumup-oss/foundry/commit/20d1be5fab4de214ddfb33f5cd9a0ab3bbe51b51) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for [`@sumup/eslint-plugin-circuit-ui`](https://circuit.sumup.com/?path=/docs/packages-eslint-plugin-circuit-ui--docs). This plugin helps users follow best practices when using [Circuit UI](https://circuit.sumup.com/).

- [#915](https://github.com/sumup-oss/foundry/pull/915) [`d937ac3`](https://github.com/sumup-oss/foundry/commit/d937ac3ed6782a2e86951f46eecda85e41ca2431) Thanks [@connor-baer](https://github.com/connor-baer)! - Added [`eslint-plugin-security`](https://github.com/eslint-community/eslint-plugin-security) for Node environments. This plugin helps identify potential security hotspots, but finds a lot of false positives which need triage by a human.

- [#911](https://github.com/sumup-oss/foundry/pull/911) [`9e9d2c2`](https://github.com/sumup-oss/foundry/commit/9e9d2c278ca3a949390090acbfedc78bcbdce5ae) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for [`eslint-plugin-storybook`](https://github.com/storybookjs/eslint-plugin-storybook). This plugin helps conform to [Storybook](https://storybook.js.org/)'s best practices.

### Minor Changes

- [#931](https://github.com/sumup-oss/foundry/pull/931) [`39b28a8`](https://github.com/sumup-oss/foundry/commit/39b28a8abc9d634508e03b6db05c87da31b1d9bd) Thanks [@connor-baer](https://github.com/connor-baer)! - Added a new `debug` command to inspect the detected configuration options.

- [#932](https://github.com/sumup-oss/foundry/pull/932) [`85b5fbe`](https://github.com/sumup-oss/foundry/commit/85b5fbe1226065eab98795112b34dc35620c7fe5) Thanks [@connor-baer](https://github.com/connor-baer)! - Expanded the scope of the Cypress and Playwright plugins to account for end-to-end test in subdirectories.

- [#931](https://github.com/sumup-oss/foundry/pull/931) [`39b28a8`](https://github.com/sumup-oss/foundry/commit/39b28a8abc9d634508e03b6db05c87da31b1d9bd) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the obsolete `publish` option which hasn't been used since v6.

## 6.2.1

### Patch Changes

- [#941](https://github.com/sumup-oss/foundry/pull/941) [`9a2ef74`](https://github.com/sumup-oss/foundry/commit/9a2ef7471b4802f13fca8b62f3b628af68c25409) Thanks [@connor-baer](https://github.com/connor-baer)! - Fixed initializing the Stylelint config files.

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
