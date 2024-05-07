---
'@sumup/foundry': major
---

Update of linter libraries to support the latest versions of Typescript:

- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-config-airbnb-typescript

This is a breaking change as the introduction of ESLint v9 requires a minimum Node version of v18.18, whereas previously Foundry only required v18.12+.
