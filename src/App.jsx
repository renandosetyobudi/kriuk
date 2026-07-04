import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";

// ─────────────────────────────────────────────
// THEME — "Golden Kriuk": warm, appetizing, professional
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    /* Material 3 — modern dashboard, cool-neutral + indigo primary */
    --bg: #F5F6F8;            /* surface / canvas */
    --bg-2: #ECEEF2;          /* surface-container */
    --surface: #FFFFFF;       /* surface-bright (cards) */
    --line: #E6E8EC;          /* outline-variant (subtle) */
    --line-strong: #D4D8DF;   /* outline */
    --ink: #1A1C20;           /* on-surface (near-black, cool) */
    --ink-2: #444851;         /* on-surface-variant */
    --muted: #767C87;         /* on-surface-variant (dim) */
    --brand: #4C5BD4;         /* primary (indigo) */
    --brand-deep: #3A47AE;    /* primary pressed / on-primary-container */
    --brand-soft: #E7E9FB;    /* primary-container */
    --brand-tint: #CFD4F5;    /* primary-container outline */
    --green: #1F9254;
    --green-soft: #E2F3E9;
    --red: #D93D38;
    --red-soft: #FBE6E4;
    --amber: #BC850F;
    --amber-soft: #F6ECD2;
    --blue: #2680D8;
    --blue-soft: #E1EFFB;
    --violet: #6E59D9;
    --font: 'Inter', sans-serif;
    /* M3 tonal elevation — soft, cool-toned */
    --shadow-xs: 0 1px 2px rgba(20,22,30,0.05);
    --shadow-sm: 0 1px 3px rgba(20,22,30,0.07);
    --shadow: 0 4px 14px rgba(20,22,30,0.08);
    --shadow-lg: 0 12px 36px rgba(16,18,26,0.18);
    /* M3 shape scale */
    --r-lg: 28px;
    --r: 20px;
    --r-sm: 14px;
    --r-xs: 10px;
  }
  body { background: var(--bg); color: var(--ink); font-family: var(--font); min-height: 100vh; font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  html { overflow-x: hidden; }
  h1,h2,h3 { letter-spacing: -0.02em; }
  .tnum { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
  input, select, textarea {
    background: var(--surface); border: 1.5px solid var(--line-strong); color: var(--ink);
    border-radius: var(--r-sm); padding: 13px 15px; font-family: var(--font);
    font-size: 15px; font-weight: 500; outline: none; width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  input::placeholder, textarea::placeholder { color: #A4AAB4; font-weight: 400; }
  input:focus, select:focus, textarea:focus {
    border-color: var(--brand); box-shadow: 0 0 0 3px rgba(76,91,212,0.18);
  }
  button { cursor: pointer; font-family: var(--font); }
  ::-webkit-scrollbar { width: 7px; height: 7px; }
  ::-webkit-scrollbar-thumb { background: #CDD2DA; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #B7BEC9; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes sheetUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pop { 0%{transform:scale(0.96);opacity:0} 60%{transform:scale(1.01)} 100%{transform:scale(1);opacity:1} }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .fade-up { animation: fadeIn 0.3s ease backwards; }
  .slide-down { animation: fadeIn 0.18s ease backwards; }
  .stagger > * { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) backwards; }
  .stagger > *:nth-child(1){animation-delay:.02s} .stagger > *:nth-child(2){animation-delay:.06s}
  .stagger > *:nth-child(3){animation-delay:.10s} .stagger > *:nth-child(4){animation-delay:.14s}
  .stagger > *:nth-child(5){animation-delay:.18s} .stagger > *:nth-child(6){animation-delay:.22s}
`;

// ─────────────────────────────────────────────
// ICON SYSTEM — crisp line icons (Lucide-style), inherit currentColor
// ─────────────────────────────────────────────
const ICONS = {
  home: <><path d="M3 9.6 12 3l9 6.6"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></>,
  store: <><path d="M3.4 8 5 3.6h14L20.6 8"/><path d="M4.6 8.5V20a1 1 0 0 0 1 1h12.8a1 1 0 0 0 1-1V8.5"/><path d="M9 21v-5h6v5"/><path d="M3.4 8h17.2"/></>,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h13v3"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3"/><path d="M21 11v4h-4a2 2 0 0 1 0-4Z"/></>,
  receipt: <><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17l-2.5-1.4L14 21l-2-1.4L10 21l-2.5-1.4Z"/><path d="M9 8h6"/><path d="M9 12h6"/></>,
  note: <><path d="M5 4a1 1 0 0 1 1-1h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></>,
  package: <><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/></>,
  sparkles: <><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4Z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="8" r="4"/></>,
  "trending-up": <><path d="M3 17 9.5 10.5l4 4L21 7"/><path d="M15 7h6v6"/></>,
  "trending-down": <><path d="M3 7 9.5 13.5l4-4L21 17"/><path d="M15 17h6v-6"/></>,
  coins: <><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></>,
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></>,
  list: <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3.5 6h.01"/><path d="M3.5 12h.01"/><path d="M3.5 18h.01"/></>,
  gem: <><path d="M6 3h12l3.5 5.5L12 21 2.5 8.5Z"/><path d="M2.5 8.5h19"/><path d="m12 3-2.5 5.5L12 21l2.5-12.5L12 3"/></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  printer: <><path d="M6 9V3h12v6"/><path d="M6 18H4.5A1.5 1.5 0 0 1 3 16.5V11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 1-1.5 1.5H18"/><rect x="6" y="14" width="12" height="7" rx="1"/></>,
  trash: <><path d="M3 6h18"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"/><path d="M6 6v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6"/><path d="M10 11v6"/><path d="M14 11v6"/></>,
  pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  banknote: <><rect x="2" y="6" width="20" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01"/><path d="M18 12h.01"/></>,
  camera: <><path d="M14.5 4h-5L7.2 6.8A2 2 0 0 1 5.6 7.6H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.6a2 2 0 0 0-2-2h-1.6a2 2 0 0 1-1.6-.8Z"/><circle cx="12" cy="13" r="3.5"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="m21 15-4.2-4.2a2 2 0 0 0-2.8 0L4 21"/></>,
  x: <><path d="M18 6 6 18"/><path d="M6 6l12 12"/></>,
  "map-pin": <><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z"/><circle cx="12" cy="11" r="2.3"/></>,
  navigation: <><path d="M3 11 22 2l-9 19-2.2-7.2L3 11Z"/></>,
  phone: <><path d="M5 4h3.2l1.8 4.5-2.3 1.4a11 11 0 0 0 5 5l1.4-2.3 4.5 1.8V19a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></>,
  check: <><path d="M20 6 9 17l-5-5"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><path d="M12 7.8h.01"/></>,
  lightbulb: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.8c.6.5 1 1.2 1 2.2h6c0-1 .4-1.7 1-2.2A7 7 0 0 0 12 2Z"/></>,
  calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5l3.2 2"/></>,
  send: <><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
  download: <><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/></>,
  folder: <><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h8.5A1.5 1.5 0 0 1 20.5 10v8a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18Z"/></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15.5H4.5A1.5 1.5 0 0 1 3 14V4.5A1.5 1.5 0 0 1 4.5 3H14a1.5 1.5 0 0 1 1.5 1.5V5"/></>,
  save: <><path d="M5 3h11l3 3v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19V5a2 2 0 0 1 2-2Z"/><path d="M8 3v5h7"/><path d="M8 21v-7h8v7"/></>,
  message: <><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/></>,
  pin: <><path d="M12 17v5"/><path d="M9 10.6V4h6v6.6l2 3.4H7l2-3.4Z"/></>,
  alert: <><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/></>,
  layers: <><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></>,
  "chevron-right": <path d="m9 18 6-6-6-6"/>,
};
function Icon({ name, size = 20, stroke = 2, style }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", flexShrink: 0, ...style }}>
      {paths}
    </svg>
  );
}

// Resize + compress an image File to a small JPEG dataURL (keeps localStorage light)
function resizeImageFile(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; }
        else if (h >= w && h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL("image/jpeg", quality)); } catch (err) { reject(err); }
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// COMPANY INFO
// ─────────────────────────────────────────────
const COMPANY = {
  name: "SB FOOD",
  tagline: "Snack Kriuk",
  address: "Unit 2 Tulang Bawang",
  phone: "0878-7823-4225",
};

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];
const thisMonth = today.slice(0, 7);
const dayNames = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const todayDay = dayNames[new Date().getDay()];
const dayIdx = { Minggu:0, Senin:1, Selasa:2, Rabu:3, Kamis:4, Jumat:5, Sabtu:6 };
const daysUntilDay = (name) => { const t = dayIdx[name]; return t == null ? null : (t - new Date().getDay() + 7) % 7; };
const nextVisitForDays = (days) => { const arr = (days || []).map(daysUntilDay).filter(x => x != null); return arr.length ? Math.min(...arr) : null; };
const whenLabel = (n) => n === 0 ? "Hari ini" : n === 1 ? "Besok" : n === 2 ? "Lusa" : `${n} hari lagi`;
const idMonths = { januari:"01", februari:"02", maret:"03", april:"04", mei:"05", juni:"06", juli:"07", agustus:"08", september:"09", oktober:"10", november:"11", desember:"12" };
const resolveMonth = (m) => {
  if (!m) return null;
  const s = String(m).trim().toLowerCase();
  if (/^\d{4}-\d{1,2}$/.test(s)) { const [y, mo] = s.split("-"); return `${y}-${mo.padStart(2, "0")}`; }
  const parts = s.split(/\s+/);
  const year = parts.find(p => /^\d{4}$/.test(p)) || String(new Date().getFullYear());
  const nameKey = Object.keys(idMonths).find(k => parts.includes(k)) || (idMonths[s] ? s : null);
  return nameKey ? `${year}-${idMonths[nameKey]}` : null;
};
const normTxType = (t) => { const s = String(t || "").toLowerCase(); if (/masuk|income|pemasukan|omset|jual/.test(s)) return "income"; if (/keluar|expense|pengeluaran|beli|biaya/.test(s)) return "expense"; return null; };
// Pengingat: rute yang dikunjungi ≤2 hari lagi + catatan toko di rute itu
let deferredInstallPrompt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstallPrompt = e; });
}
const isStandalone = () => {
  try { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; } catch { return false; }
};

const BACKUP_DUE_DAYS = 7;
const backupStatus = (data) => {
  const hasData = ((data.transactions || []).length + (data.stores || []).length) > 0;
  if (!hasData) return null;
  const last = +data.lastBackupAt || 0;
  if (!last) return { neverBackedUp: true, daysSince: null, due: true };
  const daysSince = Math.floor((Date.now() - last) / 86400000);
  return { neverBackedUp: false, daysSince, due: daysSince >= BACKUP_DUE_DAYS };
};
const buildBackupPayload = (data) => JSON.stringify({ app: "SB FOOD - Snack Kriuk", schema: "kriuk_v6", exportedAt: new Date().toISOString(), data }, null, 2);
const triggerBackupDownload = (data) => {
  try {
    const blob = new Blob([buildBackupPayload(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sb-food-backup-${today}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch { return false; }
};

const buildReminders = (data) => {
  const list = [];
  (data.routes || []).forEach(r => {
    const n = nextVisitForDays(r.days);
    if (n == null || n > 2) return;
    const storesIn = (data.stores || []).filter(s => s.routeId === r.id);
    const dayName = (r.days || []).find(d => daysUntilDay(d) === n) || "";
    list.push({ id: `route-${r.id}`, kind: "route", title: `Kunjungan ${r.name}`, detail: `${storesIn.length} toko${dayName ? ` · ${dayName}` : ""}`, when: n, whenLabel: whenLabel(n) });
    storesIn.forEach(s => { if (s.note && String(s.note).trim()) list.push({ id: `note-${s.id}`, kind: "note", title: s.name, detail: String(s.note).trim(), when: n, whenLabel: whenLabel(n), storeId: s.id }); });
  });
  list.sort((a, b) => a.when - b.when || (a.kind === b.kind ? 0 : a.kind === "route" ? -1 : 1));
  const bs = backupStatus(data);
  if (bs && bs.due) list.unshift({ id: "backup", kind: "backup", title: "Backup data usaha", detail: bs.neverBackedUp ? "Data belum pernah di-backup. Amankan lewat menu Pengaturan atau tombol di Beranda." : `Terakhir ${bs.daysSince} hari lalu. Disarankan backup tiap minggu.`, when: 0, whenLabel: "Penting" });
  return list;
};

const INIT = {
  products: [
    { id: "p1", name: "Kriuk Original", price: 8000, costPrice: 4000 },
    { id: "p2", name: "Kriuk Pedas", price: 8000, costPrice: 4000 },
    { id: "p3", name: "Kriuk Jagung", price: 7000, costPrice: 3500 },
    { id: "p4", name: "Keripik Tempe", price: 9000, costPrice: 4500 },
  ],
  routes: [
    { id: "r1", name: "Rute Barat", color: "#E07B1A", days: ["Senin","Kamis"] },
    { id: "r2", name: "Rute Timur", color: "#D6453F", days: ["Selasa","Jumat"] },
    { id: "r3", name: "Rute Tengah", color: "#138A5E", days: ["Rabu","Sabtu"] },
  ],
  stores: [
    { id: "s1", name: "Warung Bu Sari", address: "Jl. Melati No. 5", contact: "081234", routeId: "r1", lat: -5.3971, lng: 105.2668 },
    { id: "s2", name: "Toko Pak Budi", address: "Jl. Mawar No. 12", contact: "082345", routeId: "r1", lat: -5.4105, lng: 105.2580 },
    { id: "s3", name: "Minimart Ceria", address: "Jl. Anggrek No. 3", contact: "083456", routeId: "r2", lat: -5.3820, lng: 105.2895 },
    { id: "s4", name: "Warung Pak RT", address: "Jl. Dahlia No. 7", contact: "084567", routeId: "r2", lat: -5.4288, lng: 105.2611 },
    { id: "s5", name: "Kantin Sekolah", address: "Jl. Cemara No. 1", contact: "085678", routeId: "r3", lat: -5.3650, lng: 105.2470 },
  ],
  consignments: [
    { id: "c1", storeId: "s1", productId: "p1", deposited: 10, remaining: 10, date: "2026-05-13", status: "active" },
    { id: "c2", storeId: "s1", productId: "p2", deposited: 8, remaining: 8, date: "2026-05-13", status: "active" },
    { id: "c3", storeId: "s2", productId: "p1", deposited: 12, remaining: 12, date: "2026-05-14", status: "active" },
    { id: "c4", storeId: "s3", productId: "p3", deposited: 15, remaining: 15, date: "2026-05-14", status: "active" },
    { id: "c5", storeId: "s4", productId: "p4", deposited: 10, remaining: 10, date: "2026-05-15", status: "active" },
  ],
  transactions: [
    { id: "t1", type: "income", category: "Penjualan", amount: 96000, date: "2026-05-18", storeId: "s1", note: "Tagihan Bu Sari - Kriuk Original 12bks" },
    { id: "t2", type: "income", category: "Penjualan", amount: 72000, date: "2026-05-17", storeId: "s2", note: "Tagihan Pak Budi" },
    { id: "t3", type: "expense", category: "Produksi", amount: 150000, date: "2026-05-17", note: "Beli bahan baku tepung & bumbu" },
    { id: "t4", type: "income", category: "Penjualan", amount: 56000, date: "2026-05-16", storeId: "s3", note: "Tagihan Minimart Ceria" },
    { id: "t5", type: "expense", category: "Transport", amount: 30000, date: "2026-05-16", note: "BBM motor" },
    { id: "t6", type: "income", category: "Penjualan", amount: 88000, date: "2026-05-15", storeId: "s4", note: "Tagihan Warung Pak RT" },
    { id: "t7", type: "expense", category: "Kemasan", amount: 50000, date: "2026-05-14", note: "Beli plastik kemasan" },
    { id: "t8", type: "income", category: "Penjualan", amount: 120000, date: "2026-05-13", note: "Drop awal rute barat" },
    { id: "t9", type: "expense", category: "Produksi", amount: 200000, date: "2026-05-10", note: "Produksi batch mingguan" },
    { id: "t10", type: "income", category: "Penjualan", amount: 104000, date: "2026-05-08", note: "Kunjungan rute timur" },
    { id: "t11", type: "income", category: "Penjualan", amount: 80000, date: "2026-04-28", note: "Tagihan april" },
    { id: "t12", type: "expense", category: "Produksi", amount: 180000, date: "2026-04-20", note: "Produksi april" },
  ],
  notes: [
    { id: "n1", date: "2026-05-19", content: "Rencana besok kunjungi rute barat dulu, cek stok Bu Sari yang hampir habis.", pinned: true },
    { id: "n2", date: "2026-05-17", content: "Pak Budi minta tambah Kriuk Pedas minggu depan.", pinned: false },
  ],
  receipts: [],
  receiptCounter: 1,
  assets: [],
  assetSnapshots: [],
  lastBackupAt: 0,
  expenseCategories: ["Produksi","Transport","Kemasan","Gaji","Sewa","Listrik","Lain-lain"],
  expenseAdjustments: {},
  plastics: [
    { id: "pl1", name: "Plastik 100g", pricePer500g: 25000, piecesPer500g: 250 },
    { id: "pl2", name: "Plastik 250g", pricePer500g: 25000, piecesPer500g: 120 },
    { id: "pl3", name: "Plastik 500g", pricePer500g: 25000, piecesPer500g: 70 },
  ],
  labels: [
    { id: "lb1", name: "Label Sticker", pricePerSheet: 6000, perSheet: 48 },
  ],
  variants: [
    { id: "vr1", name: "Kriuk Original 100g", pricePerBall: 90000, packsPerBall: 20, plastikId: "pl1", labelId: "lb1", sellPrice: 6000, stock: 60, bs: 3 },
    { id: "vr2", name: "Kriuk Pedas 100g", pricePerBall: 96000, packsPerBall: 20, plastikId: "pl1", labelId: "lb1", sellPrice: 6500, stock: 35, bs: 1 },
    { id: "vr3", name: "Kriuk Original 250g", pricePerBall: 90000, packsPerBall: 8, plastikId: "pl2", labelId: "lb1", sellPrice: 13000, stock: 20, bs: 0 },
  ],
};

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);
const fmtShort = (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}jt` : n >= 1e3 ? `${(n/1e3).toFixed(0)}rb` : String(n||0);
const fmtDate = (d) => d ? new Date(d+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}) : "-";

const hasCoords = (o) => o && typeof o.lat === "number" && typeof o.lng === "number" && !isNaN(o.lat) && !isNaN(o.lng);
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371, toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const fmtDist = (km) => km == null ? null : km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
const mapsDirUrl = (store, from) => {
  const dest = hasCoords(store) ? `${store.lat},${store.lng}` : encodeURIComponent(store.address || store.name || "");
  let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
  if (from && hasCoords(from)) url += `&origin=${from.lat},${from.lng}`;
  return url;
};
const mapsSearchUrl = (store) => {
  const q = hasCoords(store) ? `${store.lat},${store.lng}` : encodeURIComponent(store.address || store.name || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
};
const mapsEmbedUrl = (lat, lng) => `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=id&output=embed`;

// Nota type metadata (drop = titip, cash = penjualan tunai, payment = bayar titipan)
const notaMeta = (type) =>
  type === "drop"
    ? { label: "PENITIPAN", short: "Penitipan", color: "var(--blue)", soft: "var(--blue-soft)", icon: "package", title: "Nota Penitipan", printTitle: "NOTA PENITIPAN BARANG" }
    : type === "cash"
    ? { label: "PENJUALAN TUNAI", short: "Tunai", color: "var(--green)", soft: "var(--green-soft)", icon: "banknote", title: "Nota Penjualan Tunai", printTitle: "NOTA PENJUALAN TUNAI" }
    : { label: "PEMBAYARAN", short: "Pembayaran", color: "var(--amber)", soft: "var(--amber-soft)", icon: "coins", title: "Nota Pembayaran", printTitle: "NOTA PEMBAYARAN" };

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      if (!s) return init;
      const parsed = JSON.parse(s);
      return { ...init, ...parsed };
    } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

const genNotaNo = (type, counter) => {
  const d = new Date();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  const seq = String(counter).padStart(4,"0");
  const prefix = type === "drop" ? "TTP" : type === "cash" ? "JUL" : "BYR";
  return `${prefix}/${mm}${yy}/${seq}`;
};

const DEFAULT_EXPENSE_CATS = ["Produksi","Transport","Kemasan","Gaji","Sewa","Listrik","Lain-lain"];

function terbilang(n) {
  if (n === 0) return "nol";
  const satuan = ["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"];
  function _t(x) {
    if (x < 12) return satuan[x];
    if (x < 20) return satuan[x-10] + " belas";
    if (x < 100) return satuan[Math.floor(x/10)] + " puluh" + (x%10 ? " " + satuan[x%10] : "");
    if (x < 200) return "seratus" + (x-100 ? " " + _t(x-100) : "");
    if (x < 1000) return satuan[Math.floor(x/100)] + " ratus" + (x%100 ? " " + _t(x%100) : "");
    if (x < 2000) return "seribu" + (x-1000 ? " " + _t(x-1000) : "");
    if (x < 1000000) return _t(Math.floor(x/1000)) + " ribu" + (x%1000 ? " " + _t(x%1000) : "");
    if (x < 1000000000) return _t(Math.floor(x/1000000)) + " juta" + (x%1000000 ? " " + _t(x%1000000) : "");
    return _t(Math.floor(x/1000000000)) + " miliar" + (x%1000000000 ? " " + _t(x%1000000000) : "");
  }
  return _t(Math.floor(n)).replace(/\s+/g, " ").trim();
}

function printNota(receipt, company) {
  const isDrop = receipt.type === "drop";
  const isCash = receipt.type === "cash";
  const title = isDrop ? "NOTA PENITIPAN BARANG" : isCash ? "NOTA PENJUALAN TUNAI" : "NOTA PEMBAYARAN";
  const noteText = isDrop
    ? `<strong>Sistem Titip Jual:</strong> Barang dititipkan untuk dijual. Pembayaran dilakukan saat kunjungan berikutnya berdasarkan jumlah yang terjual. Mohon barang dirawat dengan baik dan dijaga kebersihannya.`
    : isCash
    ? `<strong>Penjualan Tunai — LUNAS.</strong> Barang dibeli secara tunai. Terima kasih atas pembeliannya.`
    : `<strong>Pembayaran Lunas</strong> atas barang titip jual yang telah terjual. Terima kasih atas kerjasamanya.`;
  const items = receipt.items || [];
  const total = receipt.total || 0;
  const dateStr = new Date(receipt.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  function formatRp(n) { return "Rp " + new Intl.NumberFormat("id-ID").format(n||0); }

  const rowsHtml = items.map((item, i) => `
    <tr>
      <td style="text-align:center">${i+1}</td>
      <td>${item.name}</td>
      <td style="text-align:center">${item.qty}</td>
      <td style="text-align:right">${formatRp(item.price)}</td>
      <td style="text-align:right">${formatRp(item.qty * item.price)}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} - ${receipt.notaNo}</title>
  <style>
    @page { margin: 14mm; size: A5; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Arial', sans-serif; color: #000; font-size: 11pt; line-height: 1.4; padding: 14px; max-width: 148mm; margin: 0 auto; }
    .nota-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
    .nota-header .company h1 { font-size: 18pt; font-weight: 900; letter-spacing: 1px; margin-bottom: 2px; }
    .nota-header .company p { font-size: 9pt; line-height: 1.35; }
    .nota-header .nota-info { text-align: right; }
    .nota-header .nota-info .title { font-size: 11pt; font-weight: 700; background: #000; color: #fff; padding: 4px 10px; display: inline-block; margin-bottom: 4px; }
    .nota-header .nota-info .no { font-size: 10pt; font-weight: 700; }
    .nota-header .nota-info .date { font-size: 9pt; color: #444; }
    .recipient { margin-bottom: 12px; font-size: 10pt; }
    .recipient .label { display: inline-block; width: 80px; color: #444; }
    .recipient .val { font-weight: 700; }
    table.items { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 10pt; }
    table.items th, table.items td { border: 1px solid #333; padding: 6px 8px; }
    table.items th { background: #f0f0f0; font-weight: 700; font-size: 9.5pt; text-transform: uppercase; }
    table.items td.col-no { text-align: center; width: 30px; }
    table.items td.col-qty { text-align: center; width: 50px; }
    table.items .total-row td { font-weight: 700; background: #f8f8f8; font-size: 11pt; padding: 8px; }
    .terbilang { font-style: italic; font-size: 9.5pt; padding: 8px 0; border-bottom: 1px solid #ccc; margin-bottom: 12px; }
    .terbilang .label { color: #444; }
    .note-section { font-size: 9pt; color: #444; margin-bottom: 16px; padding: 8px 10px; background: #fafafa; border-left: 3px solid #888; }
    .signs { display: flex; justify-content: space-between; gap: 30px; margin-top: 18px; font-size: 9.5pt; }
    .sign { text-align: center; flex: 1; }
    .sign p { margin-bottom: 50px; }
    .sign .line { border-top: 1px solid #000; padding-top: 4px; font-weight: 700; }
    .footer { margin-top: 20px; text-align: center; font-size: 8pt; color: #666; padding-top: 8px; border-top: 1px dashed #ccc; }
    @media print { body { padding: 0; } }
  </style>
  </head>
  <body>
    <div class="nota-header">
      <div class="company">
        <h1>${company.name}</h1>
        <p><strong>${company.tagline}</strong></p>
        <p>${company.address}</p>
        <p>HP/WA: ${company.phone}</p>
      </div>
      <div class="nota-info">
        <div class="title">${title}</div>
        <div class="no">No: ${receipt.notaNo}</div>
        <div class="date">${dateStr}</div>
      </div>
    </div>
    <div class="recipient">
      <div><span class="label">Kepada Yth:</span> <span class="val">${receipt.storeName||"-"}</span></div>
      <div><span class="label">Alamat:</span> <span class="val">${receipt.storeAddress||"-"}</span></div>
      ${receipt.storeContact ? `<div><span class="label">Kontak:</span> <span class="val">${receipt.storeContact}</span></div>` : ""}
    </div>
    <table class="items">
      <thead>
        <tr>
          <th class="col-no">No</th>
          <th>Nama Barang</th>
          <th class="col-qty">Qty</th>
          <th style="text-align:right; width: 90px">Harga</th>
          <th style="text-align:right; width: 100px">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="total-row">
          <td colspan="4" style="text-align:right">TOTAL</td>
          <td style="text-align:right">${formatRp(total)}</td>
        </tr>
      </tbody>
    </table>
    <div class="terbilang">
      <span class="label">Terbilang:</span> <strong>${terbilang(total).replace(/^./, c => c.toUpperCase())} Rupiah</strong>
    </div>
    <div class="note-section">
      ${noteText}
    </div>
    <div class="signs">
      <div class="sign">
        <p>${receipt.storeName || "Penerima"}</p>
        <div class="line">( ........................... )</div>
      </div>
      <div class="sign">
        <p>Hormat Kami,<br>${company.name}</p>
        <div class="line">( ........................... )</div>
      </div>
    </div>
    <div class="footer">
      Terima kasih atas kepercayaan Anda kepada ${company.name}
    </div>
  </body></html>`;

  // Print inside a hidden iframe so the user never leaves the app (fixes "tidak bisa kembali" after cetak)
  const existing = document.getElementById("nota-print-frame");
  if (existing) existing.remove();
  const iframe = document.createElement("iframe");
  iframe.id = "nota-print-frame";
  iframe.setAttribute("aria-hidden", "true");
  Object.assign(iframe.style, { position: "fixed", left: "-9999px", top: "0", width: "0", height: "0", border: "0" });
  document.body.appendChild(iframe);

  let done = false;
  const cleanup = () => { if (done) return; done = true; setTimeout(() => { try { iframe.remove(); } catch {} }, 500); };

  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      win.focus();
      win.onafterprint = cleanup;
      win.print();
      // Fallback cleanup in case onafterprint never fires
      setTimeout(cleanup, 60000);
    } catch (e) {
      // Fallback: if iframe printing is blocked, open a normal window
      try { const w = window.open("", "_blank"); w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 500); } catch {}
      cleanup();
    }
  };

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

// ─────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────
function Tag({ children, color = "var(--brand)", solid }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: solid ? color : color + "18", color: solid ? "#fff" : color,
      borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700,
      whiteSpace: "nowrap", lineHeight: 1.5, letterSpacing: "-0.01em",
    }}>{children}</span>
  );
}

function Card({ children, style, onClick, hoverable }) {
  const [hov, setHov] = useState(false);
  const interactive = onClick || hoverable;
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--surface)", borderRadius: "var(--r)",
        border: `1.5px solid ${hov && interactive ? "var(--brand-tint)" : "var(--line)"}`,
        boxShadow: hov && interactive ? "var(--shadow-sm)" : "var(--shadow-xs)",
        padding: 20, transition: "all 0.2s cubic-bezier(.22,1,.36,1)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon, full, disabled }) {
  const [hov, setHov] = useState(false);
  const v = {
    primary: { bg: hov ? "var(--brand-deep)" : "var(--brand)", color: "#fff", border: "transparent", shadow: hov ? "var(--shadow)" : "var(--shadow-xs)" },
    outline: { bg: hov ? "var(--brand-soft)" : "transparent", color: "var(--brand-deep)", border: "var(--line-strong)", shadow: "none" },
    ghost: { bg: hov ? "var(--line)" : "var(--bg-2)", color: "var(--ink-2)", border: "transparent", shadow: "none" },
    dark: { bg: hov ? "#000" : "var(--ink)", color: "#fff", border: "transparent", shadow: "none" },
    danger: { bg: hov ? "#F1CBC6" : "var(--red-soft)", color: "var(--red)", border: "transparent", shadow: "none" },
    success: { bg: hov ? "#157A52" : "var(--green)", color: "#fff", border: "transparent", shadow: hov ? "var(--shadow)" : "var(--shadow-xs)" },
  }[variant] || {};
  const pad = size === "sm" ? "9px 16px" : size === "lg" ? "14px 24px" : "11px 20px";
  const fs = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: pad, fontSize: fs, fontWeight: 700,
        borderRadius: 999, border: `1.5px solid ${v.border}`, background: v.bg, color: v.color,
        transition: "all 0.16s", width: full ? "100%" : undefined, boxShadow: v.shadow,
        justifyContent: full ? "center" : undefined, opacity: disabled ? 0.5 : 1, letterSpacing: "-0.01em" }}>
      {icon && <span style={{ fontSize: fs + 2 }}>{icon}</span>}
      {children}
    </button>
  );
}

function Modal({ show, onClose, title, subtitle, children, wide }) {
  useEffect(() => {
    if (show) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [show]);
  if (!show) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(33,26,18,0.42)", backdropFilter: "blur(6px)",
      zIndex: 900, overflowY: "auto", WebkitOverflowScrolling: "touch",
      paddingTop: "calc(20px + env(safe-area-inset-top))",
      paddingBottom: "calc(28px + env(safe-area-inset-bottom))",
      paddingLeft: 14, paddingRight: 14,
    }}>
      <div onClick={e => e.stopPropagation()} style={{ animation: "sheetUp 0.3s cubic-bezier(.22,1,.36,1) both",
          background: "var(--surface)", borderRadius: "var(--r-lg)", padding: 24,
          width: "100%", maxWidth: wide ? 660 : 480,
          boxShadow: "var(--shadow-lg)", margin: "0 auto",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)" }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, fontWeight: 500 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 999, border: "none", background: "var(--bg-2)", color: "var(--muted)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--red-soft)"; e.currentTarget.style.color = "var(--red)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--muted)"; }}><Icon name="x" size={16} /></button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function FG({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 7, letterSpacing: "-0.01em" }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{hint}</p>}
    </div>
  );
}

function ConfirmDialog({ show, onClose, onConfirm, title, message, confirmText = "Hapus", danger = true, icon = "alert" }) {
  useEffect(() => {
    if (show) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [show]);
  if (!show) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(33,26,18,0.5)", backdropFilter: "blur(6px)",
      zIndex: 950, overflowY: "auto", WebkitOverflowScrolling: "touch",
      display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0,
      padding: "max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))",
    }}>
      <div onClick={e => e.stopPropagation()} style={{ animation: "pop 0.28s cubic-bezier(.22,1,.36,1) both",
          background: "var(--surface)", borderRadius: 22, padding: 26, width: "100%", maxWidth: 400, boxShadow: "var(--shadow-lg)", textAlign: "center", margin: "auto" }}>
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: danger ? "var(--red-soft)" : "var(--amber-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "var(--red)" : "var(--amber)", margin: "0 auto 18px" }}><Icon name={icon} size={30} /></div>
        <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 24, fontWeight: 500 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={onClose}>Batal</Btn>
          <Btn full variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Btn>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [state, setState] = useState({ show: false });
  const confirm = (opts) => setState({ ...opts, show: true });
  const close = () => setState(s => ({ ...s, show: false }));
  const Dialog = () => (
    <ConfirmDialog show={state.show} onClose={close} onConfirm={state.onConfirm || (()=>{})}
      title={state.title || "Konfirmasi"} message={state.message || "Apakah Anda yakin?"}
      confirmText={state.confirmText} danger={state.danger !== false} icon={state.icon} />
  );
  return { confirm, Dialog };
}

function StatCard({ label, value, sub, icon, color = "var(--brand)", soft, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "var(--surface)", borderRadius: "var(--r)", border: `1.5px solid ${hov && onClick ? color + "55" : "var(--line)"}`,
        boxShadow: hov && onClick ? "var(--shadow-sm)" : "var(--shadow-xs)", padding: 18,
        cursor: onClick ? "pointer" : "default", transition: "all .2s cubic-bezier(.22,1,.36,1)",
        position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.05 }} />
      <div style={{ width: 44, height: 44, borderRadius: 14, background: soft || color + "16", color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 4, fontWeight: 600 }}>{label}</p>
      <p className="tnum" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", lineHeight: 1.15 }}>{title}</h2>
        {sub && <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 5, fontWeight: 500 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--bg-2)", borderRadius: 999, padding: 4, flexWrap: "wrap" }}>
      {items.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 999, border: "none", fontSize: 14, fontWeight: on ? 800 : 600, cursor: "pointer", transition: "all 0.18s", fontFamily: "var(--font)",
              background: on ? "var(--surface)" : "transparent", color: on ? "var(--ink)" : "var(--muted)", boxShadow: on ? "var(--shadow-xs)" : "none", letterSpacing: "-0.01em" }}>
            {t.icon && (ICONS[t.icon] ? <Icon name={t.icon} size={16} /> : <span>{t.icon}</span>)}{t.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: sub ? "40px 20px" : "30px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.85, display: "flex", justifyContent: "center" }}>{icon}</div>
      <p style={{ fontSize: 15.5, fontWeight: 700, marginBottom: sub ? 6 : 0, color: "var(--ink)" }}>{title}</p>
      {sub && <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500, maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

// LocationPicker — capture current GPS, manual entry, or find on Google Maps
function LocationPicker({ lat, lng, address, onChange }) {
  const [status, setStatus] = useState("idle"); // idle|loading|denied|unavailable
  const [manual, setManual] = useState(false);
  const has = typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng);

  const capture = () => {
    if (!navigator.geolocation) { setStatus("unavailable"); return; }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { onChange(+pos.coords.latitude.toFixed(6), +pos.coords.longitude.toFixed(6)); setStatus("idle"); },
      (err) => setStatus(err.code === 1 ? "denied" : "unavailable"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div style={{ background:"var(--bg)", border:"1.5px solid var(--line)", borderRadius:13, padding:14 }}>
      <p style={{ fontSize:12.5, fontWeight:800, color:"var(--ink-2)", marginBottom:4, display:"flex", alignItems:"center", gap:6 }}><Icon name="map-pin" size={14} /> Lokasi Toko (untuk fitur terdekat & rute)</p>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:10, fontWeight:500, lineHeight:1.5 }}>Tekan tombol di bawah <b>saat Anda berada di toko</b> untuk menyimpan titiknya.</p>
      <Btn full size="sm" icon={<Icon name="map-pin" size={15} />} variant={has ? "outline" : "primary"} onClick={capture}>
        {status === "loading" ? "Mendeteksi lokasi…" : has ? "Perbarui ke Lokasi Saat Ini" : "Pakai Lokasi Saat Ini (GPS)"}
      </Btn>
      {status === "denied" && <p style={{ fontSize:12, color:"var(--red)", marginTop:8, fontWeight:600 }}>Izin lokasi ditolak. Aktifkan izin lokasi di browser lalu coba lagi.</p>}
      {status === "unavailable" && <p style={{ fontSize:12, color:"var(--red)", marginTop:8, fontWeight:600 }}>GPS tidak tersedia di perangkat ini. Bisa isi koordinat manual di bawah.</p>}
      {has && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginTop:10, background:"var(--green-soft)", border:"1.5px solid #BCE6D2", borderRadius:10, padding:"9px 12px", flexWrap:"wrap" }}>
          <span className="tnum" style={{ fontSize:12.5, color:"var(--green)", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}><Icon name="check" size={13} /> {lat.toFixed(5)}, {lng.toFixed(5)}</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"var(--blue)", fontWeight:700, textDecoration:"none" }}>Lihat di peta ↗</a>
            <button onClick={() => onChange(undefined, undefined)} style={{ fontSize:12, color:"var(--red)", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)" }}>Hapus</button>
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
        {address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"var(--blue)", fontWeight:700, textDecoration:"none" }}>Cari alamat di Google Maps</a>}
        <button onClick={() => setManual(m => !m)} style={{ fontSize:12, color:"var(--muted)", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)", marginLeft:"auto" }}>{manual ? "Sembunyikan" : "Isi manual"}</button>
      </div>
      {manual && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--ink-2)", marginBottom:4 }}>Latitude</p>
            <input type="number" step="any" placeholder="-5.39714" value={typeof lat === "number" && !isNaN(lat) ? lat : ""} onChange={e => onChange(e.target.value === "" ? undefined : parseFloat(e.target.value), lng)} style={{ fontSize:13, padding:"9px 11px" }} />
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--ink-2)", marginBottom:4 }}>Longitude</p>
            <input type="number" step="any" placeholder="105.26687" value={typeof lng === "number" && !isNaN(lng) ? lng : ""} onChange={e => onChange(lat, e.target.value === "" ? undefined : parseFloat(e.target.value))} style={{ fontSize:13, padding:"9px 11px" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Beranda", icon: "home", desc: "Ringkasan bisnis" },
  { id: "stores", label: "Toko", icon: "store", desc: "Drop, tagih, cetak nota" },
  { id: "finance", label: "Keuangan", icon: "wallet", desc: "Omset & pengeluaran" },
  { id: "receipts", label: "Nota", icon: "receipt", desc: "Riwayat & cetak ulang" },
  { id: "notes", label: "Catatan", icon: "note", desc: "Memo & pengingat" },
  { id: "products", label: "Produk", icon: "package", desc: "Kelola produk" },
  { id: "production", label: "Produksi", icon: "layers", desc: "Stok varian & HPP" },
  { id: "assistant", label: "Asisten AI", icon: "sparkles", desc: "Tanya-jawab data bisnis" },
  { id: "settings", label: "Pengaturan", icon: "settings", desc: "Backup & restore data" },
];
const BOTTOM_TABS = ["dashboard", "stores", "finance", "receipts"]; // + "more"

// Notification bell (top-right) — pengingat kunjungan & catatan toko
function NotificationBell({ reminders, onOpenStore, onGoSettings }) {
  const [open, setOpen] = useState(false);
  const count = reminders.length;
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)} aria-label="Notifikasi" title="Pengingat"
        style={{ position: "relative", width: 44, height: 44, borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-xs)" }}>
        <Icon name="bell" size={19} />
        {count > 0 && <span style={{ position: "absolute", top: -5, right: -5, minWidth: 19, height: 19, padding: "0 5px", borderRadius: 99, background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--surface)" }}>{count > 9 ? "9+" : count}</span>}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1290 }} />
          <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: "min(360px, calc(100vw - 28px))", maxHeight: "70vh", overflowY: "auto", background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 14, boxShadow: "0 16px 40px rgba(33,26,18,0.20)", zIndex: 1300, padding: 12, animation: "drawerIn .16s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ fontSize: 14.5, fontWeight: 800, display:"flex", alignItems:"center", gap:7 }}><Icon name="bell" size={16} /> Pengingat</p>
              <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>{count} aktif</span>
            </div>
            {count === 0 ? (
              <div style={{ textAlign: "center", padding: "22px 8px" }}>
                <div style={{ color:"var(--green)", display:"flex", justifyContent:"center", marginBottom: 8 }}><Icon name="check" size={30} /></div>
                <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>Tidak ada kunjungan rute dalam 2 hari ke depan.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reminders.map(r => (
                  <button key={r.id} onClick={() => { if (r.kind === "backup") { if (onGoSettings) onGoSettings(); setOpen(false); } else if (r.storeId) { onOpenStore(r.storeId); setOpen(false); } }}
                    style={{ textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start", background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 11, padding: "10px 12px", cursor: (r.storeId || r.kind === "backup") ? "pointer" : "default", fontFamily: "var(--font)", width: "100%" }}>
                    <span style={{ flexShrink: 0, color: r.kind === "backup" ? "var(--amber)" : "var(--brand)", display:"flex" }}><Icon name={r.kind === "route" ? "map-pin" : r.kind === "backup" ? "save" : "note"} size={17} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{r.title}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 7px", borderRadius: 99, background: r.when === 0 ? "var(--red)" : r.when === 1 ? "var(--brand)" : "var(--amber)", color: "#fff" }}>{r.whenLabel}</span>
                      </span>
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-2)", marginTop: 2, fontWeight: 500, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>{r.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Desktop top nav
function TopNav({ page, setPage }) {
  return (
    <nav className="topnav" style={{ display: "flex", gap: 4, background: "var(--bg-2)", borderRadius: 999, padding: 5 }}>
      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 999, border: "none", cursor: "pointer",
              background: active ? "var(--surface)" : "transparent", color: active ? "var(--brand-deep)" : "var(--ink-2)",
              fontWeight: active ? 800 : 600, fontSize: 14, transition: "all .16s", fontFamily: "var(--font)",
              boxShadow: active ? "var(--shadow-xs)" : "none", letterSpacing: "-0.01em" }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
            <Icon name={n.icon} size={17} />{n.label}
          </button>
        );
      })}
    </nav>
  );
}

// Mobile bottom tab bar
function BottomNav({ page, setPage, onMore }) {
  const tabs = NAV.filter(n => BOTTOM_TABS.includes(n.id));
  const moreActive = !BOTTOM_TABS.includes(page);
  return (
    <nav className="bottomnav" style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 600,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
      borderTop: "1px solid var(--line)", display: "none",
      paddingBottom: "env(safe-area-inset-bottom)",
      boxShadow: "0 -4px 24px rgba(40,28,12,0.06)",
    }}>
      <div style={{ display: "flex", maxWidth: 600, margin: "0 auto" }}>
        {tabs.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 4px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font)" }}>
              <span style={{ width: 58, height: 30, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "var(--brand-soft)" : "transparent", color: active ? "var(--brand-deep)" : "var(--muted)", transition: "all .18s" }}>
                <Icon name={n.icon} size={21} />
              </span>
              <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? "var(--brand-deep)" : "var(--muted)" }}>{n.label}</span>
            </button>
          );
        })}
        <button onClick={onMore}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 4px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font)" }}>
          <span style={{ width: 58, height: 30, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: moreActive ? "var(--brand-soft)" : "transparent", color: moreActive ? "var(--brand-deep)" : "var(--muted)", transition: "all .18s" }}>
            <Icon name="menu" size={21} />
          </span>
          <span style={{ fontSize: 11, fontWeight: moreActive ? 800 : 600, color: moreActive ? "var(--brand-deep)" : "var(--muted)" }}>Lainnya</span>
        </button>
      </div>
    </nav>
  );
}

// "More" sheet for mobile (Catatan, Produk)
function MoreSheet({ show, onClose, page, setPage }) {
  useEffect(() => {
    if (show) { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }
  }, [show]);
  if (!show) return null;
  const moreItems = NAV.filter(n => !BOTTOM_TABS.includes(n.id));
  const allItems = NAV;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(33,26,18,0.42)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ animation: "sheetUp 0.3s cubic-bezier(.22,1,.36,1) both",
        background: "var(--surface)", borderTopLeftRadius: 26, borderTopRightRadius: 26, width: "100%",
        padding: "12px 18px calc(24px + env(safe-area-inset-bottom))", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--line-strong)", margin: "0 auto 18px" }} />
        <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, paddingLeft: 4 }}>Semua Menu</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {allItems.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => { setPage(n.id); onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderRadius: 14, border: `1.5px solid ${active ? "var(--brand-tint)" : "var(--line)"}`,
                  background: active ? "var(--brand-soft)" : "var(--surface)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font)", transition: "all .15s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: active ? "var(--brand)" : "var(--bg-2)", color: active ? "#fff" : "var(--ink-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={n.icon} size={20} /></div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: active ? "var(--brand-deep)" : "var(--ink)" }}>{n.label}</p>
                  <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>{n.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ data, setData, setPage }) {
  const { transactions, consignments, stores, products, routes, notes } = data;

  const todayIncome = transactions.filter(t => t.date === today && t.type === "income").reduce((s,t) => s+t.amount, 0);
  const monthTx = transactions.filter(t => t.date.startsWith(thisMonth));
  const monthIncome = monthTx.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const monthExpense = (() => {
    const byCat = {};
    monthTx.filter(t => t.type === "expense" && !t.personal).forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const a = data.expenseAdjustments || {};
    return Object.entries(byCat).reduce((s, [cat, raw]) => { const ov = a[thisMonth + "|" + cat]; return s + ((ov !== undefined && ov !== null) ? ov : raw); }, 0);
  })();
  const activeC = consignments.filter(c => c.status === "active");
  const todayRoutes = routes.filter(r => r.days.includes(todayDay));
  const pinned = notes.find(n => n.pinned);

  const chartData = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    const ds = d.toISOString().split("T")[0];
    const lbl = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"][d.getDay()];
    return {
      hari: lbl,
      Omset: transactions.filter(t => t.date === ds && t.type === "income").reduce((s,t) => s+t.amount, 0),
      Biaya: transactions.filter(t => t.date === ds && t.type === "expense" && !t.personal).reduce((s,t) => s+t.amount, 0),
    };
  });

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="fade-up">
      {/* Greeting hero */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{greeting}</p>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, marginTop: 2 }}>Ringkasan Bisnis</h1>
      </div>

      {todayRoutes.length > 0 && (
        <div onClick={() => setPage("stores")} style={{ background: "linear-gradient(120deg, var(--brand) 0%, var(--brand-deep) 100%)", borderRadius: "var(--r)", padding: "18px 22px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 12px 30px rgba(76,91,212,0.26)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ width: 50, height: 50, background: "rgba(255,255,255,0.22)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}><Icon name="navigation" size={24} /></div>
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <p style={{ fontWeight: 800, fontSize: 16.5, color: "#fff" }}>Jadwal Kunjungan Hari Ini</p>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>{todayRoutes.map(r => r.name).join(", ")} — ketuk untuk lihat toko</p>
          </div>
          <span style={{ color: "#fff", fontSize: 22, opacity: 0.9, position: "relative" }}>→</span>
        </div>
      )}

      {(() => {
        const bk = backupStatus(data);
        if (!bk || !bk.due) return null;
        const quickBackup = () => { if (triggerBackupDownload(data)) setData(d => ({ ...d, lastBackupAt: Date.now() })); else setPage("settings"); };
        return (
          <div className="fade-up" style={{ background: "var(--amber-soft)", border: "1.5px solid var(--amber)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--surface)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="save" size={20} /></span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 14, fontWeight: 800 }}>Amankan data usaha Anda</p>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500, marginTop: 2, lineHeight: 1.5 }}>{bk.neverBackedUp ? "Data hanya tersimpan di perangkat ini dan belum pernah di-backup. Jika HP hilang atau cache terhapus, data tidak bisa dikembalikan." : `Backup terakhir ${bk.daysSince} hari lalu — disarankan backup setiap minggu.`}</p>
            </div>
            <Btn size="sm" icon={<Icon name="download" size={15} />} onClick={quickBackup}>Backup Sekarang</Btn>
          </div>
        );
      })()}

      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Omset Hari Ini" value={fmtShort(todayIncome)} icon={<Icon name="coins" size={20} />} color="var(--green)" soft="var(--green-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Omset Bulan Ini" value={fmtShort(monthIncome)} icon={<Icon name="trending-up" size={20} />} color="var(--brand)" soft="var(--brand-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Pengeluaran" value={fmtShort(monthExpense)} icon={<Icon name="trending-down" size={20} />} color="var(--red)" soft="var(--red-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Laba Bersih" value={fmtShort(monthIncome - monthExpense)} icon={<Icon name="wallet" size={20} />} color="var(--amber)" soft="var(--amber-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Toko Aktif" value={stores.length} icon={<Icon name="store" size={20} />} color="var(--blue)" soft="var(--blue-soft)" onClick={() => setPage("stores")} />
        <StatCard label="Titipan Beredar" value={`${activeC.length} item`} icon={<Icon name="package" size={20} />} color="var(--brand-deep)" soft="var(--brand-soft)" onClick={() => setPage("finance", { financeTab: "titipan" })} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, display:"flex", alignItems:"center", gap:8 }}><Icon name="trending-up" size={18} /> Aktivitas 7 Hari Terakhir</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
              <XAxis dataKey="hari" tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} cursor={{ fill: "rgba(76,91,212,0.06)" }} />
              <Bar dataKey="Omset" fill="#4C5BD4" radius={[6,6,0,0]} maxBarSize={26} />
              <Bar dataKey="Biaya" fill="#D93D38" radius={[6,6,0,0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          {pinned && (
            <Card onClick={() => setPage("notes")} style={{ background: "var(--amber-soft)", borderColor: "#F2DFB0" }}>
              <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display:"flex", alignItems:"center", gap:6 }}><Icon name="pin" size={13} /> Catatan Disematkan</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)", fontWeight: 500 }}>{pinned.content}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontWeight: 500 }}>{fmtDate(pinned.date)}</p>
            </Card>
          )}
          <Card onClick={() => setPage("stores")} style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 13, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>Toko Perlu Dikunjungi</p>
            {(() => {
              const byStore = {};
              activeC.forEach(c => { if (!byStore[c.storeId] || c.date < byStore[c.storeId].oldestDate) byStore[c.storeId] = { storeId: c.storeId, oldestDate: c.date }; });
              const now = new Date();
              const overdueStores = Object.values(byStore).map(s => ({ ...s, days: Math.floor((now - new Date(s.oldestDate)) / 864e5) })).sort((a, b) => b.days - a.days).slice(0, 4);
              if (overdueStores.length === 0) return <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center", padding: "16px 0", fontWeight: 500 }}>Belum ada titipan</p>;
              return overdueStores.map(o => {
                const s = stores.find(x => x.id === o.storeId);
                return (
                  <div key={o.storeId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700 }}>{s?.name}</p>
                      <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{fmtDate(o.oldestDate)}</p>
                    </div>
                    <Tag color={o.days >= 7 ? "var(--red)" : o.days >= 3 ? "var(--amber)" : "var(--green)"}>{o.days === 0 ? "Hari ini" : `${o.days} hari`}</Tag>
                  </div>
                );
              });
            })()}
          </Card>
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontWeight: 800, fontSize: 15 }}>Transaksi Terbaru</p>
          <Btn size="sm" variant="outline" onClick={() => setPage("finance")}>Lihat Semua →</Btn>
        </div>
        {transactions.slice(0,6).map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: t.type === "income" ? "var(--green-soft)" : "var(--red-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, color: t.type === "income" ? "var(--green)" : "var(--red)", fontWeight: 800 }}>
                {t.type === "income" ? "↑" : "↓"}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, fontWeight: 500 }}>{fmtDate(t.date)} · {t.category}</p>
              </div>
            </div>
            <p className="tnum" style={{ fontWeight: 800, fontSize: 14.5, color: t.type === "income" ? "var(--green)" : "var(--red)", whiteSpace: "nowrap", marginLeft: 12 }}>
              {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
            </p>
          </div>
        ))}
      </Card>

      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// METRIC DETAIL MODAL
// ─────────────────────────────────────────────
function DeltaBadge({ cur, prev, goodUp = true }) {
  if (!prev && !cur) return null;
  const diff = cur - prev;
  const pct = prev ? Math.round(Math.abs(diff) / Math.abs(prev) * 100) : 100;
  const up = diff >= 0;
  const good = up === goodUp;
  const col = diff === 0 ? "var(--muted)" : good ? "var(--green)" : "var(--red)";
  const bg = diff === 0 ? "var(--bg-2)" : good ? "var(--green-soft)" : "var(--red-soft)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: bg, color: col, fontSize: 12.5, fontWeight: 800 }}>
      <Icon name={up ? "trending-up" : "trending-down"} size={14} />{pct}% vs bln lalu
    </span>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: "var(--bg-2)", borderRadius: 12, padding: "12px 14px" }}>
      <p style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <p className="tnum" style={{ fontSize: 16, fontWeight: 800, marginTop: 4, color: color || "var(--ink)" }}>{value}</p>
    </div>
  );
}

function DistBars({ rows, total, fmtv }) {
  if (!rows.length || !total) return <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, textAlign: "center", padding: "8px 0" }}>Belum ada data bulan ini.</p>;
  return rows.map((r, i) => {
    const pct = total > 0 ? Math.round(r.value / total * 100) : 0;
    return (
      <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 7 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color || "var(--brand)", flexShrink: 0 }} />{r.name}{r.adjusted ? <span style={{ fontSize: 9.5, color: "var(--amber)", background: "var(--amber-soft)", padding: "1px 6px", borderRadius: 99, fontWeight: 800 }}>disesuaikan</span> : null}
          </span>
          <span className="tnum" style={{ fontSize: 13.5, fontWeight: 800, color: r.color || "var(--ink)", flexShrink: 0 }}>{fmtv(r.value)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 7, background: "var(--bg-2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: r.color || "var(--brand)", borderRadius: 99 }} />
          </div>
          <span className="tnum" style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, minWidth: 52, textAlign: "right" }}>{pct}%{r.count != null ? " · " + r.count + "x" : ""}</span>
        </div>
      </div>
    );
  });
}

function MetricDetailModal({ metric, data, onClose }) {
  if (!metric) return null;
  const { transactions = [], routes = [], stores = [] } = data;
  const adj = data.expenseAdjustments || {};
  const config = {
    omset: { title: "Omset Bulan Ini", color: "#138A5E", dataKey: "Omset" },
    pengeluaran: { title: "Pengeluaran Bulan Ini", color: "#D6453F", dataKey: "Biaya" },
    laba: { title: "Laba Bersih", color: "#2563C9", dataKey: "Laba" },
  }[metric];

  const incMonth = (mk) => transactions.filter(t => t.type === "income" && t.date.startsWith(mk)).reduce((s, t) => s + t.amount, 0);
  const effExpMonth = (mk) => {
    const byCat = {};
    transactions.filter(t => t.type === "expense" && !t.personal && t.date.startsWith(mk)).forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    return Object.entries(byCat).reduce((s, [cat, raw]) => { const ov = adj[mk + "|" + cat]; return s + ((ov != null) ? ov : raw); }, 0);
  };

  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const Omset = incMonth(key); const Biaya = effExpMonth(key);
    months.push({ key, label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }), Omset, Biaya, Laba: Omset - Biaya });
  }
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, "0")}`;
  const cur = months.find(m => m.key === thisKey) || { Omset: 0, Biaya: 0, Laba: 0 };
  const prev = months.find(m => m.key === prevKey) || { Omset: 0, Biaya: 0, Laba: 0 };
  const curVal = cur[config.dataKey]; const prevVal = prev[config.dataKey];

  const allValues = months.map(m => m[config.dataKey]);
  const total = allValues.reduce((s, v) => s + v, 0);
  const avg = total / Math.max(1, allValues.filter(v => v !== 0).length);
  const max = Math.max(...allValues, 0);

  const curTx = transactions.filter(t => t.date.startsWith(thisKey));
  const incCount = curTx.filter(t => t.type === "income").length;
  const exCount = curTx.filter(t => t.type === "expense" && !t.personal).length;
  const avgInc = incCount ? cur.Omset / incCount : 0;
  const avgEx = exCount ? cur.Biaya / exCount : 0;
  const marginPct = cur.Omset > 0 ? Math.round(cur.Laba / cur.Omset * 100) : 0;
  const expRatio = cur.Omset > 0 ? Math.round(cur.Biaya / cur.Omset * 100) : 0;

  const routeName = (id) => (routes.find(r => r.id === id) || {}).name;
  const routeColor = (id) => (routes.find(r => r.id === id) || {}).color || "#138A5E";
  const resolveRid = (t) => t.routeId || (t.storeId ? (stores.find(s => s.id === t.storeId) || {}).routeId : null) || null;
  const omsetByRoute = {};
  curTx.filter(t => t.type === "income").forEach(t => { const rid = resolveRid(t); const k = rid || "_none"; if (!omsetByRoute[k]) omsetByRoute[k] = { name: rid ? (routeName(rid) || "Rute") : "Tanpa Rute", color: rid ? routeColor(rid) : "#9AA1AD", value: 0, count: 0 }; omsetByRoute[k].value += t.amount; omsetByRoute[k].count++; });
  const routeDist = Object.values(omsetByRoute).sort((a, b) => b.value - a.value);

  const PIE = ["#E07B1A", "#D6453F", "#D89215", "#138A5E", "#2563C9", "#7C4DD6", "#C2611A"];
  const expByCatCur = {};
  curTx.filter(t => t.type === "expense" && !t.personal).forEach(t => { expByCatCur[t.category] = (expByCatCur[t.category] || 0) + t.amount; });
  const catDist = Object.entries(expByCatCur).map(([name, raw], i) => { const ov = adj[thisKey + "|" + name]; return { name, value: (ov != null) ? ov : raw, raw, adjusted: (ov != null), color: PIE[i % PIE.length] }; }).sort((a, b) => b.value - a.value);

  const grad = `grad-${metric}`;
  const monthLabel = new Date(thisKey + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const sec = (t) => <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "20px 0 8px" }}>{t}</p>;
  const expPct = cur.Omset > 0 ? Math.min(100, Math.round(cur.Biaya / cur.Omset * 100)) : (cur.Biaya > 0 ? 100 : 0);
  const profitBarPct = Math.max(0, 100 - expPct);

  return (
    <Modal show={true} onClose={onClose} title={config.title} subtitle={`${monthLabel} · analisis`} wide>
      <div style={{ background: config.color + "12", border: "1.5px solid " + config.color + "30", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Bulan ini</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
          <span className="tnum" style={{ fontSize: 28, fontWeight: 800, color: (metric === "laba" && curVal < 0) ? "var(--red)" : config.color, letterSpacing: "-0.02em" }}>{fmt(curVal)}</span>
          <DeltaBadge cur={curVal} prev={prevVal} goodUp={metric !== "pengeluaran"} />
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Bulan lalu: {fmt(prevVal)}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {metric === "omset" && <><MiniStat label="Transaksi" value={incCount + "x"} /><MiniStat label="Rata-rata" value={fmtShort(avgInc)} /><MiniStat label="Selisih" value={(curVal - prevVal >= 0 ? "+" : "") + fmtShort(curVal - prevVal)} color={curVal - prevVal >= 0 ? "var(--green)" : "var(--red)"} /></>}
        {metric === "pengeluaran" && <><MiniStat label="Transaksi" value={exCount + "x"} /><MiniStat label="Porsi Omset" value={expRatio + "%"} /><MiniStat label="Rata-rata" value={fmtShort(avgEx)} /></>}
        {metric === "laba" && <><MiniStat label="Margin Laba" value={marginPct + "%"} color={marginPct >= 0 ? "var(--green)" : "var(--red)"} /><MiniStat label="Rasio Biaya" value={expRatio + "%"} /><MiniStat label="Selisih" value={(curVal - prevVal >= 0 ? "+" : "") + fmtShort(curVal - prevVal)} color={curVal - prevVal >= 0 ? "var(--green)" : "var(--red)"} /></>}
      </div>

      {metric === "omset" && <>{sec("Distribusi Omset per Rute")}<DistBars rows={routeDist} total={cur.Omset} fmtv={fmt} /></>}
      {metric === "pengeluaran" && <>{sec("Komposisi per Kategori")}<DistBars rows={catDist} total={cur.Biaya} fmtv={fmt} /></>}
      {metric === "laba" && <>
        {sec("Komposisi Omset")}
        <div style={{ height: 14, borderRadius: 99, overflow: "hidden", display: "flex", background: "var(--bg-2)", marginBottom: 10 }}>
          <div style={{ width: expPct + "%", background: "var(--red)" }} />
          <div style={{ width: profitBarPct + "%", background: "var(--green)" }} />
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red)" }} />Pengeluaran {expPct}%</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--green)" }} />Laba {profitBarPct}%</span>
        </div>
        <DRow label="Omset" value={fmt(cur.Omset)} color="var(--green)" />
        <DRow label="Pengeluaran" value={"- " + fmt(cur.Biaya)} color="var(--red)" />
        <DRow label="Laba bersih" value={fmt(cur.Laba)} color={cur.Laba >= 0 ? "var(--brand)" : "var(--red)"} strong />
      </>}

      {sec("Tren 12 Bulan")}
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs><linearGradient id={grad} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={config.color} stopOpacity={0.25} /><stop offset="100%" stopColor={config.color} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
          <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} />
          <Area type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={3} fill={`url(#${grad})`} dot={{ fill: config.color, r: 3 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="tnum" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 6, fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
        <span>Total 12 bln: <b style={{ color: "var(--ink)" }}>{fmt(total)}</b></span>
        <span>Rata-rata: <b style={{ color: "var(--ink)" }}>{fmtShort(avg)}</b></span>
        <span>Tertinggi: <b style={{ color: "var(--ink)" }}>{fmtShort(max)}</b></span>
      </div>

      <div style={{ marginTop: 22 }}><Btn full variant="ghost" onClick={onClose}>Tutup</Btn></div>
    </Modal>
  );
}

function GrowthCard({ label, now, past }) {
  const has = past != null;
  const diff = has ? now - past : 0;
  const pct = (has && past) ? Math.round(diff / Math.abs(past) * 100) : 0;
  const up = diff >= 0;
  const col = !has || diff === 0 ? "var(--muted)" : up ? "var(--green)" : "var(--red)";
  return (
    <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "13px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      {!has ? <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Belum ada pembanding</p> : (
        <>
          <p className="tnum" style={{ fontSize: 17, fontWeight: 800, color: col, marginTop: 5, lineHeight: 1.1 }}>{diff >= 0 ? "+" : "−"}{fmt(Math.abs(diff))}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: col, fontSize: 12, fontWeight: 800 }}><Icon name={up ? "trending-up" : "trending-down"} size={13} />{Math.abs(pct)}%</span>
            <span style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600 }}>dari {fmtShort(past)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function PersonalDetailModal({ show, transactions, onClose }) {
  if (!show) return null;
  const now = new Date();
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, "0")}`;
  const personal = transactions.filter(t => t.type === "expense" && t.personal);
  const sumK = (k) => personal.filter(t => t.date.startsWith(k)).reduce((s, t) => s + t.amount, 0);
  const cur = sumK(thisKey); const prev = sumK(prevKey);
  const all = personal.reduce((s, t) => s + t.amount, 0);
  const list = personal.filter(t => t.date.startsWith(thisKey)).sort((a, b) => b.date.localeCompare(a.date));
  const monthLabel = new Date(thisKey + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  return (
    <Modal show={true} onClose={onClose} title="Gaji / Prive Owner" subtitle={`${monthLabel} · penarikan pribadi`}>
      <div style={{ background: "var(--brand-soft)", border: "1.5px solid var(--brand-tint)", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Bulan ini</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
          <span className="tnum" style={{ fontSize: 28, fontWeight: 800, color: "var(--brand-deep)", letterSpacing: "-0.02em" }}>{fmt(cur)}</span>
          <DeltaBadge cur={cur} prev={prev} goodUp={false} />
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Bulan lalu: {fmt(prev)} · Total semua: {fmt(all)}</p>
      </div>
      <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "11px 14px", marginBottom: 16, display: "flex", gap: 9, alignItems: "flex-start" }}>
        <Icon name="info" size={16} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 600, lineHeight: 1.5 }}>Penarikan pribadi owner (prive). Tercatat sebagai kas keluar, namun <b>tidak mengurangi laba bersih</b> usaha.</p>
      </div>
      <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Daftar Bulan Ini</p>
      {list.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, textAlign: "center", padding: "8px 0" }}>Belum ada penarikan bulan ini.</p> : list.map(t => (
        <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note || "Gaji Owner"}</p>
            <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{fmtDate(t.date)}</p>
          </div>
          <p className="tnum" style={{ fontSize: 14, fontWeight: 800, color: "var(--brand-deep)", flexShrink: 0 }}>{fmt(t.amount)}</p>
        </div>
      ))}
      <div style={{ marginTop: 20 }}><Btn full variant="ghost" onClick={onClose}>Tutup</Btn></div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────
function Finance({ data, setData, initialTab, onTabConsumed }) {
  const { transactions, consignments = [], products = [], stores = [], routes = [] } = data;
  const [tab, setTab] = useState(initialTab || "ringkasan");
  useEffect(() => { if (initialTab && onTabConsumed) onTabConsumed(); }, []);
  const [period, setPeriod] = useState("bulanan");
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [metricDetail, setMetricDetail] = useState(null);
  const [showPersonal, setShowPersonal] = useState(false);
  const [titipanRoute, setTitipanRoute] = useState(null);
  const [form, setForm] = useState({ type: "income", category: "Penjualan", amount: "", date: today, note: "", routeId: "", personal: false });
  const [catFilter, setCatFilter] = useState("all");
  const [incRouteFilter, setIncRouteFilter] = useState("all");
  const [manageCat, setManageCat] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [adjustMode, setAdjustMode] = useState(false);
  const [adjDraft, setAdjDraft] = useState({});
  const { confirm, Dialog } = useConfirm();

  const inCats = ["Penjualan"];
  const exCats = (data.expenseCategories && data.expenseCategories.length) ? data.expenseCategories : DEFAULT_EXPENSE_CATS;

  const add = () => {
    if (!form.amount || !form.date) return;
    const isPersonal = form.type === "expense" && form.personal;
    const tx = { id: uid(), type: form.type, category: isPersonal ? "Gaji Owner" : form.category, date: form.date, note: form.note, amount: +form.amount };
    if (form.type === "income" && form.routeId) tx.routeId = form.routeId;
    if (isPersonal) tx.personal = true;
    setData(d => ({ ...d, transactions: [tx, ...d.transactions] }));
    setForm({ type: "income", category: "Penjualan", amount: "", date: today, note: "", routeId: "", personal: false });
    setShowAdd(false);
  };

  const addCat = () => {
    const v = newCat.trim(); if (!v) return;
    if (exCats.some(c => c.toLowerCase() === v.toLowerCase())) { setNewCat(""); return; }
    setData(d => ({ ...d, expenseCategories: [...exCats, v] }));
    setForm(f => ({ ...f, category: v })); setNewCat("");
  };
  const removeCat = (c) => {
    if (exCats.length <= 1) return;
    const next = exCats.filter(x => x !== c);
    setData(d => ({ ...d, expenseCategories: next }));
    setForm(f => ({ ...f, category: f.category === c ? (next[0] || "") : f.category }));
  };
  const closeAdd = () => { setShowAdd(false); setManageCat(false); setNewCat(""); };

  const askDelete = (t) => confirm({
    title: "Hapus Transaksi?",
    message: `Transaksi "${t.note || t.category}" sebesar ${fmt(t.amount)} akan dihapus. Tindakan ini tidak bisa dibatalkan.`,
    confirmText: "Ya, Hapus",
    onConfirm: () => setData(d => ({ ...d, transactions: d.transactions.filter(x => x.id !== t.id) })),
  });

  const monthTxF = transactions.filter(t => t.date.startsWith(thisMonth));
  const totalIn = monthTxF.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const totalExRaw = monthTxF.filter(t => t.type === "expense" && !t.personal).reduce((s,t) => s+t.amount, 0);
  const totalPersonal = monthTxF.filter(t => t.type === "expense" && t.personal).reduce((s,t) => s+t.amount, 0);

  const getMonthly = () => {
    const m = {};
    transactions.forEach(t => { if (t.type === "expense" && t.personal) return; const k = t.date.slice(0,7); if (!m[k]) m[k] = { key: k, Omset: 0, Biaya: 0 }; t.type === "income" ? m[k].Omset += t.amount : m[k].Biaya += t.amount; });
    return Object.values(m).sort((a,b) => a.key.localeCompare(b.key)).map(x => ({ ...x, Laba: x.Omset - x.Biaya, label: new Date(x.key+"-01").toLocaleDateString("id-ID",{month:"short",year:"2-digit"}) }));
  };
  const getDaily = () => {
    const d = {};
    transactions.filter(t => t.date.startsWith(thisMonth)).forEach(t => { if (t.type === "expense" && t.personal) return; if (!d[t.date]) d[t.date] = { day: t.date.slice(8), Omset: 0, Biaya: 0 }; t.type === "income" ? d[t.date].Omset += t.amount : d[t.date].Biaya += t.amount; });
    return Object.values(d).sort((a,b) => +a.day - +b.day);
  };

  const chartData = period === "bulanan" ? getMonthly() : getDaily();
  const xKey = period === "bulanan" ? "label" : "day";

  const expByCat = {};
  monthTxF.filter(t => t.type === "expense" && !t.personal).forEach(t => { expByCat[t.category] = (expByCat[t.category]||0) + t.amount; });
  const adj = data.expenseAdjustments || {};
  const adjKey = (cat) => thisMonth + "|" + cat;
  const hasAdj = (cat) => adj[adjKey(cat)] !== undefined && adj[adjKey(cat)] !== null;
  const effExp = (cat, raw) => hasAdj(cat) ? adj[adjKey(cat)] : raw;
  const pieData = Object.entries(expByCat).map(([name,value]) => ({ name, value: effExp(name, value), raw: value, adjusted: hasAdj(name) }));
  const COLORS = ["#E07B1A","#D6453F","#D89215","#138A5E","#2563C9","#7C4DD6","#C2611A"];
  const pieTotal = pieData.reduce((s,d) => s + d.value, 0);
  const totalEx = pieData.reduce((s,d) => s + d.value, 0);
  const anyAdj = pieData.some(d => d.adjusted);
  const enterAdjust = () => { const dr = {}; Object.entries(expByCat).forEach(([cat, raw]) => { dr[cat] = String(effExp(cat, raw)); }); setAdjDraft(dr); setAdjustMode(true); };
  const saveAdjust = () => {
    setData(d => {
      const cur = { ...(d.expenseAdjustments || {}) };
      Object.entries(expByCat).forEach(([cat, raw]) => {
        const v = adjDraft[cat]; const num = (v === "" || v == null || isNaN(+v)) ? null : Math.max(0, Math.round(+v));
        const key = thisMonth + "|" + cat;
        if (num == null || num === raw) delete cur[key]; else cur[key] = num;
      });
      return { ...d, expenseAdjustments: cur };
    });
    setAdjustMode(false);
  };
  const cancelAdjust = () => setAdjustMode(false);
  const removeAdjustment = (month, cat) => confirm({
    title: "Hapus penyesuaian?",
    message: `Penyesuaian ${cat} (${new Date(month + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" })}) akan dihapus dan nilai kembali ke angka asli.`,
    confirmText: "Ya, Hapus", danger: true,
    onConfirm: () => setData(d => { const cur = { ...(d.expenseAdjustments || {}) }; delete cur[month + "|" + cat]; return { ...d, expenseAdjustments: cur }; }),
  });
  const routeName = (id) => (routes.find(r => r.id === id) || {}).name;
  const routeColorOf = (id) => (routes.find(r => r.id === id) || {}).color || "#138A5E";
  const resolveRid = (t) => t.routeId || (t.storeId ? (stores.find(s => s.id === t.storeId) || {}).routeId : null) || null;
  const incByRouteMap = {};
  monthTxF.filter(t => t.type === "income").forEach(t => {
    const rid = resolveRid(t); const key = rid || "_none";
    if (!incByRouteMap[key]) incByRouteMap[key] = { key, rid, name: rid ? (routeName(rid) || "Rute") : "Tanpa Rute", color: rid ? routeColorOf(rid) : "#9AA1AD", value: 0, count: 0 };
    incByRouteMap[key].value += t.amount; incByRouteMap[key].count++;
  });
  const incRouteData = Object.values(incByRouteMap).sort((a,b) => b.value - a.value);
  const incRouteTotal = incRouteData.reduce((s,d) => s + d.value, 0);
  const expenseCatsPresent = Array.from(new Set(transactions.filter(t => t.type === "expense" && !t.personal).map(t => t.category)));
  const incomeRoutesPresent = (() => {
    const m = {};
    transactions.filter(t => t.type === "income").forEach(t => { const rid = resolveRid(t); const k = rid || "_none"; if (!m[k]) m[k] = { key: k, name: rid ? (routeName(rid) || "Rute") : "Tanpa Rute" }; });
    return Object.values(m);
  })();

  const inTimeRange = (dateStr) => {
    if (timeFilter === "all") return true;
    const d = new Date(dateStr + "T00:00:00");
    const now = new Date();
    if (timeFilter === "week") { const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7); return d >= weekAgo && d <= now; }
    if (timeFilter === "month") return dateStr.startsWith(thisMonth);
    if (timeFilter === "year") return dateStr.startsWith(today.slice(0, 4));
    if (timeFilter === "custom") { if (!customRange.from || !customRange.to) return true; return dateStr >= customRange.from && dateStr <= customRange.to; }
    return true;
  };

  const filtered = transactions
    .filter(t => typeFilter === "all" || t.type === typeFilter)
    .filter(t => inTimeRange(t.date))
    .filter(t => {
      if (typeFilter === "expense" && catFilter !== "all") return t.category === catFilter;
      if (typeFilter === "income" && incRouteFilter !== "all") return (resolveRid(t) || "_none") === incRouteFilter;
      return true;
    });
  const filteredIn = filtered.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const filteredEx = filtered.filter(t => t.type === "expense" && !t.personal).reduce((s,t) => s+t.amount, 0);
  const personalInView = filtered.filter(t => t.type === "expense" && t.personal).reduce((s,t) => s+t.amount, 0);
  const rawCatMonth = (month, cat) => transactions.filter(t => t.type === "expense" && !t.personal && t.category === cat && t.date.startsWith(month)).reduce((s,t) => s + t.amount, 0);
  const adjRows = Object.entries(adj).map(([key, adjusted]) => {
    const sep = key.indexOf("|"); const month = key.slice(0, sep); const cat = key.slice(sep + 1);
    const raw = rawCatMonth(month, cat);
    return { id: "adj-" + key, _adj: true, month, category: cat, date: month + "-01", adjusted, raw, delta: adjusted - raw };
  }).filter(r => r.delta !== 0);
  const adjInView = adjRows
    .filter(r => typeFilter !== "income")
    .filter(r => inTimeRange(r.date))
    .filter(r => (typeFilter === "expense" && catFilter !== "all") ? r.category === catFilter : true)
    .sort((a,b) => b.date.localeCompare(a.date));
  const adjDeltaInView = adjInView.reduce((s,r) => s + r.delta, 0);
  const filteredExEff = filteredEx + adjDeltaInView;

  // ── Titipan (consignment) aggregates, filterable by route ──
  const titipanRows = consignments
    .filter(c => c.status === "active" && c.remaining > 0)
    .map(c => {
      const store = stores.find(s => s.id === c.storeId);
      const product = products.find(p => p.id === c.productId);
      return { ...c, store, product, routeId: store?.routeId, value: (product?.price || 0) * c.remaining };
    })
    .filter(r => r.store && r.product);
  const titipanFiltered = titipanRoute ? titipanRows.filter(r => r.routeId === titipanRoute) : titipanRows;
  const titipanValue = titipanFiltered.reduce((s, r) => s + r.value, 0);
  const titipanQty = titipanFiltered.reduce((s, r) => s + r.remaining, 0);
  const titipanStoreCount = new Set(titipanFiltered.map(r => r.storeId)).size;
  const titipanByProduct = Object.values(titipanFiltered.reduce((acc, r) => {
    const k = r.productId;
    if (!acc[k]) acc[k] = { name: r.product.name, price: r.product.price || 0, qty: 0, value: 0 };
    acc[k].qty += r.remaining; acc[k].value += r.value; return acc;
  }, {})).sort((a, b) => b.value - a.value);
  const titipanByStore = Object.values(titipanFiltered.reduce((acc, r) => {
    const k = r.storeId;
    if (!acc[k]) acc[k] = { name: r.store.name, routeId: r.routeId, qty: 0, value: 0, items: 0 };
    acc[k].qty += r.remaining; acc[k].value += r.value; acc[k].items += 1; return acc;
  }, {})).sort((a, b) => b.value - a.value);
  const routeOf = (id) => routes.find(r => r.id === id);

  // ── Aset (assets) ──
  const assets = data.assets || [];
  const [showAsset, setShowAsset] = useState(false);
  const [editAssetId, setEditAssetId] = useState(null);
  const [assetForm, setAssetForm] = useState({ name: "", type: "kas", value: "", note: "" });
  const [detailView, setDetailView] = useState(null); // null | kas | alat | lainnya | piutang
  const assetCat = { kas: { label: "Kas & Bank", icon: "banknote", color: "var(--green)" }, alat: { label: "Peralatan & Inventaris", icon: "settings", color: "var(--blue)" }, lainnya: { label: "Lainnya", icon: "coins", color: "var(--brand)" } };
  const openNewAsset = (type) => { setEditAssetId(null); setAssetForm({ name: "", type: type || "kas", value: "", note: "" }); setShowAsset(true); };
  const openEditAsset = (a) => { setEditAssetId(a.id); setAssetForm({ name: a.name, type: ["kas", "alat"].includes(a.type) ? a.type : "lainnya", value: String(a.value ?? ""), note: a.note || "" }); setShowAsset(true); };
  const saveAsset = () => {
    if (!assetForm.name.trim() || assetForm.value === "") return;
    const val = +assetForm.value || 0;
    if (editAssetId) setData(d => ({ ...d, assets: (d.assets || []).map(x => x.id === editAssetId ? { ...x, name: assetForm.name.trim(), type: assetForm.type, value: val, note: assetForm.note.trim() } : x) }));
    else setData(d => ({ ...d, assets: [{ id: uid(), name: assetForm.name.trim(), type: assetForm.type, value: val, note: assetForm.note.trim() }, ...(d.assets || [])] }));
    setShowAsset(false);
  };
  const askDeleteAsset = (a) => confirm({ title: "Hapus Aset?", message: `"${a.name}" (${fmt(a.value)}) akan dihapus.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({ ...d, assets: (d.assets || []).filter(x => x.id !== a.id) })) });

  const kasTotal = assets.filter(a => a.type === "kas").reduce((s, a) => s + (a.value || 0), 0);
  const alatTotal = assets.filter(a => a.type === "alat").reduce((s, a) => s + (a.value || 0), 0);
  const lainTotal = assets.filter(a => !["kas", "alat"].includes(a.type)).reduce((s, a) => s + (a.value || 0), 0);
  const manualTotal = kasTotal + alatTotal + lainTotal;
  const piutangAset = consignments.filter(c => c.status === "active").reduce((s, c) => { const p = products.find(x => x.id === c.productId); return s + (p ? Math.max(0, (c.deposited || 0) - (c.remaining || 0)) * p.price : 0); }, 0);
  const piutangByStore = stores.map(s => {
    const owed = consignments.filter(c => c.storeId === s.id && c.status === "active").reduce((sum, c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? Math.max(0, (c.deposited || 0) - (c.remaining || 0)) * p.price : 0); }, 0);
    if (owed <= 0) return null;
    return { id: s.id, name: s.name, route: routes.find(r => r.id === s.routeId), owed };
  }).filter(Boolean).sort((a, b) => b.owed - a.owed);
  const nilaiTitipanAll = titipanRows.reduce((s, r) => s + r.value, 0);
  const totalAset = manualTotal + piutangAset + nilaiTitipanAll;
  useEffect(() => {
    setData(d => {
      const snaps = d.assetSnapshots || [];
      if (totalAset === 0 && snaps.length === 0) return d;
      const todays = snaps.filter(s => s.date === today);
      if (todays.length && todays[todays.length - 1].total === totalAset) return d;
      const rest = snaps.filter(s => s.date !== today);
      return { ...d, assetSnapshots: [...rest, { date: today, total: totalAset }].sort((a, b) => a.date.localeCompare(b.date)) };
    });
  }, [totalAset]);
  const assetSnaps = (data.assetSnapshots || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const valueAsOf = (ds) => { let v = null; for (const sn of assetSnaps) { if (sn.date <= ds) v = sn.total; else break; } return v; };
  const offsetDate = (days) => { const [y, m, dd] = today.split("-").map(Number); const dt = new Date(y, m - 1, dd); dt.setDate(dt.getDate() - days); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`; };
  const monthAgoStr = (() => { const [y, m, dd] = today.split("-").map(Number); const dt = new Date(y, m - 1, dd); dt.setMonth(dt.getMonth() - 1); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`; })();
  const growDayBase = valueAsOf(offsetDate(1));
  const growWeekBase = valueAsOf(offsetDate(7));
  const growMonthBase = valueAsOf(monthAgoStr);
  const firstSnap = assetSnaps[0] || null;
  const growChart = assetSnaps.slice(-60).map(sn => ({ total: sn.total, label: sn.date.slice(8) + "/" + sn.date.slice(5, 7) }));

  const titipanBody = (
    <>
      <div className="route-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", overflowY: "hidden", marginBottom: 16, paddingBottom: 6, WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}>
        <button onClick={() => setTitipanRoute(null)}
          style={{ flexShrink: 0, padding: "9px 16px", borderRadius: 99, border: `1.5px solid ${!titipanRoute ? "var(--ink)" : "var(--line-strong)"}`, background: !titipanRoute ? "var(--ink)" : "var(--surface)", color: !titipanRoute ? "#fff" : "var(--ink-2)", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "var(--font)", whiteSpace: "nowrap" }}>
          Semua Rute
        </button>
        {[...routes].sort((a, b) => (b.days || []).includes(todayDay) - (a.days || []).includes(todayDay)).map(r => {
          const active = titipanRoute === r.id;
          const isTdy = (r.days || []).includes(todayDay);
          return (
            <button key={r.id} onClick={() => setTitipanRoute(r.id)}
              style={{ flexShrink: 0, padding: "9px 15px", borderRadius: 99, border: `1.5px solid ${active ? r.color : "var(--line-strong)"}`, background: active ? r.color : "var(--surface)", color: active ? "#fff" : "var(--ink-2)", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "var(--font)", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#fff" : r.color, display: "inline-block", flexShrink: 0 }} />
              {r.name}
              {isTdy && <span style={{ fontSize: 10.5, background: active ? "rgba(255,255,255,0.25)" : "var(--green-soft)", color: active ? "#fff" : "var(--green)", padding: "1px 7px", borderRadius: 99, fontWeight: 800 }}>Hari Ini</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", borderRadius: "var(--r)", padding: 18, color: "#fff", boxShadow: "0 10px 26px rgba(76,91,212,0.22)", gridColumn: "1 / -1" }}>
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.92, display: "flex", alignItems: "center", gap: 7 }}><Icon name="package" size={16} /> Total Nilai Barang Titipan {titipanRoute ? `· ${routeOf(titipanRoute)?.name || ""}` : "· Semua Toko"}</p>
          <p className="tnum" style={{ fontSize: 30, fontWeight: 800, marginTop: 4, lineHeight: 1.1 }}>{fmt(titipanValue)}</p>
          <p className="tnum" style={{ fontSize: 13, fontWeight: 600, opacity: 0.92, marginTop: 6 }}>{titipanQty} bungkus · {titipanStoreCount} toko · {titipanByProduct.length} jenis produk</p>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="package" size={18} /> Rincian per Produk</p>
        {titipanByProduct.length === 0 ? (
          <EmptyState icon={<Icon name="package" size={34} style={{ color: "var(--line-strong)" }} />} title="Tidak ada titipan" sub={titipanRoute ? "Belum ada barang titipan di rute ini" : "Belum ada barang titipan di toko mana pun"} />
        ) : titipanByProduct.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 14.5, fontWeight: 700 }}>{p.name}</p>
              <p className="tnum" style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{p.qty} bks · @ {fmt(p.price)}</p>
            </div>
            <p className="tnum" style={{ fontSize: 15, fontWeight: 800, color: "var(--brand-deep)", whiteSpace: "nowrap" }}>{fmt(p.value)}</p>
          </div>
        ))}
      </Card>

      <Card>
        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="store" size={18} /> Rincian per Toko</p>
        {titipanByStore.length === 0 ? (
          <EmptyState icon={<Icon name="store" size={34} style={{ color: "var(--line-strong)" }} />} title="Tidak ada toko" sub="Belum ada toko dengan barang titipan" />
        ) : titipanByStore.map((s, i) => {
          const rt = routeOf(s.routeId);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700 }}>{s.name}</p>
                  {rt && <Tag color={rt.color}>{rt.name}</Tag>}
                </div>
                <p className="tnum" style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{s.qty} bks · {s.items} jenis produk</p>
              </div>
              <p className="tnum" style={{ fontSize: 15, fontWeight: 800, color: "var(--brand-deep)", whiteSpace: "nowrap" }}>{fmt(s.value)}</p>
            </div>
          );
        })}
      </Card>
    </>
  );

  return (
    <div className="fade-up">
      <SectionHeader title="Keuangan" sub="Catat omset, pengeluaran, dan lihat laporan"
        action={<Btn icon="+" onClick={() => setShowAdd(true)}>Catat Transaksi</Btn>} />

      <Tabs items={[{id:"ringkasan",label:"Ringkasan",icon:"grid"},{id:"grafik",label:"Grafik",icon:"trending-up"},{id:"riwayat",label:"Riwayat",icon:"list"},{id:"titipan",label:"Titipan",icon:"package"},{id:"aset",label:"Aset",icon:"gem"}]} active={tab} onChange={setTab} />


      <div style={{ marginTop: 20 }}>
        {tab === "ringkasan" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { l:"Omset Bulan Ini", v:fmt(totalIn), c:"var(--green)", bg:"var(--green-soft)", icon:"trending-up", key:"omset", neg:false },
                { l:"Pengeluaran Bulan Ini", v:fmt(totalEx), c:"var(--red)", bg:"var(--red-soft)", icon:"trending-down", key:"pengeluaran", neg:false },
                { l:"Laba Bersih", v:fmt(totalIn-totalEx), c:"var(--brand)", bg:"var(--brand-soft)", icon:"coins", key:"laba", neg:(totalIn-totalEx) < 0 },
                { l:"Gaji / Prive Owner", v:fmt(totalPersonal), c:"#7C4DD6", bg:"#ECE6FA", icon:"user", key:"pribadi", neg:false },
              ].map(x => (
                <button key={x.l} onClick={() => x.key === "pribadi" ? setShowPersonal(true) : setMetricDetail(x.key)}
                  style={{ background: "var(--surface)", borderRadius: "var(--r)", padding: 18, border: "1.5px solid var(--line)", textAlign:"left", cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.18s", boxShadow:"var(--shadow-xs)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = x.c + "55"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
                  <div style={{ display: "flex", justifyContent:"space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 12, background: x.bg, color: x.c, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name={x.icon} size={20} /></span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Bulan ini</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{x.l}</p>
                  <p className="tnum" style={{ fontSize: 23, fontWeight: 800, color: x.neg ? "var(--red)" : x.c, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{x.v}</p>
                  <p style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 10, fontWeight: 600, display:"flex", alignItems:"center", gap:5, opacity:0.8 }}>{x.key === "pribadi" ? "Lihat rincian" : "Lihat analisis"} <span style={{ color: x.c }}>→</span></p>
                </button>
              ))}
            </div>
            {pieData.length > 0 && (
              <Card>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:10, flexWrap:"wrap" }}>
                  <p style={{ fontWeight: 800, fontSize: 15 }}>Komposisi Pengeluaran Bulan Ini</p>
                  {!adjustMode && <Btn size="sm" variant="ghost" icon={<Icon name="pencil" size={14} />} onClick={enterAdjust}>Sesuaikan</Btn>}
                </div>
                {adjustMode ? (
                  <div>
                    <p style={{ fontSize:12.5, color:"var(--muted)", fontWeight:500, lineHeight:1.55, marginBottom:14 }}>Ubah nilai pengeluaran tiap kategori untuk bulan ini (mis. jika sebagian bahan masih jadi stok). Riwayat transaksi tidak berubah — ini hanya penyesuaian laporan bulan ini.</p>
                    {Object.entries(expByCat).map(([cat,raw],i) => (
                      <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid var(--line)" }}>
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <div style={{ width:11, height:11, borderRadius:4, background:COLORS[i%COLORS.length], flexShrink:0 }} />
                            <span style={{ fontSize:14, fontWeight:600 }}>{cat}</span>
                          </div>
                          <p style={{ fontSize:11, color:"var(--muted)", fontWeight:600, marginTop:3, marginLeft:20 }}>Asli: {fmt(raw)}{(adjDraft[cat] !== undefined && adjDraft[cat] !== "" && +adjDraft[cat] !== raw) ? <button onClick={() => setAdjDraft(dr => ({...dr,[cat]:String(raw)}))} style={{ marginLeft:8, background:"none", border:"none", color:"var(--brand)", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"var(--font)" }}>samakan</button> : null}</p>
                        </div>
                        <input type="number" inputMode="numeric" value={adjDraft[cat] === undefined ? "" : adjDraft[cat]} onChange={e => setAdjDraft(dr => ({...dr,[cat]:e.target.value}))} style={{ width:130, fontSize:13.5, padding:"9px 11px", textAlign:"right" }} />
                      </div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0 4px" }}>
                      <span style={{ fontSize:13.5, fontWeight:800 }}>Total disesuaikan</span>
                      <span className="tnum" style={{ fontSize:15, fontWeight:800, color:"var(--red)" }}>{fmt(Object.entries(expByCat).reduce((s,[cat,raw]) => { const v=adjDraft[cat]; const num=(v===""||v==null||isNaN(+v))?raw:Math.max(0,+v); return s+num; }, 0))}</span>
                    </div>
                    <div style={{ display:"flex", gap:10, marginTop:14 }}>
                      <Btn full variant="ghost" onClick={cancelAdjust}>Batal</Btn>
                      <Btn full icon={<Icon name="check" size={16} />} onClick={saveAdjust}>Simpan Penyesuaian</Btn>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {pieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                        </Pie></PieChart>
                      </ResponsiveContainer>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        {pieData.map((d,i) => (
                          <div key={d.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--line)" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ width:11, height:11, borderRadius:4, background:COLORS[i%COLORS.length] }} />
                              <span style={{ fontSize:14, fontWeight:600 }}>{d.name}</span>
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                              <span className="tnum" style={{ fontWeight:800, fontSize:14, color:COLORS[i%COLORS.length] }}>{fmt(d.value)}</span>
                              {d.adjusted
                                ? <span style={{ fontSize:10.5, color:"var(--amber)", fontWeight:700 }}>disesuaikan · asli {fmt(d.raw)}</span>
                                : <span style={{ fontSize:11, color:"var(--muted)", fontWeight:700 }}>{pieTotal ? Math.round(d.value/pieTotal*100) : 0}%</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {anyAdj && (
                      <div style={{ marginTop:14, background:"var(--amber-soft)", border:"1.5px solid var(--line)", borderRadius:12, padding:"10px 14px", fontSize:12.5, color:"var(--ink-2)", fontWeight:600, lineHeight:1.5 }}>
                        Total disesuaikan {fmt(totalEx)} (asli {fmt(totalExRaw)}). Selisih {fmt(Math.abs(totalExRaw-totalEx))} {totalExRaw>=totalEx ? "dianggap stok/modal yang belum terpakai bulan ini." : "ditambahkan sebagai biaya bulan ini."}
                      </div>
                    )}
                  </>
                )}
              </Card>
            )}
            {incRouteData.length > 0 && (
              <Card style={{ marginTop: 16 }}>
                <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 18 }}>Penjualan per Rute Bulan Ini</p>
                <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart><Pie data={incRouteData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {incRouteData.map((d,i) => <Cell key={i} fill={d.color} />)}
                    </Pie></PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {incRouteData.map((d) => (
                      <div key={d.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--line)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:11, height:11, borderRadius:4, background:d.color }} />
                          <span style={{ fontSize:14, fontWeight:600 }}>{d.name}</span>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                          <span className="tnum" style={{ fontWeight:800, fontSize:14, color:d.color }}>{fmt(d.value)}</span>
                          <span style={{ fontSize:11, color:"var(--muted)", fontWeight:700 }}>{incRouteTotal ? Math.round(d.value/incRouteTotal*100) : 0}% · {d.count} transaksi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === "grafik" && (
          <div className="fade-up">
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["harian","Harian"],["bulanan","Bulanan"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={period===v?"primary":"ghost"} onClick={() => setPeriod(v)}>{l}</Btn>
              ))}
            </div>
            <Card style={{ marginBottom: 16 }}>
              <p style={{ fontWeight:800, fontSize:15, marginBottom:18 }}>{period === "harian" ? "Omset Harian (Bulan Ini)" : "Omset & Pengeluaran Bulanan"}</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
                  <XAxis dataKey={xKey} tick={{fill:"var(--muted)",fontSize:12,fontWeight:600}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                  <Tooltip contentStyle={{background:"var(--surface)",border:"1.5px solid var(--line)",borderRadius:12,fontSize:12,boxShadow:"var(--shadow)",fontFamily:"var(--font)"}} formatter={v => fmt(v)} cursor={{ fill: "rgba(76,91,212,0.06)" }} />
                  <Legend wrapperStyle={{fontSize:13,color:"var(--muted)",paddingTop:8}} />
                  <Bar dataKey="Omset" fill="#4C5BD4" radius={[6,6,0,0]} maxBarSize={30} />
                  <Bar dataKey="Biaya" fill="#D93D38" radius={[6,6,0,0]} maxBarSize={30} />
                  {period === "bulanan" && <Bar dataKey="Laba" fill="#1F9254" radius={[6,6,0,0]} maxBarSize={30} />}
                </BarChart>
              </ResponsiveContainer>
            </Card>
            {period === "bulanan" && (
              <Card>
                <p style={{ fontWeight:800, fontSize:15, marginBottom:18 }}>Tren Laba Bersih</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs><linearGradient id="labaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1F9254" stopOpacity={0.22} /><stop offset="100%" stopColor="#1F9254" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
                    <XAxis dataKey="label" tick={{fill:"var(--muted)",fontSize:12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                    <Tooltip contentStyle={{background:"var(--surface)",border:"1.5px solid var(--line)",borderRadius:12,fontSize:12,boxShadow:"var(--shadow)",fontFamily:"var(--font)"}} formatter={v => fmt(v)} />
                    <Area type="monotone" dataKey="Laba" stroke="#1F9254" strokeWidth={2.5} fill="url(#labaGrad)" dot={{fill:"#1F9254",r:4}} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {tab === "riwayat" && (
          <div className="fade-up">
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              {[["all","Semua"],["income","Pemasukan"],["expense","Pengeluaran"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={typeFilter===v?"primary":"ghost"} onClick={() => { setTypeFilter(v); setCatFilter("all"); setIncRouteFilter("all"); }}>{l}</Btn>
              ))}
            </div>
            {typeFilter === "expense" && expenseCatsPresent.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Kategori:</span>
                <Btn size="sm" variant={catFilter==="all"?"primary":"ghost"} onClick={() => setCatFilter("all")}>Semua</Btn>
                {expenseCatsPresent.map(c => <Btn key={c} size="sm" variant={catFilter===c?"primary":"ghost"} onClick={() => setCatFilter(c)}>{c}</Btn>)}
              </div>
            )}
            {typeFilter === "income" && incomeRoutesPresent.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Rute:</span>
                <Btn size="sm" variant={incRouteFilter==="all"?"primary":"ghost"} onClick={() => setIncRouteFilter("all")}>Semua</Btn>
                {incomeRoutesPresent.map(r => <Btn key={r.key} size="sm" variant={incRouteFilter===r.key?"primary":"ghost"} onClick={() => setIncRouteFilter(r.key)}>{r.name}</Btn>)}
              </div>
            )}
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform:"uppercase", letterSpacing:"0.04em", display:"inline-flex", alignItems:"center", gap:5 }}><Icon name="calendar" size={13} /> Waktu:</span>
              {[["all","Semua"],["week","Minggu Ini"],["month","Bulan Ini"],["year","Tahun Ini"],["custom","Range Tanggal"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={timeFilter===v?"primary":"ghost"} onClick={() => setTimeFilter(v)}>{l}</Btn>
              ))}
            </div>
            {timeFilter === "custom" && (
              <div style={{ background: "var(--bg-2)", border: "1.5px solid var(--line)", borderRadius: 12, padding: 12, marginBottom: 14, display:"grid", gridTemplateColumns:"1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", marginBottom: 5 }}>Dari Tanggal</p>
                  <input type="date" value={customRange.from} onChange={e => setCustomRange(r => ({...r, from: e.target.value}))} style={{ fontSize: 13, padding: "9px 11px" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", marginBottom: 5 }}>Sampai Tanggal</p>
                  <input type="date" value={customRange.to} onChange={e => setCustomRange(r => ({...r, to: e.target.value}))} style={{ fontSize: 13, padding: "9px 11px" }} />
                </div>
              </div>
            )}
            {(timeFilter !== "all" || typeFilter !== "all") && (filtered.length > 0 || adjInView.length > 0) && (
              <div style={{ background: "var(--brand-soft)", border: "1.5px solid var(--brand-tint)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--brand-deep)", fontWeight: 800 }}>{filtered.length} transaksi{adjInView.length ? ` · ${adjInView.length} penyesuaian` : ""}</span>
                <div className="tnum" style={{ display: "flex", gap: 14, fontSize: 12.5, fontWeight: 800, flexWrap: "wrap" }}>
                  {(typeFilter === "all" || typeFilter === "income") && filteredIn > 0 && <span style={{ color: "var(--green)" }}>+ {fmt(filteredIn)}</span>}
                  {(typeFilter === "all" || typeFilter === "expense") && filteredExEff > 0 && <span style={{ color: "var(--red)" }}>− {fmt(filteredExEff)}</span>}
                  {(typeFilter === "all" || typeFilter === "expense") && personalInView > 0 && <span style={{ color: "#7C4DD6" }}>prive {fmt(personalInView)}</span>}
                  {typeFilter === "all" && <span style={{ color: "var(--brand-deep)" }}>= {fmt(filteredIn - filteredExEff)}</span>}
                </div>
              </div>
            )}
            <Card style={{ padding: "4px 18px" }}>
              {filtered.length === 0 && adjInView.length === 0 && <EmptyState icon={<Icon name="list" size={34} style={{ color: "var(--line-strong)" }} />} title="Tidak ada transaksi" sub="Coba ubah filter atau catat transaksi baru" />}
              {adjInView.map(r => (
                <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--line)", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1 }}>
                    <div style={{ width:40,height:40,borderRadius:11,background:"var(--amber-soft)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--amber)" }}><Icon name="pencil" size={17} /></div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <p style={{ fontSize:14,fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Penyesuaian {r.category}</p>
                      <div style={{ display:"flex",gap:6,marginTop:3,alignItems:"center", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:11.5,color:"var(--muted)", flexShrink:0, fontWeight:500 }}>{new Date(r.month+"-01").toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</span>
                        <span style={{ fontSize:11, color:"var(--amber)", background:"var(--amber-soft)", padding:"2px 8px", borderRadius:99, fontWeight:700, flexShrink:0 }}>asli {fmt(r.raw)} → {fmt(r.adjusted)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6, flexShrink:0 }}>
                    <p className="tnum" style={{ fontWeight:800,fontSize:14,color:"var(--amber)",whiteSpace:"nowrap" }}>{r.delta>0?"+":"−"}{fmt(Math.abs(r.delta))}</p>
                    <Btn size="sm" variant="danger" onClick={() => removeAdjustment(r.month, r.category)}><Icon name="trash" size={14} /></Btn>
                  </div>
                </div>
              ))}
              {filtered.map(t => {
                const isP = t.type === "expense" && t.personal;
                const accent = t.type === "income" ? "var(--green)" : isP ? "#7C4DD6" : "var(--red)";
                const accentSoft = t.type === "income" ? "var(--green-soft)" : isP ? "#ECE6FA" : "var(--red-soft)";
                return (
                <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--line)", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, minWidth: 0, flex: 1 }}>
                    <div style={{ width:40,height:40,borderRadius:11,background:accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:accent,fontWeight:800 }}>
                      {t.type==="income"?"↑":isP?<Icon name="user" size={18} />:"↓"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize:14,fontWeight:600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note||t.category}</p>
                      <div style={{ display:"flex",gap:6,marginTop:3,alignItems:"center", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:11.5,color:"var(--muted)", flexShrink:0, fontWeight:500 }}>{fmtDate(t.date)}</span>
                        <span style={{ fontSize:11, color:accent, background:accentSoft, padding:"2px 8px", borderRadius:99, fontWeight:700, flexShrink:0 }}>{t.category}</span>
                        {isP && <span style={{ fontSize:10, color:"#7C4DD6", background:"#ECE6FA", padding:"2px 8px", borderRadius:99, fontWeight:800, flexShrink:0 }}>Prive</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6, flexShrink:0 }}>
                    <p className="tnum" style={{ fontWeight:800,fontSize:14,color:accent,whiteSpace:"nowrap" }}>
                      {t.type==="income"?"+":"−"}{fmt(t.amount)}
                    </p>
                    <Btn size="sm" variant="danger" onClick={() => askDelete(t)}><Icon name="trash" size={14} /></Btn>
                  </div>
                </div>
                );
              })}
            </Card>
          </div>
        )}

        {tab === "titipan" && (
          <div className="fade-up">
            <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>
              Nilai & jumlah barang titip jual yang <b>masih ada di toko</b> (belum terjual). Modal yang sedang beredar.
            </p>
            {titipanBody}
          </div>
        )}

        {tab === "aset" && (
          <div className="fade-up">
            <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>
              Perkiraan total kekayaan usaha: kas/bank, peralatan, ditambah <b>piutang</b> & <b>nilai barang titipan</b> yang dihitung otomatis dari data toko.
            </p>

            <div style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", borderRadius: "var(--r)", padding: 20, color: "#fff", boxShadow: "0 10px 26px rgba(76,91,212,0.22)", marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.92, display:"flex", alignItems:"center", gap:7 }}><Icon name="gem" size={16} /> Total Aset</p>
              <p className="tnum" style={{ fontSize: 32, fontWeight: 800, marginTop: 4, lineHeight: 1.1 }}>{fmt(totalAset)}</p>
              <p style={{ fontSize: 12, opacity: 0.85, marginTop: 6, fontWeight: 500 }}>Manual {fmt(manualTotal)} · Piutang {fmt(piutangAset)} · Titipan {fmt(nilaiTitipanAll)}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Kas & Bank", icon: "banknote", val: kasTotal, color: "var(--green)", bg: "var(--green-soft)", view: "kas", onClick: () => setDetailView(v => v === "kas" ? null : "kas") },
                { label: "Peralatan", icon: "settings", val: alatTotal, color: "var(--blue)", bg: "var(--blue-soft)", view: "alat", onClick: () => setDetailView(v => v === "alat" ? null : "alat") },
                { label: "Piutang (toko)", icon: "receipt", val: piutangAset, color: "var(--brand-deep)", bg: "var(--brand-soft)", auto: true, view: "piutang", onClick: () => setDetailView(v => v === "piutang" ? null : "piutang") },
                { label: "Nilai Titipan", icon: "package", val: nilaiTitipanAll, color: "var(--brand)", bg: "var(--brand-soft)", auto: true, view: "titipan", onClick: () => setDetailView(v => v === "titipan" ? null : "titipan") },
                ...(lainTotal > 0 ? [{ label: "Lainnya", icon: "coins", val: lainTotal, color: "var(--ink-2)", bg: "var(--bg-2)", view: "lainnya", onClick: () => setDetailView(v => v === "lainnya" ? null : "lainnya") }] : []),
              ].map((c, i) => {
                const clickable = !!c.onClick;
                const selected = c.view && detailView === c.view;
                const Comp = clickable ? "button" : "div";
                return (
                  <Comp key={i} onClick={c.onClick}
                    style={{ textAlign: "left", fontFamily: "var(--font)", width: "100%", background: selected ? c.bg : "var(--surface)", border: `1.5px solid ${selected ? c.color : "var(--line)"}`, borderRadius: 14, padding: 14, cursor: clickable ? "pointer" : "default", transition: "all .16s", boxShadow: selected ? "var(--shadow-sm)" : "none" }}
                    onMouseEnter={clickable ? (e) => { if (!selected) { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; } } : undefined}
                    onMouseLeave={clickable ? (e) => { if (!selected) { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; } } : undefined}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, gap: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={c.icon} size={16} /></span>
                        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.label}{c.auto ? " ·auto" : ""}</span>
                      </span>
                      {clickable && <span style={{ color: c.color, fontSize: 15, fontWeight: 800, flexShrink: 0, transform: selected ? "rotate(90deg)" : "none", transition: "transform .16s", display: "inline-block" }}>→</span>}
                    </div>
                    <p className="tnum" style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{fmt(c.val)}</p>
                  </Comp>
                );
              })}
            </div>

            {!detailView && (
              <Card style={{ marginBottom: 18 }}>
                <p style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Icon name="trending-up" size={18} /> Pertumbuhan Aset</p>
                <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 16, lineHeight: 1.5 }}>Total aset direkam otomatis tiap hari. Perubahan dihitung dari snapshot terakhir yang tersedia.</p>
                {assetSnaps.length < 2 ? (
                  <div style={{ background: "var(--bg)", border: "1.5px dashed var(--line-strong)", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>Pertumbuhan tampil setelah ada minimal 2 hari data. Nilai hari ini sudah direkam — buka lagi besok untuk melihat perubahan harian.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                      <GrowthCard label="Harian" now={totalAset} past={growDayBase} />
                      <GrowthCard label="Mingguan" now={totalAset} past={growWeekBase} />
                      <GrowthCard label="Bulanan" now={totalAset} past={growMonthBase} />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={growChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs><linearGradient id="grad-aset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--brand)" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={20} />
                        <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                        <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} labelFormatter={l => `Tgl ${l}`} />
                        <Area type="monotone" dataKey="total" stroke="var(--brand)" strokeWidth={3} fill="url(#grad-aset)" dot={{ fill: "var(--brand)", r: 2.5 }} activeDot={{ r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                    {firstSnap && <p className="tnum" style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, textAlign: "center", marginTop: 8 }}>Sejak {firstSnap.date.slice(8)}/{firstSnap.date.slice(5, 7)}/{firstSnap.date.slice(0, 4)}: <b style={{ color: (totalAset - firstSnap.total) >= 0 ? "var(--green)" : "var(--red)" }}>{(totalAset - firstSnap.total) >= 0 ? "+" : "−"}{fmt(Math.abs(totalAset - firstSnap.total))}</b></p>}
                  </>
                )}
              </Card>
            )}

            {detailView === "titipan" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><Icon name="package" size={18} /> Rincian Nilai Titipan</p>
                  <Btn size="sm" variant="ghost" onClick={() => setDetailView(null)}>← Semua aset</Btn>
                </div>
                {titipanBody}
              </>
            ) : detailView === "piutang" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><Icon name="receipt" size={18} /> Rincian Piutang per Toko</p>
                  <Btn size="sm" variant="ghost" onClick={() => setDetailView(null)}>← Semua aset</Btn>
                </div>
                {piutangByStore.length === 0 ? (
                  <Card style={{ textAlign: "center", padding: "24px 16px" }}>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>Tidak ada piutang. Semua barang yang sudah laku telah tertagih</p>
                  </Card>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {piutangByStore.map(s => (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14.5, fontWeight: 700, wordBreak: "break-word" }}>{s.name}</p>
                          {s.route && <div style={{ marginTop: 3 }}><Tag color={s.route.color}>{s.route.name}</Tag></div>}
                        </div>
                        <p className="tnum" style={{ fontSize: 15.5, fontWeight: 800, color: "var(--brand-deep)", whiteSpace: "nowrap" }}>{fmt(s.owed)}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--brand-soft)", borderRadius: 12, marginTop: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--brand-deep)" }}>Total Piutang</span>
                      <span className="tnum" style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-deep)" }}>{fmt(piutangAset)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>Piutang = barang yang sudah laku tapi belum ditagih. Lakukan "Kunjungi & Catat" / tagih di toko untuk melunasi.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                    {detailView && <Icon name={assetCat[detailView].icon} size={17} />}{detailView ? `Rincian ${assetCat[detailView].label}` : "Daftar Aset"}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {detailView && <Btn size="sm" variant="ghost" onClick={() => setDetailView(null)}>← Semua</Btn>}
                    <Btn size="sm" icon="+" onClick={() => openNewAsset(detailView || "kas")}>Tambah</Btn>
                  </div>
                </div>
                {(() => {
                  const cats = detailView ? [detailView] : ["kas", "alat", "lainnya"];
                  const visible = cats.filter(catKey => assets.some(a => catKey === "lainnya" ? !["kas", "alat"].includes(a.type) : a.type === catKey));
                  if (!visible.length) {
                    return (
                      <Card style={{ textAlign: "center", padding: "26px 16px" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon name={detailView ? assetCat[detailView].icon : "gem"} size={28} /></div>
                        <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>{detailView ? `Belum ada ${assetCat[detailView].label.toLowerCase()}. Ketuk "Tambah" untuk menambah.` : "Belum ada aset dicatat. Tambahkan kas, saldo bank, motor, etalase, dll."}</p>
                        {!detailView && <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginTop: 6 }}>Piutang & nilai titipan sudah otomatis dihitung di atas.</p>}
                      </Card>
                    );
                  }
                  return visible.map(catKey => {
                    const items = assets.filter(a => catKey === "lainnya" ? !["kas", "alat"].includes(a.type) : a.type === catKey);
                    const meta = assetCat[catKey];
                    return (
                      <div key={catKey} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--muted)", display: "flex", alignItems: "center", gap: 7 }}><Icon name={meta.icon} size={15} /> {meta.label}</p>
                          <p className="tnum" style={{ fontSize: 12.5, fontWeight: 800, color: meta.color }}>{fmt(items.reduce((s, a) => s + (a.value || 0), 0))}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {items.map(a => (
                            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 11, padding: "11px 13px" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", wordBreak: "break-word" }}>{a.name}</p>
                                {a.note && <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginTop: 1 }}>{a.note}</p>}
                              </div>
                              <p className="tnum" style={{ fontSize: 15, fontWeight: 800, color: meta.color, whiteSpace: "nowrap" }}>{fmt(a.value)}</p>
                              <button onClick={() => openEditAsset(a)} title="Edit" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pencil" size={14} /></button>
                              <button onClick={() => askDeleteAsset(a)} title="Hapus" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="trash" size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </>
            )}

            <Card style={{ background: "var(--bg-2)", marginTop: 4 }}>
              <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, lineHeight: 1.55 }}>
                <b>Piutang</b> = nilai barang yang sudah laku di toko tapi belum ditagih. <b>Nilai Titipan</b> = nilai barang yang masih ada di toko. Keduanya dihitung otomatis dari transaksi & stok, jadi tak perlu diinput manual.
              </p>
            </Card>
          </div>
        )}
      </div>

      <Modal show={showAdd} onClose={closeAdd} title="Catat Transaksi Baru">
        <div style={{ display:"flex",gap:8,marginBottom:18 }}>
          <button onClick={() => { setForm(f => ({...f,type:"income",category:"Penjualan",personal:false})); setManageCat(false); }}
            style={{ flex:1,padding:"13px",borderRadius:12,border:`2px solid ${form.type==="income"?"var(--green)":"var(--line-strong)"}`,background:form.type==="income"?"var(--green-soft)":"var(--surface)",color:form.type==="income"?"var(--green)":"var(--muted)",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s" }}>
            Pemasukan
          </button>
          <button onClick={() => setForm(f => ({...f,type:"expense",category:(exCats[0]||"Produksi")}))}
            style={{ flex:1,padding:"13px",borderRadius:12,border:`2px solid ${form.type==="expense"?"var(--red)":"var(--line-strong)"}`,background:form.type==="expense"?"var(--red-soft)":"var(--surface)",color:form.type==="expense"?"var(--red)":"var(--muted)",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s" }}>
            Pengeluaran
          </button>
        </div>
        {form.type === "expense" && (
          <button type="button" onClick={() => setForm(f => ({ ...f, personal: !f.personal }))}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"12px 14px", marginBottom:16, borderRadius:12, border:`1.5px solid ${form.personal ? "var(--brand)" : "var(--line-strong)"}`, background: form.personal ? "var(--brand-soft)" : "var(--surface)", cursor:"pointer", fontFamily:"var(--font)", textAlign:"left" }}>
            <span style={{ minWidth:0 }}>
              <span style={{ display:"block", fontSize:13.5, fontWeight:800, color: form.personal ? "var(--brand-deep)" : "var(--ink)" }}>Pengeluaran pribadi (Gaji Owner)</span>
              <span style={{ display:"block", fontSize:11.5, color:"var(--muted)", fontWeight:500, marginTop:2 }}>Prive owner — tidak mengurangi laba bersih</span>
            </span>
            <span style={{ width:44, height:26, borderRadius:99, background: form.personal ? "var(--brand)" : "var(--line-strong)", position:"relative", flexShrink:0, transition:"all .18s" }}>
              <span style={{ position:"absolute", top:3, left: form.personal ? 21 : 3, width:20, height:20, borderRadius:99, background:"#fff", transition:"all .18s", boxShadow:"var(--shadow-xs)" }} />
            </span>
          </button>
        )}
        {!(form.type === "expense" && form.personal) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
            <label style={{ fontSize:13, fontWeight:700, color:"var(--ink-2)", letterSpacing:"-0.01em" }}>Kategori</label>
            {form.type === "expense" && (
              <button onClick={() => setManageCat(v => !v)} style={{ background:"none", border:"none", color:"var(--brand)", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"var(--font)", display:"flex", alignItems:"center", gap:5 }}>
                <Icon name={manageCat ? "check" : "pencil"} size={13} /> {manageCat ? "Selesai" : "Kelola"}
              </button>
            )}
          </div>
          <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))}>
            {(form.type==="income"?inCats:exCats).map(c => <option key={c}>{c}</option>)}
          </select>
          {form.type === "expense" && manageCat && (
            <div style={{ marginTop:10, background:"var(--bg-2)", border:"1.5px solid var(--line)", borderRadius:12, padding:12 }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
                {exCats.map(c => (
                  <span key={c} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--surface)", border:"1.5px solid var(--line)", borderRadius:99, padding:"5px 6px 5px 12px", fontSize:12.5, fontWeight:600 }}>
                    {c}
                    <button onClick={() => removeCat(c)} disabled={exCats.length<=1} title="Hapus" style={{ width:19, height:19, borderRadius:99, border:"none", background:"var(--red-soft)", color:"var(--red)", cursor: exCats.length<=1?"not-allowed":"pointer", opacity: exCats.length<=1?0.4:1, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="x" size={11} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCat(); } }} placeholder="Nama kategori baru" style={{ flex:1, fontSize:13, padding:"9px 11px" }} />
                <Btn size="sm" icon={<Icon name="check" size={14} />} onClick={addCat}>Tambah</Btn>
              </div>
            </div>
          )}
        </div>
        )}
        {form.type === "income" && (
          <FG label="Rute (opsional)" hint="Tag rute agar omset per rute terhitung otomatis.">
            <select value={form.routeId} onChange={e => setForm(f => ({...f, routeId: e.target.value}))}>
              <option value="">— Tanpa rute —</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </FG>
        )}
        <FG label="Jumlah (Rp)"><input type="number" inputMode="numeric" placeholder="50000" value={form.amount} onChange={e => setForm(f => ({...f,amount:e.target.value}))} /></FG>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))} /></FG>
        <FG label="Keterangan"><input placeholder="Catatan singkat..." value={form.note} onChange={e => setForm(f => ({...f,note:e.target.value}))} /></FG>
        <div style={{ display:"flex",gap:10 }}>
          <Btn full variant="ghost" onClick={closeAdd}>Batal</Btn>
          <Btn full onClick={add}>Simpan</Btn>
        </div>
      </Modal>
      <MetricDetailModal metric={metricDetail} data={data} onClose={() => setMetricDetail(null)} />
      <PersonalDetailModal show={showPersonal} transactions={transactions} onClose={() => setShowPersonal(false)} />

      <Modal show={showAsset} onClose={() => setShowAsset(false)} title={editAssetId ? "Edit Aset" : "Tambah Aset"}>
        <FG label="Jenis Aset">
          <select value={assetForm.type} onChange={e => setAssetForm(f => ({ ...f, type: e.target.value }))}>
            <option value="kas">Kas & Bank</option>
            <option value="alat">Peralatan & Inventaris</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </FG>
        <FG label="Nama Aset"><input placeholder="mis. Kas tunai, Saldo BCA, Motor, Etalase" value={assetForm.name} onChange={e => setAssetForm(f => ({ ...f, name: e.target.value }))} /></FG>
        <FG label="Nilai (Rp)"><input type="number" inputMode="numeric" placeholder="1000000" value={assetForm.value} onChange={e => setAssetForm(f => ({ ...f, value: e.target.value }))} /></FG>
        <FG label="Catatan (opsional)"><input placeholder="keterangan singkat" value={assetForm.note} onChange={e => setAssetForm(f => ({ ...f, note: e.target.value }))} /></FG>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => setShowAsset(false)}>Batal</Btn>
          <Btn full onClick={saveAsset}>Simpan</Btn>
        </div>
      </Modal>
      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// STORE DETAIL PAGE
// ─────────────────────────────────────────────
function StoreDetail({ store, data, setData, onBack }) {
  const { consignments, products, receipts = [], receiptCounter, routes } = data;
  const route = routes.find(r => r.id === store.routeId);
  const sc = consignments.filter(c => c.storeId === store.id && c.status === "active");
  const storeReceipts = receipts.filter(r => r.storeId === store.id);

  const [showDrop, setShowDrop] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dropItems, setDropItems] = useState([{ productId:"", quantity:"" }]);
  const [dropDate, setDropDate] = useState(today);
  const [cashItems, setCashItems] = useState([{ productId:"", quantity:"" }]);
  const [cashDate, setCashDate] = useState(today);
  const [visitItems, setVisitItems] = useState([]);
  const [editForm, setEditForm] = useState({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng });
  const [editStock, setEditStock] = useState(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const nextVisit = nextVisitForDays(route?.days);
  const saveNote = () => { setData(d => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, note: noteDraft.trim() } : s) })); setEditingNote(false); };
  const { confirm, Dialog } = useConfirm();

  // ── Photo gallery ──
  const photos = store.photos || [];
  const camRef = useRef(null);
  const fileRef = useRef(null);
  const [photoView, setPhotoView] = useState(null);
  const [photoFilter, setPhotoFilter] = useState("all");
  const [busyPhoto, setBusyPhoto] = useState(false);
  const [capDraft, setCapDraft] = useState("");
  const PHOTO_LABELS = { stok: { label: "Stok", color: "var(--brand)" }, toko: { label: "Toko", color: "var(--green)" }, lainnya: { label: "Lainnya", color: "var(--muted)" } };
  useEffect(() => { const p = (store.photos || []).find(x => x.id === photoView); setCapDraft(p ? (p.caption || "") : ""); }, [photoView]);
  const writePhotos = (nextPhotos) => {
    const candidate = { ...data, stores: data.stores.map(s => s.id === store.id ? { ...s, photos: nextPhotos } : s) };
    try { localStorage.setItem("kriuk_v6", JSON.stringify(candidate)); }
    catch (e) { alert("Penyimpanan penuh — foto tidak dapat disimpan. Hapus beberapa foto lama lalu coba lagi."); return false; }
    setData(d => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, photos: nextPhotos } : s) }));
    return true;
  };
  const addPhotoFiles = async (fileList) => {
    if (busyPhoto) return;
    const files = Array.from(fileList || []).filter(f => f.type && f.type.startsWith("image/"));
    if (!files.length) return;
    setBusyPhoto(true);
    try {
      const added = [];
      for (const f of files) { try { const src = await resizeImageFile(f); added.push({ id: uid(), src, label: "lainnya", caption: "", ts: Date.now() }); } catch (e) {} }
      if (added.length) { const ok = writePhotos([...added, ...(store.photos || [])]); if (ok && added.length === 1) setPhotoView(added[0].id); }
    } finally { setBusyPhoto(false); }
  };
  const patchPhoto = (id, patch) => writePhotos((store.photos || []).map(p => p.id === id ? { ...p, ...patch } : p));
  const deletePhoto = (id) => { writePhotos((store.photos || []).filter(p => p.id !== id)); setPhotoView(null); };

  const tagihan = sc.reduce((sum,c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? (c.deposited - c.remaining) * p.price : 0); }, 0);
  const totalRemaining = sc.reduce((s,c) => s + c.remaining, 0);

  const addDropItem = () => setDropItems(arr => [...arr, { productId:"", quantity:"" }]);
  const updateDropItem = (i, field, val) => setDropItems(arr => arr.map((x,j) => j===i ? {...x, [field]: val} : x));
  const removeDropItem = (i) => setDropItems(arr => arr.length > 1 ? arr.filter((_,j) => j !== i) : arr);

  const dropTotal = dropItems.reduce((sum, it) => { if (!it.productId || !it.quantity) return sum; const p = products.find(x => x.id === it.productId); return sum + (p ? +it.quantity * p.price : 0); }, 0);

  const drop = () => {
    const validItems = dropItems.filter(it => it.productId && +it.quantity > 0);
    if (validItems.length === 0) return;
    let newConsignments = [...consignments];
    const receiptItems = [];
    let total = 0;
    validItems.forEach(it => {
      const product = products.find(p => p.id === it.productId);
      const qty = +it.quantity;
      const ex = newConsignments.find(c => c.storeId===store.id && c.productId===it.productId && c.status==="active");
      if (ex) newConsignments = newConsignments.map(c => c.id===ex.id ? {...c, deposited:c.deposited+qty, remaining:c.remaining+qty} : c);
      else newConsignments = [...newConsignments, { id: uid(), storeId: store.id, productId: it.productId, deposited: qty, remaining: qty, date: dropDate, status: "active" }];
      receiptItems.push({ productId: it.productId, name: product?.name, qty, price: product?.price || 0 });
      total += qty * (product?.price || 0);
    });
    const notaNo = genNotaNo("drop", receiptCounter || 1);
    const newReceipt = { id: uid(), notaNo, type: "drop", date: dropDate, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: receiptItems, total };
    setData(d => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, lastVisit: today } : s), consignments: newConsignments, receipts: [newReceipt, ...(d.receipts||[])], receiptCounter: (d.receiptCounter||1) + 1 }));
    setPreview(newReceipt);
    setDropItems([{ productId:"", quantity:"" }]);
    setDropDate(today);
    setShowDrop(false);
  };

  const addCashItem = () => setCashItems(arr => [...arr, { productId:"", quantity:"" }]);
  const updateCashItem = (i, field, val) => setCashItems(arr => arr.map((x,j) => j===i ? {...x, [field]: val} : x));
  const removeCashItem = (i) => setCashItems(arr => arr.length > 1 ? arr.filter((_,j) => j !== i) : arr);
  const cashTotal = cashItems.reduce((sum, it) => { if (!it.productId || !it.quantity) return sum; const p = products.find(x => x.id === it.productId); return sum + (p ? +it.quantity * p.price : 0); }, 0);

  const confirmCash = () => {
    const validItems = cashItems.filter(it => it.productId && +it.quantity > 0);
    if (validItems.length === 0) return;
    const newTxs = [];
    const receiptItems = [];
    let total = 0;
    validItems.forEach(it => {
      const product = products.find(p => p.id === it.productId);
      const qty = +it.quantity;
      newTxs.push({ id: uid(), type: "income", category: "Penjualan", storeId: store.id, amount: qty * (product?.price || 0), date: cashDate, note: `${store.name} - ${product?.name} ${qty}bks (tunai)` });
      receiptItems.push({ productId: it.productId, name: product?.name, qty, price: product?.price || 0 });
      total += qty * (product?.price || 0);
    });
    const notaNo = genNotaNo("cash", receiptCounter || 1);
    const newReceipt = { id: uid(), notaNo, type: "cash", date: cashDate, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: receiptItems, total };
    setData(d => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, lastVisit: today } : s), transactions: [...newTxs, ...d.transactions], receipts: [newReceipt, ...(d.receipts||[])], receiptCounter: (d.receiptCounter||1) + 1 }));
    setPreview(newReceipt);
    setCashItems([{ productId:"", quantity:"" }]);
    setCashDate(today);
    setShowCash(false);
  };

  const openVisit = () => {
    setVisitItems(sc.map(c => ({ ...c, soldNow: 0, sisaNow: c.remaining })));
    setShowVisit(true);
  };

  const setSisa = (i, val) => {
    setVisitItems(arr => arr.map((x,j) => {
      if (j !== i) return x;
      const sisa = Math.max(0, Math.min(+val, x.remaining));
      return { ...x, sisaNow: sisa, soldNow: x.remaining - sisa };
    }));
  };

  const confirmVisit = () => {
    const newTxs = [];
    const itemsForReceipt = [];
    let total = 0;
    const newC = consignments.map(c => {
      const item = visitItems.find(x => x.id === c.id);
      if (!item) return c;
      const prod = products.find(p => p.id === c.productId);
      if (item.soldNow > 0 && prod) {
        newTxs.push({ id:uid(), type:"income", category:"Penjualan", storeId: store.id, amount:item.soldNow*prod.price, date:today, note:`${store.name} - ${prod.name} ${item.soldNow}bks` });
        itemsForReceipt.push({ productId: c.productId, name: prod.name, qty: item.soldNow, price: prod.price });
        total += item.soldNow * prod.price;
      }
      const newRem = c.remaining - item.soldNow;
      return {...c, deposited:newRem, remaining:newRem, status:newRem<=0?"closed":"active"};
    });
    if (itemsForReceipt.length > 0) {
      const notaNo = genNotaNo("pay", receiptCounter||1);
      const newReceipt = { id: uid(), notaNo, type: "payment", date: today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: itemsForReceipt, total };
      setData(d => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, lastVisit: today } : s), transactions: [...newTxs, ...d.transactions], consignments: newC, receipts: [newReceipt, ...(d.receipts||[])], receiptCounter: (d.receiptCounter||1) + 1 }));
      setPreview(newReceipt);
    } else {
      setData(d => ({...d, stores: d.stores.map(s => s.id === store.id ? { ...s, lastVisit: today } : s), transactions:[...newTxs,...d.transactions], consignments:newC}));
    }
    setShowVisit(false);
  };

  const saveEdit = () => {
    if (!editForm.name) return;
    setData(d => ({...d, stores: d.stores.map(s => s.id === store.id ? {...s, ...editForm} : s)}));
    setShowEdit(false);
  };

  const saveStockEdit = () => {
    if (!editStock) return;
    const q = Math.max(0, parseInt(editStock.qty, 10) || 0);
    setData(d => ({ ...d, consignments: d.consignments.map(c =>
      c.id === editStock.id ? { ...c, deposited: q, remaining: q, status: q <= 0 ? "closed" : "active" } : c
    )}));
    setEditStock(null);
  };
  const bumpStock = (delta) => setEditStock(s => ({ ...s, qty: String(Math.max(0, (parseInt(s.qty, 10) || 0) + delta)) }));

  const askDelStore = () => confirm({
    title: "Hapus Toko?", message: `Toko "${store.name}" akan dihapus permanen. Riwayat nota tetap tersimpan.`,
    confirmText: "Ya, Hapus Toko", onConfirm: () => { setData(d => ({...d, stores: d.stores.filter(s => s.id !== store.id)})); onBack(); },
  });
  const askDelReceipt = (r) => confirm({
    title: "Hapus Nota?", message: `Nota "${r.notaNo}" akan dihapus dari riwayat.`,
    confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({...d, receipts: d.receipts.filter(x => x.id !== r.id)})),
  });

  const totalTagihanVisit = (visitItems||[]).reduce((s,item) => { const p = products.find(x => x.id === item.productId); return s + (p ? item.soldNow * p.price : 0); }, 0);

  return (
    <div className="fade-up">
      <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--surface)", border:"1.5px solid var(--line)", color:"var(--ink-2)", fontSize:13.5, fontWeight:700, marginBottom:16, padding:"8px 14px", cursor:"pointer", fontFamily:"var(--font)", borderRadius:10, transition:"all .15s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--brand-tint)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}>
        ← Kembali ke daftar toko
      </button>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
          <div style={{ width: 54, height: 54, borderRadius: 15, background: (route?.color || "var(--brand)") + "1e", color: route?.color || "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1.5px solid ${(route?.color || "var(--brand)")}30` }}><Icon name="store" size={26} /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)", marginBottom: 4, wordBreak: "break-word", lineHeight: 1.2 }}>{store.name}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", wordBreak: "break-word", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: 5 }}><Icon name="map-pin" size={14} style={{ marginTop: 2, flexShrink: 0 }} /> {store.address}</p>
            {store.contact && <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}><Icon name="phone" size={13} /> {store.contact}</p>}
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }} title="Edit info" style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="pencil" size={15} /></button>
            <button onClick={askDelStore} title="Hapus toko" style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="trash" size={15} /></button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
          {route && <Tag color={route.color}>{route.name}</Tag>}
          {tagihan > 0 && <Tag color="var(--amber)">Tagihan {fmt(tagihan)}</Tag>}
          <Tag color="var(--brand)">{totalRemaining} bks</Tag>
          {nextVisit != null && nextVisit <= 2 && <Tag color="var(--brand-deep)">Kunjungan {whenLabel(nextVisit)}</Tag>}
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
          {sc.length > 0 && (
            <Btn full size="lg" variant={tagihan > 0 ? "primary" : "outline"} icon={<Icon name={tagihan > 0 ? "banknote" : "check"} size={18} />} onClick={openVisit}>
              {tagihan > 0 ? `Tagih · ${fmt(tagihan)}` : "Kunjungi & Catat"}
            </Btn>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <Btn full size="lg" icon={<Icon name="package" size={18} />} onClick={() => setShowDrop(true)}>Drop</Btn>
            <Btn full size="lg" variant="success" icon={<Icon name="coins" size={18} />} onClick={() => setShowCash(true)}>Jual Tunai</Btn>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: sc.length ? 14 : 0, display: "flex", alignItems: "center", gap: 8 }}><Icon name="package" size={18} /> Stok di Toko {sc.length > 0 && <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>({sc.length} jenis)</span>}</p>
        {sc.length === 0 ? (
          <EmptyState icon={<Icon name="package" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada titipan" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {sc.map(c => {
              const p = products.find(x => x.id === c.productId);
              const stockValue = p ? c.remaining * p.price : 0;
              return (
                <div key={c.id} style={{ background: "var(--bg)", borderRadius: 13, padding: 14, border: "1.5px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
                    <p style={{ fontWeight: 800, fontSize: 14.5, flex: 1 }}>{p?.name}</p>
                    <Tag color="var(--brand)">{p ? fmt(p.price) : "-"}</Tag>
                  </div>
                  <div style={{ background: "var(--surface)", borderRadius: 11, padding: "14px 12px", textAlign: "center", border: "1.5px solid var(--line)", marginBottom: 10 }}>
                    <p className="tnum" style={{ fontSize: 32, fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{c.remaining}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>bks di toko</p>
                  </div>
                  <div className="tnum" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 10 }}>
                    <span>Nilai: <b style={{ color: "var(--ink)" }}>{fmt(stockValue)}</b></span>
                    <span>Drop: <b style={{ color: "var(--ink)" }}>{fmtDate(c.date)}</b></span>
                  </div>
                  <Btn full size="sm" variant="ghost" icon={<Icon name="pencil" size={14} />} onClick={() => setEditStock({ id: c.id, name: p?.name || "Produk", qty: String(c.remaining) })}>Ubah Stok</Btn>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 14.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Icon name="image" size={18} /> Galeri Foto {photos.length > 0 && <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 700 }}>({photos.length})</span>}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" full disabled={busyPhoto} icon={<Icon name="camera" size={16} />} onClick={() => { if (camRef.current) camRef.current.click(); }}>{busyPhoto ? "Memproses…" : "Kamera"}</Btn>
          <Btn variant="outline" full disabled={busyPhoto} icon={<Icon name="image" size={16} />} onClick={() => { if (fileRef.current) fileRef.current.click(); }}>Galeri / File</Btn>
        </div>
        <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => { addPhotoFiles(e.target.files); e.target.value = ""; }} />
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => { addPhotoFiles(e.target.files); e.target.value = ""; }} />
        {photos.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "14px 0 12px" }}>
              {[["all", "Semua"], ["stok", "Stok"], ["toko", "Toko"], ["lainnya", "Lainnya"]].map(([k, lab]) => {
                const cnt = k === "all" ? photos.length : photos.filter(p => (p.label || "lainnya") === k).length;
                if (k !== "all" && cnt === 0) return null;
                const on = photoFilter === k;
                return <button key={k} onClick={() => setPhotoFilter(k)} style={{ padding: "6px 13px", borderRadius: 999, border: `1.5px solid ${on ? "var(--ink)" : "var(--line-strong)"}`, background: on ? "var(--ink)" : "var(--surface)", color: on ? "#fff" : "var(--ink-2)", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "var(--font)" }}>{lab}{k !== "all" ? ` (${cnt})` : ""}</button>;
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {photos.filter(p => photoFilter === "all" || (p.label || "lainnya") === photoFilter).map(p => {
                const meta = PHOTO_LABELS[p.label || "lainnya"];
                return (
                  <button key={p.id} onClick={() => setPhotoView(p.id)} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--line)", padding: 0, cursor: "pointer", background: "var(--bg-2)" }}>
                    <img src={p.src} alt={p.caption || "Foto toko"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <span style={{ position: "absolute", left: 6, bottom: 6, fontSize: 9.5, fontWeight: 800, color: "#fff", background: meta.color, padding: "2px 7px", borderRadius: 99, boxShadow: "0 1px 4px rgba(0,0,0,0.35)" }}>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (editingNote || store.note || nextVisit != null) ? 10 : 0, gap: 8 }}>
          <p style={{ fontSize: 14.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}><Icon name="note" size={18} /> Catatan & Pengingat</p>
          {!editingNote && <Btn variant="ghost" size="sm" icon={store.note ? <Icon name="pencil" size={14} /> : "+"} onClick={() => { setNoteDraft(store.note || ""); setEditingNote(true); }}>{store.note ? "Ubah" : "Tambah"}</Btn>}
        </div>
        {editingNote ? (
          <div>
            <textarea rows={3} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="mis. Tagih bulan lalu · bawa stok extra · kabari pemilik sebelum datang" style={{ width: "100%", resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn variant="ghost" size="sm" onClick={() => setEditingNote(false)}>Batal</Btn>
              <Btn size="sm" icon={<Icon name="check" size={14} />} onClick={saveNote}>Simpan</Btn>
            </div>
          </div>
        ) : store.note ? (
          <p style={{ fontSize: 13.5, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500, background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 10, padding: "10px 12px" }}>{store.note}</p>
        ) : null}
        {!editingNote && nextVisit != null && (
          <div style={{ marginTop: store.note ? 12 : 0, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: nextVisit <= 2 ? "var(--brand-deep)" : "var(--muted)", background: nextVisit <= 2 ? "var(--brand-soft)" : "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 9, padding: "8px 11px" }}>
            <Icon name="bell" size={14} /> Kunjungan {route?.name}: {whenLabel(nextVisit)}
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}><Icon name="map-pin" size={18} /> Lokasi & Peta</p>
          {hasCoords(store) && <Btn size="sm" variant="ghost" icon={<Icon name="pencil" size={14} />} onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }}>Ubah</Btn>}
        </div>
        {hasCoords(store) ? (
          <>
            <div style={{ borderRadius: 13, overflow: "hidden", border: "1.5px solid var(--line)", marginBottom: 12, lineHeight: 0 }}>
              <iframe title="Peta lokasi toko" src={mapsEmbedUrl(store.lat, store.lng)} width="100%" height="200" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}><Btn full icon={<Icon name="navigation" size={16} />} onClick={() => window.open(mapsDirUrl(store), "_blank")}>Rute ke Sini</Btn></div>
              <div style={{ flex: 1, minWidth: 140 }}><Btn full variant="outline" icon={<Icon name="map-pin" size={16} />} onClick={() => window.open(mapsSearchUrl(store), "_blank")}>Buka di Maps</Btn></div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 14px", background: "var(--bg)", borderRadius: 13, border: "1.5px dashed var(--line-strong)" }}>
            <div style={{ color: "var(--line-strong)", display: "flex", justifyContent: "center", marginBottom: 10 }}><Icon name="map-pin" size={30} /></div>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Lokasi belum diatur</p>
            <Btn icon={<Icon name="map-pin" size={16} />} onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }}>Atur Lokasi</Btn>
          </div>
        )}
      </Card>

      <Card>
        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Icon name="receipt" size={18} /> Riwayat Nota {storeReceipts.length > 0 && <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>({storeReceipts.length})</span>}</p>
        {storeReceipts.length === 0 ? (
          <EmptyState icon={<Icon name="receipt" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada nota" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {storeReceipts.map(r => { const m = notaMeta(r.type); const ic = ({ drop: "package", cash: "banknote", payment: "coins" })[r.type] || "receipt"; return (
              <div key={r.id} style={{ background: "var(--bg)", borderRadius: 13, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, border: "1.5px solid var(--line)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: m.soft, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={ic} size={19} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Tag color={m.color}>{m.label}</Tag>
                    <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>{r.notaNo}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, fontWeight: 500 }}>{fmtDate(r.date)} · {(r.items || []).length} item · <b style={{ color: m.color }}>{fmt(r.total)}</b></p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setPreview(r)} title="Lihat" style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="eye" size={15} /></button>
                  <button onClick={() => printNota(r, COMPANY)} title="Cetak" style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--brand)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="printer" size={15} /></button>
                  <button onClick={() => askDelReceipt(r)} title="Hapus" style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="trash" size={15} /></button>
                </div>
              </div>
            ); })}
          </div>
        )}
      </Card>

      {(() => {
        const p = photos.find(x => x.id === photoView);
        if (!p) return null;
        return (
          <Modal show={true} onClose={() => setPhotoView(null)} title="Foto Toko" wide>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "var(--bg-2)", borderRadius: 14, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={p.src} alt={p.caption || "Foto"} style={{ maxWidth: "100%", maxHeight: "56vh", objectFit: "contain", display: "block" }} />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)", marginBottom: 7 }}>Kategori</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(PHOTO_LABELS).map(([k, m]) => {
                    const on = (p.label || "lainnya") === k;
                    return <button key={k} onClick={() => patchPhoto(p.id, { label: k })} style={{ padding: "7px 15px", borderRadius: 999, border: `1.5px solid ${on ? m.color : "var(--line-strong)"}`, background: on ? m.color : "var(--surface)", color: on ? "#fff" : "var(--ink-2)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font)" }}>{m.label}</button>;
                  })}
                </div>
              </div>
              <FG label="Keterangan">
                <input value={capDraft} onChange={e => setCapDraft(e.target.value)} onBlur={() => patchPhoto(p.id, { caption: capDraft.trim() })} placeholder="mis. Stok rak depan, sisa 5 bungkus" />
              </FG>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{fmtDate(new Date(p.ts).toISOString().slice(0, 10))}</span>
                <Btn variant="danger" size="sm" icon={<Icon name="trash" size={15} />} onClick={() => confirm({ title: "Hapus foto?", message: "Foto ini akan dihapus permanen.", confirmText: "Ya, Hapus", onConfirm: () => deletePhoto(p.id) })}>Hapus Foto</Btn>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Drop modal */}
      <Modal show={showDrop} onClose={() => setShowDrop(false)} title="Drop Barang" subtitle={store.name} wide>
        <FG label="Tanggal Drop"><input type="date" value={dropDate} onChange={e=>setDropDate(e.target.value)} /></FG>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 }}>Daftar Barang yang Dititipkan</label>
          {dropItems.map((item, i) => {
            const p = products.find(x => x.id === item.productId);
            const subtotal = p && item.quantity ? +item.quantity * p.price : 0;
            return (
              <div key={i} style={{ background:"var(--bg)", borderRadius:13, padding:13, marginBottom:10, border:"1.5px solid var(--line)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ fontSize:12.5, fontWeight:800, color:"var(--muted)" }}>Barang #{i+1}</p>
                  {dropItems.length > 1 && <Btn size="sm" variant="danger" onClick={() => removeDropItem(i)}><Icon name="trash" size={14} /></Btn>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns: "2fr 1fr", gap:8, marginBottom: subtotal > 0 ? 8 : 0 }}>
                  <select value={item.productId} onChange={e => updateDropItem(i, "productId", e.target.value)}>
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({fmt(p.price)})</option>)}
                  </select>
                  <input type="number" inputMode="numeric" placeholder="Qty" value={item.quantity} onChange={e => updateDropItem(i, "quantity", e.target.value)} min={1} style={{ textAlign:"center" }} />
                </div>
                {subtotal > 0 && <p className="tnum" style={{ fontSize:12.5, color:"var(--muted)", textAlign:"right", fontWeight:500 }}>Subtotal: <b style={{ color:"var(--brand-deep)" }}>{fmt(subtotal)}</b></p>}
              </div>
            );
          })}
          <Btn variant="outline" full icon="+" onClick={addDropItem}>Tambah Barang Lain</Btn>
        </div>
        {dropTotal > 0 && (
          <div style={{ background:"var(--brand-soft)", border:"2px solid var(--brand-tint)", borderRadius:13, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p style={{ fontWeight:800, fontSize:14 }}>Total Nilai Titipan</p>
            <p className="tnum" style={{ fontSize:20, fontWeight:800, color:"var(--brand-deep)" }}>{fmt(dropTotal)}</p>
          </div>
        )}
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowDrop(false)}>Batal</Btn>
          <Btn full onClick={drop}>Drop & Buat Nota</Btn>
        </div>
      </Modal>

      {/* Cash sale modal */}
      <Modal show={showCash} onClose={() => setShowCash(false)} title="Jual Tunai (Bayar Cash)" subtitle={store.name} wide>
        <FG label="Tanggal Penjualan"><input type="date" value={cashDate} onChange={e=>setCashDate(e.target.value)} /></FG>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 }}>Barang yang Dibeli</label>
          {cashItems.map((item, i) => {
            const p = products.find(x => x.id === item.productId);
            const subtotal = p && item.quantity ? +item.quantity * p.price : 0;
            return (
              <div key={i} style={{ background:"var(--bg)", borderRadius:13, padding:13, marginBottom:10, border:"1.5px solid var(--line)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ fontSize:12.5, fontWeight:800, color:"var(--muted)" }}>Barang #{i+1}</p>
                  {cashItems.length > 1 && <Btn size="sm" variant="danger" onClick={() => removeCashItem(i)}><Icon name="trash" size={14} /></Btn>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns: "2fr 1fr", gap:8, marginBottom: subtotal > 0 ? 8 : 0 }}>
                  <select value={item.productId} onChange={e => updateCashItem(i, "productId", e.target.value)}>
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({fmt(p.price)})</option>)}
                  </select>
                  <input type="number" inputMode="numeric" placeholder="Qty" value={item.quantity} onChange={e => updateCashItem(i, "quantity", e.target.value)} min={1} style={{ textAlign:"center" }} />
                </div>
                {subtotal > 0 && <p className="tnum" style={{ fontSize:12.5, color:"var(--muted)", textAlign:"right", fontWeight:500 }}>Subtotal: <b style={{ color:"var(--green)" }}>{fmt(subtotal)}</b></p>}
              </div>
            );
          })}
          <Btn variant="outline" full icon="+" onClick={addCashItem}>Tambah Barang Lain</Btn>
        </div>
        {cashTotal > 0 && (
          <div style={{ background:"var(--green-soft)", border:"2px solid #BCE6D2", borderRadius:13, padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p style={{ fontWeight:800, fontSize:14 }}>Total Penjualan Tunai</p>
            <p className="tnum" style={{ fontSize:20, fontWeight:800, color:"var(--green)" }}>{fmt(cashTotal)}</p>
          </div>
        )}
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowCash(false)}>Batal</Btn>
          <Btn full variant="success" onClick={confirmCash}>Simpan & Buat Nota</Btn>
        </div>
      </Modal>

      {/* Visit modal */}
      <Modal show={showVisit} onClose={() => setShowVisit(false)} title="Kunjungan Toko" subtitle={store.name} wide>
        {visitItems.map((item,i) => {
          const p = products.find(x=>x.id===item.productId);
          return (
            <div key={item.id} style={{ background:"var(--bg)", borderRadius:14, padding:16, marginBottom:14, border:"1.5px solid var(--line)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:6 }}>
                <p style={{ fontWeight:800, fontSize:16 }}>{p?.name}</p>
                <Tag color="var(--muted)">Stok awal: {item.remaining} bks</Tag>
              </div>
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:800, color:"var(--brand-deep)", textTransform:"uppercase", marginBottom:6 }}>Sisa Fisik di Toko</p>
                <input type="number" inputMode="numeric" value={item.sisaNow} min={0} max={item.remaining} onChange={e => setSisa(i, e.target.value)}
                  className="tnum" style={{ textAlign:"center", fontSize:30, fontWeight:800, color:"var(--brand-deep)", padding:"14px", background:"var(--surface)", border:"2px solid var(--brand)" }} />
              </div>
              <div style={{ background:"var(--green-soft)", border:"1.5px solid #BCE6D2", borderRadius:11, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <div>
                    <p style={{ fontSize:11.5, fontWeight:800, color:"var(--green)", textTransform:"uppercase" }}>Terjual (Otomatis)</p>
                    <p className="tnum" style={{ fontSize:11.5, color:"var(--muted)", marginTop:2, fontWeight:500 }}>{item.remaining} stok awal − {item.sisaNow} sisa</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p className="tnum" style={{ fontSize:26, fontWeight:800, color:"var(--green)", lineHeight:1 }}>{item.soldNow} bks</p>
                    {p && <p className="tnum" style={{ fontSize:13, fontWeight:800, color:"var(--green)", marginTop:3 }}>= {fmt(item.soldNow * p.price)}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ background:"linear-gradient(120deg, var(--brand), var(--brand-deep))", borderRadius:14, padding:"16px 20px", marginBottom:16, color:"#fff", boxShadow:"0 8px 22px rgba(76,91,212,0.22)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <p style={{ fontSize:13.5, opacity:0.92, fontWeight:600 }}>Setoran Pemilik Toko</p>
            <p className="tnum" style={{ fontSize:26, fontWeight:800 }}>{fmt(totalTagihanVisit)}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowVisit(false)}>Batal</Btn>
          <Btn full icon={<Icon name="check" size={16} />} onClick={confirmVisit}>Konfirmasi & Buat Nota</Btn>
        </div>
      </Modal>

      <Modal show={showEdit} onClose={() => setShowEdit(false)} title="Edit Info Toko">
        <FG label="Nama Toko"><input value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Rute">
          <select value={editForm.routeId} onChange={e=>setEditForm(f=>({...f,routeId:e.target.value}))}>
            <option value="">-- Pilih Rute --</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </FG>
        <FG label="Alamat"><input value={editForm.address} onChange={e=>setEditForm(f=>({...f,address:e.target.value}))} /></FG>
        <FG label="Kontak"><input value={editForm.contact} onChange={e=>setEditForm(f=>({...f,contact:e.target.value}))} /></FG>
        <div style={{ marginBottom:16 }}>
          <LocationPicker lat={editForm.lat} lng={editForm.lng} address={editForm.address} onChange={(lat,lng)=>setEditForm(f=>({...f,lat,lng}))} />
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowEdit(false)}>Batal</Btn>
          <Btn full onClick={saveEdit}>Simpan</Btn>
        </div>
      </Modal>

      <Modal show={!!editStock} onClose={() => setEditStock(null)} title="Ubah Stok di Toko" subtitle={editStock?.name}>
        <p style={{ fontSize:13, color:"var(--ink-2)", marginBottom:18, lineHeight:1.55, fontWeight:500 }}>
          Atur jumlah stok yang ada di toko secara manual. Berguna untuk koreksi hitung, barang rusak, atau ambil kembali sebagian. <b>Tidak membuat tagihan atau nota.</b>
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:14 }}>
          <button onClick={() => bumpStock(-1)} style={{ width:54, height:54, borderRadius:14, border:"1.5px solid var(--line-strong)", background:"var(--surface)", color:"var(--ink)", fontSize:26, fontWeight:800, cursor:"pointer", fontFamily:"var(--font)", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
          <input type="number" inputMode="numeric" value={editStock?.qty ?? ""} min={0} onChange={e => setEditStock(s => ({ ...s, qty: e.target.value }))}
            className="tnum" style={{ textAlign:"center", fontSize:34, fontWeight:800, color:"var(--brand-deep)", padding:"12px", width:130, border:"2px solid var(--brand)" }} />
          <button onClick={() => bumpStock(1)} style={{ width:54, height:54, borderRadius:14, border:"1.5px solid var(--brand-tint)", background:"var(--brand-soft)", color:"var(--brand-deep)", fontSize:26, fontWeight:800, cursor:"pointer", fontFamily:"var(--font)", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
        </div>
        <p style={{ textAlign:"center", fontSize:12.5, color:"var(--muted)", marginBottom:18, fontWeight:600 }}>bungkus (bks) di toko</p>
        {parseInt(editStock?.qty, 10) === 0 && (
          <div style={{ background:"var(--red-soft)", border:"1.5px solid #F2C7C3", borderRadius:11, padding:"10px 14px", marginBottom:16, fontSize:12.5, color:"var(--red)", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <Icon name="alert" size={15} /> Jumlah 0 — produk ini akan dihapus dari toko.
          </div>
        )}
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={() => setEditStock(null)}>Batal</Btn>
          <Btn full onClick={saveStockEdit}>Simpan</Btn>
        </div>
      </Modal>

      <NotaPreviewModal receipt={preview} onClose={() => setPreview(null)} />
      <Dialog />
    </div>
  );
}

// Swipeable card with swipe-left-to-delete on touch devices
function SwipeableStoreCard({ store, route, sc, products, totalRem, totalOwed, stockValue = 0, dist = null, userLoc = null, onTap, onDelete, onQuickVisit, visitedToday = false }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isHorizontalSwipe = useRef(false);
  const cardRef = useRef(null);
  const ACTION_WIDTH = 90;
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; isHorizontalSwipe.current = false; };
  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isHorizontalSwipe.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
    if (!isHorizontalSwipe.current) return;
    let newOffset = isOpen ? -ACTION_WIDTH + dx : dx;
    newOffset = Math.min(0, newOffset);
    newOffset = Math.max(-ACTION_WIDTH - 30, newOffset);
    setOffsetX(newOffset);
  };
  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current) setOffsetX(isOpen ? -ACTION_WIDTH : 0);
    else { if (offsetX < -SWIPE_THRESHOLD) { setOffsetX(-ACTION_WIDTH); setIsOpen(true); } else { setOffsetX(0); setIsOpen(false); } }
    touchStartX.current = null; touchStartY.current = null;
  };
  const handleCardClick = (e) => {
    if (isOpen) { e.stopPropagation(); setOffsetX(0); setIsOpen(false); return; }
    if (isHorizontalSwipe.current) return;
    onTap();
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r)" }}>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: ACTION_WIDTH, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, color: "#fff", fontWeight: 700 }}
        onClick={() => { setOffsetX(0); setIsOpen(false); onDelete(); }}>
        <span style={{ display:"flex" }}><Icon name="trash" size={20} /></span><span style={{ fontSize: 12 }}>Hapus</span>
      </div>
      <div ref={cardRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onClick={handleCardClick}
        style={{ transform: `translateX(${offsetX}px)`, transition: touchStartX.current == null ? "transform 0.25s ease" : "none",
          background: "var(--surface)", borderRadius: "var(--r)", border: "1.5px solid var(--line)", boxShadow: "var(--shadow-sm)",
          padding: 18, cursor: "pointer", touchAction: "pan-y" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:48, height:48, borderRadius:13, background:(route?.color||"#E07B1A")+"1e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:(route?.color||"#E07B1A"), border:`1.5px solid ${(route?.color||"#E07B1A")}28` }}><Icon name="store" size={24} /></div>
          <div style={{ minWidth:0, flex:1 }}>
            <p style={{ fontWeight:800, fontSize:16, lineHeight:1.2 }}>{store.name}</p>
            <p style={{ fontSize:13, color:"var(--muted)", marginTop:2, fontWeight:500 }}>{store.address}</p>
          </div>
          {hasCoords(store) && (
            <a href={mapsDirUrl(store, userLoc)} target="_blank" rel="noreferrer" title="Rute di Google Maps"
              onClick={e => e.stopPropagation()}
              style={{ width:38, height:38, borderRadius:11, flexShrink:0, background:"var(--blue-soft)", color:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", border:"1.5px solid #C9D9F6" }}><Icon name="navigation" size={17} /></a>
          )}
          <span style={{ color:"var(--brand)", fontSize:20, opacity:0.6 }}>→</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: sc.length > 0 ? 12 : 0 }}>
          {visitedToday && <Tag color="var(--green)" solid>Dikunjungi</Tag>}
          {dist != null && <Tag color="var(--blue)" solid>{fmtDist(dist)}</Tag>}
          {route && <Tag color={route.color}>{route.name}</Tag>}
          {totalRem > 0 && <Tag color="var(--brand)">{totalRem} bks</Tag>}
          {totalOwed > 0 && <Tag color="var(--amber)">{fmt(totalOwed)}</Tag>}
          {sc.length === 0 && <Tag color="var(--muted)">Kosong</Tag>}
        </div>
        {sc.length > 0 && (
          <div style={{ background:"var(--bg)", borderRadius:10, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, border:"1px solid var(--line)" }}>
            <span style={{ fontSize:12.5, color:"var(--muted)", fontWeight:600 }}>{sc.length} produk dititipkan</span>
            <span className="tnum" style={{ fontSize:12.5, fontWeight:800, color:"var(--brand-deep)" }}>{fmt(stockValue)}</span>
          </div>
        )}
        {onQuickVisit && (
          <button onClick={(e) => { e.stopPropagation(); onQuickVisit(); }}
            style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 11, border: `1.5px solid ${visitedToday ? "var(--green)" : "var(--brand)"}`, background: visitedToday ? "var(--green-soft)" : "var(--brand-soft)", color: visitedToday ? "var(--green)" : "var(--brand-deep)", fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "var(--font)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {visitedToday ? "Kunjungi Lagi" : "Kunjungi & Catat"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUICK VISIT BOTTOM SHEET (pintasan kunjungi & catat)
// ─────────────────────────────────────────────
function QuickVisitSheet({ store, data, setData, onClose }) {
  const { consignments, products, receiptCounter } = data;
  const sc = consignments.filter(c => c.storeId === store.id && c.status === "active" && c.remaining > 0);
  const prodOf = (id) => products.find(p => p.id === id);
  const [items, setItems] = useState(sc.map(c => ({ id: c.id, productId: c.productId, remaining: c.remaining, sold: "" })));
  useEffect(() => { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }, []);

  const setSold = (id, val) => setItems(arr => arr.map(x => x.id === id ? { ...x, sold: val } : x));
  const total = items.reduce((s, it) => { const p = prodOf(it.productId); const q = Math.max(0, Math.min(+it.sold || 0, it.remaining)); return s + (p ? q * p.price : 0); }, 0);
  const markVisited = (d) => ({ ...d, stores: d.stores.map(s => s.id === store.id ? { ...s, lastVisit: today } : s) });
  const justVisited = () => { setData(markVisited); onClose(); };

  const save = () => {
    const newTxs = [];
    const receiptItems = [];
    let tot = 0;
    const newC = consignments.map(c => {
      const it = items.find(x => x.id === c.id);
      if (!it) return c;
      const q = Math.max(0, Math.min(+it.sold || 0, c.remaining));
      const prod = prodOf(c.productId);
      if (q > 0 && prod) {
        newTxs.push({ id: uid(), type: "income", category: "Penjualan", storeId: store.id, amount: q * prod.price, date: today, note: `${store.name} - ${prod.name} ${q}bks` });
        receiptItems.push({ productId: c.productId, name: prod.name, qty: q, price: prod.price });
        tot += q * prod.price;
      }
      const newRem = c.remaining - q;
      return { ...c, deposited: newRem, remaining: newRem, status: newRem <= 0 ? "closed" : "active" };
    });
    if (receiptItems.length > 0) {
      const notaNo = genNotaNo("pay", receiptCounter || 1);
      const newReceipt = { id: uid(), notaNo, type: "payment", date: today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: receiptItems, total: tot };
      setData(d => ({ ...markVisited(d), transactions: [...newTxs, ...d.transactions], consignments: newC, receipts: [newReceipt, ...(d.receipts || [])], receiptCounter: (d.receiptCounter || 1) + 1 }));
    } else {
      setData(d => ({ ...markVisited(d), transactions: [...newTxs, ...d.transactions], consignments: newC }));
    }
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(33,26,18,0.42)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ animation: "sheetUp 0.3s cubic-bezier(.22,1,.36,1) both", background: "var(--surface)", borderTopLeftRadius: 26, borderTopRightRadius: 26, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", padding: "12px 18px calc(20px + env(safe-area-inset-bottom))", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--line-strong)", margin: "0 auto 16px" }} />
        <p style={{ fontSize: 18, fontWeight: 800, display:"flex", alignItems:"center", gap:8 }}><Icon name="store" size={20} /> Kunjungi: {store.name}</p>
        <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, marginBottom: store.note ? 10 : 14 }}>Catat berapa yang laku, lalu tandai sudah dikunjungi.</p>
        {store.note && <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 10, padding: "9px 12px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{store.note}</div>}

        {sc.length === 0 ? (
          <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "18px 14px", textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>Tidak ada titipan aktif di toko ini.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {items.map(it => {
              const p = prodOf(it.productId);
              const q = Math.max(0, Math.min(+it.sold || 0, it.remaining));
              return (
                <div key={it.id} style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700 }}>{p?.name || "Produk"}</p>
                      <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Titip {it.remaining} bks · {fmt(p?.price || 0)}/bks</p>
                    </div>
                    <span className="tnum" style={{ fontSize: 14, fontWeight: 800, color: "var(--green)", whiteSpace: "nowrap" }}>{q > 0 ? fmt(q * (p?.price || 0)) : "—"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 700 }}>Terjual:</span>
                    <input type="number" inputMode="numeric" min="0" max={it.remaining} placeholder="0" value={it.sold} onChange={e => setSold(it.id, e.target.value)} style={{ flex: 1 }} />
                    <button onClick={() => setSold(it.id, String(it.remaining))} style={{ flexShrink: 0, padding: "8px 12px", borderRadius: 9, border: "1.5px solid var(--line-strong)", background: "var(--surface)", color: "var(--ink-2)", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "var(--font)", whiteSpace: "nowrap" }}>Semua</button>
                  </div>
                  {q > 0 && <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500, marginTop: 6 }}>Sisa jadi {it.remaining - q} bks</p>}
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 4px 0" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--muted)" }}>Total tagihan</span>
              <span className="tnum" style={{ fontSize: 18, fontWeight: 800, color: "var(--green)" }}>{fmt(total)}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {sc.length === 0 ? (
            <>
              <Btn full variant="ghost" onClick={onClose}>Batal</Btn>
              <Btn full variant="success" icon={<Icon name="check" size={16} />} onClick={justVisited}>Tandai Dikunjungi</Btn>
            </>
          ) : (
            <>
              <Btn full variant="ghost" onClick={justVisited}>Dikunjungi saja</Btn>
              <Btn full variant="success" icon={<Icon name="check" size={16} />} onClick={save}>Catat & Selesai</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STORES PAGE
// ─────────────────────────────────────────────
function Stores({ data, setData, setPage, selectedStoreId, setSelectedStoreId }) {
  const { routes, stores, consignments, products } = data;
  const [selRoute, setSelRoute] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [userLoc, setUserLoc] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle|loading|ok|denied|unavailable
  const [showAddStore, setShowAddStore] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [sf, setSf] = useState({ name:"",address:"",contact:"",routeId:"" });
  const [rf, setRf] = useState({ name:"",color:"#E07B1A",days:[] });
  const [visitFilter, setVisitFilter] = useState("all"); // all | pending | done (hari ini)
  const [quickVisitStore, setQuickVisitStore] = useState(null);
  const { confirm, Dialog } = useConfirm();

  if (selectedStoreId) {
    const store = stores.find(s => s.id === selectedStoreId);
    if (store) return <StoreDetail store={store} data={data} setData={setData} onBack={() => setSelectedStoreId(null)} />;
  }

  const addStore = () => { if (!sf.name || !sf.routeId) return; setData(d => ({...d, stores:[...d.stores,{id:uid(),createdAt:Date.now(),...sf}]})); setSf({name:"",address:"",contact:"",routeId:""}); setShowAddStore(false); };

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocStatus("unavailable"); return; }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocStatus("ok"); },
      (err) => setLocStatus(err.code === 1 ? "denied" : "unavailable"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };
  const pickNearest = () => { setSortBy("nearest"); if (!userLoc && locStatus !== "loading") requestLocation(); };
  const openNewRoute = () => { setEditingRouteId(null); setRf({ name:"", color:"#E07B1A", days:[] }); setShowRouteForm(true); };
  const openEditRoute = (r) => { setEditingRouteId(r.id); setRf({ name:r.name, color:r.color, days:r.days||[] }); setShowRouteForm(true); };
  const saveRoute = () => {
    if (!rf.name.trim()) return;
    if (editingRouteId) setData(d => ({...d, routes: d.routes.map(x => x.id === editingRouteId ? {...x, ...rf} : x)}));
    else setData(d => ({...d, routes:[...d.routes, {id:uid(), ...rf}]}));
    setShowRouteForm(false); setEditingRouteId(null);
  };
  const askDelRoute = (r) => {
    const cnt = stores.filter(s => s.routeId === r.id).length;
    confirm({ title: "Hapus Rute?", message: `Rute "${r.name}" akan dihapus.${cnt > 0 ? ` ${cnt} toko di rute ini akan kehilangan rute-nya.` : ""}`, confirmText: "Ya, Hapus Rute", onConfirm: () => { setData(d => ({...d, routes: d.routes.filter(x => x.id !== r.id)})); if(selRoute===r.id) setSelRoute(null); } });
  };
  const askDelStore = (s) => {
    const hasConsignments = consignments.some(c => c.storeId === s.id && c.status === "active");
    confirm({ title: "Hapus Toko?", message: `Toko "${s.name}" akan dihapus permanen.${hasConsignments ? " Toko ini masih punya titipan aktif!" : ""} Riwayat nota tetap tersimpan.`, confirmText: "Ya, Hapus Toko", onConfirm: () => setData(d => ({...d, stores: d.stores.filter(x => x.id !== s.id)})) });
  };
  const toggleDay = (day) => setRf(f => ({...f,days:f.days.includes(day)?f.days.filter(d=>d!==day):[...f.days,day]}));

  const storesWithMeta = stores.map((s, idx) => {
    const route = routes.find(r => r.id === s.routeId);
    const sc = consignments.filter(c => c.storeId === s.id && c.status === "active");
    const stockValue = sc.reduce((sum,c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? c.remaining * p.price : 0); }, 0);
    const totalOwed = sc.reduce((sum,c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? (c.deposited-c.remaining)*p.price : 0); }, 0);
    const totalRem = sc.reduce((sum,c) => sum + c.remaining, 0);
    const dist = (userLoc && hasCoords(s)) ? distanceKm(userLoc.lat, userLoc.lng, s.lat, s.lng) : null;
    const order = typeof s.createdAt === "number" ? s.createdAt : idx; // chronological proxy (added order)
    return { store: s, route, sc, stockValue, totalOwed, totalRem, dist, order, idx };
  });

  const isVisitedToday = (s) => s.lastVisit === today;
  const q = query.trim().toLowerCase();
  const scoped = storesWithMeta
    .filter(m => !selRoute || m.store.routeId === selRoute)
    .filter(m => !q || m.store.name.toLowerCase().includes(q) || (m.store.address||"").toLowerCase().includes(q));
  const doneCount = scoped.filter(m => isVisitedToday(m.store)).length;
  const pendingCount = scoped.length - doneCount;
  let shown = scoped.filter(m => visitFilter === "all" || (visitFilter === "done" ? isVisitedToday(m.store) : !isVisitedToday(m.store)));
  if (sortBy === "newest") shown = [...shown].sort((a,b) => (b.order - a.order) || (b.idx - a.idx));
  else if (sortBy === "oldest") shown = [...shown].sort((a,b) => (a.order - b.order) || (a.idx - b.idx));
  else if (sortBy === "value-desc") shown = [...shown].sort((a,b) => b.stockValue - a.stockValue);
  else if (sortBy === "value-asc") shown = [...shown].sort((a,b) => a.stockValue - b.stockValue);
  else if (sortBy === "has-stock") shown = [...shown].filter(m => m.stockValue > 0).sort((a,b) => b.stockValue - a.stockValue);
  else if (sortBy === "nearest") shown = [...shown].sort((a,b) => { if (a.dist == null && b.dist == null) return 0; if (a.dist == null) return 1; if (b.dist == null) return -1; return a.dist - b.dist; });
  const noCoordCount = shown.filter(m => !hasCoords(m.store)).length;

  const COLORS = ["#E07B1A","#D6453F","#138A5E","#D89215","#2563C9","#7C4DD6","#C2611A"];

  return (
    <div className="fade-up">
      <SectionHeader title="Daftar Toko" sub="Ketuk toko untuk drop barang, tagih, & cetak nota"
        action={<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" size="sm" icon={<Icon name="navigation" size={15} />} onClick={() => setShowRoutes(true)}>Kelola Rute</Btn>
          <Btn icon="+" onClick={() => setShowAddStore(true)}>Tambah Toko</Btn>
        </div>} />

      <div className="route-scroll" style={{ display:"flex", gap:8, overflowX:"auto", overflowY:"hidden", marginBottom:20, paddingBottom:6, WebkitOverflowScrolling:"touch", scrollbarWidth:"thin" }}>
        <button onClick={() => setSelRoute(null)}
          style={{ flexShrink:0, padding:"9px 16px", borderRadius:99, border:`1.5px solid ${!selRoute?"var(--ink)":"var(--line-strong)"}`, background:!selRoute?"var(--ink)":"var(--surface)", color:!selRoute?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", transition:"all .15s", whiteSpace:"nowrap" }}>
          Semua ({stores.length})
        </button>
        {[...routes].sort((a,b) => (b.days||[]).includes(todayDay) - (a.days||[]).includes(todayDay)).map(r => {
          const cnt = stores.filter(s => s.routeId === r.id).length;
          const isTdy = (r.days||[]).includes(todayDay);
          const isActive = selRoute === r.id;
          return (
            <button key={r.id} onClick={() => setSelRoute(r.id)}
              style={{ flexShrink:0, padding:"9px 15px", borderRadius:99, border:`1.5px solid ${isActive?r.color:"var(--line-strong)"}`, background:isActive?r.color:"var(--surface)", color:isActive?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", display:"inline-flex", alignItems:"center", gap:7, transition:"all .15s", whiteSpace:"nowrap" }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:isActive?"#fff":r.color,display:"inline-block",flexShrink:0}}/>
              {r.name} ({cnt})
              {isTdy && <span style={{fontSize:10.5,background:isActive?"rgba(255,255,255,0.25)":"var(--green-soft)",color:isActive?"#fff":"var(--green)",padding:"1px 7px",borderRadius:99,fontWeight:800}}>Hari Ini</span>}
            </button>
          );
        })}
        <button onClick={() => setShowRoutes(true)}
          style={{ flexShrink:0, padding:"9px 14px", borderRadius:99, border:"1.5px dashed var(--line-strong)", background:"var(--surface)", color:"var(--muted)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", whiteSpace:"nowrap" }}>
          Kelola
        </button>
      </div>

      <div style={{ position:"relative", marginBottom:12 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0.55, pointerEvents:"none", color:"var(--muted)", display:"flex" }}><Icon name="search" size={16} /></span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama toko atau alamat..."
          style={{ paddingLeft:42, paddingRight: query ? 42 : 14 }} />
        {query && (
          <button onClick={() => setQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:8, border:"none", background:"var(--bg-2)", color:"var(--muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="x" size={14} /></button>
        )}
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Urutkan:</span>
        <Btn size="sm" variant={sortBy==="nearest"?"primary":"ghost"} icon={<Icon name="map-pin" size={15} />} onClick={pickNearest}>Terdekat (GPS)</Btn>
        <select value={sortBy} onChange={e => { const v = e.target.value; if (v === "nearest") pickNearest(); else setSortBy(v); }}
          style={{ width:"auto", minWidth:170, paddingTop:9, paddingBottom:9, fontSize:13.5 }}>
          <option value="default">Urutan Asli</option>
          <option value="newest">Terbaru → Terlama</option>
          <option value="oldest">Terlama → Terbaru</option>
          <option value="nearest">Terdekat (GPS)</option>
          <option value="value-desc">Nilai Barang: Tertinggi</option>
          <option value="value-asc">Nilai Barang: Terendah</option>
          <option value="has-stock">Hanya yang Ada Stok</option>
        </select>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Kunjungan hari ini:</span>
        {[{id:"all",label:`Semua (${scoped.length})`},{id:"pending",label:`Belum (${pendingCount})`},{id:"done",label:`Sudah (${doneCount})`}].map(f => {
          const active = visitFilter === f.id;
          const col = f.id === "done" ? "var(--green)" : f.id === "pending" ? "var(--brand)" : "var(--ink)";
          return (
            <button key={f.id} onClick={() => setVisitFilter(f.id)}
              style={{ padding:"8px 14px", borderRadius:99, border:`1.5px solid ${active?col:"var(--line-strong)"}`, background: active?col:"var(--surface)", color: active?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"var(--font)", whiteSpace:"nowrap" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {sortBy === "nearest" && (
        <div style={{ marginBottom:14, borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
          background: locStatus==="ok" ? "var(--green-soft)" : locStatus==="denied"||locStatus==="unavailable" ? "var(--red-soft)" : "var(--brand-soft)",
          border: `1.5px solid ${locStatus==="ok" ? "#BCE6D2" : locStatus==="denied"||locStatus==="unavailable" ? "#F2C7C3" : "var(--brand-tint)"}` }}>
          {locStatus === "loading" && <span style={{ fontSize:13, fontWeight:700, color:"var(--brand-deep)" }}>Mendeteksi lokasi Anda…</span>}
          {locStatus === "ok" && <>
            <span style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>Lokasi terdeteksi — diurutkan dari yang terdekat</span>
            <button onClick={requestLocation} style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"var(--green)", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)" }}>↻ Perbarui</button>
          </>}
          {locStatus === "denied" && <>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--red)" }}>Izin lokasi ditolak. Aktifkan izin lokasi di browser/HP Anda.</span>
            <button onClick={requestLocation} style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"var(--red)", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)" }}>↻ Coba lagi</button>
          </>}
          {locStatus === "unavailable" && <>
            <span style={{ fontSize:13, fontWeight:600, color:"var(--red)" }}>GPS tidak tersedia di sini (mungkin diblokir mode preview). Coba di aplikasi yang sudah di-host.</span>
            <button onClick={requestLocation} style={{ marginLeft:"auto", fontSize:12, fontWeight:700, color:"var(--red)", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)" }}>↻ Coba lagi</button>
          </>}
          {locStatus === "ok" && noCoordCount > 0 && <span style={{ fontSize:12, color:"var(--ink-2)", fontWeight:500, width:"100%" }}>{noCoordCount} toko belum punya titik lokasi (ditaruh di bawah). Buka toko → Edit Info untuk menyetel lokasinya.</span>}
        </div>
      )}

      {shown.length > 0 && (
        <div style={{ background:"var(--bg-2)", border:"1px dashed var(--line-strong)", borderRadius:12, padding:"9px 14px", marginBottom:12, fontSize:12.5, color:"var(--ink-2)", display:"flex", alignItems:"center", gap:8, fontWeight:500 }}>
          <span style={{ display:"flex", color:"var(--amber)" }}><Icon name="lightbulb" size={15} /></span>
          <span>Ketuk toko untuk masuk. <b>Geser kiri</b> untuk hapus toko.</span>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {shown.map(({ store: s, route, sc, stockValue, totalOwed, totalRem, dist }) => (
            <SwipeableStoreCard key={s.id} store={s} route={route} sc={sc} products={products} totalRem={totalRem} totalOwed={totalOwed} stockValue={stockValue} dist={dist} userLoc={userLoc}
              onTap={() => setSelectedStoreId(s.id)} onDelete={() => askDelStore(s)} onQuickVisit={() => setQuickVisitStore(s)} visitedToday={isVisitedToday(s)} />
        ))}
        {shown.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon={<Icon name={visitFilter==="done"?"check":visitFilter==="pending"?"clock":"search"} size={34} style={{ color: "var(--line-strong)" }} />} title={visitFilter==="done" ? "Belum ada toko yang dikunjungi" : visitFilter==="pending" ? "Semua toko sudah dikunjungi" : (q || sortBy === "has-stock") ? "Tidak ada toko yang cocok" : "Belum ada toko"} sub={visitFilter==="done" ? "Toko yang sudah dikunjungi hari ini akan muncul di sini" : visitFilter==="pending" ? "Mantap! Semua toko di daftar ini sudah dikunjungi hari ini" : q ? `Tidak ada toko dengan nama/alamat "${query}"` : sortBy === "has-stock" ? "Tidak ada toko yang punya stok saat ini" : "Tambah toko baru ke rute ini"} /></Card>}
      </div>

      <Modal show={showAddStore} onClose={() => setShowAddStore(false)} title="Tambah Toko Baru">
        <FG label="Nama Toko"><input placeholder="Warung Bu Sari" value={sf.name} onChange={e=>setSf(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Rute">
          <select value={sf.routeId} onChange={e=>setSf(f=>({...f,routeId:e.target.value}))}>
            <option value="">-- Pilih Rute --</option>
            {routes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </FG>
        <FG label="Alamat"><input placeholder="Jl. Melati No. 5" value={sf.address} onChange={e=>setSf(f=>({...f,address:e.target.value}))} /></FG>
        <FG label="Kontak"><input placeholder="0812..." value={sf.contact} onChange={e=>setSf(f=>({...f,contact:e.target.value}))} /></FG>
        <div style={{ marginBottom:16 }}>
          <LocationPicker lat={sf.lat} lng={sf.lng} address={sf.address} onChange={(lat,lng)=>setSf(f=>({...f,lat,lng}))} />
        </div>
        <div style={{display:"flex",gap:10}}><Btn full variant="ghost" onClick={()=>setShowAddStore(false)}>Batal</Btn><Btn full onClick={addStore}>Simpan</Btn></div>
      </Modal>

      <Modal show={showRoutes} onClose={() => setShowRoutes(false)} title="Kelola Rute" subtitle={`${routes.length} rute · atur nama, warna & jadwal hari`} wide>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {routes.length === 0 && <EmptyState icon={<Icon name="navigation" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada rute" sub="Buat rute pertama untuk mengelompokkan toko" />}
          {routes.map(r => {
            const cnt = stores.filter(s => s.routeId === r.id).length;
            const isTdy = (r.days||[]).includes(todayDay);
            return (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, background:"var(--bg)", border:"1.5px solid var(--line)", borderRadius:13, padding:"12px 14px" }}>
                <span style={{ width:14, height:14, borderRadius:"50%", background:r.color, flexShrink:0, border:"2px solid #fff", boxShadow:"0 0 0 1.5px "+r.color }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <p style={{ fontWeight:800, fontSize:15 }}>{r.name}</p>
                    {isTdy && <Tag color="var(--green)">Hari Ini</Tag>}
                    <Tag color="var(--muted)">{cnt} toko</Tag>
                  </div>
                  <p style={{ fontSize:12.5, color:"var(--muted)", marginTop:3, fontWeight:500 }}>
                    {(r.days && r.days.length) ? `${r.days.join(", ")}` : "Belum ada jadwal hari"}
                  </p>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Btn size="sm" variant="ghost" icon={<Icon name="pencil" size={14} />} onClick={() => openEditRoute(r)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelRoute(r)}><Icon name="trash" size={14} /></Btn>
                </div>
              </div>
            );
          })}
        </div>
        <Btn full icon="+" onClick={openNewRoute}>Tambah Rute Baru</Btn>
      </Modal>

      <Modal show={showRouteForm} onClose={() => setShowRouteForm(false)} title={editingRouteId ? "Edit Rute" : "Buat Rute Baru"}>
        <FG label="Nama Rute"><input placeholder="Rute Selatan" value={rf.name} onChange={e=>setRf(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Warna Rute">
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {COLORS.map(c=>(<div key={c} onClick={()=>setRf(f=>({...f,color:c}))} style={{width:36,height:36,borderRadius:11,background:c,cursor:"pointer",border:rf.color===c?"3px solid var(--ink)":"3px solid transparent",transition:"all .15s"}} />))}
          </div>
        </FG>
        <FG label="Jadwal Hari Kunjungan" hint="Pilih hari-hari rute ini dikunjungi. Rute yang jatuh hari ini akan ditandai 'Hari Ini'.">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {dayNames.slice(1).map(d=>(<button key={d} onClick={()=>toggleDay(d)} style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${rf.days.includes(d)?"var(--brand)":"var(--line-strong)"}`,background:rf.days.includes(d)?"var(--brand)":"var(--surface)",color:rf.days.includes(d)?"#fff":"var(--ink-2)",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s"}}>{d}</button>))}
          </div>
        </FG>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowRouteForm(false)}>Batal</Btn>
          <Btn full onClick={saveRoute}>{editingRouteId ? "Simpan Perubahan" : "Simpan Rute"}</Btn>
        </div>
      </Modal>

      {quickVisitStore && <QuickVisitSheet store={quickVisitStore} data={data} setData={setData} onClose={() => setQuickVisitStore(null)} />}

      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTA PREVIEW MODAL
// ─────────────────────────────────────────────
function NotaPreviewModal({ receipt, onClose }) {
  if (!receipt) return null;
  const isDrop = receipt.type === "drop";
  const isCash = receipt.type === "cash";
  const meta = notaMeta(receipt.type);
  return (
    <Modal show={true} onClose={onClose} title={meta.title} wide>
      <div style={{ background: "#fff", border: "1.5px solid var(--line)", borderRadius: 14, padding: 20, marginBottom: 16, color: "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "1px" }}>{COMPANY.name}</p>
            <p style={{ fontSize: 12, fontWeight: 700 }}>{COMPANY.tagline}</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{COMPANY.address}</p>
            <p style={{ fontSize: 11, color: "#555" }}>HP/WA: {COMPANY.phone}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "inline-block", background: "#000", color: "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{meta.printTitle}</span>
            <p style={{ fontSize: 12, fontWeight: 700 }}>No: {receipt.notaNo}</p>
            <p style={{ fontSize: 11, color: "#555" }}>{fmtDate(receipt.date)}</p>
          </div>
        </div>
        <div style={{ marginBottom: 12, fontSize: 12.5 }}>
          <div style={{ display:"flex", marginBottom:3 }}><span style={{width:80,color:"#555",flexShrink:0}}>Kepada Yth:</span><span style={{fontWeight:700}}>{receipt.storeName}</span></div>
          <div style={{ display:"flex", marginBottom:3 }}><span style={{width:80,color:"#555",flexShrink:0}}>Alamat:</span><span style={{fontWeight:600}}>{receipt.storeAddress||"-"}</span></div>
          {receipt.storeContact && <div style={{ display:"flex" }}><span style={{width:80,color:"#555",flexShrink:0}}>Kontak:</span><span style={{fontWeight:600}}>{receipt.storeContact}</span></div>}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 10, minWidth: 400 }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "center", width: 30 }}>No</th>
                <th style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "left" }}>Nama Barang</th>
                <th style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "center", width: 50 }}>Qty</th>
                <th style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "right", width: 80 }}>Harga</th>
                <th style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "right", width: 90 }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {(receipt.items||[]).map((item,i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "center" }}>{i+1}</td>
                  <td style={{ border: "1px solid #333", padding: "6px 8px" }}>{item.name}</td>
                  <td style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "center" }}>{item.qty}</td>
                  <td style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "right" }}>{fmt(item.price)}</td>
                  <td style={{ border: "1px solid #333", padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>{fmt(item.qty*item.price)}</td>
                </tr>
              ))}
              <tr style={{ background: "#f8f8f8" }}>
                <td colSpan={4} style={{ border: "1px solid #333", padding: "8px", textAlign: "right", fontWeight: 700 }}>TOTAL</td>
                <td style={{ border: "1px solid #333", padding: "8px", textAlign: "right", fontWeight: 800, fontSize: 13 }}>{fmt(receipt.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ fontStyle:"italic", fontSize: 11.5, padding: "8px 0", borderBottom: "1px solid #ccc", marginBottom: 10 }}>
          <span style={{ color: "#555" }}>Terbilang: </span><strong>{terbilang(receipt.total).replace(/^./, c => c.toUpperCase())} Rupiah</strong>
        </div>
        <div style={{ fontSize: 11, color: "#444", background: "#fafafa", padding: "8px 10px", borderLeft: "3px solid #888", marginBottom: 14 }}>
          {isDrop ? <><strong>Sistem Titip Jual:</strong> Barang dititipkan untuk dijual. Pembayaran dilakukan saat kunjungan berikutnya berdasarkan jumlah yang terjual.</> : isCash ? <><strong>Penjualan Tunai — LUNAS.</strong> Barang dibeli secara tunai. Terima kasih atas pembeliannya.</> : <><strong>Pembayaran Lunas</strong> atas barang titip jual yang telah terjual. Terima kasih atas kerjasamanya.</>}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20, fontSize: 11.5 }}>
          <div style={{ textAlign:"center", flex:1 }}><p style={{ marginBottom:42 }}>{receipt.storeName}</p><div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div></div>
          <div style={{ textAlign:"center", flex:1 }}><p style={{ marginBottom:42 }}>Hormat Kami,<br/>{COMPANY.name}</p><div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div></div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn full variant="ghost" onClick={onClose}>Tutup</Btn>
        <Btn full icon={<Icon name="printer" size={16} />} onClick={() => printNota(receipt, COMPANY)}>Cetak Nota</Btn>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// RECEIPTS PAGE
// ─────────────────────────────────────────────
function Receipts({ data, setData }) {
  const { receipts = [] } = data;
  const [filterType, setFilterType] = useState("all");
  const [filterStore, setFilterStore] = useState("all");
  const [preview, setPreview] = useState(null);
  const { confirm, Dialog } = useConfirm();

  const filtered = receipts.filter(r => { if (filterType !== "all" && r.type !== filterType) return false; if (filterStore !== "all" && r.storeId !== filterStore) return false; return true; });

  const askDelete = (r) => confirm({
    title: "Hapus Nota?", message: `Nota "${r.notaNo}" untuk ${r.storeName} akan dihapus dari riwayat. Tindakan ini tidak bisa dibatalkan.`,
    confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({ ...d, receipts: d.receipts.filter(x => x.id !== r.id) })),
  });

  const allStores = [...new Set(receipts.map(r => r.storeId))].map(id => receipts.find(r => r.storeId === id)).filter(Boolean);
  const totalDrop = receipts.filter(r=>r.type==="drop").reduce((s,r)=>s+(r.total||0),0);
  const totalPay = receipts.filter(r=>r.type==="payment").reduce((s,r)=>s+(r.total||0),0);
  const totalCash = receipts.filter(r=>r.type==="cash").reduce((s,r)=>s+(r.total||0),0);

  return (
    <div className="fade-up">
      <SectionHeader title="Nota & Bukti" sub="Riwayat nota penitipan, pembayaran & penjualan tunai" />

      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Nota" value={receipts.length} icon={<Icon name="receipt" size={20} />} color="var(--brand)" soft="var(--brand-soft)" />
        <StatCard label="Nota Penitipan" value={receipts.filter(r=>r.type==="drop").length} sub={fmt(totalDrop)} icon={<Icon name="package" size={20} />} color="var(--blue)" soft="var(--blue-soft)" />
        <StatCard label="Nota Pembayaran" value={receipts.filter(r=>r.type==="payment").length} sub={fmt(totalPay)} icon={<Icon name="coins" size={20} />} color="var(--amber)" soft="var(--amber-soft)" />
        <StatCard label="Penjualan Tunai" value={receipts.filter(r=>r.type==="cash").length} sub={fmt(totalCash)} icon={<Icon name="banknote" size={20} />} color="var(--green)" soft="var(--green-soft)" />
      </div>

      <Card style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>Filter:</span>
          {[["all","Semua"],["drop","Penitipan"],["payment","Pembayaran"],["cash","Tunai"]].map(([v,l]) => (
            <Btn key={v} size="sm" variant={filterType===v?"primary":"ghost"} onClick={() => setFilterType(v)}>{l}</Btn>
          ))}
          {allStores.length > 0 && (
            <select value={filterStore} onChange={e=>setFilterStore(e.target.value)} style={{ width: "auto", minWidth: 140, padding: "8px 12px", fontSize: 13 }}>
              <option value="all">Semua Toko</option>
              {allStores.map(r => <option key={r.storeId} value={r.storeId}>{r.storeName}</option>)}
            </select>
          )}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Icon name="receipt" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada nota" sub="Nota akan otomatis dibuat saat drop barang & kunjungan tagih" /></Card>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map(r => { const m = notaMeta(r.type); const ic = ({ drop: "package", cash: "banknote", payment: "coins" })[r.type] || "receipt"; return (
            <Card key={r.id}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: m.soft, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={ic} size={22} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                    <Tag color={m.color}>NOTA {m.label}</Tag>
                    <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>{r.notaNo}</span>
                  </div>
                  <p style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.25, wordBreak: "break-word" }}>{r.storeName}</p>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{fmtDate(r.date)} · {(r.items || []).length} item</p>
                </div>
                <p className="tnum" style={{ fontSize: 18, fontWeight: 800, color: m.color, flexShrink: 0, whiteSpace: "nowrap" }}>{fmt(r.total)}</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <Btn size="sm" variant="outline" full icon={<Icon name="eye" size={15} />} onClick={() => setPreview(r)}>Lihat</Btn>
                <Btn size="sm" variant="primary" full icon={<Icon name="printer" size={15} />} onClick={() => printNota(r, COMPANY)}>Cetak</Btn>
                <Btn size="sm" variant="danger" onClick={() => askDelete(r)}><Icon name="trash" size={15} /></Btn>
              </div>
            </Card>
          ); })}
        </div>
      )}

      <NotaPreviewModal receipt={preview} onClose={() => setPreview(null)} />
      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────
function Notes({ data, setData }) {
  const { notes } = data;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ content: "", date: today, pinned: false });
  const [editId, setEditId] = useState(null);
  const { confirm, Dialog } = useConfirm();

  const save = () => {
    if (!form.content.trim()) return;
    if (editId) setData(d => ({...d, notes: d.notes.map(n => n.id===editId ? {...n,...form} : n)}));
    else setData(d => ({...d, notes:[{id:uid(),...form},...d.notes]}));
    setForm({content:"",date:today,pinned:false}); setEditId(null); setShowAdd(false);
  };
  const askDel = (n) => confirm({ title: "Hapus Catatan?", message: `Catatan tanggal ${fmtDate(n.date)} akan dihapus permanen.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({...d, notes: d.notes.filter(x => x.id !== n.id)})) });
  const togglePin = (id) => setData(d => ({...d, notes: d.notes.map(n => n.id===id ? {...n, pinned: !n.pinned} : n)}));

  const sorted = [...notes].sort((a,b) => { if (a.pinned && !b.pinned) return -1; if (!a.pinned && b.pinned) return 1; return b.date.localeCompare(a.date); });

  return (
    <div className="fade-up">
      <SectionHeader title="Catatan Harian" sub="Simpan memo, rencana, dan pengingat"
        action={<Btn icon="+" onClick={() => { setForm({content:"",date:today,pinned:false}); setEditId(null); setShowAdd(true); }}>Catatan Baru</Btn>} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {sorted.map(n => (
          <Card key={n.id} style={{ background: n.pinned ? "var(--amber-soft)" : "var(--surface)", borderColor: n.pinned ? "#F2DFB0" : "var(--line)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <p style={{ fontSize:12.5,color:"var(--muted)",fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>{n.pinned && <Icon name="pin" size={12} style={{ color:"var(--amber)" }} />}{fmtDate(n.date)}</p>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={() => togglePin(n.id)} title="Sematkan" style={{ background:"none",border:"none",cursor:"pointer",opacity:n.pinned?1:0.45,color:"var(--amber)",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="pin" size={15} /></button>
                <button onClick={() => { setForm({content:n.content,date:n.date,pinned:n.pinned}); setEditId(n.id); setShowAdd(true); }} title="Edit" style={{ background:"none",border:"none",cursor:"pointer",color:"var(--ink-2)",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="pencil" size={15} /></button>
                <button onClick={() => askDel(n)} title="Hapus" style={{ background:"none",border:"none",cursor:"pointer",color:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon name="trash" size={15} /></button>
              </div>
            </div>
            <p style={{ fontSize:14.5,lineHeight:1.65,whiteSpace:"pre-wrap", fontWeight:500 }}>{n.content}</p>
          </Card>
        ))}
        {notes.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon={<Icon name="note" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada catatan" sub="Tulis catatan pertama Anda" /></Card>}
      </div>

      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title={editId ? "Edit Catatan" : "Catatan Baru"}>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></FG>
        <FG label="Isi Catatan"><textarea rows={5} placeholder="Tulis catatanmu..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} style={{resize:"vertical"}} /></FG>
        <label style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer", padding:"12px 14px", background:"var(--bg-2)", borderRadius:11, border:"1.5px solid var(--line)" }}>
          <input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))} style={{width:"auto"}} />
          <span style={{fontSize:13.5,color:"var(--ink-2)", fontWeight:600, display:"flex", alignItems:"center", gap:7}}><Icon name="pin" size={14} /> Sematkan catatan ini di Beranda</span>
        </label>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowAdd(false)}>Batal</Btn>
          <Btn full onClick={save}>{editId ? "Update" : "Simpan"}</Btn>
        </div>
      </Modal>
      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
function Products({ data, setData }) {
  const { products } = data;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"",price:"",costPrice:"" });
  const [editId, setEditId] = useState(null);
  const { confirm, Dialog } = useConfirm();

  const save = () => {
    if (!form.name || !form.price) return;
    if (editId) setData(d => ({...d, products: d.products.map(p => p.id===editId ? {...p,...form,price:+form.price,costPrice:+form.costPrice} : p)}));
    else setData(d => ({...d, products:[...d.products,{id:uid(),...form,price:+form.price,costPrice:+form.costPrice}]}));
    setForm({name:"",price:"",costPrice:""}); setEditId(null); setShowAdd(false);
  };
  const askDel = (p) => confirm({ title: "Hapus Produk?", message: `Produk "${p.name}" akan dihapus. Titipan yang sudah ada di toko tidak ikut terhapus, tapi tidak bisa drop produk ini lagi.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({...d, products: d.products.filter(x => x.id !== p.id)})) });

  return (
    <div className="fade-up">
      <SectionHeader title="Produk" sub="Kelola daftar produk Snack Kriuk"
        action={<Btn icon="+" onClick={() => { setForm({name:"",price:"",costPrice:""}); setEditId(null); setShowAdd(true); }}>Tambah Produk</Btn>} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
        {products.map(p => {
          const margin = p.costPrice ? Math.round(((p.price - p.costPrice)/p.price)*100) : 0;
          return (
            <Card key={p.id}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
                <div style={{ width:50,height:50,borderRadius:14,background:"var(--brand-soft)",display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid var(--brand-tint)", color:"var(--brand)" }}><Icon name="package" size={24} /></div>
                <div style={{ display:"flex",gap:6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setForm({name:p.name,price:p.price,costPrice:p.costPrice}); setEditId(p.id); setShowAdd(true); }}><Icon name="pencil" size={14} /></Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDel(p)}><Icon name="trash" size={14} /></Btn>
                </div>
              </div>
              <p style={{ fontWeight:800,fontSize:15.5,marginBottom:5 }}>{p.name}</p>
              <p className="tnum" style={{ fontSize:22,fontWeight:800,color:"var(--brand-deep)",marginBottom:10 }}>{fmt(p.price)}</p>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {p.costPrice > 0 && <Tag color="var(--amber)">HPP {fmt(p.costPrice)}</Tag>}
                {margin > 0 && <Tag color="var(--green)">Margin {margin}%</Tag>}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title={editId ? "Edit Produk" : "Tambah Produk"}>
        <FG label="Nama Produk"><input placeholder="Kriuk Original" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Harga Jual (Rp)"><input type="number" inputMode="numeric" placeholder="8000" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} /></FG>
        <FG label="Harga Pokok / HPP (Rp)" hint="Opsional, untuk hitung margin"><input type="number" inputMode="numeric" placeholder="4000" value={form.costPrice} onChange={e=>setForm(f=>({...f,costPrice:e.target.value}))} /></FG>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowAdd(false)}>Batal</Btn>
          <Btn full onClick={save}>Simpan</Btn>
        </div>
      </Modal>
      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCTION — STOK VARIAN & HPP
// ─────────────────────────────────────────────
function DRow({ label, value, strong, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
      <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, minWidth: 0 }}>{label}</span>
      <span className="tnum" style={{ fontSize: strong ? 15 : 13.5, fontWeight: strong ? 800 : 700, color: color || "var(--ink)", flexShrink: 0, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Stepper({ value, setValue, chips, allowNegative }) {
  const cur = parseInt(value) || 0;
  const setN = (n) => setValue(allowNegative ? n : Math.max(0, n));
  const btn = (bg, col) => ({ width: 54, height: 54, borderRadius: 14, border: "1.5px solid var(--line)", background: bg, color: col, fontSize: 28, fontWeight: 800, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 });
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" aria-label="Kurangi" onClick={() => setN(cur - 1)} style={btn("var(--red-soft)", "var(--red)")}>−</button>
        <input type="number" inputMode="numeric" placeholder="0" value={value} onFocus={e => e.target.select()} onChange={e => { const raw = e.target.value; if (raw === "" || raw === "-") { setValue(raw); return; } const n = parseInt(raw) || 0; setValue(allowNegative ? n : Math.max(0, n)); }} style={{ flex: 1, textAlign: "center", fontSize: 24, fontWeight: 800, padding: "13px 8px", minWidth: 0 }} />
        <button type="button" aria-label="Tambah" onClick={() => setN(cur + 1)} style={btn("var(--green-soft)", "var(--green)")}>+</button>
      </div>
      {chips && chips.length > 0 && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
          {chips.map(n => <button key={n} type="button" onClick={() => setN(cur + n)} style={{ padding: "7px 14px", borderRadius: 99, border: "1.5px solid var(--line-strong)", background: "var(--surface)", color: "var(--ink-2)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font)" }}>+{n}</button>)}
        </div>
      )}
    </>
  );
}

function hppBreakdown(v, plastics, labels) {
  const packs = +v.packsPerBall || +v.packsPerKg || 0;
  const snack = packs > 0 ? (+v.pricePerBall || +v.pricePerKg || 0) / packs : 0;
  const pl = plastics.find(p => p.id === v.plastikId);
  const plastik = (pl && +pl.piecesPer500g > 0) ? (+pl.pricePer500g || 0) / (+pl.piecesPer500g) : 0;
  const lb = labels.find(l => l.id === v.labelId);
  const label = (lb && +lb.perSheet > 0) ? (+lb.pricePerSheet || 0) / (+lb.perSheet) : 0;
  return { snack, plastik, label, total: snack + plastik + label };
}

function Production({ data, setData }) {
  const { variants = [], plastics = [], labels = [] } = data;
  const [tab, setTab] = useState("stok");
  const { confirm, Dialog } = useConfirm();

  const emptyVar = { name: "", pricePerBall: "", packsPerBall: "", plastikId: plastics[0]?.id || "", labelId: labels[0]?.id || "", sellPrice: "", stock: "", bs: "" };
  const [showVar, setShowVar] = useState(false);
  const [editVarId, setEditVarId] = useState(null);
  const [vf, setVf] = useState(emptyVar);

  const [stockTarget, setStockTarget] = useState(null);
  const [stockVal, setStockVal] = useState(0);
  const [bsVal, setBsVal] = useState(0);
  const [detailVarId, setDetailVarId] = useState(null);
  const [summaryView, setSummaryView] = useState(null);

  const [showPl, setShowPl] = useState(false);
  const [plEditId, setPlEditId] = useState(null);
  const [pf, setPf] = useState({ name: "", pricePer500g: "", piecesPer500g: "" });

  const [showLb, setShowLb] = useState(false);
  const [lbEditId, setLbEditId] = useState(null);
  const [lf, setLf] = useState({ name: "", pricePerSheet: "", perSheet: "48" });

  const openVarAdd = () => { setVf({ ...emptyVar, plastikId: plastics[0]?.id || "", labelId: labels[0]?.id || "" }); setEditVarId(null); setShowVar(true); };
  const openVarEdit = (v) => { setVf({ name: v.name, pricePerBall: String(v.pricePerBall ?? v.pricePerKg ?? ""), packsPerBall: String(v.packsPerBall ?? v.packsPerKg ?? ""), plastikId: v.plastikId || "", labelId: v.labelId || "", sellPrice: String(v.sellPrice ?? ""), stock: String(v.stock ?? ""), bs: String(v.bs ?? "") }); setEditVarId(v.id); setShowVar(true); };
  const saveVar = () => {
    if (!vf.name || !vf.pricePerBall || !vf.packsPerBall) return;
    const rec = { name: vf.name.trim(), pricePerBall: +vf.pricePerBall, packsPerBall: +vf.packsPerBall, plastikId: vf.plastikId, labelId: vf.labelId, sellPrice: +vf.sellPrice || 0, stock: Math.max(0, parseInt(vf.stock) || 0), bs: Math.max(0, parseInt(vf.bs) || 0) };
    if (editVarId) setData(d => ({ ...d, variants: (d.variants || []).map(x => x.id === editVarId ? { ...x, ...rec } : x) }));
    else setData(d => ({ ...d, variants: [...(d.variants || []), { id: uid(), ...rec }] }));
    setShowVar(false); setEditVarId(null);
  };
  const delVar = (v) => confirm({ title: "Hapus varian?", message: `Varian "${v.name}" akan dihapus beserta data stoknya.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({ ...d, variants: (d.variants || []).filter(x => x.id !== v.id) })) });

  const openStock = (v) => { setStockTarget(v); setStockVal(""); setBsVal(""); };
  const closeStock = () => { setStockTarget(null); setStockVal(""); setBsVal(""); };
  const saveStock = () => {
    setData(d => ({ ...d, variants: (d.variants || []).map(x => x.id === stockTarget.id ? { ...x, stock: Math.max(0, (+x.stock || 0) + (parseInt(stockVal) || 0)), bs: Math.max(0, (+x.bs || 0) + (parseInt(bsVal) || 0)) } : x) }));
    closeStock();
  };

  const openPlAdd = () => { setPf({ name: "", pricePer500g: "", piecesPer500g: "" }); setPlEditId(null); setShowPl(true); };
  const openPlEdit = (p) => { setPf({ name: p.name, pricePer500g: String(p.pricePer500g ?? ""), piecesPer500g: String(p.piecesPer500g ?? "") }); setPlEditId(p.id); setShowPl(true); };
  const savePl = () => {
    if (!pf.name || !pf.pricePer500g || !pf.piecesPer500g) return;
    const rec = { name: pf.name.trim(), pricePer500g: +pf.pricePer500g, piecesPer500g: +pf.piecesPer500g };
    if (plEditId) setData(d => ({ ...d, plastics: (d.plastics || []).map(x => x.id === plEditId ? { ...x, ...rec } : x) }));
    else setData(d => ({ ...d, plastics: [...(d.plastics || []), { id: uid(), ...rec }] }));
    setShowPl(false); setPlEditId(null);
  };
  const delPl = (p) => confirm({ title: "Hapus plastik?", message: `"${p.name}" akan dihapus. Varian yang memakainya kehilangan komponen biaya plastik.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({ ...d, plastics: (d.plastics || []).filter(x => x.id !== p.id) })) });

  const openLbAdd = () => { setLf({ name: "", pricePerSheet: "", perSheet: "48" }); setLbEditId(null); setShowLb(true); };
  const openLbEdit = (l) => { setLf({ name: l.name, pricePerSheet: String(l.pricePerSheet ?? ""), perSheet: String(l.perSheet ?? "48") }); setLbEditId(l.id); setShowLb(true); };
  const saveLb = () => {
    if (!lf.name || !lf.pricePerSheet || !lf.perSheet) return;
    const rec = { name: lf.name.trim(), pricePerSheet: +lf.pricePerSheet, perSheet: parseInt(lf.perSheet) || 1 };
    if (lbEditId) setData(d => ({ ...d, labels: (d.labels || []).map(x => x.id === lbEditId ? { ...x, ...rec } : x) }));
    else setData(d => ({ ...d, labels: [...(d.labels || []), { id: uid(), ...rec }] }));
    setShowLb(false); setLbEditId(null);
  };
  const delLb = (l) => confirm({ title: "Hapus label?", message: `"${l.name}" akan dihapus.`, confirmText: "Ya, Hapus", onConfirm: () => setData(d => ({ ...d, labels: (d.labels || []).filter(x => x.id !== l.id) })) });

  const totalStock = variants.reduce((s, v) => s + (+v.stock || 0), 0);
  const totalBs = variants.reduce((s, v) => s + (+v.bs || 0), 0);
  const stockValue = variants.reduce((s, v) => s + (+v.stock || 0) * hppBreakdown(v, plastics, labels).total, 0);
  const liveHpp = hppBreakdown({ pricePerBall: vf.pricePerBall, packsPerBall: vf.packsPerBall, plastikId: vf.plastikId, labelId: vf.labelId }, plastics, labels);
  const liveMargin = (+vf.sellPrice || 0) - liveHpp.total;

  return (
    <div className="fade-up">
      <SectionHeader title="Produksi" sub="Stok per varian, BS/retur, dan HPP otomatis"
        action={tab === "stok" ? <Btn icon="+" onClick={openVarAdd}>Tambah Varian</Btn> : null} />

      <Tabs items={[{ id: "stok", label: "Stok Varian", icon: "layers" }, { id: "bahan", label: "Bahan & HPP", icon: "coins" }]} active={tab} onChange={setTab} />

      <div style={{ marginTop: 20 }}>
        {tab === "stok" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
              <StatCard label="Varian" value={variants.length} icon={<Icon name="layers" size={20} />} color="var(--brand)" soft="var(--brand-soft)" />
              <StatCard label="Total Stok" value={`${totalStock} bks`} icon={<Icon name="package" size={20} />} color="var(--green)" soft="var(--green-soft)" onClick={variants.length ? () => setSummaryView("stock") : undefined} />
              <StatCard label="BS / Retur" value={`${totalBs} bks`} sub={(totalStock + totalBs) > 0 ? `${Math.round(totalBs / (totalStock + totalBs) * 100)}% dari total produksi` : undefined} icon={<Icon name="alert" size={20} />} color="var(--red)" soft="var(--red-soft)" onClick={variants.length ? () => setSummaryView("bs") : undefined} />
              <StatCard label="Nilai Stok (HPP)" value={fmtShort(stockValue)} icon={<Icon name="coins" size={20} />} color="var(--amber)" soft="var(--amber-soft)" onClick={variants.length ? () => setSummaryView("value") : undefined} />
            </div>
            {variants.length === 0 ? (
              <Card><EmptyState icon={<Icon name="layers" size={34} style={{ color: "var(--line-strong)" }} />} title="Belum ada varian" sub="Tambah varian untuk mulai menghitung stok & HPP" /></Card>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {variants.map(v => {
                  const h = hppBreakdown(v, plastics, labels);
                  const margin = v.sellPrice > 0 ? (v.sellPrice - h.total) : 0;
                  const marginPct = v.sellPrice > 0 ? Math.round((margin / v.sellPrice) * 100) : 0;
                  return (
                    <Card key={v.id} onClick={() => setDetailVarId(v.id)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0, flex: 1 }}>
                          <p style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</p>
                          <Icon name="chevron-right" size={15} style={{ color: "var(--line-strong)", flexShrink: 0 }} />
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openVarEdit(v); }}><Icon name="pencil" size={14} /></Btn>
                          <Btn size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); delVar(v); }}><Icon name="trash" size={14} /></Btn>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                        <Tag color="var(--amber)">HPP {fmt(Math.round(h.total))}</Tag>
                        {v.sellPrice > 0 && <Tag color="var(--brand)">Jual {fmt(v.sellPrice)}</Tag>}
                        {v.sellPrice > 0 && <Tag color={margin >= 0 ? "var(--green)" : "var(--red)"}>Margin {marginPct}%</Tag>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                          <p className="tnum" style={{ fontSize: 26, fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{v.stock || 0}</p>
                          <p style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>bks stok</p>
                        </div>
                        <div style={{ background: (v.bs > 0 ? "var(--red-soft)" : "var(--bg)"), border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                          <p className="tnum" style={{ fontSize: 26, fontWeight: 800, color: (v.bs > 0 ? "var(--red)" : "var(--muted)"), lineHeight: 1 }}>{v.bs || 0}</p>
                          <p className="tnum" style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>BS / Retur{((+v.stock || 0) + (+v.bs || 0)) > 0 && (+v.bs || 0) > 0 ? ` · ${Math.round((+v.bs) / ((+v.stock || 0) + (+v.bs)) * 100)}%` : ""}</p>
                        </div>
                      </div>
                      <Btn full size="sm" variant="outline" icon={<Icon name="package" size={14} />} onClick={(e) => { e.stopPropagation(); openStock(v); }}>Update Stok</Btn>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "bahan" && (
          <div className="fade-up">
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
                <p style={{ fontWeight: 800, fontSize: 15 }}>Plastik</p>
                <Btn size="sm" icon="+" onClick={openPlAdd}>Tambah</Btn>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>Harga per 500 gram tetap, tapi isi (jumlah lembar) beda tiap ukuran. Biaya per bungkus = harga ÷ isi.</p>
              {plastics.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Belum ada plastik.</p> : plastics.map(p => {
                const cost = +p.piecesPer500g > 0 ? p.pricePer500g / p.piecesPer500g : 0;
                return (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</p>
                      <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{fmt(p.pricePer500g)}/500g · isi {p.piecesPer500g} lembar</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <Tag color="var(--amber)">{fmt(Math.round(cost))}/pcs</Tag>
                      <Btn size="sm" variant="ghost" onClick={() => openPlEdit(p)}><Icon name="pencil" size={13} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => delPl(p)}><Icon name="trash" size={13} /></Btn>
                    </div>
                  </div>
                );
              })}
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
                <p style={{ fontWeight: 800, fontSize: 15 }}>Label Sticker</p>
                <Btn size="sm" icon="+" onClick={openLbAdd}>Tambah</Btn>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>Satu lembar kertas berisi sejumlah sticker. Biaya per bungkus = harga lembar ÷ jumlah sticker.</p>
              {labels.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Belum ada label.</p> : labels.map(l => {
                const cost = +l.perSheet > 0 ? l.pricePerSheet / l.perSheet : 0;
                return (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{l.name}</p>
                      <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>{fmt(l.pricePerSheet)}/lembar · isi {l.perSheet} sticker</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <Tag color="var(--amber)">{fmt(Math.round(cost))}/label</Tag>
                      <Btn size="sm" variant="ghost" onClick={() => openLbEdit(l)}><Icon name="pencil" size={13} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => delLb(l)}><Icon name="trash" size={13} /></Btn>
                    </div>
                  </div>
                );
              })}
            </Card>

            <Card>
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Rincian HPP per Varian</p>
              <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>HPP = snack (harga/kg ÷ bungkus per kg) + plastik + label.</p>
              {variants.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Belum ada varian.</p> : variants.map(v => {
                const h = hppBreakdown(v, plastics, labels);
                return (
                  <div key={v.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 800 }}>{v.name}</p>
                      <p className="tnum" style={{ fontSize: 14, fontWeight: 800, color: "var(--amber)" }}>{fmt(Math.round(h.total))}</p>
                    </div>
                    <div className="tnum" style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                      <span>Snack {fmt(Math.round(h.snack))}</span>
                      <span>Plastik {fmt(Math.round(h.plastik))}</span>
                      <span>Label {fmt(Math.round(h.label))}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
      </div>

      <Modal show={showVar} onClose={() => setShowVar(false)} title={editVarId ? "Edit Varian" : "Tambah Varian"}>
        <FG label="Nama Varian"><input placeholder="Kriuk Original 100g" value={vf.name} onChange={e => setVf(f => ({ ...f, name: e.target.value }))} /></FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FG label="Harga Snack / Ball"><input type="number" inputMode="numeric" placeholder="90000" value={vf.pricePerBall} onChange={e => setVf(f => ({ ...f, pricePerBall: e.target.value }))} /></FG>
          <FG label="Bungkus per Ball" hint="1 ball = ? bks"><input type="number" inputMode="numeric" placeholder="20" value={vf.packsPerBall} onChange={e => setVf(f => ({ ...f, packsPerBall: e.target.value }))} /></FG>
        </div>
        <FG label="Plastik">
          <select value={vf.plastikId} onChange={e => setVf(f => ({ ...f, plastikId: e.target.value }))}>
            <option value="">— Tanpa plastik —</option>
            {plastics.map(p => { const c = +p.piecesPer500g > 0 ? p.pricePer500g / p.piecesPer500g : 0; return <option key={p.id} value={p.id}>{p.name} · {fmt(Math.round(c))}/pcs</option>; })}
          </select>
        </FG>
        <FG label="Label">
          <select value={vf.labelId} onChange={e => setVf(f => ({ ...f, labelId: e.target.value }))}>
            <option value="">— Tanpa label —</option>
            {labels.map(l => { const c = +l.perSheet > 0 ? l.pricePerSheet / l.perSheet : 0; return <option key={l.id} value={l.id}>{l.name} · {fmt(Math.round(c))}/label</option>; })}
          </select>
        </FG>
        <FG label="Harga Jual / Bungkus"><input type="number" inputMode="numeric" placeholder="6000" value={vf.sellPrice} onChange={e => setVf(f => ({ ...f, sellPrice: e.target.value }))} /></FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FG label="Stok (bungkus)"><input type="number" inputMode="numeric" placeholder="0" value={vf.stock} onChange={e => setVf(f => ({ ...f, stock: e.target.value }))} /></FG>
          <FG label="BS / Retur (bungkus)"><input type="number" inputMode="numeric" placeholder="0" value={vf.bs} onChange={e => setVf(f => ({ ...f, bs: e.target.value }))} /></FG>
        </div>
        <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div className="tnum" style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12.5, color: "var(--ink-2)", fontWeight: 600, marginBottom: 6 }}>
            <span>Snack {fmt(Math.round(liveHpp.snack))}</span>
            <span>Plastik {fmt(Math.round(liveHpp.plastik))}</span>
            <span>Label {fmt(Math.round(liveHpp.label))}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800 }}>HPP / bungkus</span>
            <span className="tnum" style={{ fontSize: 16, fontWeight: 800, color: "var(--amber)" }}>{fmt(Math.round(liveHpp.total))}</span>
          </div>
          {+vf.sellPrice > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--muted)" }}>Margin</span>
            <span className="tnum" style={{ fontSize: 13.5, fontWeight: 800, color: liveMargin >= 0 ? "var(--green)" : "var(--red)" }}>{fmt(Math.round(liveMargin))} · {(+vf.sellPrice) > 0 ? Math.round((liveMargin / (+vf.sellPrice)) * 100) : 0}%</span>
          </div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => setShowVar(false)}>Batal</Btn>
          <Btn full onClick={saveVar}>Simpan</Btn>
        </div>
      </Modal>

      <Modal show={!!stockTarget} onClose={closeStock} title={stockTarget ? `Update Stok — ${stockTarget.name}` : "Update Stok"}>
        {stockTarget && <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, marginBottom: 16 }}>Saat ini: <b style={{ color: "var(--ink)" }}>{stockTarget.stock || 0}</b> bks stok · <b style={{ color: "var(--ink)" }}>{stockTarget.bs || 0}</b> bks BS/Retur.</p>}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 9, letterSpacing: "-0.01em" }}>Tambah Stok (bungkus)</label>
          <Stepper value={stockVal} setValue={setStockVal} chips={[10, 25, 50, 100]} allowNegative />
          {stockTarget && (() => { const dlt = parseInt(stockVal) || 0; const fin = Math.max(0, (stockTarget.stock || 0) + dlt); return <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 9 }}>Masukkan jumlah produksi baru (minus untuk koreksi) · stok jadi: {stockTarget.stock || 0} {dlt >= 0 ? "+" : "−"} {Math.abs(dlt)} = <b style={{ color: "var(--ink)" }}>{fin} bks</b></p>; })()}
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 9, letterSpacing: "-0.01em" }}>Tambah BS / Retur (bungkus)</label>
          <Stepper value={bsVal} setValue={setBsVal} chips={[1, 5, 10]} allowNegative />
          {stockTarget && (() => { const dlt = parseInt(bsVal) || 0; const fin = Math.max(0, (stockTarget.bs || 0) + dlt); return <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 9 }}>Barang rusak / retur baru · BS jadi: {stockTarget.bs || 0} {dlt >= 0 ? "+" : "−"} {Math.abs(dlt)} = <b style={{ color: "var(--ink)" }}>{fin} bks</b></p>; })()}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={closeStock}>Batal</Btn>
          <Btn full icon={<Icon name="check" size={16} />} onClick={saveStock}>Simpan</Btn>
        </div>
      </Modal>

      <Modal show={showPl} onClose={() => setShowPl(false)} title={plEditId ? "Edit Plastik" : "Tambah Plastik"}>
        <FG label="Nama / Ukuran"><input placeholder="Plastik 100g" value={pf.name} onChange={e => setPf(f => ({ ...f, name: e.target.value }))} /></FG>
        <FG label="Harga per 500 gram (Rp)"><input type="number" inputMode="numeric" placeholder="25000" value={pf.pricePer500g} onChange={e => setPf(f => ({ ...f, pricePer500g: e.target.value }))} /></FG>
        <FG label="Isi per 500 gram (lembar)" hint="Berapa lembar plastik dalam 500 gram"><input type="number" inputMode="numeric" placeholder="250" value={pf.piecesPer500g} onChange={e => setPf(f => ({ ...f, piecesPer500g: e.target.value }))} /></FG>
        {+pf.pricePer500g > 0 && +pf.piecesPer500g > 0 && <p style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 700, marginBottom: 16 }}>Biaya per pcs: <span style={{ color: "var(--amber)" }}>{fmt(Math.round(pf.pricePer500g / pf.piecesPer500g))}</span></p>}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => setShowPl(false)}>Batal</Btn>
          <Btn full onClick={savePl}>Simpan</Btn>
        </div>
      </Modal>

      <Modal show={showLb} onClose={() => setShowLb(false)} title={lbEditId ? "Edit Label" : "Tambah Label"}>
        <FG label="Nama Label"><input placeholder="Label Sticker" value={lf.name} onChange={e => setLf(f => ({ ...f, name: e.target.value }))} /></FG>
        <FG label="Harga per Lembar (Rp)"><input type="number" inputMode="numeric" placeholder="6000" value={lf.pricePerSheet} onChange={e => setLf(f => ({ ...f, pricePerSheet: e.target.value }))} /></FG>
        <FG label="Jumlah Sticker per Lembar"><input type="number" inputMode="numeric" placeholder="48" value={lf.perSheet} onChange={e => setLf(f => ({ ...f, perSheet: e.target.value }))} /></FG>
        {+lf.pricePerSheet > 0 && +lf.perSheet > 0 && <p style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 700, marginBottom: 16 }}>Biaya per label: <span style={{ color: "var(--amber)" }}>{fmt(Math.round(lf.pricePerSheet / lf.perSheet))}</span></p>}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={() => setShowLb(false)}>Batal</Btn>
          <Btn full onClick={saveLb}>Simpan</Btn>
        </div>
      </Modal>

      {(() => {
        const dv = variants.find(v => v.id === detailVarId) || null;
        if (!dv) return null;
        const h = hppBreakdown(dv, plastics, labels);
        const pl = plastics.find(p => p.id === dv.plastikId);
        const lb = labels.find(l => l.id === dv.labelId);
        const packs = +dv.packsPerBall || +dv.packsPerKg || 0;
        const ballPrice = +dv.pricePerBall || +dv.pricePerKg || 0;
        const margin = (dv.sellPrice || 0) - h.total;
        const marginPct = dv.sellPrice > 0 ? Math.round(margin / dv.sellPrice * 100) : 0;
        const sval = (dv.stock || 0) * h.total;
        const profit = (dv.stock || 0) * margin;
        const sec = (t) => <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "18px 0 6px" }}>{t}</p>;
        return (
          <Modal show={!!detailVarId} onClose={() => setDetailVarId(null)} title={dv.name} subtitle="Rincian varian produksi" wide>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "13px 10px", textAlign: "center" }}>
                <p className="tnum" style={{ fontSize: 24, fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{dv.stock || 0}</p>
                <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginTop: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>bks stok</p>
              </div>
              <div style={{ background: (dv.bs > 0 ? "var(--red-soft)" : "var(--bg)"), border: "1.5px solid var(--line)", borderRadius: 12, padding: "13px 10px", textAlign: "center" }}>
                <p className="tnum" style={{ fontSize: 24, fontWeight: 800, color: (dv.bs > 0 ? "var(--red)" : "var(--muted)"), lineHeight: 1 }}>{dv.bs || 0}</p>
                <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginTop: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>BS / Retur</p>
              </div>
              <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "13px 10px", textAlign: "center" }}>
                <p className="tnum" style={{ fontSize: 16, fontWeight: 800, color: "var(--amber)", lineHeight: 1.1 }}>{fmtShort(sval)}</p>
                <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginTop: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>nilai stok</p>
              </div>
            </div>
            {((dv.stock || 0) + (dv.bs || 0)) > 0 && (
              <p className="tnum" style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, textAlign: "center", marginTop: 10 }}>
                Rasio BS: <b style={{ color: (dv.bs || 0) > 0 ? "var(--red)" : "var(--green)" }}>{Math.round((+dv.bs || 0) / ((+dv.stock || 0) + (+dv.bs || 0)) * 100)}%</b> dari total produksi
              </p>
            )}
            {sec("Harga & Margin")}
            <DRow label="Harga jual / bungkus" value={fmt(dv.sellPrice || 0)} />
            <DRow label="HPP / bungkus" value={fmt(Math.round(h.total))} color="var(--amber)" />
            <DRow label="Margin / bungkus" value={`${fmt(Math.round(margin))} · ${marginPct}%`} color={margin >= 0 ? "var(--green)" : "var(--red)"} strong />
            <DRow label="Estimasi laba (stok × margin)" value={fmt(Math.round(profit))} color={profit >= 0 ? "var(--green)" : "var(--red)"} />
            {sec("Rincian HPP / bungkus")}
            <DRow label={`Snack (${fmt(ballPrice)} ÷ ${packs || 0})`} value={fmt(Math.round(h.snack))} />
            <DRow label={`Plastik${pl ? " · " + pl.name : ""}`} value={fmt(Math.round(h.plastik))} />
            <DRow label={`Label${lb ? " · " + lb.name : ""}`} value={fmt(Math.round(h.label))} />
            <DRow label="Total HPP" value={fmt(Math.round(h.total))} color="var(--amber)" strong />
            {sec("Resep & Bahan")}
            <DRow label="Harga snack / ball" value={fmt(ballPrice)} />
            <DRow label="Bungkus per ball" value={`${packs || 0} bks`} />
            {pl && <DRow label="Plastik" value={`${fmt(pl.pricePer500g)}/500g · isi ${pl.piecesPer500g}`} />}
            {lb && <DRow label="Label" value={`${fmt(lb.pricePerSheet)}/lembar · isi ${lb.perSheet}`} />}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Btn full variant="outline" icon={<Icon name="package" size={15} />} onClick={() => { setDetailVarId(null); openStock(dv); }}>Update Stok</Btn>
              <Btn full icon={<Icon name="pencil" size={15} />} onClick={() => { setDetailVarId(null); openVarEdit(dv); }}>Edit Varian</Btn>
            </div>
          </Modal>
        );
      })()}

      {(() => {
        if (!summaryView) return null;
        const rows = variants.map(v => { const h = hppBreakdown(v, plastics, labels); return { id: v.id, name: v.name, stock: +v.stock || 0, bs: +v.bs || 0, value: (+v.stock || 0) * h.total }; });
        const cfg = summaryView === "stock" ? { title: "Rincian Total Stok", sub: "Stok per varian", total: totalStock, get: r => r.stock, fmtv: n => `${n} bks`, color: "var(--green)" }
          : summaryView === "bs" ? { title: "Rincian BS / Retur", sub: "Barang rusak / retur per varian", total: totalBs, get: r => r.bs, fmtv: n => `${n} bks`, color: "var(--red)" }
          : { title: "Rincian Nilai Stok", sub: "Nilai stok (HPP) per varian", total: stockValue, get: r => r.value, fmtv: n => fmt(Math.round(n)), color: "var(--amber)" };
        const sorted = [...rows].sort((a, b) => cfg.get(b) - cfg.get(a));
        return (
          <Modal show={!!summaryView} onClose={() => setSummaryView(null)} title={cfg.title} subtitle={cfg.sub}>
            <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Total</span>
              <span className="tnum" style={{ fontSize: 20, fontWeight: 800, color: cfg.color }}>{cfg.fmtv(cfg.total)}</span>
            </div>
            {sorted.length === 0 || cfg.total === 0 ? (
              <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, textAlign: "center", padding: "10px 0" }}>Belum ada data.</p>
            ) : sorted.map(r => {
              const val = cfg.get(r); const pct = cfg.total > 0 ? Math.round(val / cfg.total * 100) : 0;
              return (
                <div key={r.id} style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 7 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                    <span className="tnum" style={{ fontSize: 14, fontWeight: 800, color: val > 0 ? cfg.color : "var(--muted)", flexShrink: 0 }}>{cfg.fmtv(val)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: "var(--bg-2)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: cfg.color, borderRadius: 99 }} />
                    </div>
                    <span className="tnum" style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, minWidth: 34, textAlign: "right" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </Modal>
        );
      })()}

      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS — BACKUP & RESTORE
// ─────────────────────────────────────────────
function Settings({ data, setData }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'error'|'info', text }
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const { confirm, Dialog } = useConfirm();

  const counts = {
    toko: (data.stores || []).length,
    produk: (data.products || []).length,
    transaksi: (data.transactions || []).length,
    nota: (data.receipts || []).length,
    catatan: (data.notes || []).length,
  };

  const buildPayload = () => buildBackupPayload(data);
  const markBackedUp = () => setData(d => ({ ...d, lastBackupAt: Date.now() }));

  const downloadBackup = () => {
    if (triggerBackupDownload(data)) { markBackedUp(); setMsg({ type: "ok", text: "Backup berhasil diunduh. Simpan file di tempat aman (Drive, email, dll)." }); }
    else setMsg({ type: "error", text: "Unduhan diblokir di lingkungan ini. Pakai 'Salin Teks Backup' sebagai gantinya." });
  };

  const copyBackup = async () => {
    const text = buildPayload();
    try {
      await navigator.clipboard.writeText(text);
      markBackedUp();
      setMsg({ type: "ok", text: "Teks backup tersalin ke clipboard. Tempel & simpan di catatan/email Anda." });
    } catch {
      setPasteOpen(true); setPasteText(text);
      setMsg({ type: "info", text: "Tidak bisa menyalin otomatis. Teks backup ditampilkan di bawah — salin manual." });
    }
  };

  const applyRestore = (restored) => {
    setData({ ...INIT, ...restored });
    setMsg({ type: "ok", text: "Data berhasil dipulihkan dari backup." });
    setPasteOpen(false); setPasteText("");
  };

  const tryParse = (text, sourceLabel) => {
    let obj;
    try { obj = JSON.parse(text); }
    catch { setMsg({ type: "error", text: "Format tidak valid — pastikan ini file/teks backup .json yang benar." }); return; }
    const d = obj && obj.data ? obj.data : obj;
    const looksValid = d && typeof d === "object" && (Array.isArray(d.stores) || Array.isArray(d.products) || Array.isArray(d.transactions));
    if (!looksValid) { setMsg({ type: "error", text: "Ini sepertinya bukan backup SB FOOD." }); return; }
    confirm({
      title: "Pulihkan Data?",
      message: `Semua data saat ini akan DIGANTI dengan data dari ${sourceLabel}. Disarankan unduh backup dulu sebelum melanjutkan. Lanjutkan?`,
      confirmText: "Ya, Pulihkan", danger: true, icon: "refresh",
      onConfirm: () => applyRestore(d),
    });
  };

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => tryParse(String(reader.result), `file "${file.name}"`);
    reader.onerror = () => setMsg({ type: "error", text: "Gagal membaca file." });
    reader.readAsText(file);
    e.target.value = "";
  };

  const msgColor = msg ? (msg.type === "ok" ? { bg: "var(--green-soft)", bd: "#BCE6D2", fg: "var(--green)" } : msg.type === "error" ? { bg: "var(--red-soft)", bd: "#F2C7C3", fg: "var(--red)" } : { bg: "var(--brand-soft)", bd: "var(--brand-tint)", fg: "var(--brand-deep)" }) : null;

  return (
    <div className="fade-up">
      <SectionHeader title="Pengaturan" sub="Cadangkan & pulihkan seluruh data aplikasi" />

      {msg && (
        <div style={{ background: msgColor.bg, border: `1.5px solid ${msgColor.bd}`, color: msgColor.fg, borderRadius: 12, padding: "12px 15px", marginBottom: 16, fontSize: 13.5, fontWeight: 600, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <span style={{ display:"flex", alignItems:"center", gap:7 }}><Icon name={msg.type === "ok" ? "check" : msg.type === "error" ? "alert" : "info"} size={15} /> {msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: "none", border: "none", color: msgColor.fg, cursor: "pointer", fontWeight: 800, flexShrink: 0, display:"flex" }}><Icon name="x" size={15} /></button>
        </div>
      )}

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)" }}><Icon name="download" size={22} /></div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16 }}>Pasang Aplikasi</p>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Install ke layar utama, bisa dibuka offline</p>
          </div>
        </div>
        {isStandalone() ? (
          <div style={{ background: "var(--green-soft)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "11px 14px", display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="check" size={16} style={{ color: "var(--green)", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 700 }}>Aplikasi sudah terpasang & berjalan mandiri.</p>
          </div>
        ) : (
          <>
            {deferredInstallPrompt && (
              <Btn full icon={<Icon name="download" size={16} />} onClick={async () => { try { deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; } catch {} }} >Pasang di Perangkat Ini</Btn>
            )}
            <div style={{ background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 12, padding: "12px 14px", marginTop: deferredInstallPrompt ? 10 : 0 }}>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink-2)", marginBottom: 4 }}>iPhone (Safari)</p>
              <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, lineHeight: 1.55 }}>Buka situs ini di Safari → tombol <b>Bagikan</b> → <b>Tambahkan ke Layar Utama</b> → Tambah.</p>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink-2)", margin: "10px 0 4px" }}>Android (Chrome)</p>
              <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, lineHeight: 1.55 }}>Menu titik tiga → <b>Instal aplikasi</b>, atau pakai tombol di atas bila muncul.</p>
            </div>
          </>
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", color:"var(--green)" }}><Icon name="save" size={22} /></div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16 }}>Backup Data</p>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Simpan salinan semua data ke file</p>
          </div>
        </div>
        <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 11, padding: "12px 14px", marginBottom: 14 }}>
          <p className="tnum" style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 600, lineHeight: 1.7 }}>
            Termasuk: <b>{counts.toko}</b> toko · <b>{counts.produk}</b> produk · <b>{counts.transaksi}</b> transaksi · <b>{counts.nota}</b> nota · <b>{counts.catatan}</b> catatan
          </p>
        </div>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: data.lastBackupAt ? "var(--muted)" : "var(--amber)", margin: "-4px 0 14px" }}>
          Backup terakhir: {data.lastBackupAt ? new Date(data.lastBackupAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "belum pernah"}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full icon={<Icon name="download" size={16} />} onClick={downloadBackup}>Unduh File Backup</Btn></div>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full variant="outline" icon={<Icon name="copy" size={16} />} onClick={copyBackup}>Salin Teks Backup</Btn></div>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", color:"var(--brand)" }}><Icon name="refresh" size={22} /></div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16 }}>Restore Data</p>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Pulihkan dari file backup</p>
          </div>
        </div>
        <div style={{ background: "var(--red-soft)", border: "1.5px solid #F2C7C3", borderRadius: 11, padding: "10px 14px", marginBottom: 14, fontSize: 12.5, color: "var(--red)", fontWeight: 600, lineHeight: 1.5 }}>
          Memulihkan akan <b>mengganti seluruh data saat ini</b>. Sebaiknya unduh backup dulu.
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full icon={<Icon name="folder" size={16} />} onClick={() => fileRef.current && fileRef.current.click()}>Pilih File Backup</Btn></div>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full variant="outline" icon={<Icon name="note" size={16} />} onClick={() => { setPasteOpen(o => !o); setPasteText(""); }}>Tempel Teks Backup</Btn></div>
        </div>
        {pasteOpen && (
          <div style={{ marginTop: 14 }}>
            <textarea rows={6} placeholder="Tempel isi teks backup di sini, lalu tekan Pulihkan..." value={pasteText} onChange={e => setPasteText(e.target.value)} style={{ resize: "vertical", fontSize: 12.5, fontFamily: "monospace" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <Btn full variant="ghost" onClick={() => { setPasteOpen(false); setPasteText(""); }}>Tutup</Btn>
              <Btn full onClick={() => pasteText.trim() && tryParse(pasteText, "teks yang ditempel")}>Pulihkan dari Teks</Btn>
            </div>
          </div>
        )}
      </Card>

      <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, textAlign: "center", lineHeight: 1.6 }}>
        Data tersimpan otomatis di perangkat ini. Backup berguna saat ganti HP/browser, atau sebagai cadangan berkala.
      </p>

      <Dialog />
    </div>
  );
}

// ─────────────────────────────────────────────
// AI ASSISTANT — tanya-jawab data bisnis
// ─────────────────────────────────────────────
//
// ── KONEKSI AI ──
// Asisten AI memanggil backend Anda sendiri di "/api/ai" (Vercel + OpenAI),
// satu domain dengan aplikasi sehingga tanpa CORS dan API key tetap aman di server.
//
// Cara pasang backend (ringkas):
//   1) Di proyek Anda, buat file "api/ai.js" di ROOT (sejajar folder src).
//   2) Di Vercel → Settings → Environment Variables, isi OPENAI_API_KEY, lalu Redeploy.
//   (Kode lengkap api/ai.js ada di chat / dokumentasi yang diberikan.)
//
// Untuk ganti penyedia (Claude/Gemini), cukup ubah isi backend "api/ai.js" —
// fungsi di bawah ini tidak perlu diubah.
//
// Catatan: di dalam Claude.ai (preview) "/api/ai" belum ada, jadi otomatis
// memakai CADANGAN AI bawaan agar fitur tetap bisa diuji. Di kriuk.vercel.app
// yang dipakai adalah backend "/api/ai" Anda.
const AI_ENDPOINT = "/api/ai";

async function askAI({ system, messages }) {
  const parse = (data) => (data.content || []).map(b => (b.type === "text" ? b.text : "")).join("").trim();

  // 1) Utama: backend Anda (Vercel + OpenAI).
  let backendResponded = false;
  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Jika Anda mengisi APP_SECRET di backend, aktifkan & samakan baris ini:
        // "x-app-secret": "RAHASIA-ANDA",
      },
      body: JSON.stringify({ system, messages }),
    });
    backendResponded = true;
    if (res.ok) return parse(await res.json());
    // Backend ADA tapi mengembalikan error — tampilkan alasan aslinya (selain 404).
    if (res.status !== 404) {
      let detail = "";
      try { const j = await res.json(); detail = [j.error, j.detail].filter(Boolean).join(" — "); } catch (_) {}
      throw new Error(`Backend /api/ai gagal (${res.status})${detail ? ": " + detail : ""}`);
    }
    // 404 = endpoint belum ada (mis. di dalam preview Claude) → pakai cadangan di bawah.
  } catch (e) {
    if (backendResponded) throw e; // error nyata dari backend Anda — jangan ditutupi
    // fetch gagal total (jaringan) → lanjut ke cadangan
  }

  // 2) Cadangan: AI bawaan Claude — hanya berfungsi saat dibuka di dalam Claude.ai (untuk uji coba).
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4096, system, messages }),
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return parse(await response.json());
}

function Assistant({ data, setData }) {
  const { products = [], routes = [], stores = [], consignments = [], transactions = [], receipts = [] } = data;
  const [chat, setChat] = useLocalStorage("kriuk_chats_v1", { sessions: [], activeId: null });
  const [aiMem, setAiMem] = useLocalStorage("kriuk_ai_memory_v1", { facts: [] });
  const [input, setInput] = useState("");
  const [loadingId, setLoadingId] = useState(null);   // sesi yang sedang menunggu balasan AI
  const [err, setErr] = useState(null);                // { sessionId, msg }
  const [pending, setPending] = useState(null);        // { sessionId, actions }
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  const sessions = chat.sessions || [];
  const active = sessions.find(s => s.id === chat.activeId) || null;
  const messages = active ? active.messages : [];
  const loading = !!loadingId;

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loadingId, pending]);
  useEffect(() => { if (!showHistory) return; const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }, [showHistory]);

  // Tambah/ubah pesan pada SESI TERTENTU (mencegah balasan nyasar saat pindah chat ketika masih loading)
  const appendToSession = (sessionId, updater, opts = {}) => {
    setChat(c => {
      let ss = c.sessions ? [...c.sessions] : [];
      let idx = ss.findIndex(s => s.id === sessionId);
      if (idx === -1) {
        if (!opts.create) return c;
        ss = [{ id: sessionId, title: "Chat Baru", createdAt: Date.now(), messages: [] }, ...ss];
        idx = 0;
      }
      const cur = ss[idx];
      const newMsgs = typeof updater === "function" ? updater(cur.messages) : updater;
      let title = cur.title;
      if ((!title || title === "Chat Baru") && newMsgs.length) {
        const fu = newMsgs.find(m => m.role === "user");
        if (fu) title = fu.content.slice(0, 42);
      }
      ss[idx] = { ...cur, messages: newMsgs, title };
      return { ...c, sessions: ss, activeId: opts.activate ? sessionId : c.activeId };
    });
  };

  const newChat = () => {
    setChat(c => {
      const ss = c.sessions || [];
      const act = ss.find(s => s.id === c.activeId);
      if (act && act.messages.length === 0) return c; // sudah berada di chat kosong
      const id = uid();
      return { sessions: [{ id, title: "Chat Baru", createdAt: Date.now(), messages: [] }, ...ss], activeId: id };
    });
    setShowHistory(false);
  };
  const switchChat = (id) => { setChat(c => ({ ...c, activeId: id })); setShowHistory(false); };
  const deleteChat = (id) => {
    setChat(c => { const ss = (c.sessions || []).filter(s => s.id !== id); return { ...c, sessions: ss, activeId: c.activeId === id ? (ss[0]?.id || null) : c.activeId }; });
  };
  const fmtChatDate = (ts) => { try { return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short" }); } catch { return ""; } };

  const buildContext = () => {
    const monthTx = transactions.filter(t => t.date.startsWith(thisMonth));
    const omsetBulan = monthTx.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
    const keluarBulan = monthTx.filter(t => t.type === "expense" && !t.personal).reduce((s,t) => s+t.amount, 0);
    const omsetHari = transactions.filter(t => t.date === today && t.type === "income").reduce((s,t) => s+t.amount, 0);
    const activeC = consignments.filter(c => c.status === "active" && c.remaining > 0);
    const now = new Date();
    // Konteks RINGKAS agar hemat token (hindari limit): nama+rute selalu; detail stok hanya bila ada.
    const toko = stores.map(s => {
      const rt = routes.find(r => r.id === s.routeId);
      const cs = activeC.filter(c => c.storeId === s.id);
      const o = { nama: s.name, rute: rt?.name || "-" };
      if (cs.length) {
        o.bks = cs.reduce((a,c) => a + c.remaining, 0);
        o.nilai = cs.reduce((a,c) => { const p = products.find(x => x.id === c.productId); return a + (p?.price || 0) * c.remaining; }, 0);
        const oldest = cs.reduce((m,c) => c.date < m ? c.date : m, cs[0].date);
        o.hari = Math.floor((now - new Date(oldest)) / 864e5);
      }
      return o;
    });
    const totalTitipan = toko.reduce((a,b) => a + (b.nilai || 0), 0);
    return JSON.stringify({
      tanggalHariIni: today,
      perusahaan: `${COMPANY.name} - ${COMPANY.tagline}`,
      ringkasanKeuangan: { omsetHariIni: omsetHari, omsetBulanIni: omsetBulan, pengeluaranBulanIni: keluarBulan, labaBulanIni: omsetBulan - keluarBulan, totalNilaiBarangTitipan: totalTitipan },
      produk: products.map(p => ({ nama: p.name, harga: p.price, hpp: p.costPrice })),
      rute: routes.map(r => r.name),
      jumlahToko: stores.length,
      keteranganToko: "field: nama, rute. bks/nilai/hari hanya untuk toko yang masih ada titipan (hari = umur drop terlama).",
      toko,
      transaksiTerakhir: transactions.slice(0, 25).map(t => ({ tgl: t.date, tipe: t.type === "income" ? "masuk" : "keluar", jml: t.amount, ket: t.note || t.category })),
      jumlahNota: receipts.length,
    });
  };

  const SYSTEM = `Kamu asisten bisnis untuk aplikasi "${COMPANY.name}" (usaha titip jual / konsinyasi snack di Indonesia). Jawab pertanyaan pemilik usaha HANYA berdasarkan DATA JSON yang diberikan.
Aturan:
- Jawab dalam Bahasa Indonesia, ringkas, jelas, ramah.
- Tampilkan uang dalam format Rupiah (mis. Rp80.000).
- Bila perlu menghitung, hitung dari data dan tunjukkan angkanya. Boleh membuat daftar singkat bila membantu.
- Jika data tidak cukup, katakan terus terang — jangan mengarang angka.
- Istilah: "titipan/sisa" = barang yang masih di toko & belum terjual; "omset" = pemasukan; "laba" = pemasukan - pengeluaran; "hariSejakDropTerlama" = berapa hari sejak drop paling lama di toko itu (indikasi toko perlu dikunjungi).
- Hari ini: ${today}.

KAMU JUGA BISA MENGELOLA DATA. Jika pemilik MEMINTA menambah/mencatat/mengubah sesuatu (bukan sekadar bertanya), sertakan SATU blok kode \`\`\`json berisi {"actions":[ ... ]} di AKHIR pesan, didahului 1 kalimat ringkas konfirmasi. Jika pemilik hanya BERTANYA, jawab teks biasa TANPA blok json.

Jenis aksi (pakai persis nama field-nya, uang sebagai angka polos tanpa "Rp", tanggal "YYYY-MM-DD"):
- {"type":"add_store","name":"...","routeName":"(opsional)","address":"(opsional)","contact":"(opsional)","note":"(opsional, catatan/pengingat toko)"}
- {"type":"add_product","name":"...","price":8000,"costPrice":4000}
- {"type":"add_route","name":"...","days":["Senin","Kamis"]}
- {"type":"cash_sale","storeName":"...","items":[{"product":"...","qty":5}],"date":"(opsional)"}   // penjualan tunai (bukan titipan)
- {"type":"drop","storeName":"...","items":[{"product":"...","qty":10}],"date":"(opsional)"}   // menitipkan barang ke toko
- {"type":"collect","storeName":"...","items":[{"product":"...","soldQty":3}],"date":"(opsional)"}   // tagih: catat jumlah titipan yang TERJUAL
- {"type":"set_stock","storeName":"...","product":"...","qty":10}   // set sisa stok titipan di toko
- {"type":"add_income","amount":100000,"category":"(opsional)","note":"(opsional)","date":"(opsional)"}
- {"type":"add_expense","amount":50000,"category":"(opsional)","note":"(opsional)","date":"(opsional)"}
- {"type":"add_note","content":"...","pinned":false}
- {"type":"update_store","name":"(nama toko yang sudah ada)","newName":"(opsional)","routeName":"(opsional)","address":"(opsional)","contact":"(opsional)","note":"(opsional, catatan/pengingat toko)"}   // PERBAIKI toko yang sudah ada
- {"type":"update_product","name":"(produk yang sudah ada)","price":12000,"costPrice":5000,"newName":"(opsional)"}
- {"type":"delete_store","name":"...","onlyEmpty":true}   // hapus toko; onlyEmpty=true hanya menghapus yang TIDAK punya stok (untuk bersihkan duplikat)
- {"type":"delete_product","name":"..."}
- {"type":"delete_transactions","month":"2026-05","type":"(opsional: masuk/keluar)","category":"(opsional)","note":"(opsional kata kunci)","date":"(opsional YYYY-MM-DD)","all":false}   // HAPUS transaksi keuangan sesuai filter. Bulan WAJIB format YYYY-MM. Hapus semua: all:true
- {"type":"delete_note","content":"(opsional kata kunci)","date":"(opsional)","all":false}
- {"type":"delete_receipts","month":"2026-05","type":"(opsional: drop/cash/payment)","storeName":"(opsional)","all":false}
- {"type":"remember","fact":"..."}   // simpan preferensi/kebiasaan/koreksi pemilik agar kamu adaptasi ke depan
- {"type":"forget","fact":"(kata kunci)"}   // atau {"type":"forget","all":true}

Aturan aksi:
- Untuk cash_sale/drop/collect/set_stock, nama toko & produk HARUS yang SUDAH ADA di DATA (atau dibuat di blok yang sama lewat add_store/add_product). Jika belum ada & tidak dibuat, jangan dipaksakan.
- Jangan membuat aksi yang tidak diminta. Jika nama/jumlah tidak jelas, tanyakan dulu (tanpa blok json).
- Boleh menggabungkan banyak aksi dalam satu array "actions".
- PENTING saat pemilik memberi DAFTAR data untuk dimasukkan: LANGSUNG keluarkan blok json berisi semua aksinya, didahului 1 kalimat singkat saja. JANGAN membuat tabel ringkasan dan JANGAN bertanya "benar?"/"lanjut?" lebih dulu — aplikasi sudah menampilkan kartu konfirmasi (Terapkan/Batal) untuk pemilik setujui.
- JANGAN PERNAH menjawab bahwa kamu "tidak bisa mengirim/menginput data ke aplikasi". Tugasmu cukup menghasilkan blok json; aplikasi yang menerapkannya.
- Tulis tiap objek aksi ringkas dalam SATU baris (tanpa spasi berlebih) agar hemat & tidak terpotong.
- Jika daftarnya SANGAT panjang (lebih dari ~20 toko/aksi), proses sebagian dulu (mis. 15–20 aksi) lalu beri tahu pemilik untuk mengirim sisanya, supaya balasan tidak terpotong.
- MEMPERBAIKI / MENGOREKSI data yang SUDAH ADA: gunakan update_store / update_product / delete_store — JANGAN memakai add_store/add_product lagi (itu bisa membuat DUPLIKAT). Contoh: kalau toko sudah ada tapi rutenya salah/kosong → pakai update_store dengan routeName, bukan add_store.
- Jika pemilik menyebut SATU rute untuk sekelompok toko (mis. "rute=mesuji"), WAJIB sertakan "routeName":"Mesuji" pada SETIAP add_store/update_store toko tersebut. Rute yang belum ada akan dibuat otomatis.
- Untuk membersihkan toko duplikat, gunakan delete_store dengan "onlyEmpty":true (menghapus yang tanpa stok, menyisakan yang ada stok).
- MENGHAPUS DATA: kamu BISA menghapus lewat delete_transactions / delete_note / delete_receipts / delete_store / delete_product. JANGAN PERNAH menjawab "belum bisa menghapus" atau menyuruh pemilik hapus manual — cukup keluarkan aksi delete yang sesuai; aplikasi akan menampilkan kartu konfirmasi sebelum benar-benar menghapus. Untuk "hapus transaksi/keuangan bulan Mei", ubah nama bulan ke format YYYY-MM memakai tahun dari tanggalHariIni (mis. Mei 2026 → "2026-05") lalu pakai delete_transactions {"month":"2026-05"}. Wajib ada minimal satu filter; gunakan all:true hanya bila pemilik jelas minta "semua/hapus total".
- BELAJAR & ADAPTASI: bila pemilik mengajari sebuah kebiasaan/istilah/preferensi (mis. "k berarti ribuan", "produk default Kriuk", "tulis nama toko huruf besar"), ATAU mengoreksi kamu, sertakan aksi {"type":"remember","fact":"..."} (ringkas) agar kamu menerapkannya di chat berikutnya. Selalu patuhi bagian "INGATAN & PREFERENSI PEMILIK" jika ada.`;

  // ── Pengelolaan data lewat AI: parsing aksi + eksekusi (dengan konfirmasi) ──
  const stripJson = (text) => {
    let t = text || "";
    t = t.replace(/```(?:json)?\s*[\s\S]*?```/gi, "");   // blok ```json``` tertutup
    t = t.replace(/```(?:json)?\s*[\s\S]*$/i, "");        // blok terbuka (terpotong) sampai akhir
    const idx = t.indexOf('"actions"');                   // objek {"actions":...} telanjang yang tersisa
    if (idx !== -1) { const b = t.lastIndexOf("{", idx); if (b !== -1) t = t.slice(0, b); }
    return t.trim();
  };

  // Mengembalikan { actions, complete } atau null. Tahan terhadap balasan AI yang terpotong:
  // tetap memungut setiap objek aksi {...} yang lengkap walau array/penutupnya hilang.
  const extractActions = (text) => {
    const src = text || "";
    let body = null;
    const closed = src.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (closed) body = closed[1];
    else { const open = src.match(/```(?:json)?\s*([\s\S]*)$/i); if (open) body = open[1]; }
    if (!body) {
      const ai = src.indexOf('"actions"');
      if (ai !== -1) { const b = src.lastIndexOf("{", ai); body = src.slice(b === -1 ? ai : b); }
    }
    if (!body) return null;

    // Coba parse penuh lebih dulu (kasus normal).
    try { const obj = JSON.parse(body.trim()); if (obj && Array.isArray(obj.actions) && obj.actions.length) return { actions: obj.actions, complete: true }; } catch (_) {}

    // Fallback tahan-potong: pungut objek {...} lengkap di dalam array "actions".
    const start = body.indexOf("[");
    const region = start !== -1 ? body.slice(start + 1) : body;
    const actions = [];
    let depth = 0, cur = "", inStr = false, prev = "";
    for (const ch of region) {
      if (inStr) { cur += ch; if (ch === '"' && prev !== "\\") inStr = false; prev = ch; continue; }
      if (ch === '"') { inStr = true; cur += ch; prev = ch; continue; }
      if (ch === "{") { depth++; cur += ch; prev = ch; continue; }
      if (ch === "}") { depth--; cur += ch; if (depth === 0) { try { const o = JSON.parse(cur.trim()); if (o && o.type) actions.push(o); } catch (_) {} cur = ""; } prev = ch; continue; }
      if (depth > 0) cur += ch;
      prev = ch;
    }
    return actions.length ? { actions, complete: false } : null;
  };

  const describeAction = (a) => {
    const items = (a.items || []).map(i => `${i.soldQty ?? i.qty} ${i.product}`).join(", ");
    switch (a.type) {
      case "add_store": return `Tambah toko "${a.name}"${a.routeName ? ` (rute ${a.routeName})` : ""}`;
      case "add_product": return `Tambah produk "${a.name}" — jual ${fmt(+a.price || 0)}${a.costPrice ? `, HPP ${fmt(+a.costPrice)}` : ""}`;
      case "add_route": return `Tambah rute "${a.name}"${Array.isArray(a.days) && a.days.length ? ` (${a.days.join(", ")})` : ""}`;
      case "cash_sale": return `Jual tunai di ${a.storeName}: ${items}`;
      case "drop": return `Drop titipan di ${a.storeName}: ${items}`;
      case "collect": return `Tagih di ${a.storeName} (terjual): ${items}`;
      case "set_stock": return `Set stok ${a.product} di ${a.storeName} = ${a.qty} bks`;
      case "add_income": return `Catat pemasukan ${fmt(+a.amount || 0)}${a.note ? ` — ${a.note}` : ""}`;
      case "add_expense": return `Catat pengeluaran ${fmt(+a.amount || 0)}${a.note ? ` — ${a.note}` : ""}`;
      case "add_note": return `Catatan: "${String(a.content || "").slice(0, 70)}"`;
      case "update_store": return `Ubah toko "${a.name || a.storeName}"${a.newName ? ` → "${a.newName}"` : ""}${a.routeName ? ` (rute ${a.routeName})` : ""}${a.note != null ? ` (catatan: "${String(a.note).slice(0,40)}")` : ""}`;
      case "update_product": return `Ubah produk "${a.name}"${a.newName ? ` → "${a.newName}"` : ""}${a.price != null ? ` — jual ${fmt(+a.price)}` : ""}`;
      case "delete_store": return `Hapus toko "${a.name || a.storeName}"${a.onlyEmpty ? " (yang kosong)" : ""}`;
      case "delete_product": return `Hapus produk "${a.name}"`;
      case "delete_transactions": { const b = []; if (a.all) b.push("SEMUA"); if (a.month) b.push(`bln ${a.month}`); if (a.date) b.push(a.date); if (a.type) b.push(a.type); if (a.category) b.push(`kat. ${a.category}`); if (a.note) b.push(`"${a.note}"`); return `Hapus transaksi keuangan${b.length ? ` (${b.join(", ")})` : ""}`; }
      case "delete_note": return `Hapus catatan${a.all ? " SEMUA" : a.content ? ` "${String(a.content).slice(0, 40)}"` : a.date ? ` (${a.date})` : ""}`;
      case "delete_receipts": { const b = []; if (a.all) b.push("SEMUA"); if (a.month) b.push(`bln ${a.month}`); if (a.type) b.push(a.type); if (a.storeName) b.push(a.storeName); return `Hapus nota${b.length ? ` (${b.join(", ")})` : ""}`; }
      case "remember": return `Ingat: "${String(a.fact || a.content || "").slice(0, 80)}"`;
      case "forget": return a.all ? "Lupakan semua memori" : `Lupakan: "${String(a.fact || a.content || "").slice(0, 60)}"`;
      default: return `Aksi: ${a.type}`;
    }
  };

  const applyActions = (actions) => {
    const nd = {
      ...data,
      products: [...products], routes: [...routes], stores: [...stores],
      consignments: [...consignments], transactions: [...transactions],
      notes: [...(data.notes || [])], receipts: [...receipts],
      receiptCounter: data.receiptCounter || 1,
    };
    const results = [];
    let memFacts = [...(aiMem.facts || [])];
    let memChanged = false;
    const palette = ["#E07B1A", "#D6453F", "#138A5E", "#D89215", "#2563C9", "#7C4DD6", "#C2611A"];
    const norm = (s) => String(s || "").trim().toLowerCase();
    const findStore = (n) => nd.stores.find(s => norm(s.name) === norm(n)) || (norm(n) && nd.stores.find(s => norm(s.name).includes(norm(n))));
    const findStoreExact = (n) => nd.stores.find(s => norm(s.name) === norm(n));
    const findProduct = (n) => nd.products.find(p => norm(p.name) === norm(n)) || (norm(n) && nd.products.find(p => norm(p.name).includes(norm(n))));
    const findRoute = (n) => n ? (nd.routes.find(r => norm(r.name) === norm(n)) || nd.routes.find(r => norm(r.name).includes(norm(n)))) : null;
    const ensureRoute = (name) => {
      if (!name) return null;
      let r = findRoute(name);
      if (!r) { r = { id: uid(), name: String(name).trim(), color: palette[nd.routes.length % palette.length], days: [] }; nd.routes = [...nd.routes, r]; }
      return r;
    };

    for (const a of (actions || [])) {
      try {
        switch (a.type) {
          case "add_product": {
            if (!a.name || a.price == null) { results.push("Produk gagal: nama/harga kurang."); break; }
            const ex = nd.products.find(p => norm(p.name) === norm(a.name));
            if (ex) {
              nd.products = nd.products.map(p => p.id === ex.id ? { ...p, price: +a.price, costPrice: a.costPrice != null ? +a.costPrice : p.costPrice } : p);
              results.push(`• Produk "${a.name}" sudah ada — harga diperbarui (${fmt(+a.price)}).`);
            } else {
              nd.products = [...nd.products, { id: uid(), name: a.name, price: +a.price, costPrice: +(a.costPrice || 0) }];
              results.push(`Produk "${a.name}" ditambahkan.`);
            }
            break;
          }
          case "add_route": {
            if (!a.name) { results.push("Rute gagal: nama kurang."); break; }
            if (findRoute(a.name)) { results.push(`• Rute "${a.name}" sudah ada (dilewati).`); break; }
            nd.routes = [...nd.routes, { id: uid(), name: a.name, color: a.color || palette[nd.routes.length % palette.length], days: Array.isArray(a.days) ? a.days : [] }];
            results.push(`Rute "${a.name}" ditambahkan.`); break;
          }
          case "add_store": {
            if (!a.name) { results.push("Toko gagal: nama kurang."); break; }
            const rt = a.routeName ? ensureRoute(a.routeName) : null;
            const existing = findStoreExact(a.name);
            if (existing) {
              nd.stores = nd.stores.map(s => s.id === existing.id ? { ...s, routeId: rt ? rt.id : s.routeId, address: a.address || s.address, contact: a.contact || s.contact, note: a.note != null ? a.note : s.note } : s);
              results.push(`• Toko "${a.name}" sudah ada — diperbarui${rt ? ` (rute ${rt.name})` : ""} (tidak diduplikat).`);
            } else {
              nd.stores = [...nd.stores, { id: uid(), createdAt: Date.now(), name: a.name, address: a.address || "", contact: a.contact || "", routeId: rt ? rt.id : "", note: a.note || "" }];
              results.push(`Toko "${a.name}" ditambahkan${rt ? ` (rute ${rt.name})` : ""}.`);
            }
            break;
          }
          case "add_income":
          case "add_expense": {
            if (a.amount == null) { results.push("Transaksi gagal: jumlah kurang."); break; }
            const t = { id: uid(), type: a.type === "add_income" ? "income" : "expense", category: a.category || "Lain-lain", amount: +a.amount, date: a.date || today, note: a.note || "" };
            nd.transactions = [t, ...nd.transactions];
            results.push(`${t.type === "income" ? "Pemasukan" : "Pengeluaran"} ${fmt(t.amount)} dicatat.`); break;
          }
          case "add_note": {
            if (!a.content) { results.push("Catatan gagal: isi kurang."); break; }
            nd.notes = [{ id: uid(), date: a.date || today, content: a.content, pinned: !!a.pinned }, ...nd.notes];
            results.push("Catatan ditambahkan."); break;
          }
          case "cash_sale":
          case "drop": {
            const store = findStore(a.storeName);
            if (!store) { results.push(`${a.type}: toko "${a.storeName}" tidak ditemukan.`); break; }
            const recItems = []; let total = 0;
            for (const it of (a.items || [])) {
              const p = findProduct(it.product); const qty = +it.qty;
              if (!p || !(qty > 0)) { results.push(`Produk "${it.product}" tidak ditemukan / qty salah.`); continue; }
              recItems.push({ productId: p.id, name: p.name, qty, price: p.price }); total += qty * p.price;
              if (a.type === "drop") {
                const ex = nd.consignments.find(c => c.storeId === store.id && c.productId === p.id && c.status === "active");
                if (ex) nd.consignments = nd.consignments.map(c => c.id === ex.id ? { ...c, deposited: c.deposited + qty, remaining: c.remaining + qty } : c);
                else nd.consignments = [...nd.consignments, { id: uid(), storeId: store.id, productId: p.id, deposited: qty, remaining: qty, date: a.date || today, status: "active" }];
              }
            }
            if (!recItems.length) { results.push(`${a.type}: tidak ada item valid.`); break; }
            if (a.type === "cash_sale") recItems.forEach(ri => { nd.transactions = [{ id: uid(), type: "income", category: "Penjualan", amount: ri.qty * ri.price, date: a.date || today, note: `${store.name} - ${ri.name} ${ri.qty}bks (tunai)` }, ...nd.transactions]; });
            const ntype = a.type === "drop" ? "drop" : "cash";
            const notaNo = genNotaNo(ntype, nd.receiptCounter);
            nd.receipts = [{ id: uid(), notaNo, type: ntype, date: a.date || today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: recItems, total }, ...nd.receipts];
            nd.receiptCounter += 1;
            results.push(`${a.type === "drop" ? "Drop" : "Jual tunai"} di ${store.name}: ${recItems.map(r => `${r.qty} ${r.name}`).join(", ")} = ${fmt(total)} (nota ${notaNo}).`); break;
          }
          case "set_stock": {
            const store = findStore(a.storeName); const p = findProduct(a.product);
            if (!store || !p) { results.push("Set stok: toko/produk tidak ditemukan."); break; }
            const q = Math.max(0, +a.qty || 0);
            const ex = nd.consignments.find(c => c.storeId === store.id && c.productId === p.id && c.status === "active");
            if (ex) nd.consignments = nd.consignments.map(c => c.id === ex.id ? { ...c, deposited: q, remaining: q, status: q <= 0 ? "closed" : "active" } : c);
            else if (q > 0) nd.consignments = [...nd.consignments, { id: uid(), storeId: store.id, productId: p.id, deposited: q, remaining: q, date: today, status: "active" }];
            results.push(`Stok ${p.name} di ${store.name} di-set ${q} bks.`); break;
          }
          case "collect": {
            const store = findStore(a.storeName);
            if (!store) { results.push(`Tagih: toko "${a.storeName}" tidak ditemukan.`); break; }
            const recItems = []; let total = 0;
            for (const it of (a.items || [])) {
              const p = findProduct(it.product); const sold = +(it.soldQty ?? it.qty);
              if (!p || !(sold > 0)) { results.push(`Tagih: produk "${it.product}" salah.`); continue; }
              const c = nd.consignments.find(x => x.storeId === store.id && x.productId === p.id && x.status === "active");
              if (!c) { results.push(`Tagih: ${p.name} belum ada titipan di ${store.name}.`); continue; }
              const s = Math.min(sold, c.remaining); const newRem = c.remaining - s;
              nd.consignments = nd.consignments.map(x => x.id === c.id ? { ...x, deposited: newRem, remaining: newRem, status: newRem <= 0 ? "closed" : "active" } : x);
              nd.transactions = [{ id: uid(), type: "income", category: "Penjualan", amount: s * p.price, date: a.date || today, note: `${store.name} - ${p.name} ${s}bks` }, ...nd.transactions];
              recItems.push({ productId: p.id, name: p.name, qty: s, price: p.price }); total += s * p.price;
            }
            if (!recItems.length) { results.push("Tagih: tidak ada item valid."); break; }
            const notaNo = genNotaNo("payment", nd.receiptCounter);
            nd.receipts = [{ id: uid(), notaNo, type: "payment", date: a.date || today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: recItems, total }, ...nd.receipts];
            nd.receiptCounter += 1;
            results.push(`Tagih ${store.name}: ${recItems.map(r => `${r.qty} ${r.name}`).join(", ")} = ${fmt(total)} (nota ${notaNo}).`); break;
          }
          case "update_store": {
            const target = findStoreExact(a.name || a.storeName) || findStore(a.name || a.storeName);
            if (!target) { results.push(`Update toko: "${a.name || a.storeName}" tidak ditemukan.`); break; }
            const rt = a.routeName ? ensureRoute(a.routeName) : null;
            nd.stores = nd.stores.map(s => s.id === target.id ? { ...s, name: a.newName || s.name, routeId: rt ? rt.id : s.routeId, address: a.address != null ? a.address : s.address, contact: a.contact != null ? a.contact : s.contact, note: a.note != null ? a.note : s.note } : s);
            results.push(`Toko "${target.name}" diperbarui${a.newName ? ` → "${a.newName}"` : ""}${rt ? ` (rute ${rt.name})` : ""}.`); break;
          }
          case "update_product": {
            const target = nd.products.find(p => norm(p.name) === norm(a.name)) || nd.products.find(p => norm(a.name) && norm(p.name).includes(norm(a.name)));
            if (!target) { results.push(`Update produk: "${a.name}" tidak ditemukan.`); break; }
            nd.products = nd.products.map(p => p.id === target.id ? { ...p, name: a.newName || p.name, price: a.price != null ? +a.price : p.price, costPrice: a.costPrice != null ? +a.costPrice : p.costPrice } : p);
            results.push(`Produk "${target.name}" diperbarui.`); break;
          }
          case "delete_store": {
            const nm = norm(a.name || a.storeName);
            if (!nm) { results.push("Hapus toko: nama kurang."); break; }
            const matches = nd.stores.filter(s => norm(s.name) === nm);
            const hasStock = (s) => nd.consignments.some(c => c.storeId === s.id && c.status === "active" && c.remaining > 0);
            const toDelete = a.onlyEmpty ? matches.filter(s => !hasStock(s)) : matches;
            if (!toDelete.length) { results.push(`Hapus toko: tidak ada "${a.name || a.storeName}"${a.onlyEmpty ? " yang kosong" : ""} untuk dihapus.`); break; }
            const ids = new Set(toDelete.map(s => s.id));
            nd.stores = nd.stores.filter(s => !ids.has(s.id));
            nd.consignments = nd.consignments.filter(c => !ids.has(c.storeId));
            results.push(`${toDelete.length} toko "${a.name || a.storeName}"${a.onlyEmpty ? " (kosong)" : ""} dihapus.`); break;
          }
          case "delete_product": {
            const target = nd.products.find(p => norm(p.name) === norm(a.name));
            if (!target) { results.push(`Hapus produk: "${a.name}" tidak ditemukan.`); break; }
            nd.products = nd.products.filter(p => p.id !== target.id);
            results.push(`Produk "${target.name}" dihapus.`); break;
          }
          case "delete_transactions": {
            const mon = a.month ? resolveMonth(a.month) : null;
            if (a.month && !mon) { results.push(`Hapus transaksi: bulan "${a.month}" tidak dikenali (pakai YYYY-MM).`); break; }
            const typ = a.type ? normTxType(a.type) : null;
            const catQ = a.category ? norm(a.category) : null;
            const noteQ = a.note ? norm(a.note) : null;
            const dateQ = a.date || null;
            const hasFilter = !!(mon || dateQ || typ || catQ || noteQ);
            if (!a.all && !hasFilter) { results.push("Hapus transaksi: sebutkan kriteria (mis. bulan) atau set all:true."); break; }
            const match = (t) => {
              if (mon && !String(t.date).startsWith(mon)) return false;
              if (dateQ && t.date !== dateQ) return false;
              if (typ && t.type !== typ) return false;
              if (catQ && !norm(t.category).includes(catQ)) return false;
              if (noteQ && !norm(t.note).includes(noteQ)) return false;
              return true;
            };
            const toDel = nd.transactions.filter(match);
            if (!toDel.length) { results.push("Hapus transaksi: tidak ada yang cocok."); break; }
            const ids = new Set(toDel.map(t => t.id));
            nd.transactions = nd.transactions.filter(t => !ids.has(t.id));
            const masuk = toDel.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
            const keluar = toDel.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
            results.push(`${toDel.length} transaksi dihapus${mon ? ` (${mon})` : ""}${typ ? ` · ${typ === "income" ? "pemasukan" : "pengeluaran"}` : ""}. Total masuk ${fmt(masuk)}, keluar ${fmt(keluar)}.`);
            break;
          }
          case "delete_note": {
            if (a.all) { const n = nd.notes.length; nd.notes = []; results.push(`${n} catatan dihapus.`); break; }
            const q = norm(a.content || a.text || a.fact || "");
            const dateQ = a.date || null;
            if (!q && !dateQ) { results.push("Hapus catatan: sebutkan isi/tanggal atau set all:true."); break; }
            const before = nd.notes.length;
            nd.notes = nd.notes.filter(nt => !((dateQ ? nt.date === dateQ : true) && (q ? norm(nt.content).includes(q) : true)));
            const removed = before - nd.notes.length;
            results.push(removed ? `${removed} catatan dihapus.` : "Hapus catatan: tidak ada yang cocok.");
            break;
          }
          case "delete_receipts": {
            const mon = a.month ? resolveMonth(a.month) : null;
            if (a.month && !mon) { results.push(`Hapus nota: bulan "${a.month}" tidak dikenali.`); break; }
            const typ = a.type || null; // drop / cash / payment
            const storeQ = a.storeName ? norm(a.storeName) : null;
            const hasFilter = !!(mon || typ || storeQ);
            if (!a.all && !hasFilter) { results.push("Hapus nota: sebutkan kriteria atau set all:true."); break; }
            const match = (r) => {
              if (mon && !String(r.date).startsWith(mon)) return false;
              if (typ && r.type !== typ) return false;
              if (storeQ && !norm(r.storeName).includes(storeQ)) return false;
              return true;
            };
            const toDel = nd.receipts.filter(match);
            if (!toDel.length) { results.push("Hapus nota: tidak ada yang cocok."); break; }
            const ids = new Set(toDel.map(r => r.id));
            nd.receipts = nd.receipts.filter(r => !ids.has(r.id));
            results.push(`${toDel.length} nota dihapus${mon ? ` (${mon})` : ""}.`);
            break;
          }
          case "remember": {
            const fact = String(a.fact || a.content || "").trim();
            if (!fact) { results.push("Ingat: isi kosong."); break; }
            if (!memFacts.some(f => norm(f) === norm(fact))) { memFacts.push(fact); memChanged = true; results.push(`Diingat: "${fact}"`); }
            else results.push(`Sudah diingat: "${fact}"`);
            break;
          }
          case "forget": {
            const q = norm(a.fact || a.content || "");
            const before = memFacts.length;
            if (a.all) { memFacts = []; }
            else if (q) { memFacts = memFacts.filter(f => !norm(f).includes(q)); }
            if (memFacts.length !== before || a.all) { memChanged = true; results.push("Memori diperbarui (dilupakan)."); }
            else results.push("Tidak ada yang cocok untuk dilupakan.");
            break;
          }
          default: results.push(`Aksi tidak dikenal: ${a.type}`);
        }
      } catch (err) { results.push(`Gagal memproses aksi: ${String(err.message || err)}`); }
    }
    setData(nd);
    if (memChanged) setAiMem({ facts: memFacts });
    return results;
  };

  const send = async (q) => {
    const question = (q ?? input).trim();
    if (!question || loading) return;
    setErr(null);
    setPending(null);
    // Tentukan sesi tujuan (buat & aktifkan bila belum ada), lalu KUNCI balasan ke sesi ini
    const targetId = active ? active.id : uid();
    const base = active ? active.messages : [];
    const newMsgs = [...base, { role: "user", content: question }];
    appendToSession(targetId, () => newMsgs, { create: true, activate: true });
    setInput("");
    setLoadingId(targetId);
    try {
      const memBlock = (aiMem.facts && aiMem.facts.length)
        ? "\n\nINGATAN & PREFERENSI PEMILIK (hasil pembelajaran sebelumnya — WAJIB dipatuhi):\n- " + aiMem.facts.join("\n- ")
        : "";
      const reply = await askAI({
        system: SYSTEM + memBlock + "\n\nDATA (JSON):\n" + buildContext(),
        messages: newMsgs.slice(-12).map(m => ({ role: m.role, content: m.content })),
      });
      const parsed = extractActions(reply || "");
      const actions = parsed ? parsed.actions : null;
      let prose = stripJson(reply || "");
      if (actions) {
        if (!parsed.complete) prose += (prose ? "\n\n" : "") + "Daftarnya panjang dan sepertinya terpotong — saya tampilkan yang berhasil terbaca di bawah. Jika ada yang kurang, kirim sisanya secara terpisah.";
      } else if (/```|"actions"/.test(reply || "")) {
        prose += (prose ? "\n\n" : "") + "Daftarnya terlalu panjang sehingga balasan terpotong dan gagal dibaca. Coba kirim per 5–8 item agar muat.";
      }
      appendToSession(targetId, m => [...m, { role: "assistant", content: prose || (actions ? "Saya siapkan perubahannya — mohon konfirmasi di bawah." : "(maaf, tidak ada jawaban)") }]);
      if (actions) setPending({ sessionId: targetId, actions });
    } catch (e) {
      const msg = String(e.message || e);
      setErr({ sessionId: targetId, msg: msg.startsWith("Backend") ? msg : "Tidak bisa terhubung ke layanan AI. Pastikan backend /api/ai sudah terpasang (lihat catatan di kode)." });
    } finally {
      setLoadingId(null);
    }
  };

  const confirmActions = () => {
    if (!pending) return;
    const { sessionId, actions } = pending;
    setPending(null);
    const results = applyActions(actions);
    appendToSession(sessionId, m => [...m, { role: "assistant", content: "Selesai diterapkan:\n" + results.join("\n") }]);
  };
  const cancelActions = () => {
    if (!pending) return;
    const { sessionId } = pending;
    setPending(null);
    appendToSession(sessionId, m => [...m, { role: "assistant", content: "Baik, perubahan dibatalkan." }]);
  };

  const suggestions = [
    "Toko mana yang paling lama belum dikunjungi?",
    "Berapa omset dan laba bulan ini?",
    "Catat penjualan tunai 5 Kriuk Original di Warung Bu Sari",
    "Catat pengeluaran 50.000 untuk beli bensin",
  ];

  const loadingThis = !!(active && loadingId === active.id);

  return (
    <div className="fade-up">
      <SectionHeader title="Asisten AI" sub="Tanya atau perintahkan apa saja tentang data bisnismu"
        action={<div style={{ display: "flex", gap: 8 }}>
          {sessions.length > 0 && <Btn variant="ghost" size="sm" icon={<Icon name="clock" size={15} />} onClick={() => setShowHistory(v => !v)}>Riwayat</Btn>}
          <Btn variant="outline" size="sm" icon="＋" onClick={newChat}>Chat Baru</Btn>
        </div>} />

      {showHistory && (
        <>
          <div onClick={() => setShowHistory(false)} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(33,26,18,0.42)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "min(330px, 86vw)", zIndex: 1201, background: "var(--surface)", borderRight: "1.5px solid var(--line)", boxShadow: "2px 0 30px rgba(33,26,18,0.18)", display: "flex", flexDirection: "column", animation: "drawerIn .22s ease" }}>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1.5px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 15, fontWeight: 800, display:"flex", alignItems:"center", gap:7 }}><Icon name="clock" size={16} /> Riwayat Chat</p>
              <button onClick={() => setShowHistory(false)} title="Tutup" style={{ width: 32, height: 32, borderRadius: 9, border: "1.5px solid var(--line)", background: "var(--bg)", cursor: "pointer", color: "var(--ink-2)", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="x" size={15} /></button>
            </div>
            <div style={{ padding: 12 }}>
              <Btn full variant="primary" icon="＋" onClick={newChat}>Chat Baru</Btn>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              {sessions.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)", padding: "6px", fontWeight: 500 }}>Belum ada chat tersimpan.</p>
              ) : sessions.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: 11, border: `1.5px solid ${s.id === chat.activeId ? "var(--brand-tint)" : "var(--line)"}`, background: s.id === chat.activeId ? "var(--brand-soft)" : "var(--bg)" }}>
                  <button onClick={() => switchChat(s.id)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)", minWidth: 0, padding: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title || "Chat Baru"}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, marginTop: 1 }}>{fmtChatDate(s.createdAt)} · {s.messages.length} pesan</p>
                  </button>
                  <button onClick={() => deleteChat(s.id)} title="Hapus chat" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="trash" size={14} /></button>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1.5px solid var(--line)", padding: 12, maxHeight: "34%", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--muted)", display:"flex", alignItems:"center", gap:6 }}><Icon name="sparkles" size={14} /> Memori AI ({(aiMem.facts || []).length})</p>
                {(aiMem.facts || []).length > 0 && <button onClick={() => setAiMem({ facts: [] })} style={{ fontSize: 11.5, fontWeight: 700, color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}>Lupakan semua</button>}
              </div>
              {(aiMem.facts || []).length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, lineHeight: 1.5 }}>AI menyimpan preferensi & koreksimu di sini agar makin sesuai. Contoh: ajari "k berarti ribuan" atau "produk default Kriuk".</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {aiMem.facts.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 9, padding: "7px 10px" }}>
                      <span style={{ flex: 1, fontSize: 12.5, color: "var(--ink)", fontWeight: 500, lineHeight: 1.4 }}>{f}</span>
                      <button onClick={() => setAiMem({ facts: aiMem.facts.filter((_, j) => j !== i) })} title="Lupakan" style={{ flexShrink: 0, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display:"flex" }}><Icon name="x" size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div ref={scrollRef} style={{ minHeight: 300, maxHeight: "52vh", overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && !loadingThis && (
            <div style={{ textAlign: "center", margin: "auto 0", padding: "10px 6px" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 10px 24px rgba(76,91,212,0.26)", color: "#fff" }}><Icon name="sparkles" size={30} /></div>
              <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Halo! Saya asisten bisnis Anda</p>
              <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 500, maxWidth: 360, margin: "0 auto 18px", lineHeight: 1.55 }}>Tanyakan tentang omset, titipan, toko, atau produk. Coba salah satu:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420, margin: "0 auto" }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: 12, border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand-tint)"; e.currentTarget.style.background = "var(--brand-soft)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--bg)"; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 9, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: m.role === "user" ? "var(--ink)" : "linear-gradient(135deg, var(--brand), var(--brand-deep))", color: "#fff" }}><Icon name={m.role === "user" ? "user" : "sparkles"} size={17} /></div>
              <div style={{ maxWidth: "82%", padding: "11px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.6, fontWeight: 500, whiteSpace: "pre-wrap", wordBreak: "break-word",
                background: m.role === "user" ? "var(--brand-soft)" : "var(--bg-2)", color: "var(--ink)", border: `1.5px solid ${m.role === "user" ? "var(--brand-tint)" : "var(--line)"}`,
                borderTopRightRadius: m.role === "user" ? 4 : 14, borderTopLeftRadius: m.role === "user" ? 14 : 4 }}>
                {m.content}
              </div>
            </div>
          ))}

          {loadingThis && (
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", color: "#fff" }}><Icon name="sparkles" size={17} /></div>
              <div style={{ padding: "12px 16px", borderRadius: 14, borderTopLeftRadius: 4, background: "var(--bg-2)", border: "1.5px solid var(--line)", color: "var(--muted)", fontSize: 13.5, fontWeight: 600 }}>
                <span className="ai-typing">Sedang menganalisis data…</span>
              </div>
            </div>
          )}

          {err && active && err.sessionId === active.id && (
            <div style={{ background: "var(--red-soft)", border: "1.5px solid #F2C7C3", borderRadius: 12, padding: "11px 14px", fontSize: 13, color: "var(--red)", fontWeight: 600, lineHeight: 1.5 }}>
              {err.msg}
            </div>
          )}

          {pending && active && pending.sessionId === active.id && (
            <div style={{ background: "var(--brand-soft)", border: "2px solid var(--brand-tint)", borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 7, color: "var(--brand-deep)" }}><Icon name="sparkles" size={16} /> Konfirmasi perubahan data ({pending.actions.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14, maxHeight: 280, overflowY: "auto" }}>
                {pending.actions.map((a, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 10, padding: "9px 12px", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                    {describeAction(a)}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn full variant="ghost" onClick={cancelActions}>Batal</Btn>
                <Btn full variant="success" icon={<Icon name="check" size={15} />} onClick={confirmActions}>Terapkan</Btn>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1.5px solid var(--line)", padding: 12, display: "flex", gap: 8, background: "var(--surface)" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Tulis perintah atau pertanyaan…" disabled={loading} style={{ flex: 1 }} />
          <Btn onClick={() => send()} disabled={loading || !input.trim()} icon={<Icon name="send" size={15} />}>Kirim</Btn>
        </div>
      </Card>

      <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500, textAlign: "center", lineHeight: 1.6, marginTop: 14 }}>
        AI bisa menjawab pertanyaan & mengelola data (tambah toko/produk, catat penjualan, dll). Perubahan selalu minta konfirmasi dulu — tetap cek angka penting.<br/>
        Demo ini memakai AI bawaan Claude. Untuk aplikasi yang Anda host sendiri, sambungkan ke API key + backend (lihat catatan di kode).
      </p>

      <style>{`
        @keyframes aiblink { 0%,100%{opacity:.4} 50%{opacity:1} }
        .ai-typing { animation: aiblink 1.2s ease-in-out infinite; }
        @keyframes drawerIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [data, setData] = useLocalStorage("kriuk_v6", INIT);
  const [page, setPage] = useState("dashboard");
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [financeTab, setFinanceTab] = useState(null);

  const navigate = (p, opts) => {
    setPage(p);
    if (p !== "stores") setSelectedStoreId(null);
    if (opts && opts.financeTab) setFinanceTab(opts.financeTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    const props = { data, setData, setPage: navigate };
    switch (page) {
      case "dashboard": return <Dashboard {...props} />;
      case "finance": return <Finance {...props} initialTab={financeTab} onTabConsumed={() => setFinanceTab(null)} />;
      case "stores": return <Stores {...props} selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId} />;
      case "receipts": return <Receipts {...props} />;
      case "notes": return <Notes {...props} />;
      case "products": return <Products {...props} />;
      case "production": return <Production {...props} />;
      case "assistant": return <Assistant {...props} />;
      case "settings": return <Settings {...props} />;
      default: return null;
    }
  };

  const tdyDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long" });
  const reminders = buildReminders(data);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 500, background: "rgba(245,246,248,0.82)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #5868E0, #3F4FC0)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: "-0.04em" }}>SB</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>{COMPANY.name}</p>
                <p className="brand-subtitle" style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.1, marginTop: 2, whiteSpace: "nowrap", fontWeight: 500 }}>{COMPANY.tagline}</p>
              </div>
            </div>
            <div className="nav-wrap" style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
              <TopNav page={page} setPage={navigate} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <NotificationBell reminders={reminders} onOpenStore={(id) => { setSelectedStoreId(id); navigate("stores"); }} onGoSettings={() => navigate("settings")} />
              <div style={{ textAlign: "right" }} className="date-display">
                <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{todayDay}</p>
                <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>{tdyDate}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="main-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 16px 28px", overflowX: "hidden" }}>
          {renderPage()}
        </main>
      </div>

      <BottomNav page={page} setPage={navigate} onMore={() => setShowMore(true)} />
      <MoreSheet show={showMore} onClose={() => setShowMore(false)} page={page} setPage={navigate} />

      <style>{`
        @media (max-width: 860px) {
          .topnav { display: none !important; }
          .nav-wrap { display: none !important; }
          .date-display { display: none !important; }
          .bottomnav { display: block !important; }
          .main-wrap { padding-bottom: calc(86px + env(safe-area-inset-bottom)) !important; }
        }
        @media (max-width: 480px) {
          .brand-subtitle { display: block !important; }
        }
      `}</style>
    </>
  );
}
