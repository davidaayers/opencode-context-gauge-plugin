# AGENTS.md

OpenCode **TUI-only** sidebar plugin (SolidJS/OpenTUI). Single deliverable: `src/context-gauge.tsx`. Install/config/user-facing docs live in README.md.

## Commands

- `bun run typecheck` — the only check (`tsc --noEmit`). No test runner or linter is configured.
- `bun scratch-repro.tsx` — offscreen render harness: mounts JSX via `testRender()` from `@opentui/solid` with a fake api object, then prints captured frames via `setup.captureCharFrame()`. Use this pattern (in a scratch file) to verify rendering headlessly instead of restarting the real TUI. Scratch files are disposable and outside `src/`.
- Visual changes can't be observed by typecheck alone — render-capture or restart the OpenCode TUI to see them.

## Hard constraints

- Line 1 of any `.tsx` file must be `/** @jsxImportSource @opentui/solid */`. This is Solid, not React: use `solid-js` primitives (`createMemo`, `Show`), never React imports/hooks. `tsconfig.json` enforces the import source.
- Module shape: default export `{ id, tui }` satisfying `TuiPluginModule`. The `id` belongs ONLY on the module export — the object passed to `api.slots.register()` forbids `id` (`id?: never`) and will fail typecheck if included.
- This module is TUI-side only. It must never be listed in `opencode.jsonc`'s `plugin` array (the server will throw on it); it loads exclusively from `tui.json`.
- Dependencies are host-provided and resolved at plugin-load time (`@opentui/core`, `@opentui/solid`, `solid-js`, `@opencode-ai/plugin`). Keep the runtime dependency surface empty/minimal — there is no bundler.

## Conventions

- Keep everything in the single source file; it exists so installation stays one `file://` path. Split only if it becomes unmanageable, and say so.
- All incoming option values are untrusted: validate types and clamp ranges (see `resolveOptions`). Follow this for any new option; invalid input falls back to defaults, never throws.
- Colors come only from theme tokens via `api.theme.current` (`accent`, `warning`, `error`, `text`, `textMuted`) — no hardcoded ANSI colors.
- Terminal width math counts emoji/wide glyphs as 2 cells; the sidebar slot is narrow (~30 cols), so account for that when touching layout or labels.
- TypeScript is strict with `verbatimModuleSyntax` — use `import type` for type-only imports.
