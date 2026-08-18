# postcss-variable-theming

## 0.5.1

### Patch Changes

- 59fd8f8: Fix an empty custom property declaration (e.g. `--content: ;`) emitting a stray comma as `var(--a-content, )` instead of `var(--a-content)`

## 0.5.0

### Minor Changes

- ed98e95: Support a `.` name to nest an anonymous theme, which keeps the nested theme delimiter before the property name (e.g. `--foo--color`)

## 0.4.1

### Patch Changes

- 8d3d8c5: Fix the missing `dist` directory in the published package

## 0.4.0

### Minor Changes

- 9dad10b: Add a `propAlias` option to name variables independently of the property name, along with `tailwindPropAlias` and `groupedPropAlias` presets exported from `postcss-variable-theming/preset`

### Patch Changes

- b8a3d6c: Fix to support declarations without rules

## 0.3.0

### Minor Changes

- 851d1c6: Support `&` and `*` characters for special purposes

## 0.2.0

### Minor Changes

- 3df8238: Use `@var` rule name rather than `@theme`
- 0543a8a: Support rest parameters as fallback name
- e3143b2: Add an `atRuleName` option

### Patch Changes

- 7321c0c: Allow an empty string for `propDelimiter` and `nestedThemeDelimiter` options

## 0.1.0

### Minor Changes

- 4767e85: Initial release
