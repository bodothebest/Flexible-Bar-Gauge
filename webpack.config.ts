import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'node:path';
import standardConfig, { type Env } from './.config/webpack/webpack.config';

// Extend the generated pipeline with notices and an opt-in SWC WASM compiler.
export default async (env: Env) => {
  const config = await standardConfig(env);
  if (env.wasm) {
    for (const rule of config.module?.rules ?? []) {
      if (
        rule &&
        typeof rule === 'object' &&
        rule.use &&
        typeof rule.use === 'object' &&
        'loader' in rule.use &&
        rule.use.loader === 'swc-loader'
      ) {
        rule.use.loader = path.resolve('scripts/swc-wasm-loader.cjs');
      }
    }
  }
  config.plugins?.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: '../NOTICE', to: '.' },
        { from: '../licenses', to: 'licenses' },
      ],
    })
  );
  return config;
};
