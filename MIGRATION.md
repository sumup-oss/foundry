# Migration

## From v8.x to v9

### Prerequisites

Foundry now requires Node.js 20.19.x || >=22.0.0 to support `require(esm)`. Foundry is now a [pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and we strongly recommend moving your project to ESM as well, though it is not a requirement to use Foundry v9.

### Dependencies

First, upgrade all custom ESLint plugins to their latest major version. Remove `@biomejs/biome` if it is listed as a direct dependency, as it is now bundled with Foundry. Uninstall `@sumup-oss/foundry`, then re-install it to ensure that sub-dependencies are installed at their latest version and at the `node_modules` root:

```sh
npm uninstall @sumup-oss/foundry
npm install --dev @sumup-oss/foundry
```

Check that ESLint is only installed at v9.x:

```sh
npm why eslint
```

If there are older versions of ESLint installed, find the offending plugins and use [ESLint's compatibility utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/) to adapt them. Use [npm overrides](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#overrides) to force ESLint to be installed at v9.

### Configuration files

The names and formats of most config files have changed. Run `npx foundry init` to initialize new default configs, then migrate over any previous customizations, and delete the old config files. Here's an overview of the new filenames:

- `.prettierrc.js` and `.prettierignore` → `biome.jsonc` and `.editorconfig`
- `.eslintrc.js` and `.eslintignore` → `biome.jsonc` and `eslint.config.js`
- `.stylelintrc.js` → `stylelint.config.js`
- `.huskyrc.js` → `husky.config.cjs`

#### ESLint

Foundry v9 upgrades to ESLint v9 which introduced a new [flat config system](https://eslint.org/blog/2022/08/new-config-system-part-2/). The config now consists of an array of configuration objects, similar to the previous `overrides` option. Refer to [ESLint's official migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) to migrate any custom overrides.

The unmaintained [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) and [`eslint-plugin-node`](https://www.npmjs.com/package/eslint-plugin-node) packages have been replaced by [`eslint-plugin-import-x`](https://www.npmjs.com/package/eslint-plugin-import-x) and [`eslint-plugin-n`](https://www.npmjs.com/package/eslint-plugin-n) respectively. Update any rule overrides or directives that reference the plugins to the new names:

```diff
-// eslint-disable-next-line import/no-named-as-default
+// eslint-disable-next-line import-x/no-named-as-default
```

### Scripts

The `foundry run` command has been removed in favor of calling the tools directly. The default package scripts added by `foundry init` have been updated to run Biome and exclude warnings:

```diff
-  "lint": "foundry run eslint . --ext .js,.jsx,.json,.ts,.tsx",
-  "lint:fix": "foundry run eslint . --ext .js,.jsx,.json,.ts,.tsx --fix",
-  "lint:ci": "foundry run eslint . --ext .js,.jsx,.json,.ts,.tsx",
-  "lint:css": "foundry run stylelint '**/*.css'"
+  "lint": "biome check --diagnostic-level=error && eslint . --quiet --concurrency=auto",
+  "lint:fix": "biome check --write --diagnostic-level=error && eslint . --fix --quiet --concurrency=auto",
+  "lint:ci": "biome ci --diagnostic-level=error && eslint . --quiet --concurrency=auto",
+  "lint:css": "stylelint '**/*.css' --quiet"
```

Once the config files and scripts have been migrated, apply all automated fixes:

```sh
npm run lint:fix
```

Commit the changes, then fix any remaining issues manually. Use [ESLint's new bulk suppressions](https://eslint.org/blog/2025/04/introducing-bulk-suppressions/) when the existing number of violations are too numerous. Use [ESLint's `--report-unused-disable-directives` CLI flag](https://eslint.org/docs/latest/use/command-line-interface#--report-unused-disable-directives) to remove all obsolete directives.
