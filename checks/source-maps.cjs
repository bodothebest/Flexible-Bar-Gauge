const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const map = JSON.parse(fs.readFileSync(path.join(root, 'dist/module.js.map'), 'utf8'));
const sources = map.sources.map((s) => s.replaceAll('\\', '/'));
const files = ['FlexibleBarGaugePanel.tsx', 'types.ts', 'layout.ts', 'CalculationEditor.tsx', 'module.ts'];
for (const file of files) {
  const index = sources.findIndex((s) => !s.includes('node_modules') && s.endsWith('/' + file));
  assert.notEqual(index, -1, `Missing source map entry: ${file}`);
  assert.equal(
    map.sourcesContent[index],
    fs.readFileSync(path.join(root, 'src', file), 'utf8'),
    `Source mismatch: ${file}`
  );
}
const bundle = fs.readFileSync(path.join(root, 'dist/module.js'), 'utf8');
assert.match(bundle, /\[create-plugin\] version: 7\.16\.0/);
const meta = JSON.parse(fs.readFileSync(path.join(root, 'dist/plugin.json'), 'utf8'));
assert.equal(meta.buildMode, 'production');
assert.equal(meta.info.version, require('../package.json').version);
console.log(`Original sources match all ${files.length} source-map entries; standard production build verified.`);
