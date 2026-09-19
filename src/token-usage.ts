type Tokens = {
  input?: unknown
  output?: unknown
  reasoning?: unknown
  cache?: { read?: unknown; write?: unknown }
}

type AssistantMessage = {
  role: string
  tokens?: unknown
}

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0
}

export function tokenTotal(tokens: unknown): number {
  const t = (tokens ?? {}) as Tokens
  return num(t.input) + num(t.output) + num(t.reasoning) + num(t.cache?.read) + num(t.cache?.write)
}

export function lastAssistantWithTokens<T extends AssistantMessage>(
  messages: readonly T[],
): Extract<T, { role: "assistant" }> | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.role === "assistant" && num((message.tokens as Tokens | undefined)?.output) > 0) {
      return message as Extract<T, { role: "assistant" }>
    }
  }
  return undefined
}
