# AGENTS.md

OpenCode **TUI-only** sidebar plugin (SolidJS/OpenTUI). Single authored plugin source: `src/tui.tsx`; npm publishes the generated `dist/tui.js` through the sole `./tui` export. Install/config/user-facing docs live in README.md.

## Commands

- `pnpm check` — Bun tests, TypeScript typecheck, and a packed-install render/update smoke test.
- `pnpm build` — Solid-transform the JSX source into `dist/tui.js` with host renderer imports external. `npm pack` and `npm publish` run this through `prepack`.
- `bun scratch-repro.tsx` — offscreen render harness: mounts JSX via `testRender()` from `@opentui/solid` with a fake api object, then prints captured frames via `setup.captureCharFrame()`. Use this pattern (in a scratch file) to verify rendering headlessly instead of restarting the real TUI. Scratch files are disposable and outside `src/`.
- Visual changes can't be observed by typecheck alone — render-capture or restart the OpenCode TUI to see them.

## Hard constraints

- Line 1 of any `.tsx` file must be `/** @jsxImportSource @opentui/solid */`. This is Solid, not React: use `solid-js` primitives (`createMemo`, `Show`), never React imports/hooks. `tsconfig.json` enforces the import source.
- The npm entrypoint must be Solid-transformed JS, not raw TSX or eager `jsxDEV` calls. Validate a packed install (import, mount, and signal update), not just local source; raw TSX injected an unresolvable `jsx-dev-runtime` in dependency-free npm installs.
- V2 module shape: default export `Plugin.define({ id, setup })` from `@opencode/plugin/tui`. Register views with `api.ui.slot`, read caches/events from `api.data`, and use `api.theme.text` tokens.
- This module is CLI-side only. Load it from the global `cli.json` `plugins` array, never the server configuration. V1 `tui.json` is not the V2 config.
- Direct local package loading did not activate on OpenCode 2.1.3 during live verification. The verified fallback is a global discovery wrapper re-exporting `dist/tui.js`; never combine it with a direct entry for the same plugin.
- Renderer dependencies are host-provided (`@opentui/core`, `@opentui/solid`, `solid-js`). Keep these and the runtime `@opencode/plugin` import in `devDependencies` and external to the build: a second renderer breaks the shared render context.

## Commits

- Conventional commit style ([conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)): `feat:`, `fix:`, `docs:`, `chore:` prefixes, imperative mood, concise subject line.

## Conventions

- Keep plugin logic in the single source file; `build.mjs` only generates the npm artifact. Local loading must use the compiled artifact, through the package directory or the verified discovery-wrapper fallback.
- All incoming option values are untrusted: validate types and clamp ranges (see `resolveOptions`). Follow this for any new option; invalid input falls back to defaults, never throws.
- Colors come only from V2 `api.theme.text` tokens (base/muted, primary action, warning/error feedback) — no hardcoded ANSI colors.
- Terminal width math counts emoji/wide glyphs as 2 cells; the sidebar slot is narrow (~30 cols), so account for that when touching layout or labels.
- TypeScript is strict with `verbatimModuleSyntax` — use `import type` for type-only imports.
