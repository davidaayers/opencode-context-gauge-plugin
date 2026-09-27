# AGENTS.md

OpenCode **TUI-only** sidebar plugin (SolidJS/OpenTUI). Single authored plugin source: `src/context-gauge.tsx`; npm publishes the generated `dist/tui.js`. Install/config/user-facing docs live in README.md.

## Commands

- `pnpm check` — Bun tests, TypeScript typecheck, and a packed-install render/update smoke test.
- `pnpm build` — Solid-transform the JSX source into `dist/tui.js` with host renderer imports external. `npm pack` and `npm publish` run this through `prepack`.
- `bun scratch-repro.tsx` — offscreen render harness: mounts JSX via `testRender()` from `@opentui/solid` with a fake api object, then prints captured frames via `setup.captureCharFrame()`. Use this pattern (in a scratch file) to verify rendering headlessly instead of restarting the real TUI. Scratch files are disposable and outside `src/`.
- Visual changes can't be observed by typecheck alone — render-capture or restart the OpenCode TUI to see them.

## Hard constraints

- Line 1 of any `.tsx` file must be `/** @jsxImportSource @opentui/solid */`. This is Solid, not React: use `solid-js` primitives (`createMemo`, `Show`), never React imports/hooks. `tsconfig.json` enforces the import source.
- The npm entrypoint must be Solid-transformed JS, not raw TSX or eager `jsxDEV` calls. Validate a packed install (import, mount, and signal update), not just local source; raw TSX injected an unresolvable `jsx-dev-runtime` in dependency-free npm installs.
- Module shape: default export `{ id, tui }` satisfying `TuiPluginModule`. The `id` belongs ONLY on the module export — the object passed to `api.slots.register()` forbids `id` (`id?: never`) and will fail typecheck if included.
- This module is TUI-side only. It must never be listed in `opencode.jsonc`'s `plugin` array (the server will throw on it); it loads exclusively from `tui.json`.
- Renderer dependencies are host-provided and resolved at plugin-load time (`@opentui/core`, `@opentui/solid`, `solid-js`, `@opencode-ai/plugin`). Keep these in `devDependencies` only and external to the build: installing or bundling a second OpenTUI renderer breaks the shared render context (`No renderer found`).

## Commits

- Conventional commit style ([conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)): `feat:`, `fix:`, `docs:`, `chore:` prefixes, imperative mood, concise subject line.

## Conventions

- Keep plugin logic in the single source file; `build.mjs` only generates the npm artifact. The source remains installable via one `file://` path.
- All incoming option values are untrusted: validate types and clamp ranges (see `resolveOptions`). Follow this for any new option; invalid input falls back to defaults, never throws.
- Colors come only from theme tokens via `api.theme.current` (`accent`, `warning`, `error`, `text`, `textMuted`) — no hardcoded ANSI colors.
- Terminal width math counts emoji/wide glyphs as 2 cells; the sidebar slot is narrow (~30 cols), so account for that when touching layout or labels.
- TypeScript is strict with `verbatimModuleSyntax` — use `import type` for type-only imports.
