---
"postcss-variable-theming": patch
---

Fix an empty custom property declaration (e.g. `--content: ;`) emitting a stray comma as `var(--a-content, )` instead of `var(--a-content)`
