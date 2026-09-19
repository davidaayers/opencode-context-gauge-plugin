import { describe, expect, test } from "bun:test"
import { lastAssistantWithTokens, tokenTotal } from "./token-usage"

describe("context token usage", () => {
  test("matches OpenCode's built-in cache-inclusive total", () => {
    expect(
      tokenTotal({
        input: 629,
        output: 79,
        reasoning: 0,
        cache: { read: 168448, write: 11 },
      }),
    ).toBe(169167)
  })

  test("uses the latest completed assistant message", () => {
    const messages = [
      { role: "assistant", tokens: { input: 100, output: 20, cache: { read: 1000, write: 0 } } },
      { role: "assistant", tokens: { input: 900, output: 0, cache: { read: 9000, write: 0 } } },
      { role: "assistant", tokens: { input: 200, output: 30, cache: { read: 2000, write: 0 } } },
    ] as const

    expect(lastAssistantWithTokens(messages)).toBe(messages[2])
    expect(tokenTotal(lastAssistantWithTokens(messages)?.tokens)).toBe(2230)
  })
})
