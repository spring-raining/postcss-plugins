import type { PropAlias } from './index.js';

/**
 * Property aliases named after Tailwind CSS utility class prefixes.
 *
 * Only properties whose alias is unambiguous are listed. Where Tailwind reuses
 * one prefix for several properties (`text-lg` / `text-red-500`,
 * `border-2` / `border-red-500`), the alias goes to the color property and the
 * others keep their own name.
 */
export const tailwindPropAlias: PropAlias = {
  // Color
  color: 'text',
  'background-color': 'bg',
  'border-color': 'border',
  'border-top-color': 'border-t',
  'border-right-color': 'border-r',
  'border-bottom-color': 'border-b',
  'border-left-color': 'border-l',
  'border-inline-start-color': 'border-s',
  'border-inline-end-color': 'border-e',
  'outline-color': 'outline',
  'text-decoration-color': 'decoration',
  'box-shadow': 'shadow',

  // Spacing
  padding: 'p',
  'padding-inline': 'px',
  'padding-block': 'py',
  'padding-top': 'pt',
  'padding-right': 'pr',
  'padding-bottom': 'pb',
  'padding-left': 'pl',
  'padding-inline-start': 'ps',
  'padding-inline-end': 'pe',
  margin: 'm',
  'margin-inline': 'mx',
  'margin-block': 'my',
  'margin-top': 'mt',
  'margin-right': 'mr',
  'margin-bottom': 'mb',
  'margin-left': 'ml',
  'margin-inline-start': 'ms',
  'margin-inline-end': 'me',
  'column-gap': 'gap-x',
  'row-gap': 'gap-y',

  // Sizing
  width: 'w',
  height: 'h',
  'min-width': 'min-w',
  'min-height': 'min-h',
  'max-width': 'max-w',
  'max-height': 'max-h',

  // Position
  'inset-inline': 'inset-x',
  'inset-block': 'inset-y',
  'z-index': 'z',

  // Flexbox & grid
  'flex-basis': 'basis',
  'flex-grow': 'grow',
  'flex-shrink': 'shrink',
  'grid-template-columns': 'grid-cols',
  'grid-template-rows': 'grid-rows',
  'grid-column': 'col',
  'grid-column-start': 'col-start',
  'grid-column-end': 'col-end',
  'grid-row': 'row',
  'grid-row-start': 'row-start',
  'grid-row-end': 'row-end',
  'grid-auto-columns': 'auto-cols',
  'grid-auto-rows': 'auto-rows',
  'align-items': 'items',
  'align-self': 'self',
  'justify-content': 'justify',

  // Border radius
  'border-radius': 'rounded',
  'border-start-start-radius': 'rounded-ss',
  'border-start-end-radius': 'rounded-se',
  'border-end-end-radius': 'rounded-ee',
  'border-end-start-radius': 'rounded-es',
  'border-top-left-radius': 'rounded-tl',
  'border-top-right-radius': 'rounded-tr',
  'border-bottom-right-radius': 'rounded-br',
  'border-bottom-left-radius': 'rounded-bl',

  // Typography
  'font-family': 'font',
  'letter-spacing': 'tracking',
  'line-height': 'leading',
  'white-space': 'whitespace',
  'text-underline-offset': 'underline-offset',
  'text-indent': 'indent',
  'vertical-align': 'align',
  'list-style-type': 'list',

  // Transition & animation
  'transition-property': 'transition',
  'transition-duration': 'duration',
  'transition-timing-function': 'ease',
  'transition-delay': 'delay',
  animation: 'animate',

  // Miscellaneous
  'aspect-ratio': 'aspect',
  'object-position': 'object',
  'mix-blend-mode': 'mix-blend',
  'background-blend-mode': 'bg-blend',
};

/**
 * Property aliases that move the side, corner or axis segment of a longhand
 * name to the end, so every variant of one feature shares a prefix:
 * `--border-width-block-end` instead of `--border-block-end-width`.
 *
 * Covers every standard CSS property whose segments are ordered otherwise.
 */
export const groupedPropAlias: PropAlias = {
  'border-block-color': 'border-color-block',
  'border-block-end-color': 'border-color-block-end',
  'border-block-start-color': 'border-color-block-start',
  'border-bottom-color': 'border-color-bottom',
  'border-inline-color': 'border-color-inline',
  'border-inline-end-color': 'border-color-inline-end',
  'border-inline-start-color': 'border-color-inline-start',
  'border-left-color': 'border-color-left',
  'border-right-color': 'border-color-right',
  'border-top-color': 'border-color-top',

  'border-bottom-left-radius': 'border-radius-bottom-left',
  'border-bottom-right-radius': 'border-radius-bottom-right',
  'border-end-end-radius': 'border-radius-end-end',
  'border-end-start-radius': 'border-radius-end-start',
  'border-start-end-radius': 'border-radius-start-end',
  'border-start-start-radius': 'border-radius-start-start',
  'border-top-left-radius': 'border-radius-top-left',
  'border-top-right-radius': 'border-radius-top-right',

  'border-block-style': 'border-style-block',
  'border-block-end-style': 'border-style-block-end',
  'border-block-start-style': 'border-style-block-start',
  'border-bottom-style': 'border-style-bottom',
  'border-inline-style': 'border-style-inline',
  'border-inline-end-style': 'border-style-inline-end',
  'border-inline-start-style': 'border-style-inline-start',
  'border-left-style': 'border-style-left',
  'border-right-style': 'border-style-right',
  'border-top-style': 'border-style-top',

  'border-block-width': 'border-width-block',
  'border-block-end-width': 'border-width-block-end',
  'border-block-start-width': 'border-width-block-start',
  'border-bottom-width': 'border-width-bottom',
  'border-inline-width': 'border-width-inline',
  'border-inline-end-width': 'border-width-inline-end',
  'border-inline-start-width': 'border-width-inline-start',
  'border-left-width': 'border-width-left',
  'border-right-width': 'border-width-right',
  'border-top-width': 'border-width-top',

  'contain-intrinsic-block-size': 'contain-intrinsic-size-block',
  'contain-intrinsic-inline-size': 'contain-intrinsic-size-inline',

  'corner-block-end-shape': 'corner-shape-block-end',
  'corner-block-start-shape': 'corner-shape-block-start',
  'corner-bottom-shape': 'corner-shape-bottom',
  'corner-bottom-left-shape': 'corner-shape-bottom-left',
  'corner-bottom-right-shape': 'corner-shape-bottom-right',
  'corner-end-end-shape': 'corner-shape-end-end',
  'corner-end-start-shape': 'corner-shape-end-start',
  'corner-inline-end-shape': 'corner-shape-inline-end',
  'corner-inline-start-shape': 'corner-shape-inline-start',
  'corner-left-shape': 'corner-shape-left',
  'corner-right-shape': 'corner-shape-right',
  'corner-start-end-shape': 'corner-shape-start-end',
  'corner-start-start-shape': 'corner-shape-start-start',
  'corner-top-shape': 'corner-shape-top',
  'corner-top-left-shape': 'corner-shape-top-left',
  'corner-top-right-shape': 'corner-shape-top-right',

  'block-size': 'size-block',
  'inline-size': 'size-inline',
  'max-block-size': 'max-size-block',
  'max-inline-size': 'max-size-inline',
  'min-block-size': 'min-size-block',
  'min-inline-size': 'min-size-inline',
};
