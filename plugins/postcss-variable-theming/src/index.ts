import type { AtRule, PluginCreator, Rule } from 'postcss';

export interface PluginOptions {
  prefix?: string;
  propDelimiter?: string;
  nestedThemeDelimiter?: string;
}

const atRuleNameFilter = /^var|var-fallback$/;
const visited = Symbol('visited');

function processAtRule(
  parentNs: string,
  fallbacks: string[],
  opts: { prefix: string; propDelimiter: string; nestedThemeDelimiter: string },
) {
  return (atRule: AtRule) => {
    const context = [parentNs, atRule.params].filter(Boolean).join('.');
    const fb = [...fallbacks];
    let ns = parentNs;
    if (atRule.name === 'var-fallback') {
      fb.unshift(context);
    } else {
      ns = context;
    }
    atRule.walkAtRules(atRuleNameFilter, processAtRule(ns, fb, opts));
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
        decl.value = wrap([ns, ...fb, decl.value]);
      });
    });
    if (atRule.nodes) {
      atRule.replaceWith(atRule.nodes);
    }
  };
}

const Plugin: PluginCreator<PluginOptions> = (options = {}) => {
  const opts = {
    prefix: options.prefix || '',
    propDelimiter: options.propDelimiter || '-',
    nestedThemeDelimiter: options.nestedThemeDelimiter || '--',
  };
  return {
    postcssPlugin: 'variable-theming',
    OnceExit(css) {
      css.walkAtRules(atRuleNameFilter, processAtRule('', [], opts));
    },
  };
};
Plugin.postcss = true;

export default Plugin;
