// Optional compiler fallback for environments that cannot load native SWC.
// Normal builds use the generated swc-loader without this adapter.
const swc = require('@swc/wasm');
module.exports = function (source, inputSourceMap) {
  const options = this.getOptions();
  const result = swc.transformSync(source, {
    ...options,
    filename: this.resourcePath,
    sourceFileName: this.resourcePath,
    sourceMaps: this.sourceMap,
    ...(inputSourceMap
      ? { inputSourceMap: typeof inputSourceMap === 'string' ? inputSourceMap : JSON.stringify(inputSourceMap) }
      : {}),
  });
  this.callback(null, result.code, result.map ? JSON.parse(result.map) : undefined);
};
