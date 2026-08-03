// Fetch-based SSE client for the AI service's chat endpoints
// (single-vendor-ai's POST /api/v1/chat/customer and /chat/admin —
// ai-chatbot-plan.txt section 7). Not using the browser's native
// EventSource here because it can't send a POST body or a custom
// Authorization header, both of which these endpoints need.

export interface ChatTokenEvent {
  type: "token";
  content: string;
}

export interface ChatProduct {
  id: string;
  name: string;
  price: number;
  discountedPrice: number | null;
  stock: number;
  category: string | null;
  brand: string | null;
  product_url: string;
  image_url: string | null;
}

export interface ChatFinalEvent {
  type: "final";
  conversation_id: string;
  message_id: string;
  role: "assistant";
  content: string;
  tool_calls: unknown[];
  chart?: { type: string; data: unknown } | null;
  products?: ChatProduct[];
}

export type ChatEvent = ChatTokenEvent | ChatFinalEvent;

async function streamChat(
  endpoint: "customer" | "admin",
  message: string,
  conversationId: string | undefined,
  onEvent: (event: ChatEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/api/v1/chat/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ conversation_id: conversationId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    // SSE frames are separated by a blank line ("\n\n")
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data:")) continue;
      const jsonStr = line.slice("data:".length).trim();
      if (!jsonStr) continue;
      try {
        onEvent(JSON.parse(jsonStr) as ChatEvent);
      } catch {
        // malformed/partial frame — skip rather than crash the stream
      }
    }
  }
}

export function streamCustomerChat(
  message: string,
  conversationId: string | undefined,
  onEvent: (event: ChatEvent) => void,
  signal?: AbortSignal
) {
  return streamChat("customer", message, conversationId, onEvent, signal);
}

export function streamAdminChat(
  message: string,
  conversationId: string | undefined,
  onEvent: (event: ChatEvent) => void,
  signal?: AbortSignal
) {
  return streamChat("admin", message, conversationId, onEvent, signal);
}
