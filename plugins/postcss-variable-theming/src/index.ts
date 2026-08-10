import type { AtRule, Declaration, PluginCreator, Result } from 'postcss';

export type PropAlias = Record<string, string>;

export interface PluginOptions {
  prefix?: string;
  propDelimiter?: string;
  nestedThemeDelimiter?: string;
  atRuleName?: string;
  propAlias?: PropAlias;
}

const visited = Symbol('visited');

function createProcessor(opts: Required<PluginOptions>, result: Result) {
  const generatedBy = new Map<string, string>();

  function processAtRule(parentNs: string, fallbacks: string[]) {
    return (atRule: AtRule) => {
      const names = atRule.params.split(/(?<!\\),/).map((s) => s.trim());
      const specifiers = names.map((s) => (s.includes('&') ? s : `&.${s}`));
      const invalidNameRe = /([^.][&*]|[&*][^.])/;
      if (specifiers.some((n) => invalidNameRe.test(n))) {
        // Ignore entire children
        atRule.remove();
        return;
      }
      const [context, ...fb] = specifiers.map((n, i) => {
        const ns = n
          .replace(/&/g, parentNs)
          .split('.')
          .filter((s) => s && s !== '*')
          .join('.');
        // A `.` name nests an anonymous theme, held as a trailing empty segment
        return names[i] === '.' && ns ? `${ns}.` : ns;
      });
      const rest = [...fb, ...fallbacks];
      atRule.walkAtRules(opts.atRuleName, processAtRule(context, rest));
      atRule.walkDecls((decl: Declaration & { [visited]?: boolean }) => {
        if (decl[visited]) {
          return;
        }
        decl[visited] = true;
        const propName =
          opts.propAlias[decl.prop] ?? decl.prop.replace(/^--/g, '');
        function wrap(acc: string[]): string {
          if (acc.length >= 2) {
            const [head, ...tail] = acc;
            const themes = head ? head.split('.') : [];
            const leaf = themes.pop() ?? '';
            const themeName = `${themes
              .map((theme) => `${theme}${opts.nestedThemeDelimiter}`)
              .join('')}${leaf ? `${leaf}${opts.propDelimiter}` : ''}`;
            const name = `--${opts.prefix}${themeName}${propName}`;
            const generator = generatedBy.get(name);
            if (generator === undefined) {
              generatedBy.set(name, decl.prop);
            } else if (generator !== decl.prop) {
              result.warn(
                `Variable ${name} is generated from both "${generator}" and "${decl.prop}"`,
                { node: decl },
              );
            }
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

  return processAtRule('', []);
}

const Plugin: PluginCreator<PluginOptions> = (options = {}) => {
  const opts = {
    prefix: options.prefix ?? '',
    propDelimiter: options.propDelimiter ?? '-',
    nestedThemeDelimiter: options.nestedThemeDelimiter ?? '--',
    atRuleName: options.atRuleName || 'var',
    propAlias: Object.assign(
      Object.create(null) as PropAlias,
      options.propAlias,
    ),
  };
  return {
    postcssPlugin: 'variable-theming',
    OnceExit(css, { result }) {
      css.walkAtRules(opts.atRuleName, createProcessor(opts, result));
    },
  };
};
Plugin.postcss = true;

export default Plugin;
