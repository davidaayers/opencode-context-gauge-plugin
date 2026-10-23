# opencode-context-gauge-plugin

An [OpenCode](https://opencode.ai) TUI sidebar plugin that shows a live context-window usage gauge for the active session.

```
🧠 ████████▋░░░░░░░░░░░░ 43%
18.4k / 200k · 💰 $0.53
```

## Features

- **Context gauge** — eighth-block progress bar showing used tokens vs. the active model's context window
- **Token accounting** — cache-inclusive component total from the latest assistant response, falling back to session aggregates
- **Cost display** — session spend alongside token counts (optional)
- **Threshold colors** — bar turns warning/danger colored as you approach the window limit (theme-aware)
- **Configurable** — label, bar width, thresholds, cost visibility

## Install

Requires OpenCode **2.1.3 or newer**. Add the package to `~/.config/opencode/cli.json`:

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["@davidaayers/opencode-context-gauge-plugin"]
}
```

Restart OpenCode after installing. The gauge appears once the session has a completed assistant response. V1 releases do not run in V2.

> **Version 0.1.2 warning:** npm `0.1.2` can overstate context when cache counters are added to an already-aggregated total. Upgrade to the latest release for the fix.

The npm package ships a compiled TUI entrypoint that shares OpenCode's Solid/OpenTUI renderer.

### From source

Run `pnpm install && pnpm build`, then load the compiled entrypoint from the global **`~/.config/opencode/cli.json`**, not the server configuration:

```jsonc
// ~/.config/opencode/cli.json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": [
    "file:///absolute/path/to/opencode-context-gauge-plugin/dist/tui.js"
  ]
}
```

## Notes

OpenCode also ships a built-in context section in the sidebar. If you'd rather only see this one, press `ctrl+p` → **Plugins** and toggle the built-in context plugin off. The choice persists across restarts.

## Configuration

Pass options using the object form (package name or a `file://` path):

```jsonc
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": [
    {
      "package": "@davidaayers/opencode-context-gauge-plugin",
      "options": {
        "label": "Context",
        "barWidth": 20,
        "warnAt": 70,
        "dangerAt": 90,
        "showCost": true
      }
    }
  ]
}
```

| Option    | Type              | Default    | Description                                                        |
| --------- | ----------------- | ---------- | ------------------------------------------------------------------ |
| `label`   | `string \| false` | `"🧠"`     | Gauge label; set to `false` to hide                                |
| `barWidth`| `number`          | `20`       | Bar width in cells (clamped 4–60)                                  |
| `warnAt`  | `number`          | `70`       | Percent at which the bar switches to the warning color             |
| `dangerAt`| `number`          | `90`       | Percent at which the bar switches to the danger color (clamped > `warnAt`) |
| `showCost`| `boolean`         | `true`     | Show session cost after token counts                               |

## How It Works

- **Used tokens**: matches OpenCode's built-in context section: the most recent assistant message with output uses `input + output + reasoning + cache.read + cache.write`. Before any responses exist, session-level token/cost aggregates are used.
- **Context window**: resolved from the location's model catalog using the message's (or session's) model reference. The widget hides itself if no context limit is known.
- **Rendering**: SolidJS JSX via `@opentui/solid`, registered into V2's `sidebar.content` slot through `@opencode/plugin/tui`. Colors come from the active OpenCode theme.

## Development

```sh
pnpm install
pnpm check
pnpm build
```

Plugin logic lives in [`src/context-gauge.tsx`](src/context-gauge.tsx). `build.mjs` compiles its JSX to `dist/tui.js` for npm; `prepack` builds it automatically for publishing. From-source installs can still use the `.tsx` file directly.

## Roadmap

Cross-repository follow-up work is tracked in the [OpenCode Plugins project](https://github.com/users/davidaayers/projects/1).

## Releases

Releases are managed by [Release Please](https://github.com/googleapis/release-please) from Conventional Commit messages. Merging a Release Please pull request bumps the version, updates `CHANGELOG.md`, creates the GitHub release and tag, and publishes the package to npm.

See [CHANGELOG.md](CHANGELOG.md) for release history.

Before the first automated release, configure npm Trusted Publishing for `@davidaayers/opencode-context-gauge-plugin` with:

- GitHub organization or user: `davidaayers`
- Repository: `opencode-context-gauge-plugin`
- Workflow filename: `release-please.yml`
- Environment: leave empty

The `v0.1.1` baseline tag is already in place at commit `65f68a753babf7f12fe1618ff01ac14c20b5a77f`.

## Credits

Inspired by [streetturtle/opencode-better-sidebar](https://github.com/streetturtle/opencode-better-sidebar) — a great collection of OpenCode sidebar plugins; its `context-progress` plugin planted the seed for this one.

## License

[MIT](LICENSE) © 2026 David Ayers
