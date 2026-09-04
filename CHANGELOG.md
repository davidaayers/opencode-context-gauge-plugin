# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.3...v0.1.4) (2026-09-04)


### Fixed

* disable pnpm cache during npm publish ([dbaf3c1](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/dbaf3c1e31caa603065bb3d27bf87ca8325b0d2f))
* use authoritative context token totals ([c3a877d](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/c3a877dbc6344b919ff45121c9d2ff7b18b96f9f))

## [0.1.3](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.2...v0.1.3) (2026-09-03)


### Fixed

* allow release publish retries ([5055c2d](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/5055c2d4e96a58d37a01ccad02ecd5939dcf1f30))
* exclude cache tokens from context usage ([50f8c3d](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/50f8c3dd0b1e52069858a6c0bbe49a2860a5cb66))

## [0.1.2](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/0.1.1...v0.1.2) (2026-09-02)


### Fixed

* refresh context gauge on session updates ([24d162a](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/24d162adf2effc7355f4428b217756494d2e7edc))

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
