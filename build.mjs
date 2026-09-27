import { readFileSync, rmSync } from "node:fs"
import { createSolidTransformPlugin } from "@opentui/solid/bun-plugin"

rmSync("dist", { recursive: true, force: true })

const result = await Bun.build({
  entrypoints: ["src/context-gauge.tsx"],
  outdir: "dist",
  naming: "tui.js",
  target: "bun",
  format: "esm",
  external: ["@opencode-ai/plugin", "@opentui/core", "@opentui/solid", "solid-js"],
  plugins: [createSolidTransformPlugin()],
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

const output = readFileSync("dist/tui.js", "utf8")
if (/jsxDEV|jsx-runtime/.test(output) || !/effect as _\$effect/.test(output) || !/insert as _\$insert/.test(output)) {
  throw new Error("TUI build must contain reactive Solid bindings, not eager JSX runtime calls")
}
