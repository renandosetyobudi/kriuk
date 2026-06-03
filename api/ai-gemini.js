// api/ai.js — versi GRATIS pakai Google Gemini.
// Limit gratisnya JAUH lebih besar dari Groq (cocok untuk data/daftar besar).
// Key gratis tanpa kartu: https://aistudio.google.com/apikey
// Output dibuat sama persis seperti versi lain, jadi aplikasi TIDAK perlu diubah.

const MODEL = "gemini-1.5-flash"; // gratis & cepat. Alternatif: "gemini-2.0-flash".

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST" });
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY belum diset di Vercel" });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages harus array" });

    // Gemini memakai role "user"/"model" + parts
    const contents = [];
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] });
      }
    }

    const body = { contents, generationConfig: { temperature: 0.3, maxOutputTokens: 4096 } };
    if (system) body.system_instruction = { parts: [{ text: String(system) }] };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error", r.status, detail); // muncul di Vercel → Logs
      return res.status(502).json({ error: "Gemini menolak permintaan", status: r.status, detail });
    }

    const data = await r.json();
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map(p => p.text || "").join("").trim();
    return res.status(200).json({ content: [{ type: "text", text }], text });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String((e && e.message) || e) });
  }
}
