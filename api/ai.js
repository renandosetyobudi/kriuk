// api/ai.js — versi GRATIS pakai Groq (API kompatibel OpenAI).
// Key gratis tanpa kartu kredit: https://console.groq.com/keys
// Output dibuat sama persis seperti versi sebelumnya, jadi aplikasi TIDAK perlu diubah.

const MODEL = "llama-3.3-70b-versatile"; // gratis & pintar. Alternatif lebih cepat: "llama-3.1-8b-instant".

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST" });
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY belum diset di Vercel" });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages harus array" });

    const chat = [];
    if (system) chat.push({ role: "system", content: String(system) });
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        chat.push({ role: m.role, content: m.content });
      }
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: MODEL, temperature: 0.3, max_tokens: 8000, messages: chat }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Groq error", r.status, detail); // muncul di Vercel → Logs
      return res.status(502).json({ error: "Groq menolak permintaan", status: r.status, detail });
    }

    const data = await r.json();
    const text = ((data.choices?.[0]?.message?.content) || "").trim();
    return res.status(200).json({ content: [{ type: "text", text }], text });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String(e?.message || e) });
  }
}
