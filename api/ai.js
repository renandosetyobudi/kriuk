// api/ai.js — backend OpenAI (satu domain dengan aplikasi, tanpa CORS)
const MODEL = "gpt-4o-mini"; // bisa diganti: "gpt-4o", dll.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST" });
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY belum diset di Vercel" });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages harus array" });

    const oaMessages = [];
    if (system) oaMessages.push({ role: "system", content: String(system) });
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        oaMessages.push({ role: m.role, content: m.content });
      }
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: MODEL, temperature: 0.3, max_tokens: 1000, messages: oaMessages }),
    });
    if (!r.ok) return res.status(502).json({ error: "OpenAI error", detail: await r.text() });

    const data = await r.json();
    const text = ((data.choices?.[0]?.message?.content) || "").trim();
    return res.status(200).json({ content: [{ type: "text", text }], text });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e?.message || e) });
  }
}
