/** @jsxImportSource @opentui/solid */
import { createMemo, createSignal, onCleanup, Show } from "solid-js"
import { TextAttributes } from "@opentui/core"
import { Plugin } from "@opencode/plugin/tui"
import type { Context as TuiPluginApi } from "@opencode/plugin/tui/context"

type GaugeOptions = {
  label?: string | false
  barWidth?: number
  warnAt?: number
  dangerAt?: number
  showCost?: boolean
}

type Resolved = {
  label: string
  barWidth: number
  warnAt: number
  dangerAt: number
  showCost: boolean
}

const DEFAULTS: Resolved = {
  label: "🧠",
  barWidth: 20,
  warnAt: 70,
  dangerAt: 90,
  showCost: true,
}

const EIGHTHS = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉"]

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

type Tokens = {
  input?: unknown
  output?: unknown
  reasoning?: unknown
  cache?: { read?: unknown; write?: unknown }
}

export function tokenTotal(tokens: unknown): number {
  const t = (tokens ?? {}) as Tokens
  return num(t.input) + num(t.output) + num(t.reasoning) + num(t.cache?.read) + num(t.cache?.write)
}

function compact(value: number): string {
  if (value < 1000) return String(Math.round(value))
  const scaled = (divisor: number, unit: string, decimals: number) => {
    let s = (value / divisor).toFixed(decimals)
    if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "")
    return s + unit
  }
  if (value < 1_000_000) return scaled(1000, "k", value < 10_000 ? 1 : 0)
  return scaled(1_000_000, "M", value < 10_000_000 ? 2 : 1)
}

function gauge(fraction: number, width: number): { fill: string; track: string } {
  const cells = clamp(fraction, 0, 1) * width
  let full = Math.floor(cells)
  let partial = EIGHTHS[Math.round((cells - full) * 8)] ?? ""
  if (partial === EIGHTHS[8]) {
    full += 1
    partial = ""
  }
  return {
    fill: "█".repeat(full) + partial,
    track: "░".repeat(width - full - (partial ? 1 : 0)),
  }
}

function percentLabel(percent: number): string {
  if (percent <= 0) return "0%"
  if (percent < 1) return "<1%"
  return `${Math.round(clamp(percent, 0, 100))}%`
}

function resolveOptions(raw: unknown): Resolved {
  const o = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>
  const width = typeof o.barWidth === "number" && Number.isFinite(o.barWidth) ? clamp(Math.round(o.barWidth), 4, 60) : DEFAULTS.barWidth
  const warnAt = typeof o.warnAt === "number" && Number.isFinite(o.warnAt) ? clamp(o.warnAt, 1, 99) : DEFAULTS.warnAt
  const dangerRaw = typeof o.dangerAt === "number" && Number.isFinite(o.dangerAt) ? o.dangerAt : DEFAULTS.dangerAt
  return {
    label: o.label === false ? "" : typeof o.label === "string" && o.label.trim() ? o.label.trim() : DEFAULTS.label,
    barWidth: width,
    warnAt,
    dangerAt: clamp(dangerRaw, warnAt + 1, 100),
    showCost: o.showCost === false ? false : DEFAULTS.showCost,
  }
}

export function lastAssistantWithTokens<T extends { type: string; tokens?: unknown }>(
  messages: readonly T[],
): Extract<T, { type: "assistant" }> | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.type === "assistant" && num((message.tokens as Tokens | undefined)?.output) > 0) {
      return message as Extract<T, { type: "assistant" }>
    }
  }
  return undefined
}

function Gauge(props: { api: TuiPluginApi; sessionID: string; options: Resolved }) {
  const api = props.api
  const [revision, setRevision] = createSignal(0)

  const refresh = () => {
    setRevision((current) => current + 1)
    api.renderer.requestRender()
  }

  const offSession = api.data.listen(({ details }) => {
    if ("sessionID" in details.data && details.data.sessionID === props.sessionID) refresh()
  })
  onCleanup(() => {
    offSession()
  })

  const session = createMemo(() => {
    revision()
    return api.data.session.get(props.sessionID)
  })
  const messages = createMemo(() => {
    revision()
    return api.data.session.message.list(props.sessionID)
  })
  const latest = createMemo(() => lastAssistantWithTokens(messages()))

  const modelRef = createMemo(() => {
    const m = latest()
    if (m) return { providerID: m.model.providerID, modelID: m.model.id }
    const model = session()?.model
    return model ? { providerID: model.providerID, modelID: model.id } : undefined
  })

  const contextWindow = createMemo(() => {
    const ref = modelRef()
    if (!ref) return 0
    const model = api.data.location.model.list(session()?.location)?.find((m) => m.providerID === ref.providerID && m.id === ref.modelID)
    return num(model?.limit.context)
  })

  const usedTokens = createMemo(() => {
    const m = latest()
    if (m) return tokenTotal(m.tokens)
    return tokenTotal(session()?.tokens)
  })

  const cost = createMemo(() => {
    const aggregate = num(session()?.cost)
    if (aggregate > 0) return aggregate
    return messages().reduce((sum, m) => (m.type === "assistant" ? sum + num(m.cost) : sum), 0)
  })

  const percent = createMemo(() => {
    const window = contextWindow()
    return window > 0 ? (usedTokens() / window) * 100 : 0
  })

  const levelColor = () => {
    const t = api.theme
    const p = percent()
    if (p >= props.options.dangerAt) return t.text.feedback.error.base
    if (p >= props.options.warnAt) return t.text.feedback.warning.base
    return t.text.action.primary.base
  }

  const statsLine = () => {
    const base = `${compact(usedTokens())} / ${compact(contextWindow())}`
    if (!props.options.showCost || cost() <= 0) return base
    return `${base} · 💰 $${cost().toFixed(2)}`
  }

  const bar = () => gauge(percent() / 100, props.options.barWidth)

  return (
    <Show when={contextWindow() > 0} fallback={<box />}>
      <box flexDirection="column">
        <box flexDirection="row">
          <Show when={props.options.label} fallback={<box />}>
            <text fg={api.theme.text.base} attributes={TextAttributes.BOLD}>
              {`${props.options.label} `}
            </text>
          </Show>
          <text fg={levelColor()}>{bar().fill}</text>
          <text fg={api.theme.text.muted}>{bar().track}</text>
          <text fg={levelColor()}>{` ${percentLabel(percent())}`}</text>
        </box>
        <text fg={api.theme.text.muted}>{statsLine()}</text>
      </box>
    </Show>
  )
}

export default Plugin.define({
  id: "context-gauge",
  setup(api) {
    const options = resolveOptions(api.options)
    return api.ui.slot({
      append: "sidebar.content",
      render: (props) => <Gauge api={api} sessionID={props.sessionID} options={options} />,
    })
  },
})
