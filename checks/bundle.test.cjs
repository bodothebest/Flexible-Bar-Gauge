const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Loader-contract smoke test, not an end-to-end Grafana rendering test.
// The host supplies these entry points. @grafana/schema must be bundled.
// Reference: Grafana v13.0.2, public/app/features/plugins/loader/sharedDependencies.ts.
test('production AMD bundle resolves only supported host modules and exports the panel', () => {
  const controls = [];
  const builder = Object.fromEntries(
    ['addRadio', 'addNumberInput', 'addBooleanSwitch', 'addTextInput', 'addCustomEditor'].map((method) => [
      method,
      (config) => {
        controls.push(config);
        return builder;
      },
    ])
  );
  class PanelPlugin {
    constructor(component) {
      this.component = component;
    }
    useFieldConfig() {
      return this;
    }
    setPanelOptions(configure) {
      configure(builder);
      return this;
    }
  }
  const host = {
    module: { uri: 'http://localhost/public/plugins/bodothebest-flexiblebargauge-panel/module.js' },
    '@grafana/data': { PanelPlugin },
    '@grafana/ui': {},
    react: require('react'),
  };
  let result;
  const code = fs.readFileSync(path.join(__dirname, '../dist/module.js'), 'utf8');
  vm.runInNewContext(
    code,
    {
      define(dependencies, factory) {
        for (const dependency of dependencies) {
          assert.ok(Object.hasOwn(host, dependency), `Unsupported host dependency: ${dependency}`);
        }
        result = factory(...dependencies.map((dependency) => host[dependency]));
      },
    },
    { timeout: 5000 }
  );
  assert.ok(result.plugin instanceof PanelPlugin);
  assert.equal(typeof result.plugin.component, 'function');
  assert.equal(controls.find((c) => c.path === 'displayMode').defaultValue, 'gradient');
  assert.equal(controls.find((c) => c.path === 'namePlacement').defaultValue, 'left');
});
