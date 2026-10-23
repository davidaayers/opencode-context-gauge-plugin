import { test, expect } from "bun:test"
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { RGBA } from "@opentui/core"
import { testRender } from "@opentui/solid"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

test("packed npm entrypoint mounts and reacts using the host renderer", async () => {
  const directory = mkdtempSync(join(tmpdir(), "context-gauge-pack-"))
  let setup
  try {
    const packed = JSON.parse(execFileSync("npm", ["pack", "--json", "--pack-destination", directory], {
      cwd: import.meta.dir,
      encoding: "utf8",
    }))
    const consumer = join(directory, "consumer")
    execFileSync("npm", ["install", "--prefix", consumer, "--no-save", "--ignore-scripts", "--no-audit", "--no-fund", join(directory, packed[0].filename)])

    const installed = join(consumer, "node_modules", "@davidaayers", "opencode-context-gauge-plugin")
    const pkg = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"))
    expect(pkg.dependencies).toBeUndefined()
    expect(pkg.exports["./tui"]).toBe("./dist/tui.js")

    ensureRuntimePluginSupport()
    const plugin = (await import(join(installed, pkg.exports["./tui"]))).default
    let slot = () => undefined
    let output = 100
    const events = new Map()
    const color = RGBA.fromHex("#ffffff")
    const api = {
      options: {},
      ui: { slot: (entry) => { slot = entry.render; return () => { slot = () => undefined } } },
      theme: { text: { base: color, muted: color, action: { primary: { base: color } }, feedback: { warning: { base: color }, error: { base: color } } } },
      data: {
        listen: (callback) => { events.set("session", callback); return () => events.delete("session") },
        location: { model: { list: () => [{ id: "model", providerID: "test", limit: { context: 10_000 } }] } },
        session: {
          get: () => ({ model: { providerID: "test", id: "model" } }),
          message: { list: () => [{ type: "assistant", model: { providerID: "test", id: "model" }, tokens: { input: 100, output } }] },
        },
      },
      renderer: { requestRender: () => {} },
    }
    const cleanup = await plugin.setup(api)
    expect(plugin.id).toBe("context-gauge")
    setup = await testRender(() => slot({ sessionID: "test" }), { width: 50, height: 5 })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain("200 / 10k")

    output = 900
    events.get("session")?.({ details: { type: "session.usage.updated", data: { sessionID: "test" } } })
    await setup.renderOnce()
    expect(setup.captureCharFrame()).toContain("1k / 10k")
    cleanup()
    setup.renderer.destroy()
    setup = undefined
    expect(events.size).toBe(0)
  } finally {
    setup?.renderer.destroy()
    rmSync(directory, { recursive: true, force: true })
  }
})
