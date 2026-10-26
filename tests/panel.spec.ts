import { test, expect } from '@grafana/plugin-e2e';

for (const example of [
  { id: '1', align: 'left', whitespace: 'nowrap', width: '210px' },
  { id: '2', align: 'center', whitespace: 'nowrap' },
  { id: '3', align: 'right', whitespace: 'normal', width: '170px' },
  { id: '4', align: 'left', whitespace: 'nowrap', width: '220px' },
]) {
  test(`renders values and name layout in example ${example.id}`, async ({
    readProvisionedDashboard,
    gotoPanelEditPage,
  }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'dashboards/dashboard.json' });
    const editor = await gotoPanelEditPage({ dashboard, id: example.id });
    const label = editor.panel.locator.locator('div[title="API gateway — Europe"]');
    await expect(label).toHaveCSS('text-align', example.align);
    await expect(label).toHaveCSS('white-space', example.whitespace);
    if (example.width) {
      await expect(label).toHaveCSS('width', example.width);
    }
    await expect(editor.panel.locator).toContainText('72%');
    await expect(editor.panel.locator).toContainText('88%');
    await expect(editor.panel.locator).not.toContainText('Error loading:');
  });
}

test('an empty query has no plugin load failure', async ({ readProvisionedDashboard, gotoPanelEditPage }) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboards/dashboard.json' });
  const editor = await gotoPanelEditPage({ dashboard, id: '5' });
  await expect(editor.panel.locator).toContainText('No data');
  await expect(editor.panel.locator).not.toContainText('Error loading:');
});
