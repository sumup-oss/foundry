---
"@sumup-oss/foundry": major
---

Enabled Biome's `noSecrets` security rule to flag usage of sensitive data such as API keys and tokens. This rule checks for high-entropy strings and matches common patterns for secrets, including AWS keys, Slack tokens, and private keys.
