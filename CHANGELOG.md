# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-09-02

### Fixed

- Publish the OpenCode and OpenTUI runtime packages as production dependencies so the plugin can load after npm installation.

### Changed

- Rename the package to `@davidaayers/opencode-context-gauge-plugin`.
- Expose the plugin from the package root as well as the `./tui` export.
- Standardize package scripts and documentation on pnpm tooling.

## [0.1.0] - 2026-08-23

### Added

- Initial npm release of the OpenCode TUI context-window usage gauge.
- Live token usage, context-window percentage, and optional session cost display.
- Theme-aware warning and danger thresholds.
- Configuration for the label, bar width, thresholds, and cost visibility.
- Installation and source-loading documentation for OpenCode TUI plugins.
