/** @jsxImportSource @opentui/solid */
import { createMemo, createSignal, onCleanup, Show } from "solid-js"
import { TextAttributes } from "@opentui/core"
import type { TuiPlugin, TuiPluginApi, TuiPluginModule, TuiState } from "@opencode-ai/plugin/tui"

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

function tokenTotal(tokens: unknown): number {
  const t = (tokens ?? {}) as {
    total?: unknown
    input?: unknown
    output?: unknown
    reasoning?: unknown
    cache?: { read?: unknown; write?: unknown }
  }
  const total = num(t.total)
  if (total > 0) return total
  return num(t.input) + num(t.output) + num(t.reasoning)
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

type Messages = ReturnType<TuiState["session"]["messages"]>

function lastAssistantWithTokens(messages: Messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role === "assistant" && tokenTotal(m.tokens) > 0) return m
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

  const offMessage = api.event.on("message.updated", refresh)
  const offSession = api.event.on("session.updated", refresh)
  onCleanup(() => {
    offMessage()
    offSession()
  })

  const session = createMemo(() => {
    revision()
    return api.state.session.get(props.sessionID)
  })
  const messages = createMemo(() => {
    revision()
    return api.state.session.messages(props.sessionID)
  })
  const latest = createMemo(() => lastAssistantWithTokens(messages()))

  const modelRef = createMemo(() => {
    const m = latest()
    if (m) return { providerID: m.providerID, modelID: m.modelID }
    const model = session()?.model
    return model ? { providerID: model.providerID, modelID: model.id } : undefined
  })

  const contextWindow = createMemo(() => {
    const ref = modelRef()
    if (!ref) return 0
    const provider = api.state.provider.find((p) => p.id === ref.providerID)
    return num(provider?.models?.[ref.modelID]?.limit?.context)
  })

  const usedTokens = createMemo(() => {
    const m = latest()
    if (m) return tokenTotal(m.tokens)
    return tokenTotal(session()?.tokens)
  })

  const cost = createMemo(() => {
    const aggregate = num(session()?.cost)
    if (aggregate > 0) return aggregate
    return messages().reduce((sum, m) => (m.role === "assistant" ? sum + num(m.cost) : sum), 0)
  })

  const percent = createMemo(() => {
    const window = contextWindow()
    return window > 0 ? (usedTokens() / window) * 100 : 0
  })

  const levelColor = () => {
    const t = api.theme.current
    const p = percent()
    if (p >= props.options.dangerAt) return t.error
    if (p >= props.options.warnAt) return t.warning
    return t.accent
  }

  const statsLine = () => {
    const base = `${compact(usedTokens())} / ${compact(contextWindow())}`
    if (!props.options.showCost || cost() <= 0) return base
    return `${base} · 💰 $${cost().toFixed(2)}`
  }

  const bar = () => gauge(percent() / 100, props.options.barWidth)

  return (
    <Show when={contextWindow() > 0}>
      <box flexDirection="column">
        <box flexDirection="row">
          <Show when={props.options.label}>
            <text fg={api.theme.current.text} attributes={TextAttributes.BOLD}>
              {`${props.options.label} `}
            </text>
          </Show>
          <text fg={levelColor()}>{bar().fill}</text>
          <text fg={api.theme.current.textMuted}>{bar().track}</text>
          <text fg={levelColor()}>{` ${percentLabel(percent())}`}</text>
        </box>
        <text fg={api.theme.current.textMuted}>{statsLine()}</text>
      </box>
    </Show>
  )
}

const tui: TuiPlugin = async (api, rawOptions) => {
  const options = resolveOptions(rawOptions)

  api.slots.register({
    order: 100,
    slots: {
      sidebar_content(_ctx, slotProps) {
        return <Gauge api={api} sessionID={slotProps.session_id} options={options} />
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "context-gauge",
  tui,
}

export default plugin
