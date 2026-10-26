const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { zipSync } = require('fflate');
require('../checks/source-maps.cjs');
const root = path.resolve(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(root, 'dist/plugin.json'), 'utf8'));
const prefix = `${meta.id}-${meta.info.version}`;
const artifacts = path.join(root, 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });

function collect(directory, prefix, result) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {collect(filename, relative, result);}
    else if (entry.isFile()) {result[relative] = fs.readFileSync(filename);}
  }
}
const binary = {};
collect(path.join(root, 'dist'), meta.id, binary);
for (const required of [
  'LICENSE',
  'NOTICE',
  'CHANGELOG.md',
  'README.md',
  'module.js',
  'module.js.map',
  'plugin.json',
]) {
  if (!binary[`${meta.id}/${required}`]) {throw Error(`Missing release file: ${required}`);}
}
if (meta.info.screenshots.length === 0) {throw Error('Add a real Grafana screenshot before packaging.');}
for (const screenshot of meta.info.screenshots) {
  if (!binary[`${meta.id}/${screenshot.path}`]) {throw Error(`Missing screenshot: ${screenshot.path}`);}
}
const source = {};
for (const dir of ['.config', '.github', 'src', 'checks', 'tests', 'scripts', 'provisioning', 'licenses']) {
  collect(path.join(root, dir), `${meta.id}/${dir}`, source);
}
for (const name of [
  'package.json',
  'package-lock.json',
  'README.md',
  'LICENSE',
  'NOTICE',
  'CHANGELOG.md',
  'DEVELOPMENT.md',
  'tsconfig.json',
  'webpack.config.ts',
  'docker-compose.yaml',
  'playwright.config.ts',
  'jest.config.js',
  'jest-setup.js',
  'eslint.config.mjs',
  '.gitignore',
  '.gitattributes',
  '.cprc.json',
  '.prettierrc.js',
  '.nvmrc',
  '.npmrc',
]) {
  const file = path.join(root, name);
  if (fs.existsSync(file)) {source[`${meta.id}/${name}`] = fs.readFileSync(file);}
}
const files = [
  [`${prefix}.zip`, binary],
  [`${prefix}-source.zip`, source],
];
const checksums = [];
for (const [name, entries] of files) {
  const bytes = zipSync(entries, { level: 9 });
  fs.writeFileSync(path.join(artifacts, name), bytes);
  for (const alg of ['sha1', 'sha256'])
    {checksums.push(`${alg.toUpperCase()} ${crypto.createHash(alg).update(bytes).digest('hex')} ${name}`);}
}
fs.writeFileSync(path.join(artifacts, `${prefix}-checksums.txt`), checksums.join('\n') + '\n');
console.log(checksums.join('\n'));
