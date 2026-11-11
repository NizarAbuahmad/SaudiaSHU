// Visitor assistant for the «سماء الحرمين… مع السعودية» landing page.
// The page calls POST /.netlify/functions/assistant with the recent chat history.
// Needs the ANTHROPIC_API_KEY environment variable set in Netlify; without it the
// page falls back to its built-in answers.
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./assistant-kb.mjs";

const client = new Anthropic();
const MAX_TURNS = 12;
const MAX_CHARS = 1500;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "not_configured" }, 503);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // Keep only short, well-formed user/assistant text turns from the visitor's history.
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .slice(-MAX_TURNS)
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "bad_request" }, 400);
  }

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      output_config: { effort: "low" }, // short chat answers
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // re-run on a fallback model if a request is declined
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") return json({ reply: null });
    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
    return json({ reply: reply || null });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 429);
    if (error instanceof Anthropic.AuthenticationError) return json({ error: "not_configured" }, 503);
    if (error instanceof Anthropic.APIError) {
      console.error("Claude API error", error.status, error.message);
      return json({ error: "upstream" }, 502);
    }
    console.error(error);
    return json({ error: "server" }, 500);
  }
};
