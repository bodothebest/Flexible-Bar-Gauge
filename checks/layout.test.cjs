const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/layout.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const layoutExports = {};
new Function('exports', compiled.outputText)(layoutExports);
const { columnLayout } = layoutExports;

test('pixel width is preserved and remaining space goes to gauges', () => {
  assert.deepEqual(columnLayout(800, 180, 'px', false, 12), { name: 180, gap: 12, gauge: 608, total: 800 });
});
test('percentage tracks the available width', () => {
  assert.equal(columnLayout(800, 25, 'percent', false, 12).name, 200);
  assert.equal(columnLayout(400, 25, 'percent', false, 12).name, 100);
});
test('narrow panels preserve labels and a usable gauge through horizontal scroll', () => {
  const layout = columnLayout(120, 180, 'px', false, 12);
  assert.equal(layout.name, 180);
  assert.equal(layout.gauge, 240);
  assert.equal(layout.total, 432);
});
test('hidden names reserve neither column nor gap', () => {
  assert.deepEqual(columnLayout(800, 180, 'px', true, 12), { name: 0, gap: 0, gauge: 800, total: 800 });
});
test('invalid widths and extreme percentages are bounded', () => {
  assert.equal(columnLayout(800, NaN, 'px', false, 12).name, 180);
  assert.equal(columnLayout(800, -30, 'px', false, 12).name, 0);
  assert.equal(columnLayout(800, 500, 'percent', false, 12).name, 640);
});
