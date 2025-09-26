# @sumup-oss/foundry

## 9.0.2

### Patch Changes

- [#1146](https://github.com/sumup-oss/foundry/pull/1146) [`05f6b5c`](https://github.com/sumup-oss/foundry/commit/05f6b5c59545fe29103f1a38b48035b5f49161dd) Thanks [@connor-baer](https://github.com/connor-baer)! - Fixed reading the options when running `foundry init`.

## 9.0.1

### Patch Changes

- [#1143](https://github.com/sumup-oss/foundry/pull/1143) [`290bca4`](https://github.com/sumup-oss/foundry/commit/290bca4a592609dea3709d812cca31b2e7e71d35) Thanks [@connor-baer](https://github.com/connor-baer)! - Migrated to `listr2` internally to remove vulnerable sub-dependencies.

## 9.0.0

### Major Changes

- [#1115](https://github.com/sumup-oss/foundry/pull/1115) [`711986c`](https://github.com/sumup-oss/foundry/commit/711986c66eca7b3d08e563d74f64a0524a6be57d) Thanks [@connor-baer](https://github.com/connor-baer)! - Dropped support for Node 18. The supported versions are `^20.19 || >=22`.

- [#1066](https://github.com/sumup-oss/foundry/pull/1066) [`abc85b1`](https://github.com/sumup-oss/foundry/commit/abc85b1439a0b299a22bde43a25ca93bb31612f7) Thanks [@connor-baer](https://github.com/connor-baer)! - Migrated to [ESLint's new flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/). Foundry now exports language, environment, and framework-specific configs that can be combined and customized using ESLint's default config format:

  **Before**

  ```js
  // .eslintrc.js
  module.exports = require("@sumup-oss/foundry/eslint")({
    /* custom overrides */
  });
  ```

  **After**

  ```js
  // eslint.config.mjs
  import { defineConfig, configs, files } from "@sumup-oss/foundry/eslint";
  import react from 'eslint-plugin-react';

  export default defineConfig([
  	configs.ignores,
  	configs.javascript.
  	// Extend a config to override the files and/or rules
  	{
  		files: [...files.typescript, /* custom file glob */],
  		extends: [configs.typescript],
  		languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
  		rules: { /* custom rules */ }
  	},
  	// Framework-specific ESLint plugins aren't bundled with Foundry.
  	// Import and extend them manually, placing the Foundry config last.
  	{
  		extends: [react.configs.recommended, configs.react],
  	},
  ]);
  ```

- [#1043](https://github.com/sumup-oss/foundry/pull/1043) [`904b0e8`](https://github.com/sumup-oss/foundry/commit/904b0e8916d269513295d27a56b330e3d49fd873) Thanks [@connor-baer](https://github.com/connor-baer)! - Replaced Prettier with Biome as the code formatter. Remove the `prettier.config.js` and `.prettierignore` files from your project.

- [#1116](https://github.com/sumup-oss/foundry/pull/1116) [`e313ea4`](https://github.com/sumup-oss/foundry/commit/e313ea43dfaaf840d4356a541c0f6da33e6d8764) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded to Biome v2.2. [Biome v2](https://biomejs.dev/blog/biome-v2/) added type-aware linting rules, monorepo support, and plugins powered by GritQL.

- [#1134](https://github.com/sumup-oss/foundry/pull/1134) [`0a11c3e`](https://github.com/sumup-oss/foundry/commit/0a11c3ec91b5ca3f06f7b0da18492fc792461463) Thanks [@connor-baer](https://github.com/connor-baer)! - Updated the supported ESLint and Stylelint plugin version ranges to drop support for plugins that don't support ESLint's new flat config and declare support for the latest plugin versions.

- [#1133](https://github.com/sumup-oss/foundry/pull/1133) [`ed35ec2`](https://github.com/sumup-oss/foundry/commit/ed35ec2e8a07b02b5410bd500547f239173f0cde) Thanks [@connor-baer](https://github.com/connor-baer)! - Switched from `stylelint-config-recess-order` to Biome's CSS property sorting.

- [#1116](https://github.com/sumup-oss/foundry/pull/1116) [`e313ea4`](https://github.com/sumup-oss/foundry/commit/e313ea43dfaaf840d4356a541c0f6da33e6d8764) Thanks [@connor-baer](https://github.com/connor-baer)! - Replaced many ESLint rules with their Biome equivalents. Biome implements some rules with slight differences or different configuration options which may lead to different lint results.

- [#1116](https://github.com/sumup-oss/foundry/pull/1116) [`e313ea4`](https://github.com/sumup-oss/foundry/commit/e313ea43dfaaf840d4356a541c0f6da33e6d8764) Thanks [@connor-baer](https://github.com/connor-baer)! - Enabled Biome's import sorting assist. Imports are sorted by their proximity to the current file, with absolute imports preceding relative ones.

- [#1132](https://github.com/sumup-oss/foundry/pull/1132) [`dc35606`](https://github.com/sumup-oss/foundry/commit/dc35606f0ea3dcd2fb258d21abcd45951532a49e) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed the `foundry run` command. Instead, call tools like Biome, ESLint, and Stylelint directly. For example:

  ```diff
  -foundry run eslint . --fix
  +eslint . --fix
  ```

### Minor Changes

- [#1138](https://github.com/sumup-oss/foundry/pull/1138) [`7c88f07`](https://github.com/sumup-oss/foundry/commit/7c88f077c53b6782859ab3f9c2250434b7965c3f) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded to [lint-staged v16](https://github.com/lint-staged/lint-staged/blob/main/CHANGELOG.md#1600).

- [#1043](https://github.com/sumup-oss/foundry/pull/1043) [`904b0e8`](https://github.com/sumup-oss/foundry/commit/904b0e8916d269513295d27a56b330e3d49fd873) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for generating an [`.editorconfig`](https://editorconfig.org/) file when running `foundry init` to ensure consistent code formatting across many supported code editors and file types.

## 8.4.1

### Patch Changes

- [#1040](https://github.com/sumup-oss/foundry/pull/1040) [`650a2c6`](https://github.com/sumup-oss/foundry/commit/650a2c687376df68c116ed404c87778047128b2e) Thanks [@connor-baer](https://github.com/connor-baer)! - Prevented Styleling from throwing an error when all matched input files are ignored during a pre-commit check.

## 8.4.0

### Minor Changes

- [#1038](https://github.com/sumup-oss/foundry/pull/1038) [`54fb731`](https://github.com/sumup-oss/foundry/commit/54fb7319e6d7932178bbd43fbe6e5a4a121979f8) Thanks [@connor-baer](https://github.com/connor-baer)! - Updated all dependencies to their latest minor.

## 8.3.0

### Minor Changes

- [#1032](https://github.com/sumup-oss/foundry/pull/1032) [`ebcfdf8`](https://github.com/sumup-oss/foundry/commit/ebcfdf8df48580fde60c8a88671da0d3d584cef9) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for the Circuit UI plugins under the new `@sumup/oss` package scope.

## 8.2.0

### Minor Changes

- [`ae59351`](https://github.com/sumup-oss/foundry/commit/ae59351572a22cce1e47bee34b9730de5c284a5b) Thanks [@connor-baer](https://github.com/connor-baer)! - Updated all dependencies to their latest minor, most notably [`eslint-plugin-import` v2.30](https://github.com/import-js/eslint-plugin-import/releases/tag/v2.30.0) which should drastically improve the performance of the `import/no-cycle` rule.

## 8.1.1

### Patch Changes

- [`67a89d2`](https://github.com/sumup-oss/foundry/commit/67a89d299cea7f2b15abb8f3bea031ffb8931025) Thanks [@connor-baer](https://github.com/connor-baer)! - Skipped initializing the Prettier config when using Biome.

- [`6b53cfb`](https://github.com/sumup-oss/foundry/commit/6b53cfbb221304094b0a6f623b9641b65a12af65) Thanks [@connor-baer](https://github.com/connor-baer)! - Removed extraneous properties when updating the `package.json` file.

## 8.1.0

### Minor Changes

- [#982](https://github.com/sumup-oss/foundry/pull/982) [`c2d2d68`](https://github.com/sumup-oss/foundry/commit/c2d2d68995ece4cd893eb10333a37b5b77453b2e) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for [Biome](https://biomejs.dev/) to replace Prettier for formatting code and to supplement ESLint for linting code. Written in Rust, Biome is orders of magnitude faster; however, it doesn't support as many rules or plugins yet. [Install Biome](https://biomejs.dev/guides/getting-started/) with your package manager of choice, then run `npx foundry init` to update the package scripts for linting.

## 8.1.0-canary.0

### Minor Changes

- [#982](https://github.com/sumup-oss/foundry/pull/982) [`c2d2d68`](https://github.com/sumup-oss/foundry/commit/c2d2d68995ece4cd893eb10333a37b5b77453b2e) Thanks [@connor-baer](https://github.com/connor-baer)! - Added support for [Biome](https://biomejs.dev/) to replace Prettier for formatting code and to supplement ESLint for linting code. Written in Rust, Biome is orders of magnitude faster, however, it doesn't support as many rules or plugins yet.

## 8.0.1

### Patch Changes

- [#980](https://github.com/sumup-oss/foundry/pull/980) [`6fdbb2b`](https://github.com/sumup-oss/foundry/commit/6fdbb2bedcf1c5066b110631d8fdf44239b67073) Thanks [@connor-baer](https://github.com/connor-baer)! - Fixed conflicts between Prettier and ESLint formatting rules.

## 8.0.0

### Major Changes

- [#974](https://github.com/sumup-oss/foundry/pull/974) [`1018616`](https://github.com/sumup-oss/foundry/commit/10186164db60df7aec124208e173bffd3fc9278a) Thanks [@connor-baer](https://github.com/connor-baer)! - Renamed the package from `@sumup/foundry` to `@sumup-oss/foundry`. Update the name in your `package.json` and tooling config files. We recommend running a global search-and-replace in your project.

- [#973](https://github.com/sumup-oss/foundry/pull/973) [`bf86e86`](https://github.com/sumup-oss/foundry/commit/bf86e86cb8730d0f0b8e69611350bf518288b138) Thanks [@connor-baer](https://github.com/connor-baer)! - Raised the minimum Node version to ^18.18 || ^20.9 || >=22.

- [#963](https://github.com/sumup-oss/foundry/pull/963) [`46a67f9`](https://github.com/sumup-oss/foundry/commit/46a67f927dcfc415ebc72869dfead6d342136b84) Thanks [@davilima6](https://github.com/davilima6)! - Upgraded `@typescript-eslint/*` to v7. Read the [changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/CHANGELOG.md).

- [#963](https://github.com/sumup-oss/foundry/pull/963) [`46a67f9`](https://github.com/sumup-oss/foundry/commit/46a67f927dcfc415ebc72869dfead6d342136b84) Thanks [@davilima6](https://github.com/davilima6)! - Upgraded `eslint-config-airbnb-typescript` to v18. Read the [release notes](https://github.com/iamturns/eslint-config-airbnb-typescript/releases/tag/v18.0.0).

- [#973](https://github.com/sumup-oss/foundry/pull/973) [`bf86e86`](https://github.com/sumup-oss/foundry/commit/bf86e86cb8730d0f0b8e69611350bf518288b138) Thanks [@connor-baer](https://github.com/connor-baer)! - Upgraded `eslint-plugin-security` to v3. Read the [changelog](https://github.com/eslint-community/eslint-plugin-security/blob/main/CHANGELOG.md).

## 7.2.0

### Minor Changes

> [!WARNING] > `@sumup/foundry` will be renamed to `@sumup-oss/foundry` in the next major release.
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
