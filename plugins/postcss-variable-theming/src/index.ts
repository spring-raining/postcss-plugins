import { type AtRule, type Declaration, type PluginCreator } from 'postcss';

export interface PluginOptions {
  prefix?: string;
  propDelimiter?: string;
  nestedThemeDelimiter?: string;
  atRuleName?: string;
}

const visited = Symbol('visited');

function processAtRule(
  parentNs: string,
  fallbacks: string[],
  opts: Required<PluginOptions>,
) {
  return (atRule: AtRule) => {
    const names = atRule.params
      .split(/(?<!\\),/)
      .map((s) => s.trim())
      .map((s) => (s.includes('&') ? s : `&.${s}`));
    const invalidNameRe = /([^.][&*]|[&*][^.])/;
    if (names.some((n) => invalidNameRe.test(n))) {
      // Ignore entire children
      atRule.remove();
      return;
    }
    const [context, ...fb] = names.map((n) =>
      n
        .replace(/&/g, parentNs)
        .split('.')
        .filter((s) => s && s !== '*')
        .join('.'),
    );
    const rest = [...fb, ...fallbacks];
    atRule.walkAtRules(opts.atRuleName, processAtRule(context, rest, opts));
    atRule.walkDecls((decl: Declaration & { [visited]?: boolean }) => {
      if (decl[visited]) {
        return;
      }
      decl[visited] = true;
      function wrap(acc: string[]): string {
        if (acc.length >= 2) {
          const [head, ...tail] = acc;
          const name = `--${opts.prefix}${[
            head.replaceAll('.', opts.nestedThemeDelimiter),
            decl.prop.replace(/^--/g, ''),
          ]
            .filter(Boolean)
            .join(opts.propDelimiter)}`;
          const out = wrap(tail);
          return `var(${name}${out ? `, ${out.replace(/^,\s*/, '')}` : ''})`;
        }
        return acc[0];
      }
      decl.value = wrap([context, ...rest, decl.value]);
    });
    if (atRule.nodes) {
      atRule.replaceWith(atRule.nodes);
    }
  };
}

const Plugin: PluginCreator<PluginOptions> = (options = {}) => {
  const opts = {
    prefix: options.prefix ?? '',
    propDelimiter: options.propDelimiter ?? '-',
    nestedThemeDelimiter: options.nestedThemeDelimiter ?? '--',
    atRuleName: options.atRuleName || 'var',
  };
  return {
    postcssPlugin: 'variable-theming',
    OnceExit(css) {
      css.walkAtRules(opts.atRuleName, processAtRule('', [], opts));
    },
  };
};
Plugin.postcss = true;

export default Plugin;
