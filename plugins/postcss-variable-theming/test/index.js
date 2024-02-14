import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import theming from 'postcss-variable-theming';
const self = fileURLToPath(import.meta.url);

const files = fs.readdirSync(path.join(self, '../css'));
for (const expected of files.filter((file) => file.endsWith('.expect.css'))) {
  test(`Expected css/${expected} to match`, async () => {
    const inputCss = fs.readFileSync(
      path.join(self, '../css', expected.replace('.expect.css', '.css')),
      'utf8',
    );
    const expectedCss = fs.readFileSync(
      path.join(self, '../css', expected),
      'utf8',
    );
    const result = await postcss([theming()]).process(inputCss, {
      from: undefined,
    });
    assert.equal(result.css, expectedCss, `Expected css/${expected} to match`);
  });
}
