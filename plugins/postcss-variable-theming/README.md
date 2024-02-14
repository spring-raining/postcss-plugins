# PostCSS Variable Theming

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-variable-theming.svg" height="20">][npm-url]

[npm-url]: https://www.npmjs.com/package/postcss-variable-theming

> PostCSS plugin to provide theming function based on CSS variables using `@theme` rules.

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

@theme foo {
  :root {
    font: 16px / 1.5;
    color: ;
  }
}

@theme-fallback heading {
  @theme h1 {
    h1 {
      font-size: 2em;
      line-height: 1.5;
    }
  }
  @theme h2 {
    h2 {
      font-size: 1.5em;
      line-height: 1.5;
    }
  }
  @theme h3 {
    h3 {
      font-size: 1.17em;
      line-height: 1.5;
    }
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

### Theme nesting

```css
/* Input CSS */

@theme {
  :root {
    --color-1: orange;
  }
  @theme foo.bar {
    :root {
      --color-2: green;
    }
  }
  @theme foo {
    @theme baz {
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

## Options

```js
module.exports = {
  plugins: [require('postcss-variable-theming')({
    prefix: '',
    propDelimiter: '-',
    nestedThemeDelimiter: '--',
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
