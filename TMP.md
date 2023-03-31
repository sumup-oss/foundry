# v6

## Removals

- CI template → _replace with template repos for web apps, packages_
- semantic release → _replace with **changesets**_

## Changed config

### Prettier

- `useTabs: true` [needs discussion]

### ESLint

- Enable Next.js ESLint integration?

---

## Migration

### release

**Keep semantic-release**

- install packages (provide command)
- replace `.releaserc.js` (provide config)

**Remove semantic-release**

- remove `.releaserc.js`
- uninstall any custom `semantic-release` plugins (`@semantic-release/*`)
- update CONTRIBUTING.md, ci.yaml
- (recommend `changesets`, link to docs)

### ci

- nothing to do

---

Support Yarn v1 and npm
-> encourage switch to npm
Check installed dependencies, e.g. next, jest
-> returns suggested packages (plugins) to install (name + version)
-> checks if packages are already installed and up-to-date
-> how to check actual installed version (ie. lock file, not package.json)
Should this be a choice?
-> we should enforce consistency and quality, so no
-> might not be able to set it up right away, so offer option to delay by 1 day or week?
When does this run?
-> not in CI
-> will most likely change when installing or upgrading a dependency, so `postinstall`?
-> when linting? heavy, would require caching, not compatible with lint-staged?
optionalPeerDependencies or peerDependencies?
-> indicates support in Foundry to warn about unsupported versions
-> should warn during linting?
store
-> package manager
-> additional plugins + version
-> config file? can be checked into version control, easier to debug
add debug logging

### Linting

config
-> base rules and plugins (imports, prettier)
-> list of extra plugins
-> generate config for plugin version (config should be fn)

```sh
# Create initial config files and install additional dependencies based on environment
foundry init
# Check latest environment and package versions
foundry update
```

dynamically import command handlers
