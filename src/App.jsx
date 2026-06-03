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
    { id: "t1", type: "income", category: "Penjualan", amount: 96000, date: "2026-05-18", note: "Tagihan Bu Sari - Kriuk Original 12bks" },
    { id: "t2", type: "income", category: "Penjualan", amount: 72000, date: "2026-05-17", note: "Tagihan Pak Budi" },
    { id: "t3", type: "expense", category: "Produksi", amount: 150000, date: "2026-05-17", note: "Beli bahan baku tepung & bumbu" },
    { id: "t4", type: "income", category: "Penjualan", amount: 56000, date: "2026-05-16", note: "Tagihan Minimart Ceria" },
    { id: "t5", type: "expense", category: "Transport", amount: 30000, date: "2026-05-16", note: "BBM motor" },
    { id: "t6", type: "income", category: "Penjualan", amount: 88000, date: "2026-05-15", note: "Tagihan Warung Pak RT" },
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
    ? { label: "PENITIPAN", short: "Penitipan", color: "var(--blue)", soft: "var(--blue-soft)", icon: "📦", title: "Nota Penitipan", printTitle: "NOTA PENITIPAN BARANG" }
    : type === "cash"
    ? { label: "PENJUALAN TUNAI", short: "Tunai", color: "var(--green)", soft: "var(--green-soft)", icon: "💵", title: "Nota Penjualan Tunai", printTitle: "NOTA PENJUALAN TUNAI" }
    : { label: "PEMBAYARAN", short: "Pembayaran", color: "var(--amber)", soft: "var(--amber-soft)", icon: "💰", title: "Nota Pembayaran", printTitle: "NOTA PEMBAYARAN" };

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
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--muted)"; }}>✕</button>
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

function ConfirmDialog({ show, onClose, onConfirm, title, message, confirmText = "Hapus", danger = true, icon = "⚠️" }) {
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
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: danger ? "var(--red-soft)" : "var(--amber-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 18px" }}>{icon}</div>
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
    <div style={{ textAlign: "center", padding: "44px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.85 }}>{icon}</div>
      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--ink)" }}>{title}</p>
      <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500, maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>{sub}</p>
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
      <p style={{ fontSize:12.5, fontWeight:800, color:"var(--ink-2)", marginBottom:4 }}>📍 Lokasi Toko (untuk fitur terdekat & rute)</p>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:10, fontWeight:500, lineHeight:1.5 }}>Tekan tombol di bawah <b>saat Anda berada di toko</b> untuk menyimpan titiknya.</p>
      <Btn full size="sm" icon="📍" variant={has ? "outline" : "primary"} onClick={capture}>
        {status === "loading" ? "Mendeteksi lokasi…" : has ? "Perbarui ke Lokasi Saat Ini" : "Pakai Lokasi Saat Ini (GPS)"}
      </Btn>
      {status === "denied" && <p style={{ fontSize:12, color:"var(--red)", marginTop:8, fontWeight:600 }}>Izin lokasi ditolak. Aktifkan izin lokasi di browser lalu coba lagi.</p>}
      {status === "unavailable" && <p style={{ fontSize:12, color:"var(--red)", marginTop:8, fontWeight:600 }}>GPS tidak tersedia di perangkat ini. Bisa isi koordinat manual di bawah.</p>}
      {has && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginTop:10, background:"var(--green-soft)", border:"1.5px solid #BCE6D2", borderRadius:10, padding:"9px 12px", flexWrap:"wrap" }}>
          <span className="tnum" style={{ fontSize:12.5, color:"var(--green)", fontWeight:700 }}>✓ {lat.toFixed(5)}, {lng.toFixed(5)}</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"var(--blue)", fontWeight:700, textDecoration:"none" }}>Lihat di peta ↗</a>
            <button onClick={() => onChange(undefined, undefined)} style={{ fontSize:12, color:"var(--red)", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)" }}>Hapus</button>
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
        {address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"var(--blue)", fontWeight:700, textDecoration:"none" }}>🔎 Cari alamat di Google Maps</a>}
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
  { id: "assistant", label: "Asisten AI", icon: "sparkles", desc: "Tanya-jawab data bisnis" },
  { id: "settings", label: "Pengaturan", icon: "settings", desc: "Backup & restore data" },
];
const BOTTOM_TABS = ["dashboard", "stores", "finance", "receipts"]; // + "more"

// Notification bell (top-right) — pengingat kunjungan & catatan toko
function NotificationBell({ reminders, onOpenStore }) {
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
              <p style={{ fontSize: 14.5, fontWeight: 800 }}>🔔 Pengingat</p>
              <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>{count} aktif</span>
            </div>
            {count === 0 ? (
              <div style={{ textAlign: "center", padding: "22px 8px" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>Tidak ada kunjungan rute dalam 2 hari ke depan.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reminders.map(r => (
                  <button key={r.id} onClick={() => { if (r.storeId) { onOpenStore(r.storeId); setOpen(false); } }}
                    style={{ textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start", background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 11, padding: "10px 12px", cursor: r.storeId ? "pointer" : "default", fontFamily: "var(--font)", width: "100%" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{r.kind === "route" ? "📍" : "📝"}</span>
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
function Dashboard({ data, setPage }) {
  const { transactions, consignments, stores, products, routes, notes } = data;

  const todayIncome = transactions.filter(t => t.date === today && t.type === "income").reduce((s,t) => s+t.amount, 0);
  const monthTx = transactions.filter(t => t.date.startsWith(thisMonth));
  const monthIncome = monthTx.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const monthExpense = monthTx.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);
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
      Biaya: transactions.filter(t => t.date === ds && t.type === "expense").reduce((s,t) => s+t.amount, 0),
    };
  });

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="fade-up">
      {/* Greeting hero */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{greeting} 👋</p>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, marginTop: 2 }}>Ringkasan Bisnis</h1>
      </div>

      {todayRoutes.length > 0 && (
        <div onClick={() => setPage("stores")} style={{ background: "linear-gradient(120deg, var(--brand) 0%, var(--brand-deep) 100%)", borderRadius: "var(--r)", padding: "18px 22px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 12px 30px rgba(76,91,212,0.26)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ width: 50, height: 50, background: "rgba(255,255,255,0.22)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, flexShrink: 0 }}>🗺️</div>
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <p style={{ fontWeight: 800, fontSize: 16.5, color: "#fff" }}>Jadwal Kunjungan Hari Ini</p>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>{todayRoutes.map(r => r.name).join(", ")} — ketuk untuk lihat toko</p>
          </div>
          <span style={{ color: "#fff", fontSize: 22, opacity: 0.9, position: "relative" }}>→</span>
        </div>
      )}

      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Omset Hari Ini" value={fmtShort(todayIncome)} icon={<Icon name="coins" size={20} />} color="var(--green)" soft="var(--green-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Omset Bulan Ini" value={fmtShort(monthIncome)} icon={<Icon name="trending-up" size={20} />} color="var(--brand)" soft="var(--brand-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Pengeluaran" value={fmtShort(monthExpense)} icon={<Icon name="trending-down" size={20} />} color="var(--red)" soft="var(--red-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Laba Bersih" value={fmtShort(monthIncome - monthExpense)} icon={<Icon name="wallet" size={20} />} color="var(--amber)" soft="var(--amber-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Toko Aktif" value={stores.length} icon={<Icon name="store" size={20} />} color="var(--blue)" soft="var(--blue-soft)" onClick={() => setPage("stores")} />
        <StatCard label="Titipan Beredar" value={`${activeC.length} item`} icon={<Icon name="package" size={20} />} color="var(--brand-deep)" soft="var(--brand-soft)" onClick={() => setPage("stores")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>📊 Aktivitas 7 Hari Terakhir</p>
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
              <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>📌 Catatan Disematkan</p>
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
              if (overdueStores.length === 0) return <p style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center", padding: "16px 0", fontWeight: 500 }}>✅ Belum ada titipan</p>;
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
function MetricDetailModal({ metric, transactions, onClose }) {
  if (!metric) return null;
  const config = {
    omset: { title: "Omset Penjualan", color: "#138A5E", dataKey: "Omset" },
    pengeluaran: { title: "Pengeluaran", color: "#D6453F", dataKey: "Biaya" },
    laba: { title: "Laba Bersih", color: "#E07B1A", dataKey: "Laba" },
  }[metric];

  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    months.push({ key, label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }), Omset: 0, Biaya: 0, Laba: 0 });
  }
  transactions.forEach(t => {
    const m = months.find(x => x.key === t.date.slice(0, 7));
    if (!m) return;
    if (t.type === "income") m.Omset += t.amount; else m.Biaya += t.amount;
  });
  months.forEach(m => { m.Laba = m.Omset - m.Biaya; });

  const thisM = now.toISOString().slice(0, 7);
  const dailyData = {};
  transactions.filter(t => t.date.startsWith(thisM)).forEach(t => {
    const day = t.date.slice(8);
    if (!dailyData[day]) dailyData[day] = { day, Omset: 0, Biaya: 0, Laba: 0 };
    if (t.type === "income") dailyData[day].Omset += t.amount; else dailyData[day].Biaya += t.amount;
  });
  Object.values(dailyData).forEach(d => { d.Laba = d.Omset - d.Biaya; });
  const dailyArr = Object.values(dailyData).sort((a,b) => +a.day - +b.day);

  const allValues = months.map(m => m[config.dataKey]);
  const total = allValues.reduce((s,v) => s + v, 0);
  const avg = total / Math.max(1, allValues.filter(v => v !== 0).length);
  const max = Math.max(...allValues, 0);

  const grad = `grad-${metric}`;

  return (
    <Modal show={true} onClose={onClose} title={config.title} subtitle="Tren 12 bulan terakhir" wide>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 22 }}>
        <div style={{ background: config.color + "14", borderRadius: 12, padding: "13px 15px" }}>
          <p style={{ fontSize: 11, color: config.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total 12 Bulan</p>
          <p className="tnum" style={{ fontSize: 17, fontWeight: 800, color: config.color, marginTop: 4 }}>{fmt(total)}</p>
        </div>
        <div style={{ background: "var(--bg-2)", borderRadius: 12, padding: "13px 15px" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rata-rata/Bulan</p>
          <p className="tnum" style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>{fmt(avg)}</p>
        </div>
        <div style={{ background: "var(--bg-2)", borderRadius: 12, padding: "13px 15px" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tertinggi</p>
          <p className="tnum" style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>{fmt(max)}</p>
        </div>
      </div>

      <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>📈 Tren 12 Bulan Terakhir</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs><linearGradient id={grad} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={config.color} stopOpacity={0.25} /><stop offset="100%" stopColor={config.color} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
          <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} />
          <Area type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={3} fill={`url(#${grad})`} dot={{ fill: config.color, r: 3 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>

      {dailyArr.length > 0 && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, marginTop: 24, marginBottom: 12 }}>📊 Harian Bulan Ini</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyArr} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} labelFormatter={l => `Tanggal ${l}`} />
              <Line type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={2.5} dot={{ fill: config.color, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      <div style={{ marginTop: 22 }}><Btn full variant="ghost" onClick={onClose}>Tutup</Btn></div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────
function Finance({ data, setData }) {
  const { transactions, consignments = [], products = [], stores = [], routes = [] } = data;
  const [tab, setTab] = useState("ringkasan");
  const [period, setPeriod] = useState("bulanan");
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [metricDetail, setMetricDetail] = useState(null);
  const [titipanRoute, setTitipanRoute] = useState(null);
  const [form, setForm] = useState({ type: "income", category: "Penjualan", amount: "", date: today, note: "" });
  const { confirm, Dialog } = useConfirm();

  const inCats = ["Penjualan","Bonus","Lain-lain"];
  const exCats = ["Produksi","Transport","Kemasan","Gaji","Sewa","Listrik","Lain-lain"];

  const add = () => {
    if (!form.amount || !form.date) return;
    setData(d => ({ ...d, transactions: [{ id: uid(), ...form, amount: +form.amount }, ...d.transactions] }));
    setForm({ type: "income", category: "Penjualan", amount: "", date: today, note: "" });
    setShowAdd(false);
  };

  const askDelete = (t) => confirm({
    title: "Hapus Transaksi?",
    message: `Transaksi "${t.note || t.category}" sebesar ${fmt(t.amount)} akan dihapus. Tindakan ini tidak bisa dibatalkan.`,
    confirmText: "Ya, Hapus",
    onConfirm: () => setData(d => ({ ...d, transactions: d.transactions.filter(x => x.id !== t.id) })),
  });

  const monthTxF = transactions.filter(t => t.date.startsWith(thisMonth));
  const totalIn = monthTxF.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const totalEx = monthTxF.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);

  const getMonthly = () => {
    const m = {};
    transactions.forEach(t => { const k = t.date.slice(0,7); if (!m[k]) m[k] = { key: k, Omset: 0, Biaya: 0 }; t.type === "income" ? m[k].Omset += t.amount : m[k].Biaya += t.amount; });
    return Object.values(m).sort((a,b) => a.key.localeCompare(b.key)).map(x => ({ ...x, Laba: x.Omset - x.Biaya, label: new Date(x.key+"-01").toLocaleDateString("id-ID",{month:"short",year:"2-digit"}) }));
  };
  const getDaily = () => {
    const d = {};
    transactions.filter(t => t.date.startsWith(thisMonth)).forEach(t => { if (!d[t.date]) d[t.date] = { day: t.date.slice(8), Omset: 0, Biaya: 0 }; t.type === "income" ? d[t.date].Omset += t.amount : d[t.date].Biaya += t.amount; });
    return Object.values(d).sort((a,b) => +a.day - +b.day);
  };

  const chartData = period === "bulanan" ? getMonthly() : getDaily();
  const xKey = period === "bulanan" ? "label" : "day";

  const expByCat = {};
  monthTxF.filter(t => t.type === "expense").forEach(t => { expByCat[t.category] = (expByCat[t.category]||0) + t.amount; });
  const pieData = Object.entries(expByCat).map(([name,value]) => ({name,value}));
  const COLORS = ["#E07B1A","#D6453F","#D89215","#138A5E","#2563C9","#7C4DD6","#C2611A"];

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

  const filtered = transactions.filter(t => typeFilter === "all" || t.type === typeFilter).filter(t => inTimeRange(t.date));
  const filteredIn = filtered.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const filteredEx = filtered.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);

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
  const assetCat = { kas: { label: "Kas & Bank", icon: "💵", color: "var(--green)" }, alat: { label: "Peralatan & Inventaris", icon: "🛠️", color: "var(--blue)" }, lainnya: { label: "Lainnya", icon: "📦", color: "var(--brand)" } };
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
  const nilaiTitipanAll = titipanRows.reduce((s, r) => s + r.value, 0);
  const totalAset = manualTotal + piutangAset + nilaiTitipanAll;

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
              ].map(x => (
                <button key={x.l} onClick={() => setMetricDetail(x.key)}
                  style={{ background: "var(--surface)", borderRadius: "var(--r)", padding: 18, border: "1.5px solid var(--line)", textAlign:"left", cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.18s", boxShadow:"var(--shadow-xs)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = x.c + "55"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
                  <div style={{ display: "flex", justifyContent:"space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 12, background: x.bg, color: x.c, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name={x.icon} size={20} /></span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Bulan ini</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{x.l}</p>
                  <p className="tnum" style={{ fontSize: 23, fontWeight: 800, color: x.neg ? "var(--red)" : x.c, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{x.v}</p>
                  <p style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 10, fontWeight: 600, display:"flex", alignItems:"center", gap:5, opacity:0.8 }}>Lihat grafik <span style={{ color: x.c }}>→</span></p>
                </button>
              ))}
            </div>
            {pieData.length > 0 && (
              <Card>
                <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 18 }}>Komposisi Pengeluaran Bulan Ini</p>
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
                        <span className="tnum" style={{ fontWeight:800, fontSize:14, color:COLORS[i%COLORS.length] }}>{fmt(d.value)}</span>
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
                <Btn key={v} size="sm" variant={typeFilter===v?"primary":"ghost"} onClick={() => setTypeFilter(v)}>{l}</Btn>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 800, textTransform:"uppercase", letterSpacing:"0.04em" }}>📅 Waktu:</span>
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
            {(timeFilter !== "all" || typeFilter !== "all") && filtered.length > 0 && (
              <div style={{ background: "var(--brand-soft)", border: "1.5px solid var(--brand-tint)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--brand-deep)", fontWeight: 800 }}>📊 {filtered.length} transaksi</span>
                <div className="tnum" style={{ display: "flex", gap: 14, fontSize: 12.5, fontWeight: 800, flexWrap: "wrap" }}>
                  {(typeFilter === "all" || typeFilter === "income") && filteredIn > 0 && <span style={{ color: "var(--green)" }}>+ {fmt(filteredIn)}</span>}
                  {(typeFilter === "all" || typeFilter === "expense") && filteredEx > 0 && <span style={{ color: "var(--red)" }}>− {fmt(filteredEx)}</span>}
                  {typeFilter === "all" && <span style={{ color: "var(--brand-deep)" }}>= {fmt(filteredIn - filteredEx)}</span>}
                </div>
              </div>
            )}
            <Card style={{ padding: "4px 18px" }}>
              {filtered.length === 0 && <EmptyState icon="📭" title="Tidak ada transaksi" sub="Coba ubah filter atau catat transaksi baru" />}
              {filtered.map(t => (
                <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--line)", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, minWidth: 0, flex: 1 }}>
                    <div style={{ width:40,height:40,borderRadius:11,background:t.type==="income"?"var(--green-soft)":"var(--red-soft)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:t.type==="income"?"var(--green)":"var(--red)",fontWeight:800 }}>
                      {t.type==="income"?"↑":"↓"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize:14,fontWeight:600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note||t.category}</p>
                      <div style={{ display:"flex",gap:6,marginTop:3,alignItems:"center", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:11.5,color:"var(--muted)", flexShrink:0, fontWeight:500 }}>{fmtDate(t.date)}</span>
                        <span style={{ fontSize:11, color:t.type==="income"?"var(--green)":"var(--red)", background:t.type==="income"?"var(--green-soft)":"var(--red-soft)", padding:"2px 8px", borderRadius:99, fontWeight:700, flexShrink:0 }}>{t.category}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6, flexShrink:0 }}>
                    <p className="tnum" style={{ fontWeight:800,fontSize:14,color:t.type==="income"?"var(--green)":"var(--red)",whiteSpace:"nowrap" }}>
                      {t.type==="income"?"+":"−"}{fmt(t.amount)}
                    </p>
                    <Btn size="sm" variant="danger" onClick={() => askDelete(t)}>🗑</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "titipan" && (
          <div className="fade-up">
            <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>
              Nilai & jumlah barang titip jual yang <b>masih ada di toko</b> (belum terjual). Modal yang sedang beredar.
            </p>

            <div className="route-scroll" style={{ display:"flex", gap:8, overflowX:"auto", overflowY:"hidden", marginBottom:16, paddingBottom:6, WebkitOverflowScrolling:"touch", scrollbarWidth:"thin" }}>
              <button onClick={() => setTitipanRoute(null)}
                style={{ flexShrink:0, padding:"9px 16px", borderRadius:99, border:`1.5px solid ${!titipanRoute?"var(--ink)":"var(--line-strong)"}`, background:!titipanRoute?"var(--ink)":"var(--surface)", color:!titipanRoute?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", whiteSpace:"nowrap" }}>
                Semua Rute
              </button>
              {[...routes].sort((a,b) => (b.days||[]).includes(todayDay) - (a.days||[]).includes(todayDay)).map(r => {
                const active = titipanRoute === r.id;
                const isTdy = (r.days||[]).includes(todayDay);
                return (
                  <button key={r.id} onClick={() => setTitipanRoute(r.id)}
                    style={{ flexShrink:0, padding:"9px 15px", borderRadius:99, border:`1.5px solid ${active?r.color:"var(--line-strong)"}`, background:active?r.color:"var(--surface)", color:active?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", display:"inline-flex", alignItems:"center", gap:7, whiteSpace:"nowrap" }}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:active?"#fff":r.color,display:"inline-block",flexShrink:0}}/>
                    {r.name}
                    {isTdy && <span style={{fontSize:10.5,background:active?"rgba(255,255,255,0.25)":"var(--green-soft)",color:active?"#fff":"var(--green)",padding:"1px 7px",borderRadius:99,fontWeight:800}}>Hari Ini</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", borderRadius: "var(--r)", padding: 18, color: "#fff", boxShadow: "0 10px 26px rgba(76,91,212,0.22)", gridColumn: "1 / -1" }}>
                <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.92 }}>📦 Total Nilai Barang Titipan {titipanRoute ? `· ${routeOf(titipanRoute)?.name || ""}` : "· Semua Toko"}</p>
                <p className="tnum" style={{ fontSize: 30, fontWeight: 800, marginTop: 4, lineHeight: 1.1 }}>{fmt(titipanValue)}</p>
                <p className="tnum" style={{ fontSize: 13, fontWeight: 600, opacity: 0.92, marginTop: 6 }}>{titipanQty} bungkus · {titipanStoreCount} toko · {titipanByProduct.length} jenis produk</p>
              </div>
            </div>

            <Card style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>🍟 Rincian per Produk</p>
              {titipanByProduct.length === 0 ? (
                <EmptyState icon="📭" title="Tidak ada titipan" sub={titipanRoute ? "Belum ada barang titipan di rute ini" : "Belum ada barang titipan di toko mana pun"} />
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
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>🏪 Rincian per Toko</p>
              {titipanByStore.length === 0 ? (
                <EmptyState icon="🏪" title="Tidak ada toko" sub="Belum ada toko dengan barang titipan" />
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
          </div>
        )}

        {tab === "aset" && (
          <div className="fade-up">
            <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>
              Perkiraan total kekayaan usaha: kas/bank, peralatan, ditambah <b>piutang</b> & <b>nilai barang titipan</b> yang dihitung otomatis dari data toko.
            </p>

            <div style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-deep))", borderRadius: "var(--r)", padding: 20, color: "#fff", boxShadow: "0 10px 26px rgba(76,91,212,0.22)", marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.92 }}>💎 Total Aset</p>
              <p className="tnum" style={{ fontSize: 32, fontWeight: 800, marginTop: 4, lineHeight: 1.1 }}>{fmt(totalAset)}</p>
              <p style={{ fontSize: 12, opacity: 0.85, marginTop: 6, fontWeight: 500 }}>Manual {fmt(manualTotal)} · Piutang {fmt(piutangAset)} · Titipan {fmt(nilaiTitipanAll)}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Kas & Bank", icon: "💵", val: kasTotal, color: "var(--green)" },
                { label: "Peralatan", icon: "🛠️", val: alatTotal, color: "var(--blue)" },
                { label: "Piutang (toko)", icon: "🧾", val: piutangAset, color: "var(--brand-deep)", auto: true },
                { label: "Nilai Titipan", icon: "📦", val: nilaiTitipanAll, color: "var(--brand)", auto: true },
                ...(lainTotal > 0 ? [{ label: "Lainnya", icon: "📦", val: lainTotal, color: "var(--ink-2)" }] : []),
              ].map((c, i) => (
                <div key={i} style={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 13, padding: 14 }}>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{c.icon} {c.label}{c.auto ? " ·auto" : ""}</p>
                  <p className="tnum" style={{ fontSize: 18, fontWeight: 800, color: c.color, marginTop: 4 }}>{fmt(c.val)}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 800 }}>Daftar Aset</p>
              <Btn size="sm" icon="+" onClick={() => openNewAsset("kas")}>Tambah Aset</Btn>
            </div>

            {assets.length === 0 ? (
              <Card style={{ textAlign: "center", padding: "26px 16px" }}>
                <div style={{ fontSize: 34, marginBottom: 8 }}>💎</div>
                <p style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600, lineHeight: 1.5 }}>Belum ada aset dicatat. Tambahkan kas, saldo bank, motor, etalase, dll.</p>
                <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginTop: 6 }}>Piutang & nilai titipan sudah otomatis dihitung di atas.</p>
              </Card>
            ) : (
              ["kas", "alat", "lainnya"].map(catKey => {
                const items = assets.filter(a => catKey === "lainnya" ? !["kas", "alat"].includes(a.type) : a.type === catKey);
                if (!items.length) return null;
                const meta = assetCat[catKey];
                return (
                  <div key={catKey} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--muted)" }}>{meta.icon} {meta.label}</p>
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
                          <button onClick={() => openEditAsset(a)} title="Edit" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", cursor: "pointer", fontSize: 13 }}>✏️</button>
                          <button onClick={() => askDeleteAsset(a)} title="Hapus" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            <Card style={{ background: "var(--bg-2)", marginTop: 4 }}>
              <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500, lineHeight: 1.55 }}>
                ℹ️ <b>Piutang</b> = nilai barang yang sudah laku di toko tapi belum ditagih. <b>Nilai Titipan</b> = nilai barang yang masih ada di toko. Keduanya dihitung otomatis dari transaksi & stok, jadi tak perlu diinput manual.
              </p>
            </Card>
          </div>
        )}
      </div>

      <Modal show={showAdd} onClose={() => setShowAdd(false)} title="Catat Transaksi Baru">
        <div style={{ display:"flex",gap:8,marginBottom:18 }}>
          <button onClick={() => setForm(f => ({...f,type:"income",category:"Penjualan"}))}
            style={{ flex:1,padding:"13px",borderRadius:12,border:`2px solid ${form.type==="income"?"var(--green)":"var(--line-strong)"}`,background:form.type==="income"?"var(--green-soft)":"var(--surface)",color:form.type==="income"?"var(--green)":"var(--muted)",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s" }}>
            💚 Pemasukan
          </button>
          <button onClick={() => setForm(f => ({...f,type:"expense",category:"Produksi"}))}
            style={{ flex:1,padding:"13px",borderRadius:12,border:`2px solid ${form.type==="expense"?"var(--red)":"var(--line-strong)"}`,background:form.type==="expense"?"var(--red-soft)":"var(--surface)",color:form.type==="expense"?"var(--red)":"var(--muted)",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s" }}>
            🔴 Pengeluaran
          </button>
        </div>
        <FG label="Kategori">
          <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))}>
            {(form.type==="income"?inCats:exCats).map(c => <option key={c}>{c}</option>)}
          </select>
        </FG>
        <FG label="Jumlah (Rp)"><input type="number" inputMode="numeric" placeholder="50000" value={form.amount} onChange={e => setForm(f => ({...f,amount:e.target.value}))} /></FG>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))} /></FG>
        <FG label="Keterangan"><input placeholder="Catatan singkat..." value={form.note} onChange={e => setForm(f => ({...f,note:e.target.value}))} /></FG>
        <div style={{ display:"flex",gap:10 }}>
          <Btn full variant="ghost" onClick={() => setShowAdd(false)}>Batal</Btn>
          <Btn full onClick={add}>Simpan</Btn>
        </div>
      </Modal>
      <MetricDetailModal metric={metricDetail} transactions={transactions} onClose={() => setMetricDetail(null)} />

      <Modal show={showAsset} onClose={() => setShowAsset(false)} title={editAssetId ? "Edit Aset" : "Tambah Aset"}>
        <FG label="Jenis Aset">
          <select value={assetForm.type} onChange={e => setAssetForm(f => ({ ...f, type: e.target.value }))}>
            <option value="kas">💵 Kas & Bank</option>
            <option value="alat">🛠️ Peralatan & Inventaris</option>
            <option value="lainnya">📦 Lainnya</option>
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
      newTxs.push({ id: uid(), type: "income", category: "Penjualan", amount: qty * (product?.price || 0), date: cashDate, note: `${store.name} - ${product?.name} ${qty}bks (tunai)` });
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
        newTxs.push({ id:uid(), type:"income", category:"Penjualan", amount:item.soldNow*prod.price, date:today, note:`${store.name} - ${prod.name} ${item.soldNow}bks` });
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

      <Card style={{ marginBottom:16, background: "linear-gradient(135deg, var(--surface), var(--bg))" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
          <div style={{ width:62, height:62, borderRadius:16, background:(route?.color||"#E07B1A")+"1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0, border:`1.5px solid ${(route?.color||"#E07B1A")}30` }}>🏪</div>
          <div style={{ minWidth:0, flex:1 }}>
            <h2 style={{ fontSize:21, fontWeight:800, color:"var(--ink)", marginBottom:3, wordBreak:"break-word" }}>{store.name}</h2>
            <p style={{ fontSize:13.5, color:"var(--muted)", wordBreak:"break-word", fontWeight:500 }}>📍 {store.address}</p>
            {store.contact && <p style={{ fontSize:13, color:"var(--muted)", marginTop:2, fontWeight:500 }}>📱 {store.contact}</p>}
            <div style={{ display:"flex", gap:6, marginTop:9, flexWrap:"wrap" }}>
              {route && <Tag color={route.color}>{route.name}</Tag>}
              {totalRemaining > 0 && <Tag color="var(--brand)">{totalRemaining} bks di toko</Tag>}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:12, paddingBottom:12, borderBottom:"1px solid var(--line)", flexWrap:"wrap" }}>
          <Btn variant="ghost" size="sm" icon="✏️" onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }}>Edit Info</Btn>
          <Btn variant="danger" size="sm" icon="🗑" onClick={askDelStore}>Hapus Toko</Btn>
        </div>

        <div style={{ display:"grid", gridTemplateColumns: sc.length > 0 ? "1fr 1fr" : "1fr", gap:10, marginBottom:10 }}>
          <Btn full size="lg" icon="📦" onClick={() => setShowDrop(true)}>Drop Barang</Btn>
          {sc.length > 0 && (
            <Btn full size="lg" variant={tagihan > 0 ? "primary" : "outline"} icon="🤝" onClick={openVisit}>
              {tagihan > 0 ? `Tagih (${fmt(tagihan)})` : "Kunjungi & Catat"}
            </Btn>
          )}
        </div>
        <Btn full size="lg" variant="success" icon="💵" onClick={() => setShowCash(true)}>Jual Tunai (Bayar Cash)</Btn>
      </Card>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: (editingNote || store.note) ? 10 : 0, gap:8 }}>
          <p style={{ fontSize:14.5, fontWeight:800 }}>📝 Catatan & Pengingat Toko</p>
          {!editingNote && <Btn variant="ghost" size="sm" icon={store.note ? "✏️" : "+"} onClick={() => { setNoteDraft(store.note || ""); setEditingNote(true); }}>{store.note ? "Ubah" : "Tambah"}</Btn>}
        </div>
        {editingNote ? (
          <div>
            <textarea rows={3} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="mis. Tagih pembayaran bulan lalu · bawa stok extra Kriuk · pemilik minta dikabari sebelum datang" style={{ width:"100%", resize:"vertical" }} />
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <Btn variant="ghost" size="sm" onClick={() => setEditingNote(false)}>Batal</Btn>
              <Btn size="sm" icon="✓" onClick={saveNote}>Simpan</Btn>
            </div>
          </div>
        ) : store.note ? (
          <p style={{ fontSize:13.5, color:"var(--ink-2)", whiteSpace:"pre-wrap", lineHeight:1.55, fontWeight:500, background:"var(--amber-soft)", border:"1.5px solid var(--line)", borderRadius:10, padding:"10px 12px" }}>{store.note}</p>
        ) : (
          <p style={{ fontSize:13, color:"var(--muted)", fontWeight:500 }}>Belum ada catatan. Tambahkan pengingat yang akan muncul di 🔔 saat mendekati hari kunjungan.</p>
        )}
        {nextVisit != null && (
          <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, fontSize:12.5, fontWeight:700, color: nextVisit <= 2 ? "var(--brand-deep)" : "var(--muted)", background: nextVisit <= 2 ? "var(--brand-soft)" : "var(--bg)", border:"1.5px solid var(--line)", borderRadius:9, padding:"8px 11px" }}>
            🔔 Kunjungan {route?.name}: {whenLabel(nextVisit)}{nextVisit <= 2 ? " — pengingat aktif" : ""}
          </div>
        )}
      </Card>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <p style={{ fontWeight:800, fontSize:15 }}>🗺️ Lokasi & Peta</p>
          {hasCoords(store) && <Btn size="sm" variant="ghost" icon="✏️" onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }}>Ubah Lokasi</Btn>}
        </div>
        {hasCoords(store) ? (
          <>
            <div style={{ borderRadius:13, overflow:"hidden", border:"1.5px solid var(--line)", marginBottom:12, lineHeight:0 }}>
              <iframe title="Peta lokasi toko" src={mapsEmbedUrl(store.lat, store.lng)} width="100%" height="220" style={{ border:0, display:"block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:140 }}><Btn full icon="🧭" onClick={() => window.open(mapsDirUrl(store), "_blank")}>Rute ke Sini</Btn></div>
              <div style={{ flex:1, minWidth:140 }}><Btn full variant="outline" icon="📍" onClick={() => window.open(mapsSearchUrl(store), "_blank")}>Buka di Google Maps</Btn></div>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"18px 14px", background:"var(--bg)", borderRadius:13, border:"1.5px dashed var(--line-strong)" }}>
            <p style={{ fontSize:30, marginBottom:8 }}>📍</p>
            <p style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Lokasi belum diatur</p>
            <p style={{ fontSize:13, color:"var(--muted)", fontWeight:500, marginBottom:14, lineHeight:1.5 }}>Setel titik lokasi toko agar bisa diurutkan berdasarkan jarak terdekat & dibuatkan rute.</p>
            <Btn icon="📍" onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng }); setShowEdit(true); }}>Atur Lokasi Toko</Btn>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <p style={{ fontWeight:800, fontSize:15 }}>📦 Stok di Toko ({sc.length} jenis)</p>
        </div>
        {sc.length === 0 ? (
          <EmptyState icon="📭" title="Belum ada titipan" sub="Ketuk 'Drop Barang' di atas untuk mulai menitipkan" />
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:10 }}>
            {sc.map(c => {
              const p = products.find(x => x.id === c.productId);
              const stockValue = p ? c.remaining * p.price : 0;
              return (
                <div key={c.id} style={{ background:"var(--bg)", borderRadius:13, padding:"14px", border:"1.5px solid var(--line)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:8 }}>
                    <p style={{ fontWeight:800, fontSize:14.5, flex:1 }}>{p?.name}</p>
                    <Tag color="var(--brand)">{p ? fmt(p.price) : "-"}</Tag>
                  </div>
                  <div style={{ background:"var(--surface)", borderRadius:11, padding:"14px 12px", textAlign:"center", border:"1.5px solid var(--line)", marginBottom:10 }}>
                    <p className="tnum" style={{ fontSize:32, fontWeight:800, color:"var(--brand)", lineHeight:1 }}>{c.remaining}</p>
                    <p style={{ fontSize:11, color:"var(--muted)", fontWeight:700, marginTop:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>bks di toko</p>
                  </div>
                  <div className="tnum" style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", fontWeight:500, marginBottom:10 }}>
                    <span>Nilai: <b style={{color:"var(--ink)"}}>{fmt(stockValue)}</b></span>
                    <span>Drop: <b style={{color:"var(--ink)"}}>{fmtDate(c.date)}</b></span>
                  </div>
                  <Btn full size="sm" variant="ghost" icon="✏️" onClick={() => setEditStock({ id: c.id, name: p?.name || "Produk", qty: String(c.remaining) })}>Ubah Stok</Btn>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <p style={{ fontWeight:800, fontSize:15, marginBottom:14 }}>🧾 Riwayat Nota ({storeReceipts.length})</p>
        {storeReceipts.length === 0 ? (
          <EmptyState icon="📄" title="Belum ada nota" sub="Nota otomatis dibuat saat drop & tagih" />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {storeReceipts.map(r => { const m = notaMeta(r.type); return (
              <div key={r.id} style={{ background:"var(--bg)", borderRadius:13, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", border:"1.5px solid var(--line)" }}>
                <div style={{ width:42, height:42, borderRadius:11, background: m.soft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {m.icon}
                </div>
                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <Tag color={m.color}>{m.label}</Tag>
                    <span style={{ fontSize:11.5, color:"var(--muted)", fontWeight:700 }}>{r.notaNo}</span>
                  </div>
                  <p style={{ fontSize:12.5, color:"var(--muted)", marginTop:3, fontWeight:500 }}>{fmtDate(r.date)} · {(r.items||[]).length} item · <b style={{color:m.color}}>{fmt(r.total)}</b></p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => setPreview(r)}>👁</Btn>
                  <Btn size="sm" variant="primary" onClick={() => printNota(r, COMPANY)}>🖨️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelReceipt(r)}>🗑</Btn>
                </div>
              </div>
            ); })}
          </div>
        )}
      </Card>

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
                  {dropItems.length > 1 && <Btn size="sm" variant="danger" onClick={() => removeDropItem(i)}>🗑</Btn>}
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
        <div style={{ background:"var(--green-soft)", border:"1.5px solid #BCE6D2", borderRadius:12, padding:"12px 15px", marginBottom:16, fontSize:13, color:"var(--ink-2)", lineHeight:1.55, fontWeight:500 }}>
          💵 Untuk toko yang <b>beli putus / bayar tunai</b> (bukan titip). Penjualan langsung tercatat sebagai pemasukan & dibuatkan nota. <b>Tidak memengaruhi stok titipan.</b>
        </div>
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
                  {cashItems.length > 1 && <Btn size="sm" variant="danger" onClick={() => removeCashItem(i)}>🗑</Btn>}
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
        <div style={{ background:"var(--brand-soft)", border:"1.5px solid var(--brand-tint)", borderRadius:12, padding:"13px 15px", marginBottom:18, fontSize:13.5, color:"var(--ink-2)", lineHeight:1.6, fontWeight:500 }}>
          <p style={{ fontWeight:800, marginBottom:4, color:"var(--brand-deep)" }}>📋 Cara Pakai</p>
          <p>1. Hitung <b>sisa fisik</b> tiap produk di toko, isi di kolom <b>SISA</b>.</p>
          <p>2. Sistem hitung otomatis yang <b>laku</b> = tagihan pemilik toko.</p>
        </div>
        {visitItems.map((item,i) => {
          const p = products.find(x=>x.id===item.productId);
          return (
            <div key={item.id} style={{ background:"var(--bg)", borderRadius:14, padding:16, marginBottom:14, border:"1.5px solid var(--line)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:6 }}>
                <p style={{ fontWeight:800, fontSize:16 }}>{p?.name}</p>
                <Tag color="var(--muted)">Stok awal: {item.remaining} bks</Tag>
              </div>
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:800, color:"var(--brand-deep)", textTransform:"uppercase", marginBottom:6 }}>📍 Sisa Fisik di Toko</p>
                <input type="number" inputMode="numeric" value={item.sisaNow} min={0} max={item.remaining} onChange={e => setSisa(i, e.target.value)}
                  className="tnum" style={{ textAlign:"center", fontSize:30, fontWeight:800, color:"var(--brand-deep)", padding:"14px", background:"var(--surface)", border:"2px solid var(--brand)" }} />
              </div>
              <div style={{ background:"var(--green-soft)", border:"1.5px solid #BCE6D2", borderRadius:11, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <div>
                    <p style={{ fontSize:11.5, fontWeight:800, color:"var(--green)", textTransform:"uppercase" }}>💚 Terjual (Otomatis)</p>
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
            <p style={{ fontSize:13.5, opacity:0.92, fontWeight:600 }}>💰 Setoran Pemilik Toko</p>
            <p className="tnum" style={{ fontSize:26, fontWeight:800 }}>{fmt(totalTagihanVisit)}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowVisit(false)}>Batal</Btn>
          <Btn full onClick={confirmVisit}>✓ Konfirmasi & Buat Nota</Btn>
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
          <div style={{ background:"var(--red-soft)", border:"1.5px solid #F2C7C3", borderRadius:11, padding:"10px 14px", marginBottom:16, fontSize:12.5, color:"var(--red)", fontWeight:600, textAlign:"center" }}>
            ⚠️ Jumlah 0 — produk ini akan dihapus dari toko.
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
        <span style={{ fontSize: 22 }}>🗑</span><span style={{ fontSize: 12 }}>Hapus</span>
      </div>
      <div ref={cardRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onClick={handleCardClick}
        style={{ transform: `translateX(${offsetX}px)`, transition: touchStartX.current == null ? "transform 0.25s ease" : "none",
          background: "var(--surface)", borderRadius: "var(--r)", border: "1.5px solid var(--line)", boxShadow: "var(--shadow-sm)",
          padding: 18, cursor: "pointer", touchAction: "pan-y" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:48, height:48, borderRadius:13, background:(route?.color||"#E07B1A")+"1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, border:`1.5px solid ${(route?.color||"#E07B1A")}28` }}>🏪</div>
          <div style={{ minWidth:0, flex:1 }}>
            <p style={{ fontWeight:800, fontSize:16, lineHeight:1.2 }}>{store.name}</p>
            <p style={{ fontSize:13, color:"var(--muted)", marginTop:2, fontWeight:500 }}>{store.address}</p>
          </div>
          {hasCoords(store) && (
            <a href={mapsDirUrl(store, userLoc)} target="_blank" rel="noreferrer" title="Rute di Google Maps"
              onClick={e => e.stopPropagation()}
              style={{ width:38, height:38, borderRadius:11, flexShrink:0, background:"var(--blue-soft)", color:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, textDecoration:"none", border:"1.5px solid #C9D9F6" }}>🧭</a>
          )}
          <span style={{ color:"var(--brand)", fontSize:20, opacity:0.6 }}>→</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: sc.length > 0 ? 12 : 0 }}>
          {visitedToday && <Tag color="var(--green)" solid>✓ Dikunjungi</Tag>}
          {dist != null && <Tag color="var(--blue)" solid>📍 {fmtDist(dist)}</Tag>}
          {route && <Tag color={route.color}>{route.name}</Tag>}
          {totalRem > 0 && <Tag color="var(--brand)">{totalRem} bks</Tag>}
          {totalOwed > 0 && <Tag color="var(--amber)">💰 {fmt(totalOwed)}</Tag>}
          {sc.length === 0 && <Tag color="var(--muted)">Kosong</Tag>}
        </div>
        {sc.length > 0 && (
          <div style={{ background:"var(--bg)", borderRadius:10, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, border:"1px solid var(--line)" }}>
            <span style={{ fontSize:12.5, color:"var(--muted)", fontWeight:600 }}>{sc.length} produk dititipkan</span>
            <span className="tnum" style={{ fontSize:12.5, fontWeight:800, color:"var(--brand-deep)" }}>📦 {fmt(stockValue)}</span>
          </div>
        )}
        {onQuickVisit && (
          <button onClick={(e) => { e.stopPropagation(); onQuickVisit(); }}
            style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 11, border: `1.5px solid ${visitedToday ? "var(--green)" : "var(--brand)"}`, background: visitedToday ? "var(--green-soft)" : "var(--brand-soft)", color: visitedToday ? "var(--green)" : "var(--brand-deep)", fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "var(--font)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {visitedToday ? "🔁 Kunjungi Lagi" : "🏍️ Kunjungi & Catat"}
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
        newTxs.push({ id: uid(), type: "income", category: "Penjualan", amount: q * prod.price, date: today, note: `${store.name} - ${prod.name} ${q}bks` });
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
        <p style={{ fontSize: 18, fontWeight: 800 }}>🏍️ Kunjungi: {store.name}</p>
        <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, marginBottom: store.note ? 10 : 14 }}>Catat berapa yang laku, lalu tandai sudah dikunjungi.</p>
        {store.note && <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--line)", borderRadius: 10, padding: "9px 12px", marginBottom: 14, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>📝 {store.note}</div>}

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
              <Btn full variant="success" icon="✓" onClick={justVisited}>Tandai Dikunjungi</Btn>
            </>
          ) : (
            <>
              <Btn full variant="ghost" onClick={justVisited}>Dikunjungi saja</Btn>
              <Btn full variant="success" icon="✓" onClick={save}>Catat & Selesai</Btn>
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
    confirm({ title: "Hapus Toko?", message: `Toko "${s.name}" akan dihapus permanen.${hasConsignments ? " ⚠️ Toko ini masih punya titipan aktif!" : ""} Riwayat nota tetap tersimpan.`, confirmText: "Ya, Hapus Toko", onConfirm: () => setData(d => ({...d, stores: d.stores.filter(x => x.id !== s.id)})) });
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
          <Btn variant="ghost" size="sm" icon="🗺️" onClick={() => setShowRoutes(true)}>Kelola Rute</Btn>
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
          ⚙️ Kelola
        </button>
      </div>

      <div style={{ position:"relative", marginBottom:12 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, opacity:0.55, pointerEvents:"none" }}>🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama toko atau alamat..."
          style={{ paddingLeft:42, paddingRight: query ? 42 : 14 }} />
        {query && (
          <button onClick={() => setQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:8, border:"none", background:"var(--bg-2)", color:"var(--muted)", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        )}
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Urutkan:</span>
        <Btn size="sm" variant={sortBy==="nearest"?"primary":"ghost"} icon="📍" onClick={pickNearest}>Terdekat (GPS)</Btn>
        <select value={sortBy} onChange={e => { const v = e.target.value; if (v === "nearest") pickNearest(); else setSortBy(v); }}
          style={{ width:"auto", minWidth:170, paddingTop:9, paddingBottom:9, fontSize:13.5 }}>
          <option value="default">Urutan Asli</option>
          <option value="newest">Terbaru → Terlama</option>
          <option value="oldest">Terlama → Terbaru</option>
          <option value="nearest">📍 Terdekat (GPS)</option>
          <option value="value-desc">Nilai Barang: Tertinggi</option>
          <option value="value-asc">Nilai Barang: Terendah</option>
          <option value="has-stock">Hanya yang Ada Stok</option>
        </select>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Kunjungan hari ini:</span>
        {[{id:"all",label:`Semua (${scoped.length})`},{id:"pending",label:`🕒 Belum (${pendingCount})`},{id:"done",label:`✓ Sudah (${doneCount})`}].map(f => {
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
          {locStatus === "loading" && <span style={{ fontSize:13, fontWeight:700, color:"var(--brand-deep)" }}>⏳ Mendeteksi lokasi Anda…</span>}
          {locStatus === "ok" && <>
            <span style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>📍 Lokasi terdeteksi — diurutkan dari yang terdekat</span>
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
          {locStatus === "ok" && noCoordCount > 0 && <span style={{ fontSize:12, color:"var(--ink-2)", fontWeight:500, width:"100%" }}>💡 {noCoordCount} toko belum punya titik lokasi (ditaruh di bawah). Buka toko → Edit Info untuk menyetel lokasinya.</span>}
        </div>
      )}

      {shown.length > 0 && (
        <div style={{ background:"var(--bg-2)", border:"1px dashed var(--line-strong)", borderRadius:12, padding:"9px 14px", marginBottom:12, fontSize:12.5, color:"var(--ink-2)", display:"flex", alignItems:"center", gap:8, fontWeight:500 }}>
          <span style={{ fontSize:14 }}>💡</span>
          <span>Ketuk toko untuk masuk. <b>Geser kiri</b> untuk hapus toko.</span>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {shown.map(({ store: s, route, sc, stockValue, totalOwed, totalRem, dist }) => (
            <SwipeableStoreCard key={s.id} store={s} route={route} sc={sc} products={products} totalRem={totalRem} totalOwed={totalOwed} stockValue={stockValue} dist={dist} userLoc={userLoc}
              onTap={() => setSelectedStoreId(s.id)} onDelete={() => askDelStore(s)} onQuickVisit={() => setQuickVisitStore(s)} visitedToday={isVisitedToday(s)} />
        ))}
        {shown.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon={visitFilter==="done"?"✓":visitFilter==="pending"?"🕒":"🔍"} title={visitFilter==="done" ? "Belum ada toko yang dikunjungi" : visitFilter==="pending" ? "Semua toko sudah dikunjungi 🎉" : (q || sortBy === "has-stock") ? "Tidak ada toko yang cocok" : "Belum ada toko"} sub={visitFilter==="done" ? "Toko yang sudah dikunjungi hari ini akan muncul di sini" : visitFilter==="pending" ? "Mantap! Semua toko di daftar ini sudah dikunjungi hari ini" : q ? `Tidak ada toko dengan nama/alamat "${query}"` : sortBy === "has-stock" ? "Tidak ada toko yang punya stok saat ini" : "Tambah toko baru ke rute ini"} /></Card>}
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
          {routes.length === 0 && <EmptyState icon="🗺️" title="Belum ada rute" sub="Buat rute pertama untuk mengelompokkan toko" />}
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
                    {(r.days && r.days.length) ? `📅 ${r.days.join(", ")}` : "📅 Belum ada jadwal hari"}
                  </p>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Btn size="sm" variant="ghost" icon="✏️" onClick={() => openEditRoute(r)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelRoute(r)}>🗑</Btn>
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
        <Card><EmptyState icon="📭" title="Belum ada nota" sub="Nota akan otomatis dibuat saat drop barang & kunjungan tagih" /></Card>
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
              <p style={{ fontSize:12.5,color:"var(--muted)",fontWeight:700 }}>{n.pinned && "📌 "}{fmtDate(n.date)}</p>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={() => togglePin(n.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:15,opacity:n.pinned?1:0.35 }}>📌</button>
                <button onClick={() => { setForm({content:n.content,date:n.date,pinned:n.pinned}); setEditId(n.id); setShowAdd(true); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>✏️</button>
                <button onClick={() => askDel(n)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>🗑</button>
              </div>
            </div>
            <p style={{ fontSize:14.5,lineHeight:1.65,whiteSpace:"pre-wrap", fontWeight:500 }}>{n.content}</p>
          </Card>
        ))}
        {notes.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon="📓" title="Belum ada catatan" sub="Tulis catatan pertama Anda" /></Card>}
      </div>

      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title={editId ? "Edit Catatan" : "Catatan Baru"}>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></FG>
        <FG label="Isi Catatan"><textarea rows={5} placeholder="Tulis catatanmu..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} style={{resize:"vertical"}} /></FG>
        <label style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer", padding:"12px 14px", background:"var(--bg-2)", borderRadius:11, border:"1.5px solid var(--line)" }}>
          <input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))} style={{width:"auto"}} />
          <span style={{fontSize:13.5,color:"var(--ink-2)", fontWeight:600}}>📌 Sematkan catatan ini di Beranda</span>
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
                <div style={{ width:50,height:50,borderRadius:14,background:"var(--brand-soft)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:25, border:"1.5px solid var(--brand-tint)" }}>🍟</div>
                <div style={{ display:"flex",gap:6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setForm({name:p.name,price:p.price,costPrice:p.costPrice}); setEditId(p.id); setShowAdd(true); }}>✏️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDel(p)}>🗑</Btn>
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

  const buildPayload = () => JSON.stringify({ app: "SB FOOD - Snack Kriuk", schema: "kriuk_v6", exportedAt: new Date().toISOString(), data }, null, 2);

  const downloadBackup = () => {
    try {
      const blob = new Blob([buildPayload()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `sb-food-backup-${today}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMsg({ type: "ok", text: "Backup berhasil diunduh. Simpan file di tempat aman (Drive, email, dll)." });
    } catch {
      setMsg({ type: "error", text: "Unduhan diblokir di lingkungan ini. Pakai 'Salin Teks Backup' sebagai gantinya." });
    }
  };

  const copyBackup = async () => {
    const text = buildPayload();
    try {
      await navigator.clipboard.writeText(text);
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
      confirmText: "Ya, Pulihkan", danger: true, icon: "♻️",
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
          <span>{msg.type === "ok" ? "✓ " : msg.type === "error" ? "⚠️ " : "ℹ️ "}{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: "none", border: "none", color: msgColor.fg, cursor: "pointer", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>✕</button>
        </div>
      )}

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💾</div>
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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full icon="⬇️" onClick={downloadBackup}>Unduh File Backup</Btn></div>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full variant="outline" icon="📋" onClick={copyBackup}>Salin Teks Backup</Btn></div>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>♻️</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16 }}>Restore Data</p>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Pulihkan dari file backup</p>
          </div>
        </div>
        <div style={{ background: "var(--red-soft)", border: "1.5px solid #F2C7C3", borderRadius: 11, padding: "10px 14px", marginBottom: 14, fontSize: 12.5, color: "var(--red)", fontWeight: 600, lineHeight: 1.5 }}>
          ⚠️ Memulihkan akan <b>mengganti seluruh data saat ini</b>. Sebaiknya unduh backup dulu.
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full icon="📂" onClick={() => fileRef.current && fileRef.current.click()}>Pilih File Backup</Btn></div>
          <div style={{ flex: 1, minWidth: 150 }}><Btn full variant="outline" icon="📝" onClick={() => { setPasteOpen(o => !o); setPasteText(""); }}>Tempel Teks Backup</Btn></div>
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
        💡 Data tersimpan otomatis di perangkat ini. Backup berguna saat ganti HP/browser, atau sebagai cadangan berkala.
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
    const keluarBulan = monthTx.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);
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
      case "add_store": return `🏪 Tambah toko "${a.name}"${a.routeName ? ` (rute ${a.routeName})` : ""}`;
      case "add_product": return `🍟 Tambah produk "${a.name}" — jual ${fmt(+a.price || 0)}${a.costPrice ? `, HPP ${fmt(+a.costPrice)}` : ""}`;
      case "add_route": return `🛣️ Tambah rute "${a.name}"${Array.isArray(a.days) && a.days.length ? ` (${a.days.join(", ")})` : ""}`;
      case "cash_sale": return `💵 Jual tunai di ${a.storeName}: ${items}`;
      case "drop": return `📦 Drop titipan di ${a.storeName}: ${items}`;
      case "collect": return `🤝 Tagih di ${a.storeName} (terjual): ${items}`;
      case "set_stock": return `✏️ Set stok ${a.product} di ${a.storeName} = ${a.qty} bks`;
      case "add_income": return `🟢 Catat pemasukan ${fmt(+a.amount || 0)}${a.note ? ` — ${a.note}` : ""}`;
      case "add_expense": return `🔴 Catat pengeluaran ${fmt(+a.amount || 0)}${a.note ? ` — ${a.note}` : ""}`;
      case "add_note": return `📝 Catatan: "${String(a.content || "").slice(0, 70)}"`;
      case "update_store": return `✏️ Ubah toko "${a.name || a.storeName}"${a.newName ? ` → "${a.newName}"` : ""}${a.routeName ? ` (rute ${a.routeName})` : ""}${a.note != null ? ` (catatan: "${String(a.note).slice(0,40)}")` : ""}`;
      case "update_product": return `✏️ Ubah produk "${a.name}"${a.newName ? ` → "${a.newName}"` : ""}${a.price != null ? ` — jual ${fmt(+a.price)}` : ""}`;
      case "delete_store": return `🗑 Hapus toko "${a.name || a.storeName}"${a.onlyEmpty ? " (yang kosong)" : ""}`;
      case "delete_product": return `🗑 Hapus produk "${a.name}"`;
      case "delete_transactions": { const b = []; if (a.all) b.push("SEMUA"); if (a.month) b.push(`bln ${a.month}`); if (a.date) b.push(a.date); if (a.type) b.push(a.type); if (a.category) b.push(`kat. ${a.category}`); if (a.note) b.push(`"${a.note}"`); return `🗑 Hapus transaksi keuangan${b.length ? ` (${b.join(", ")})` : ""}`; }
      case "delete_note": return `🗑 Hapus catatan${a.all ? " SEMUA" : a.content ? ` "${String(a.content).slice(0, 40)}"` : a.date ? ` (${a.date})` : ""}`;
      case "delete_receipts": { const b = []; if (a.all) b.push("SEMUA"); if (a.month) b.push(`bln ${a.month}`); if (a.type) b.push(a.type); if (a.storeName) b.push(a.storeName); return `🗑 Hapus nota${b.length ? ` (${b.join(", ")})` : ""}`; }
      case "remember": return `🧠 Ingat: "${String(a.fact || a.content || "").slice(0, 80)}"`;
      case "forget": return a.all ? "🧠 Lupakan semua memori" : `🧠 Lupakan: "${String(a.fact || a.content || "").slice(0, 60)}"`;
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
            if (!a.name || a.price == null) { results.push("⚠️ Produk gagal: nama/harga kurang."); break; }
            const ex = nd.products.find(p => norm(p.name) === norm(a.name));
            if (ex) {
              nd.products = nd.products.map(p => p.id === ex.id ? { ...p, price: +a.price, costPrice: a.costPrice != null ? +a.costPrice : p.costPrice } : p);
              results.push(`• Produk "${a.name}" sudah ada — harga diperbarui (${fmt(+a.price)}).`);
            } else {
              nd.products = [...nd.products, { id: uid(), name: a.name, price: +a.price, costPrice: +(a.costPrice || 0) }];
              results.push(`✓ Produk "${a.name}" ditambahkan.`);
            }
            break;
          }
          case "add_route": {
            if (!a.name) { results.push("⚠️ Rute gagal: nama kurang."); break; }
            if (findRoute(a.name)) { results.push(`• Rute "${a.name}" sudah ada (dilewati).`); break; }
            nd.routes = [...nd.routes, { id: uid(), name: a.name, color: a.color || palette[nd.routes.length % palette.length], days: Array.isArray(a.days) ? a.days : [] }];
            results.push(`✓ Rute "${a.name}" ditambahkan.`); break;
          }
          case "add_store": {
            if (!a.name) { results.push("⚠️ Toko gagal: nama kurang."); break; }
            const rt = a.routeName ? ensureRoute(a.routeName) : null;
            const existing = findStoreExact(a.name);
            if (existing) {
              nd.stores = nd.stores.map(s => s.id === existing.id ? { ...s, routeId: rt ? rt.id : s.routeId, address: a.address || s.address, contact: a.contact || s.contact, note: a.note != null ? a.note : s.note } : s);
              results.push(`• Toko "${a.name}" sudah ada — diperbarui${rt ? ` (rute ${rt.name})` : ""} (tidak diduplikat).`);
            } else {
              nd.stores = [...nd.stores, { id: uid(), createdAt: Date.now(), name: a.name, address: a.address || "", contact: a.contact || "", routeId: rt ? rt.id : "", note: a.note || "" }];
              results.push(`✓ Toko "${a.name}" ditambahkan${rt ? ` (rute ${rt.name})` : ""}.`);
            }
            break;
          }
          case "add_income":
          case "add_expense": {
            if (a.amount == null) { results.push("⚠️ Transaksi gagal: jumlah kurang."); break; }
            const t = { id: uid(), type: a.type === "add_income" ? "income" : "expense", category: a.category || "Lain-lain", amount: +a.amount, date: a.date || today, note: a.note || "" };
            nd.transactions = [t, ...nd.transactions];
            results.push(`✓ ${t.type === "income" ? "Pemasukan" : "Pengeluaran"} ${fmt(t.amount)} dicatat.`); break;
          }
          case "add_note": {
            if (!a.content) { results.push("⚠️ Catatan gagal: isi kurang."); break; }
            nd.notes = [{ id: uid(), date: a.date || today, content: a.content, pinned: !!a.pinned }, ...nd.notes];
            results.push("✓ Catatan ditambahkan."); break;
          }
          case "cash_sale":
          case "drop": {
            const store = findStore(a.storeName);
            if (!store) { results.push(`⚠️ ${a.type}: toko "${a.storeName}" tidak ditemukan.`); break; }
            const recItems = []; let total = 0;
            for (const it of (a.items || [])) {
              const p = findProduct(it.product); const qty = +it.qty;
              if (!p || !(qty > 0)) { results.push(`⚠️ Produk "${it.product}" tidak ditemukan / qty salah.`); continue; }
              recItems.push({ productId: p.id, name: p.name, qty, price: p.price }); total += qty * p.price;
              if (a.type === "drop") {
                const ex = nd.consignments.find(c => c.storeId === store.id && c.productId === p.id && c.status === "active");
                if (ex) nd.consignments = nd.consignments.map(c => c.id === ex.id ? { ...c, deposited: c.deposited + qty, remaining: c.remaining + qty } : c);
                else nd.consignments = [...nd.consignments, { id: uid(), storeId: store.id, productId: p.id, deposited: qty, remaining: qty, date: a.date || today, status: "active" }];
              }
            }
            if (!recItems.length) { results.push(`⚠️ ${a.type}: tidak ada item valid.`); break; }
            if (a.type === "cash_sale") recItems.forEach(ri => { nd.transactions = [{ id: uid(), type: "income", category: "Penjualan", amount: ri.qty * ri.price, date: a.date || today, note: `${store.name} - ${ri.name} ${ri.qty}bks (tunai)` }, ...nd.transactions]; });
            const ntype = a.type === "drop" ? "drop" : "cash";
            const notaNo = genNotaNo(ntype, nd.receiptCounter);
            nd.receipts = [{ id: uid(), notaNo, type: ntype, date: a.date || today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: recItems, total }, ...nd.receipts];
            nd.receiptCounter += 1;
            results.push(`✓ ${a.type === "drop" ? "Drop" : "Jual tunai"} di ${store.name}: ${recItems.map(r => `${r.qty} ${r.name}`).join(", ")} = ${fmt(total)} (nota ${notaNo}).`); break;
          }
          case "set_stock": {
            const store = findStore(a.storeName); const p = findProduct(a.product);
            if (!store || !p) { results.push("⚠️ Set stok: toko/produk tidak ditemukan."); break; }
            const q = Math.max(0, +a.qty || 0);
            const ex = nd.consignments.find(c => c.storeId === store.id && c.productId === p.id && c.status === "active");
            if (ex) nd.consignments = nd.consignments.map(c => c.id === ex.id ? { ...c, deposited: q, remaining: q, status: q <= 0 ? "closed" : "active" } : c);
            else if (q > 0) nd.consignments = [...nd.consignments, { id: uid(), storeId: store.id, productId: p.id, deposited: q, remaining: q, date: today, status: "active" }];
            results.push(`✓ Stok ${p.name} di ${store.name} di-set ${q} bks.`); break;
          }
          case "collect": {
            const store = findStore(a.storeName);
            if (!store) { results.push(`⚠️ Tagih: toko "${a.storeName}" tidak ditemukan.`); break; }
            const recItems = []; let total = 0;
            for (const it of (a.items || [])) {
              const p = findProduct(it.product); const sold = +(it.soldQty ?? it.qty);
              if (!p || !(sold > 0)) { results.push(`⚠️ Tagih: produk "${it.product}" salah.`); continue; }
              const c = nd.consignments.find(x => x.storeId === store.id && x.productId === p.id && x.status === "active");
              if (!c) { results.push(`⚠️ Tagih: ${p.name} belum ada titipan di ${store.name}.`); continue; }
              const s = Math.min(sold, c.remaining); const newRem = c.remaining - s;
              nd.consignments = nd.consignments.map(x => x.id === c.id ? { ...x, deposited: newRem, remaining: newRem, status: newRem <= 0 ? "closed" : "active" } : x);
              nd.transactions = [{ id: uid(), type: "income", category: "Penjualan", amount: s * p.price, date: a.date || today, note: `${store.name} - ${p.name} ${s}bks` }, ...nd.transactions];
              recItems.push({ productId: p.id, name: p.name, qty: s, price: p.price }); total += s * p.price;
            }
            if (!recItems.length) { results.push("⚠️ Tagih: tidak ada item valid."); break; }
            const notaNo = genNotaNo("payment", nd.receiptCounter);
            nd.receipts = [{ id: uid(), notaNo, type: "payment", date: a.date || today, storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact, items: recItems, total }, ...nd.receipts];
            nd.receiptCounter += 1;
            results.push(`✓ Tagih ${store.name}: ${recItems.map(r => `${r.qty} ${r.name}`).join(", ")} = ${fmt(total)} (nota ${notaNo}).`); break;
          }
          case "update_store": {
            const target = findStoreExact(a.name || a.storeName) || findStore(a.name || a.storeName);
            if (!target) { results.push(`⚠️ Update toko: "${a.name || a.storeName}" tidak ditemukan.`); break; }
            const rt = a.routeName ? ensureRoute(a.routeName) : null;
            nd.stores = nd.stores.map(s => s.id === target.id ? { ...s, name: a.newName || s.name, routeId: rt ? rt.id : s.routeId, address: a.address != null ? a.address : s.address, contact: a.contact != null ? a.contact : s.contact, note: a.note != null ? a.note : s.note } : s);
            results.push(`✓ Toko "${target.name}" diperbarui${a.newName ? ` → "${a.newName}"` : ""}${rt ? ` (rute ${rt.name})` : ""}.`); break;
          }
          case "update_product": {
            const target = nd.products.find(p => norm(p.name) === norm(a.name)) || nd.products.find(p => norm(a.name) && norm(p.name).includes(norm(a.name)));
            if (!target) { results.push(`⚠️ Update produk: "${a.name}" tidak ditemukan.`); break; }
            nd.products = nd.products.map(p => p.id === target.id ? { ...p, name: a.newName || p.name, price: a.price != null ? +a.price : p.price, costPrice: a.costPrice != null ? +a.costPrice : p.costPrice } : p);
            results.push(`✓ Produk "${target.name}" diperbarui.`); break;
          }
          case "delete_store": {
            const nm = norm(a.name || a.storeName);
            if (!nm) { results.push("⚠️ Hapus toko: nama kurang."); break; }
            const matches = nd.stores.filter(s => norm(s.name) === nm);
            const hasStock = (s) => nd.consignments.some(c => c.storeId === s.id && c.status === "active" && c.remaining > 0);
            const toDelete = a.onlyEmpty ? matches.filter(s => !hasStock(s)) : matches;
            if (!toDelete.length) { results.push(`⚠️ Hapus toko: tidak ada "${a.name || a.storeName}"${a.onlyEmpty ? " yang kosong" : ""} untuk dihapus.`); break; }
            const ids = new Set(toDelete.map(s => s.id));
            nd.stores = nd.stores.filter(s => !ids.has(s.id));
            nd.consignments = nd.consignments.filter(c => !ids.has(c.storeId));
            results.push(`✓ ${toDelete.length} toko "${a.name || a.storeName}"${a.onlyEmpty ? " (kosong)" : ""} dihapus.`); break;
          }
          case "delete_product": {
            const target = nd.products.find(p => norm(p.name) === norm(a.name));
            if (!target) { results.push(`⚠️ Hapus produk: "${a.name}" tidak ditemukan.`); break; }
            nd.products = nd.products.filter(p => p.id !== target.id);
            results.push(`✓ Produk "${target.name}" dihapus.`); break;
          }
          case "delete_transactions": {
            const mon = a.month ? resolveMonth(a.month) : null;
            if (a.month && !mon) { results.push(`⚠️ Hapus transaksi: bulan "${a.month}" tidak dikenali (pakai YYYY-MM).`); break; }
            const typ = a.type ? normTxType(a.type) : null;
            const catQ = a.category ? norm(a.category) : null;
            const noteQ = a.note ? norm(a.note) : null;
            const dateQ = a.date || null;
            const hasFilter = !!(mon || dateQ || typ || catQ || noteQ);
            if (!a.all && !hasFilter) { results.push("⚠️ Hapus transaksi: sebutkan kriteria (mis. bulan) atau set all:true."); break; }
            const match = (t) => {
              if (mon && !String(t.date).startsWith(mon)) return false;
              if (dateQ && t.date !== dateQ) return false;
              if (typ && t.type !== typ) return false;
              if (catQ && !norm(t.category).includes(catQ)) return false;
              if (noteQ && !norm(t.note).includes(noteQ)) return false;
              return true;
            };
            const toDel = nd.transactions.filter(match);
            if (!toDel.length) { results.push("⚠️ Hapus transaksi: tidak ada yang cocok."); break; }
            const ids = new Set(toDel.map(t => t.id));
            nd.transactions = nd.transactions.filter(t => !ids.has(t.id));
            const masuk = toDel.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
            const keluar = toDel.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
            results.push(`✓ ${toDel.length} transaksi dihapus${mon ? ` (${mon})` : ""}${typ ? ` · ${typ === "income" ? "pemasukan" : "pengeluaran"}` : ""}. Total masuk ${fmt(masuk)}, keluar ${fmt(keluar)}.`);
            break;
          }
          case "delete_note": {
            if (a.all) { const n = nd.notes.length; nd.notes = []; results.push(`✓ ${n} catatan dihapus.`); break; }
            const q = norm(a.content || a.text || a.fact || "");
            const dateQ = a.date || null;
            if (!q && !dateQ) { results.push("⚠️ Hapus catatan: sebutkan isi/tanggal atau set all:true."); break; }
            const before = nd.notes.length;
            nd.notes = nd.notes.filter(nt => !((dateQ ? nt.date === dateQ : true) && (q ? norm(nt.content).includes(q) : true)));
            const removed = before - nd.notes.length;
            results.push(removed ? `✓ ${removed} catatan dihapus.` : "⚠️ Hapus catatan: tidak ada yang cocok.");
            break;
          }
          case "delete_receipts": {
            const mon = a.month ? resolveMonth(a.month) : null;
            if (a.month && !mon) { results.push(`⚠️ Hapus nota: bulan "${a.month}" tidak dikenali.`); break; }
            const typ = a.type || null; // drop / cash / payment
            const storeQ = a.storeName ? norm(a.storeName) : null;
            const hasFilter = !!(mon || typ || storeQ);
            if (!a.all && !hasFilter) { results.push("⚠️ Hapus nota: sebutkan kriteria atau set all:true."); break; }
            const match = (r) => {
              if (mon && !String(r.date).startsWith(mon)) return false;
              if (typ && r.type !== typ) return false;
              if (storeQ && !norm(r.storeName).includes(storeQ)) return false;
              return true;
            };
            const toDel = nd.receipts.filter(match);
            if (!toDel.length) { results.push("⚠️ Hapus nota: tidak ada yang cocok."); break; }
            const ids = new Set(toDel.map(r => r.id));
            nd.receipts = nd.receipts.filter(r => !ids.has(r.id));
            results.push(`✓ ${toDel.length} nota dihapus${mon ? ` (${mon})` : ""}.`);
            break;
          }
          case "remember": {
            const fact = String(a.fact || a.content || "").trim();
            if (!fact) { results.push("⚠️ Ingat: isi kosong."); break; }
            if (!memFacts.some(f => norm(f) === norm(fact))) { memFacts.push(fact); memChanged = true; results.push(`🧠 Diingat: "${fact}"`); }
            else results.push(`🧠 Sudah diingat: "${fact}"`);
            break;
          }
          case "forget": {
            const q = norm(a.fact || a.content || "");
            const before = memFacts.length;
            if (a.all) { memFacts = []; }
            else if (q) { memFacts = memFacts.filter(f => !norm(f).includes(q)); }
            if (memFacts.length !== before || a.all) { memChanged = true; results.push("🧠 Memori diperbarui (dilupakan)."); }
            else results.push("🧠 Tidak ada yang cocok untuk dilupakan.");
            break;
          }
          default: results.push(`⚠️ Aksi tidak dikenal: ${a.type}`);
        }
      } catch (err) { results.push(`⚠️ Gagal memproses aksi: ${String(err.message || err)}`); }
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
        if (!parsed.complete) prose += (prose ? "\n\n" : "") + "⚠️ Daftarnya panjang dan sepertinya terpotong — saya tampilkan yang berhasil terbaca di bawah. Jika ada yang kurang, kirim sisanya secara terpisah.";
      } else if (/```|"actions"/.test(reply || "")) {
        prose += (prose ? "\n\n" : "") + "⚠️ Daftarnya terlalu panjang sehingga balasan terpotong dan gagal dibaca. Coba kirim per 5–8 item agar muat.";
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
    appendToSession(sessionId, m => [...m, { role: "assistant", content: "✅ Selesai diterapkan:\n" + results.join("\n") }]);
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
          {sessions.length > 0 && <Btn variant="ghost" size="sm" icon="🕘" onClick={() => setShowHistory(v => !v)}>Riwayat</Btn>}
          <Btn variant="outline" size="sm" icon="＋" onClick={newChat}>Chat Baru</Btn>
        </div>} />

      {showHistory && (
        <>
          <div onClick={() => setShowHistory(false)} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(33,26,18,0.42)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "min(330px, 86vw)", zIndex: 1201, background: "var(--surface)", borderRight: "1.5px solid var(--line)", boxShadow: "2px 0 30px rgba(33,26,18,0.18)", display: "flex", flexDirection: "column", animation: "drawerIn .22s ease" }}>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1.5px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 15, fontWeight: 800 }}>🕘 Riwayat Chat</p>
              <button onClick={() => setShowHistory(false)} title="Tutup" style={{ width: 32, height: 32, borderRadius: 9, border: "1.5px solid var(--line)", background: "var(--bg)", cursor: "pointer", fontSize: 14, color: "var(--ink-2)" }}>✕</button>
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
                  <button onClick={() => deleteChat(s.id)} title="Hapus chat" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface)", color: "var(--red)", cursor: "pointer", fontSize: 13 }}>🗑</button>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1.5px solid var(--line)", padding: 12, maxHeight: "34%", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--muted)" }}>🧠 Memori AI ({(aiMem.facts || []).length})</p>
                {(aiMem.facts || []).length > 0 && <button onClick={() => setAiMem({ facts: [] })} style={{ fontSize: 11.5, fontWeight: 700, color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}>Lupakan semua</button>}
              </div>
              {(aiMem.facts || []).length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, lineHeight: 1.5 }}>AI menyimpan preferensi & koreksimu di sini agar makin sesuai. Contoh: ajari "k berarti ribuan" atau "produk default Kriuk".</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {aiMem.facts.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "var(--bg)", border: "1.5px solid var(--line)", borderRadius: 9, padding: "7px 10px" }}>
                      <span style={{ flex: 1, fontSize: 12.5, color: "var(--ink)", fontWeight: 500, lineHeight: 1.4 }}>{f}</span>
                      <button onClick={() => setAiMem({ facts: aiMem.facts.filter((_, j) => j !== i) })} title="Lupakan" style={{ flexShrink: 0, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12 }}>✕</button>
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
                    💬 {s}
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
              ⚠️ {err.msg}
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
                <Btn full variant="success" icon="✓" onClick={confirmActions}>Terapkan</Btn>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1.5px solid var(--line)", padding: 12, display: "flex", gap: 8, background: "var(--surface)" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Tulis perintah atau pertanyaan…" disabled={loading} style={{ flex: 1 }} />
          <Btn onClick={() => send()} disabled={loading || !input.trim()} icon="➤">Kirim</Btn>
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

  const navigate = (p) => {
    setPage(p);
    if (p !== "stores") setSelectedStoreId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    const props = { data, setData, setPage: navigate };
    switch (page) {
      case "dashboard": return <Dashboard {...props} />;
      case "finance": return <Finance {...props} />;
      case "stores": return <Stores {...props} selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId} />;
      case "receipts": return <Receipts {...props} />;
      case "notes": return <Notes {...props} />;
      case "products": return <Products {...props} />;
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
              <NotificationBell reminders={reminders} onOpenStore={(id) => { setSelectedStoreId(id); navigate("stores"); }} />
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
