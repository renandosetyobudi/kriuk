// api/ai.js
// Vercel Serverless Function — proxy AMAN ke OpenAI untuk "Asisten AI" SB FOOD.
//
// Endpoint  : POST /api/ai
// Body kirim: { "system": "...", "messages": [{ "role": "user"|"assistant", "content": "..." }] }
// Balasan   : { "content": [{ "type": "text", "text": "..." }], "text": "..." }
//             (sengaja dibuat mirip bentuk lama supaya aplikasi cukup ganti URL saja)
//
// API key TIDAK ada di sini — diambil dari Environment Variable di Vercel.

const MODEL = "gpt-4o-mini"; // murah & cukup pintar. Bisa diganti: "gpt-4o", "gpt-4.1-mini", dst.

export default async function handler(req, res) {
  // ---------- CORS ----------
  // Default "*" (semua origin). Untuk lebih aman, isi ALLOWED_ORIGIN dengan domain aplikasi Anda.
  const allowed = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-app-secret");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan metode POST" });

  // ---------- (Opsional) proteksi sederhana dari penyalahgunaan ----------
  // Jika Anda mengisi APP_SECRET di Vercel, aplikasi harus mengirim header x-app-secret yang sama.
  if (process.env.APP_SECRET && req.headers["x-app-secret"] !== process.env.APP_SECRET) {
    return res.status(401).json({ error: "Tidak diizinkan (secret salah)" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY belum diset di Environment Variables Vercel" });
    }

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Field 'messages' harus berupa array" });
    }

    // Susun pesan untuk OpenAI (system di depan, lalu percakapan)
    const oaMessages = [];
    if (system) oaMessages.push({ role: "system", content: String(system) });
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        oaMessages.push({ role: m.role, content: m.content });
      }
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 8000,
        messages: oaMessages,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("OpenAI error", r.status, detail); // muncul di Vercel → Logs
      return res.status(502).json({ error: "OpenAI menolak permintaan", status: r.status, detail });
    }

    const data = await r.json();
    const text =
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content
        : ""
      ).trim();

    return res.status(200).json({ content: [{ type: "text", text }], text });
  } catch (e) {
    return res.status(500).json({ error: "Kesalahan server", detail: String((e && e.message) || e) });
  }
}
