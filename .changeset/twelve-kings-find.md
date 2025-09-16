---
'@sumup-oss/foundry': major
---

Removed the `foundry run` command. Instead, call tools like Biome, ESLint, and Stylelint directly. For example:

```diff
-foundry run eslint . --fix
+eslint . --fix
```
