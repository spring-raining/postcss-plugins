import { type AtRule, type PluginCreator, type Rule } from 'postcss';

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
    const [ctx, ...rest] = atRule.params.split(/(?<!\\),/).map((s) => s.trim());
    const context = [parentNs, ctx].filter(Boolean).join('.');
    const fb = [
      ...rest
        .filter(Boolean)
        .map((n) => [parentNs, n].filter(Boolean).join('.')),
      ...fallbacks,
    ];
    atRule.walkAtRules(opts.atRuleName, processAtRule(context, fb, opts));
    atRule.walkRules((rule: Rule & { [visited]?: boolean }) => {
      if (rule[visited]) {
        return;
      }
      rule[visited] = true;
      rule.walkDecls((decl) => {
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
        decl.value = wrap([context, ...fb, decl.value]);
      });
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
