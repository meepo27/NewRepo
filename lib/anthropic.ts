import Anthropic from '@anthropic-ai/sdk';

// Singleton client — never instantiated on the client side (server-only module)
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ClaudeParseError extends Error {
  constructor(
    message: string,
    public readonly rawContent: string
  ) {
    super(message);
    this.name = 'ClaudeParseError';
  }
}

function stripMarkdownFences(text: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
}

export async function callClaude<T = unknown>(
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens: number
): Promise<T> {
  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new ClaudeParseError('No text block in Claude response', '');
  }

  const raw = block.text.trim();
  const cleaned = stripMarkdownFences(raw);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract the first {...} block as a fallback
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // fall through
      }
    }
    throw new ClaudeParseError(`Failed to parse Claude response as JSON`, raw);
  }
}
