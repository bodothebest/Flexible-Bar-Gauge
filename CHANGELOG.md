# Changelog

## 0.2.0 - 2026-10-26

- Adopt the public ID `bodothebest-flexiblebargauge-panel` (different from the local prototype).
- License original plugin code under AGPL-3.0-only and include third-party notices.
- Migrate to the standard Grafana create-plugin 7.16.0 build configuration.
- Preserve original TypeScript/TSX in source maps and verify source correspondence before packaging.
- Update serialize-javascript to 7.1.4 throughout the dependency tree.
- Add a provisioned TestData dashboard and automated checks for the release artifacts.

## 0.1.1 - 2026-10-23

- Bundle the required @grafana/schema constants instead of requesting an unsupported shared module from Grafana.
- Add a regression check for AMD module dependencies.

## 0.1.0 - 2026-10-23

- Initial local prototype: horizontal gauges with configurable name width, position, alignment and overflow.
