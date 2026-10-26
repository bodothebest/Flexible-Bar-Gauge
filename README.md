# Flexible Bar Gauge

Display horizontal bar gauges with a name column that you control. Choose the column width, place names on either side, align them left, center or right, and decide how long names should be displayed.

## Features

- Name column width in pixels or as a percentage of the panel.
- Left/right name placement and left/center/right text alignment.
- Ellipsis, clipping or wrapping for long names, with the full name available on hover.
- Gradient, basic and retro LCD gauges, with colored, neutral or hidden values.
- Grafana field settings for units, decimals, thresholds, value mappings and overrides.
- Calculated values or individual rows, field filtering and data links on bars.
- Horizontal scrolling when a fixed name column leaves too little room for the gauge, and vertical scrolling for long lists.

## Getting started

Add a visualization, select your data source and choose **Flexible Bar Gauge**. In **Names**, set the position, width unit, column width, alignment and long-name behavior. In **Bars**, configure the bar style and sizing. In **Values**, select calculations or individual values.

For percentage widths, enter a number such as `30` for 30%; the maximum is 80%. A pixel width is preserved when resizing the panel, so narrow panels may scroll horizontally. Wrapped names increase their row height while the bar remains vertically centered.

For comparable bar lengths, set a shared minimum and maximum in Grafana's standard field options. The included example dashboard uses TestData and needs no external service or credentials.

## Scope

This panel focuses on horizontal gauges with explicitly controlled name columns. It does not currently provide vertical gauges, a separate legend, automatic migration from the built-in Bar Gauge, or virtualized rows. Up to 5,000 individual values can be requested; choose a smaller limit for large data sets. Click the bar or value to open data links.

The panel uses the public `BarGauge` component from the Grafana UI library. It does not import or embed the built-in Bar Gauge panel plugin.

## Compatibility and installation

The minimum supported Grafana version is 13.0.2. The current manifest permits Grafana 13.x; later releases should be tested before upgrading production. This is a candidate for community review and is not yet published in the Grafana catalog.

The public plugin ID is `bodothebest-flexiblebargauge-panel`. It is distinct from the early local prototype `local-flexiblebargauge-panel`. Existing dashboards using the prototype must select the new visualization explicitly and reapply the desired options.

## Development and feedback

See DEVELOPMENT.md in the source repository for the build, test, example dashboard and packaging workflow. Report defects with the plugin version, Grafana version, reproduction steps and a small anonymized example. Never include credentials or access tokens.

## License and credits

Original plugin code: **AGPL-3.0-only**. See LICENSE. Dependencies retain their respective licenses; see NOTICE and the licenses directory. Grafana UI components and data utilities are provided by Grafana Labs. This project is independently maintained and is not endorsed by Grafana Labs.
