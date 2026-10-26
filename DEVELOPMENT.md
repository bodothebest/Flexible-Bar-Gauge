# Development and review

Use Node.js 24.15 or newer and npm. Grafana's development tooling officially supports Linux, macOS and Windows through WSL. The `.config` directory was generated with `@grafana/create-plugin` 7.16.0; preserve it in source archives and Git. The root Webpack extension copies third-party notices and provides an optional WebAssembly compiler fallback.

In an environment that cannot load SWC's native binding, use `npm run build -- --env wasm`. This opt-in extension uses the same SWC version through WebAssembly and preserves the generated Webpack configuration, source maps and release metadata. The default build still uses Grafana's generated swc-loader. The local candidate was built with this fallback because the native compiler cache could not be accessed.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:bundle
npm run package
```

The packaging command creates matching compiled and source ZIPs in `artifacts/`, plus SHA1 and SHA256 checksums. Do not edit the source between building and packaging: the source-map check will reject a mismatch. Both archives must correspond to the same release tag. Do not omit hidden development files such as `.config` from the SOURCE archive. The compiled archive contains only distribution files.

## Local Grafana

```sh
docker compose up --build
```

Open Grafana at http://localhost:3000 and the provisioned **Flexible Bar Gauge examples** dashboard. TestData provides deterministic values without another service. `GRAFANA_VERSION` selects the Grafana image version (default 13.0.2). Use `npm run dev` during development.

After installing Playwright's Chromium, run `npm run e2e`. For another test server, set `GRAFANA_URL`. Never run provisioning against a production Grafana instance.

## Catalog review

The first public submission is unsigned. Grafana must review the plugin and assign a signature level before public signing is available. A private signature with root URLs is not a substitute for catalog approval. Keep the signing token outside the source tree and chat; after approval use the `GRAFANA_ACCESS_POLICY_TOKEN` environment variable or a repository secret.

Create a public Git repository, add its real source/support/license URLs to `src/plugin.json`, and publish the exact source tag and compiled ZIP with the generated checksums. The repository and screenshots must be publicly accessible. Supply the included TestData dashboard as testing guidance.

Run Grafana's full validator on the compiled archive and the matching source directory:

```sh
docker run --rm --pull=always \
  -v "$PWD/artifacts/bodothebest-flexiblebargauge-panel-0.2.0.zip:/archive.zip:ro" \
  -v "$PWD:/source_code:ro" \
  grafana/plugin-validator-cli -sourceCodeUri file:///source_code /archive.zip
```

The local structural checks do not replace Grafana's validator, dependency scanning or manual catalog review. Review the actual archive before submitting or signing it. Do not modify distribution files after signing.

## Why this panel exists

Reviewers should evaluate the explicit shared name-column width (pixels/percentage), independent text alignment, right-side placement and wrapping/truncation behavior. The plugin composes public SDK components, without copying or embedding the core panel. Nevertheless, Grafana's policy allows rejection of duplicate or derivative plugins: approval is not guaranteed, and contributing the feature upstream is an alternative.

## References

- https://grafana.com/legal/plugins/
- https://grafana.com/developers/plugin-tools/publish-a-plugin/
- https://grafana.com/developers/plugin-tools/publish-a-plugin/sign-a-plugin
- https://github.com/grafana/plugin-validator

## Installing the unsigned review candidate

Extract the compiled ZIP into Grafana's configured plugins directory. The archive already contains the `bodothebest-flexiblebargauge-panel` directory. Add this ID to the existing comma-separated setting in grafana.ini:

```ini
[plugins]
allow_loading_unsigned_plugins = bodothebest-flexiblebargauge-panel
```

Restart Grafana after installing or replacing the plugin, or changing plugin.json. For a server that also uses other unsigned plugins, preserve their IDs in this setting. Existing dashboards using `local-flexiblebargauge-panel` continue to reference that older ID until you explicitly select the new visualization.

## Local verification limits

The candidate was rendered on Grafana 13.0.2 and checked for name widths, alignment, wrapping, LCD rendering and loading errors. Type checking, layout tests, AMD loading, source-map comparisons and the native Grafana validator 0.51.3 were run. The automated Playwright suite and GitHub workflows have not been run in this environment.

The native validator does not provide the same coverage as the Docker image when external analyzers are absent. Semgrep and ClamAV were unavailable locally; no LLM review was configured. The plugin has no Go backend. Repeat the Docker validation before submission. The separate npm audit reports zero high/critical issues and five moderate dependency entries; this is not a claim that all dependencies are vulnerability-free.

The tag workflow builds unsigned candidate ZIPs as GitHub Actions artifacts. It does not publish a release or submit to Grafana. After the public repository exists, add its actual links to plugin.json and rebuild both ZIPs and their checksums.
