import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import theming from 'postcss-variable-theming';
import {
  groupedPropAlias,
  tailwindPropAlias,
} from 'postcss-variable-theming/preset';

const self = fileURLToPath(import.meta.url);
const cssDir = path.join(self, '../css');

const presets = {
  tailwind: tailwindPropAlias,
  grouped: groupedPropAlias,
};
const optionsRe = /^\/\*\s*@options([\s\S]*?)\*\/\n/;

function extractOptions(css) {
  const match = css.match(optionsRe);
  if (!match) {
    return [css, {}];
  }
  const opts = JSON.parse(match[1]);
  if (typeof opts.propAlias === 'string') {
    assert.ok(presets[opts.propAlias], `Unknown preset: ${opts.propAlias}`);
    opts.propAlias = presets[opts.propAlias];
  }
  return [css.replace(optionsRe, ''), opts];
}

const files = fs.readdirSync(cssDir);
for (const expected of files.filter((file) => file.endsWith('.expect.css'))) {
  test(`Expected css/${expected} to match`, async () => {
    const base = expected.replace('.expect.css', '');
    const [inputCss, opts] = extractOptions(
      fs.readFileSync(path.join(cssDir, `${base}.css`), 'utf8'),
    );
    const expectedCss = fs.readFileSync(path.join(cssDir, expected), 'utf8');
    const result = await postcss([theming(opts)]).process(inputCss, {
      from: undefined,
    });
    assert.equal(result.css, expectedCss, `Expected css/${expected} to match`);
  });
}

test('Warns when two properties generate the same variable', async () => {
  const result = await postcss([
    theming({ propAlias: { 'background-color': 'bg' } }),
  ]).process('@var acme{:root{background-color:red;--bg:blue}}', {
    from: undefined,
  });
  const warnings = result.warnings();
  assert.equal(warnings.length, 1);
  assert.match(warnings[0].text, /--acme-bg/);
  assert.match(warnings[0].text, /"background-color" and "--bg"/);
});

for (const [name, propAlias] of Object.entries(presets)) {
  test(`The ${name} preset never maps two properties to the same name`, () => {
    const aliases = Object.values(propAlias);
    assert.equal(new Set(aliases).size, aliases.length);
  });

  test(`The ${name} preset never takes the name of another property`, () => {
    const props = new Set(Object.keys(propAlias));
    const taken = Object.values(propAlias).filter((alias) => props.has(alias));
    assert.deepEqual(taken, []);
  });
}

test('Does not warn when the same property is themed twice', async () => {
  const result = await postcss([
    theming({ propAlias: { 'background-color': 'bg' } }),
  ]).process('@var acme{.a{background-color:red}.b{background-color:blue}}', {
    from: undefined,
  });
  assert.deepEqual(result.warnings(), []);
});
