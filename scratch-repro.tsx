/** @jsxImportSource @opentui/solid */
import { RGBA, TextAttributes } from "@opentui/core"
import { testRender } from "@opentui/solid"
import { Show } from "solid-js"

const theme = {
  accent: RGBA.fromHex("#ff00ff"),
  warning: RGBA.fromHex("#ff9900"),
  error: RGBA.fromHex("#ff0000"),
  text: RGBA.fromHex("#e6e6e6"),
  textMuted: RGBA.fromHex("#808080"),
}

function fakeApi() {
  return {
    theme: { current: theme },
    state: {
      session: {
        get: () => ({ cost: 1.24 }),
        messages: () => [] as any[],
      },
      provider: [],
    },
  } as any
}

function GaugeCurrent(props: { label?: boolean }) {
  const api = fakeApi()
  const pct = 9
  return (
    <Show when={true}>
      <box flexDirection="column">
        <box flexDirection="row">
          <Show when={props.label !== false}>
            <text fg={api.theme.current.text} attributes={TextAttributes.BOLD}>{`Context `}</text>
          </Show>
          <text fg={levelColor()}>{`██`}</text>
          <text fg={api.theme.current.textMuted}>{`░░░░░░░░░░░░░░░░░░`}</text>
          <text fg={levelColor()}>{` ${pct}%`}</text>
        </box>
        <text fg={api.theme.current.textMuted}>{`89k / 1M`}</text>
      </box>
    </Show>
  )
  function levelColor() {
    return api.theme.current.accent
  }
}

function McpSection() {
  return (
    <box>
      <box flexDirection="row" gap={1}>
        <text fg={theme.text} attributes={TextAttributes.BOLD}>{`MCP`}</text>
      </box>
      <box flexDirection="row" gap={1}>
        <text fg={theme.accent}>{`•`}</text>
        <text fg={theme.text}>{`vestige Connected`}</text>
      </box>
    </box>
  )
}

function LspSection() {
  return (
    <box>
      <text fg={theme.text} attributes={TextAttributes.BOLD}>{`LSP`}</text>
      <text fg={theme.textMuted}>{`LSPs will activate as files are read`}</text>
    </box>
  )
}

async function main() {
  const setup = await testRender(
    () => (
      <box gap={1} paddingLeft={2} paddingTop={1} width={44}>
        <box paddingRight={1}>
          <text fg={theme.text} attributes={TextAttributes.BOLD}>{`Building opencode TUI sidebar plugin from scratch`}</text>
        </box>
        <GaugeCurrent />
        <McpSection />
        <LspSection />
      </box>
    ),
    { width: 46, height: 14 },
  )
  await setup.renderOnce()
  console.log("=== variant A: outer column box ===")
  console.log(setup.captureCharFrame())
  setup.renderer.destroy()
}
main()
