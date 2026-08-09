# PostCSS Variable Theming

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-variable-theming.svg" height="20">][npm-url]

[npm-url]: https://www.npmjs.com/package/postcss-variable-theming

> PostCSS plugin to provide theming function based on CSS variables using `@var` rules.

## Installation

```
npm install -D postcss-variable-theming
```

## Usage

`postcss.confg.js`:

```js
const theming = require('postcss-variable-theming');

module.exports = {
  plugins: [theming()],
};
```

```css
/* Input CSS */

@var foo {
  :root {
    font: 16px / 1.5;
    color: ;
  }
}

@var h1, heading {
  h1 {
    font-size: 2em;
    line-height: 1.5;
  }
}
@var h2, heading {
  h2 {
    font-size: 1.5em;
    line-height: 1.5;
  }
}
@var h3, heading {
  h3 {
    font-size: 1.17em;
    line-height: 1.5;
  }
}
```

```css
/* Output CSS */

:root {
  font: var(--foo-font, 16px / 1.5);
  color: var(--foo-color);
}
h1 {
  font-size: var(--h1-font-size, var(--heading-font-size, 2em));
  line-height: var(--h1-line-height, var(--heading-line-height, 1.5));
}
h2 {
  font-size: var(--h2-font-size, var(--heading-font-size, 1.5em));
  line-height: var(--h2-line-height, var(--heading-line-height, 1.5));
}
h3 {
  font-size: var(--h3-font-size, var(--heading-font-size, 1.17em));
  line-height: var(--h3-line-height, var(--heading-line-height, 1.5));
}
```

Or you can use a special `*` character as follows:

```css
@var *, heading {
  @var h1 {
    h1 { ... }
  }
  @var h2 {
    h2 { ... }
  }
  @var h3 {
    h3 { ... }
  }
}
```

### Theme nesting

```css
/* Input CSS */

@var {
  :root {
    --color-1: orange;
  }
  @var foo.bar {
    :root {
      --color-2: green;
    }
  }
  @var foo {
    @var baz {
      :root {
        --color-3: purple;
      }
    }
  }
}
```

```css
/* Output CSS */

:root {
  --color-1: var(--color-1, orange);
}
:root {
  --color-2: var(--foo--bar-color-2, green);
}
:root {
  --color-3: var(--foo--baz-color-3, purple);
}
```

### Explicit nesting specifier: `&`

```css
/* Input CSS */

@var acme {
  @var *, fallback.& {
    @media (prefers-color-scheme: light) {
      @var &.light {
        :root {
          color: #111;
          background-color: #fff;
        }
      }
    }
    @media (prefers-color-scheme: dark) {
      @var &.dark {
        :root {
          color: #fff;
          background-color: #333;
        }
      }
    }
  }
}
```

```css
/* Output CSS */

@media (prefers-color-scheme: light) {
  :root {
    color: var(--acme--light-color, var(--fallback--acme-color, #111));
    background-color: var(--acme--light-background-color,
      var(--fallback--acme-background-color, #fff));
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    color: var(--acme--dark-color, var(--fallback--acme-color, #fff));
    background-color: var(--acme--dark-background-color,
      var(--fallback--acme-background-color, #333));
  }
}
```

### Property aliases

Variable names are derived from the property name itself, but `propAlias` lets
you name them freely:

```js
module.exports = {
  plugins: [require('postcss-variable-theming')({
    propAlias: {
      'background-color': 'bg',
      color: 'text',
      '--brand': 'primary',
    },
  })],
};
```

```css
/* Input CSS */

@var acme {
  .card {
    background-color: #fff;
    color: #111;
    --brand: #09f;
    padding: 1rem;
  }
}
```

```css
/* Output CSS */

.card {
  background-color: var(--acme-bg, #fff);
  color: var(--acme-text, #111);
  --brand: var(--acme-primary, #09f);
  padding: var(--acme-padding, 1rem);
}
```

Properties left out of the table keep their own name, so only the ones worth
shortening need an entry.

#### Tailwind preset

`postcss-variable-theming/preset` ships ready-made tables. `tailwindPropAlias`
holds 83 entries named after Tailwind CSS utility class prefixes:

```js
const theming = require('postcss-variable-theming');
const { tailwindPropAlias } = require('postcss-variable-theming/preset');

module.exports = {
  plugins: [theming({ propAlias: tailwindPropAlias })],
};
```

| Property | Variable name |
| --- | --- |
| `color` | `text` |
| `background-color` | `bg` |
| `border-color` | `border` |
| `padding-inline` | `px` |
| `margin-top` | `mt` |
| `width` | `w` |
| `border-radius` | `rounded` |
| `letter-spacing` | `tracking` |
| `line-height` | `leading` |
| `transition-duration` | `duration` |

Tailwind reuses a single prefix for several properties — `text-lg` sets
`font-size` while `text-red-500` sets `color`, and `border-2` sets
`border-width` while `border-red-500` sets `border-color`. A name can only
belong to one property here, so the preset hands it to the color property and
leaves `font-size`, `border-width`, `outline-width` and
`text-decoration-thickness` under their own names.

#### Grouped preset

`groupedPropAlias` moves the side, corner or axis segment of a longhand name to
the end, so every variant of one feature shares a prefix:

| Property | Variable name |
| --- | --- |
| `border-top-width` | `border-width-top` |
| `border-block-end-width` | `border-width-block-end` |
| `border-inline-start-color` | `border-color-inline-start` |
| `border-start-start-radius` | `border-radius-start-start` |
| `corner-top-left-shape` | `corner-shape-top-left` |
| `inline-size` | `size-inline` |
| `min-block-size` | `min-size-block` |

All 62 standard properties whose segments run the other way around are covered,
which keeps `--border-width-*` together instead of scattering it over
`--border-top-width`, `--border-block-end-width` and the rest.

The two presets can be merged, the later one winning:

```js
theming({ propAlias: { ...groupedPropAlias, ...tailwindPropAlias } })
```

#### Name collisions

Two properties sharing one variable name would silently overwrite each other, so
they are reported as a PostCSS warning:

```css
@var acme {
  :root {
    background-color: red;
    --bg: blue;
  }
}
```

```
Variable --acme-bg is generated from both "background-color" and "--bg"
```

## Options

```js
module.exports = {
  plugins: [require('postcss-variable-theming')({
    prefix: '',
    propDelimiter: '-',
    nestedThemeDelimiter: '--',
    atRuleName: 'var',
    propAlias: {},
  })],
};
```

### `prefix`

* Type: `string`
* Default: `''`

### `propDelimiter`

* Type: `string`
* Default: `'-'`

### `nestedThemeDelimiter`

* Type: `string`
* Default: `'--'`

### `atRuleName`

* Type: `string`
* Default: `var`

### `propAlias`

* Type: `Record<string, string>`
* Default: `{}`

Maps a property name to the name used in the generated variable. Custom
properties are keyed with their leading `--` (e.g. `'--brand': 'primary'`).
