# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v1.0.1...v1.0.2) (2026-10-24)


### Fixed

* align gauge row with usage plugin layouts ([a6bbf8a](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/a6bbf8a57567b4c4fa7fe02bdcf514ba48b04023))

## [1.0.1](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v1.0.0...v1.0.1) (2026-10-23)


### Fixed

* prepend sidebar gauge and collapse hidden content ([a6f731b](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/a6f731b0040d626b2c4b57c7d4e914576893f789))
* prepend sidebar gauge and collapse hidden content ([b790e25](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/b790e25abc5200532797ff98cd49b6605563221f))
* restore automatic release version increments ([#16](https://github.com/davidaayers/opencode-context-gauge-plugin/issues/16)) ([1365132](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/13651326b69af940b449a51e0f26d1861772d100))

## [1.0.0](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.8...v1.0.0) (2026-10-23)


### Added

* migrate the TUI plugin to OpenCode v2 ([bb7d182](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/bb7d182f05438b3fce409535f9641d4fa15c704a))


### Fixed

* support direct local TUI directory loading ([c7f63bc](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/c7f63bc2129420d9ce4181737fdc88bd78fb134b))


### Changed

* adopt canonical TUI package template ([b0a96d7](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/b0a96d7b472f0b131078efb5e7ddeaf8ae8779b4))

## [Unreleased]

### Breaking Changes

- Prepare 1.0.0 for OpenCode 2.x only (minimum 2.1.3; OpenCode 3.x is not supported).
- Replace the V1 plugin API and configuration with `Plugin.define` and global `cli.json` loading.
- OpenCode 1.x users must pin `@davidaayers/opencode-context-gauge-plugin@0.1.8`, the last V1 release.

### Changed

- Standardize the Solid-transformed `src/tui.tsx` build, host-provided runtimes, packed verification, and generated local-directory entry.

## [0.1.8](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.7...v0.1.8) (2026-09-27)


### Fixed

* load JSX runtime from host in npm plugin ([da50da5](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/da50da5aa2e41f326e819a1d36079617e649c4ef))
* publish Solid-transformed TUI plugin ([e353741](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/e353741825bb1077ab6fcd91d1effa92b13f54b7))

## [0.1.7](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.6...v0.1.7) (2026-09-27)


### Fixed

* use host-provided TUI renderer for npm installs ([cd195e5](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/cd195e5eb665121bd12ac48b35ee4bb35b6d8d4f))

## [0.1.6](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.5...v0.1.6) (2026-09-26)


### Fixed

* finalize merged releases from pull request events ([8517b70](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/8517b7092fa009fe55beb9af63864892b8c549a5))
* keep context token calculations in the published plugin ([31f5c91](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/31f5c91f5e242713c6b11d23b65188757ad58a71))

## [0.1.5](https://github.com/davidaayers/opencode-context-gauge-plugin/compare/v0.1.4...v0.1.5) (2026-09-14)


### Fixed

* finish release please bootstrap ([5e2f213](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/5e2f2136fde85e8cf67b88482732d046d7648337))
* match built-in context measurement ([006bf63](https://github.com/davidaayers/opencode-context-gauge-plugin/commit/006bf63320bc0cfd7fb979b3a4bcad70e26d941f))

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
