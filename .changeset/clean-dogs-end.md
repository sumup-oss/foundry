---
'@sumup-oss/foundry': major
---

Migrated to [ESLint's new flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/). Foundry now exports language, environment, and framework-specific configs that can be combined and customized using ESLint's default config format:

**Before**

```js
// .eslintrc.js
module.exports = require('@sumup-oss/foundry/eslint')({
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
		rules: { /* custom rules */ }
	},
	// Framework-specific ESLint plugins aren't bundled with Foundry.
	// Import and extend them manually, placing the Foundry config last.
	{
		extends: [
			react.configs.recommended,
			react.configs['jsx-runtime'],
			configs.react
		],
		plugins: { react },
	},
]);
```
