// api/ai.js — versi GRATIS pakai Google Gemini, OTOMATIS memilih model Flash TERBARU.
// Key gratis tanpa kartu: https://aistudio.google.com/apikey
// Output dibuat sama persis seperti versi lain → aplikasi TIDAK perlu diubah.
//
// Cara kerja model:
//  - Default: cari sendiri model Flash terbaru yang didukung akunmu (mis. gemini-3.5-flash),
//    fallback ke "gemini-2.5-flash" bila pencarian gagal.
//  - Bila balasan 404 (model dipensiunkan/ganti nama), ia cari ulang otomatis lalu coba lagi.
//  - Mau kunci model tertentu? Set env GEMINI_MODEL (mis. gemini-3.5-flash) di Vercel.

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const FALLBACK_MODEL = "gemini-2.5-flash";
let cachedModel = null;

// Skor model: stabil > versi lebih baru > "flash" murni (bukan lite)
function scoreModel(name) {
  const m = name.match(/gemini-(\d+(?:\.\d+)?)/i);
  const ver = m ? parseFloat(m[1]) : 0;
  const stable = /preview|exp/i.test(name) ? 0 : 1;
  const plainFlash = /flash$/i.test(name) ? 1 : 0;
  return stable * 1000 + ver * 10 + plainFlash;
}

async function discoverModel(apiKey) {
  try {
    const r = await fetch(`${BASE}/models?key=${apiKey}`);
    if (!r.ok) return null;
    const data = await r.json();
    const usable = (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map(m => String(m.name || "").replace(/^models\//, ""))
      .filter(n => /flash/i.test(n) && !/(image|vision|tts|audio|live|embedding|thinking)/i.test(n));
    if (!usable.length) return null;
    usable.sort((a, b) => scoreModel(b) - scoreModel(a));
    return usable[0];
  } catch (_) {
    return null;
  }
}

async function resolveModel(apiKey) {
  if (process.env.GEMINI_MODEL) return process.env.GEMINI_MODEL;
  if (cachedModel) return cachedModel;
  cachedModel = (await discoverModel(apiKey)) || FALLBACK_MODEL;
  return cachedModel;
}

async function callGemini(apiKey, model, body) {
  return fetch(`${BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST" });
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY belum diset di Vercel" });

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages harus array" });

    const contents = [];
    for (const m of messages) {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
        contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] });
      }
    }

    const body = { contents, generationConfig: { temperature: 0.3, maxOutputTokens: 4096 } };
    if (system) body.system_instruction = { parts: [{ text: String(system) }] };

    let model = await resolveModel(apiKey);
    let r = await callGemini(apiKey, model, body);

    // Model dipensiunkan / nama berubah → cari ulang lalu coba sekali lagi
    if (r.status === 404) {
      cachedModel = null;
      const found = await discoverModel(apiKey);
      if (found && found !== model) {
        model = found;
        cachedModel = found;
        r = await callGemini(apiKey, model, body);
      }
    }

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error", r.status, "model:", model, detail); // muncul di Vercel → Logs
      return res.status(502).json({ error: "Gemini menolak permintaan", status: r.status, detail });
    }

    cachedModel = model; // ingat model yang berhasil
    const data = await r.json();
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map(p => p.text || "").join("").trim();
    return res.status(200).json({ content: [{ type: "text", text }], text, model });
  } catch (e) {
    return res.status(500).json({ error: "Server error", detail: String((e && e.message) || e) });
  }
}
