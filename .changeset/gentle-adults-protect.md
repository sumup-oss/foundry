---
'@sumup/foundry': patch
---

Reduced the scope of the integration test file globs to prevent false positive lint issues in unit test files. Integration tests must be located in the `e2e/` or `tests/` folders in the repo or [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces) root directories.
