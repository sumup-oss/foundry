# Migration

## From v8.x to v9

### Prerequisites

Foundry now requires Node.js 20.19.x || >=22.0.0 to support requiring ESM. Foundry is now a [pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and we strongly recommend moving your project to ESM as well, though it is not a requirement to use Foundry v9.

### Dependencies

Upgrade all custom ESLint plugins to their latest version. Remove `@biomejs/biome` if it is listed as a direct dependency, as it is now bundled with Foundry. Uninstall `@sumup-oss/foundry`, then re-install it to ensure that sub-dependencies are installed at their latest version and at the `node_modules` root:

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

The names and formats of most config files have changed. Run `npx foundry init` to initialize new default configs, migrate over any previous customizations, then delete the old config files. Here's an overview of the new filenames:

- `.prettierrc.js` and `.prettierignore` → `biome.jsonc` and `.editorconfig`
- `.eslintrc.js` and `.eslintignore` → `biome.jsonc` and `eslint.config.js`
- `.stylelintrc.js` → `stylelint.config.js`
- `.huskyrc.js` → `husky.config.cjs`

#### ESLint

Foundry v9 upgrades to ESLint v9 which introduced a new [flat config system](https://eslint.org/blog/2022/08/new-config-system-part-2/). The config now consists of an array of configuration objects, similar to the previous `overrides` option. Refer to [ESLint's official migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) to migrate any custom overrides.

The unmaintained [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) and [`eslint-plugin-node`](https://www.npmjs.com/package/eslint-plugin-node) have been replaced by [`eslint-plugin-import-x`](https://www.npmjs.com/package/eslint-plugin-import-x) and [`eslint-plugin-n`](https://www.npmjs.com/package/eslint-plugin-n) respectively. Update any rule overrides or directives that reference the plugins to the new names:

```diff
-// eslint-disable-next-line import/no-named-as-default
+// eslint-disable-next-line import-x/no-named-as-default
```
