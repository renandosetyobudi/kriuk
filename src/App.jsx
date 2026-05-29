import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";

// ─────────────────────────────────────────────
// THEME — "Golden Kriuk": warm, appetizing, professional
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #FAF7F1;
    --bg-2: #F3EEE4;
    --surface: #FFFFFF;
    --line: #EBE4D7;
    --line-strong: #DDD3C2;
    --ink: #211A12;
    --ink-2: #5A5043;
    --muted: #948A79;
    --brand: #E07B1A;
    --brand-deep: #B85F0E;
    --brand-soft: #FDF0DF;
    --brand-tint: #FBE6CC;
    --green: #138A5E;
    --green-soft: #E4F4EC;
    --red: #D6453F;
    --red-soft: #FBE9E7;
    --amber: #D89215;
    --amber-soft: #FBF1DA;
    --blue: #2563C9;
    --blue-soft: #E7EEFB;
    --violet: #7C4DD6;
    --font: 'Plus Jakarta Sans', sans-serif;
    --shadow-xs: 0 1px 2px rgba(58,40,18,0.04);
    --shadow-sm: 0 2px 6px rgba(58,40,18,0.05), 0 1px 2px rgba(58,40,18,0.04);
    --shadow: 0 8px 24px rgba(58,40,18,0.07), 0 2px 6px rgba(58,40,18,0.04);
    --shadow-lg: 0 24px 60px rgba(40,28,12,0.16), 0 8px 24px rgba(40,28,12,0.08);
    --r-lg: 20px;
    --r: 16px;
    --r-sm: 11px;
    --r-xs: 8px;
  }
  body { background: var(--bg); color: var(--ink); font-family: var(--font); min-height: 100vh; font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  html { overflow-x: hidden; }
  h1,h2,h3 { letter-spacing: -0.02em; }
  .tnum { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
  input, select, textarea {
    background: var(--surface); border: 1.5px solid var(--line-strong); color: var(--ink);
    border-radius: var(--r-sm); padding: 12px 14px; font-family: var(--font);
    font-size: 15px; font-weight: 500; outline: none; width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  input::placeholder, textarea::placeholder { color: #B8AE9C; font-weight: 400; }
  input:focus, select:focus, textarea:focus {
    border-color: var(--brand); box-shadow: 0 0 0 4px rgba(224,123,26,0.13);
  }
  button { cursor: pointer; font-family: var(--font); }
  ::-webkit-scrollbar { width: 7px; height: 7px; }
  ::-webkit-scrollbar-thumb { background: #D8CDBA; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #C5B89F; }
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
  const prefix = type === "drop" ? "TTP" : "BYR";
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
  const w = window.open("","_blank");
  const isDrop = receipt.type === "drop";
  const title = isDrop ? "NOTA PENITIPAN BARANG" : "NOTA PEMBAYARAN";
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

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} - ${receipt.notaNo}</title>
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
      ${isDrop
        ? `<strong>Sistem Titip Jual:</strong> Barang dititipkan untuk dijual. Pembayaran dilakukan saat kunjungan berikutnya berdasarkan jumlah yang terjual. Mohon barang dirawat dengan baik dan dijaga kebersihannya.`
        : `<strong>Pembayaran Lunas</strong> atas barang titip jual yang telah terjual. Terima kasih atas kerjasamanya.`}
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
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 600);
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
        boxShadow: hov && interactive ? "var(--shadow)" : "var(--shadow-sm)",
        padding: 20, transition: "all 0.2s cubic-bezier(.22,1,.36,1)",
        cursor: onClick ? "pointer" : "default",
        transform: hov && interactive ? "translateY(-2px)" : "none",
        ...style,
      }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon, full, disabled }) {
  const [hov, setHov] = useState(false);
  const v = {
    primary: { bg: hov ? "var(--brand-deep)" : "var(--brand)", color: "#fff", border: "transparent", shadow: hov ? "0 6px 18px rgba(224,123,26,0.32)" : "0 2px 8px rgba(224,123,26,0.22)" },
    outline: { bg: hov ? "var(--brand-soft)" : "var(--surface)", color: "var(--brand-deep)", border: "var(--brand-tint)", shadow: "none" },
    ghost: { bg: hov ? "var(--bg-2)" : "var(--surface)", color: "var(--ink-2)", border: "var(--line-strong)", shadow: "none" },
    dark: { bg: hov ? "#000" : "var(--ink)", color: "#fff", border: "transparent", shadow: "none" },
    danger: { bg: hov ? "#F7DAD7" : "var(--red-soft)", color: "var(--red)", border: "#F2C7C3", shadow: "none" },
  }[variant] || {};
  const pad = size === "sm" ? "8px 13px" : size === "lg" ? "13px 20px" : "11px 18px";
  const fs = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: pad, fontSize: fs, fontWeight: 700,
        borderRadius: "var(--r-sm)", border: `1.5px solid ${v.border}`, background: v.bg, color: v.color,
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
          background: "var(--surface)", borderRadius: 22, padding: 22,
          width: "100%", maxWidth: wide ? 660 : 480,
          boxShadow: "var(--shadow-lg)", margin: "0 auto",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)" }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, fontWeight: 500 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 11, border: "1.5px solid var(--line)", background: "var(--bg-2)", color: "var(--muted)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}
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
        boxShadow: hov && onClick ? "var(--shadow)" : "var(--shadow-sm)", padding: 18,
        cursor: onClick ? "pointer" : "default", transition: "all .2s cubic-bezier(.22,1,.36,1)",
        transform: hov && onClick ? "translateY(-3px)" : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.05 }} />
      <div style={{ width: 42, height: 42, borderRadius: 12, background: soft || color + "16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{icon}</div>
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
    <div style={{ display: "flex", gap: 3, background: "var(--surface)", borderRadius: 13, padding: 4, border: "1.5px solid var(--line)", flexWrap: "wrap", boxShadow: "var(--shadow-xs)" }}>
      {items.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ padding: "9px 18px", borderRadius: 9, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.18s", fontFamily: "var(--font)",
            background: active === t.id ? "var(--ink)" : "transparent", color: active === t.id ? "#fff" : "var(--ink-2)", letterSpacing: "-0.01em" }}>
          {t.icon && <span style={{ marginRight: 5 }}>{t.icon}</span>}{t.label}
        </button>
      ))}
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
  { id: "dashboard", label: "Beranda", icon: "🏠", desc: "Ringkasan bisnis" },
  { id: "stores", label: "Toko", icon: "🏪", desc: "Drop, tagih, cetak nota" },
  { id: "finance", label: "Keuangan", icon: "💰", desc: "Omset & pengeluaran" },
  { id: "receipts", label: "Nota", icon: "🧾", desc: "Riwayat & cetak ulang" },
  { id: "notes", label: "Catatan", icon: "📝", desc: "Memo & pengingat" },
  { id: "products", label: "Produk", icon: "🍟", desc: "Kelola produk" },
  { id: "settings", label: "Pengaturan", icon: "⚙️", desc: "Backup & restore data" },
];
const BOTTOM_TABS = ["dashboard", "stores", "finance", "receipts"]; // + "more"

// Desktop top nav
function TopNav({ page, setPage }) {
  return (
    <nav className="topnav" style={{ display: "flex", gap: 4, background: "var(--bg-2)", borderRadius: 13, padding: 4, border: "1.5px solid var(--line)" }}>
      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 9, border: "none", cursor: "pointer",
              background: active ? "var(--surface)" : "transparent", color: active ? "var(--brand-deep)" : "var(--ink-2)",
              fontWeight: active ? 800 : 600, fontSize: 14, transition: "all .16s", fontFamily: "var(--font)",
              boxShadow: active ? "var(--shadow-xs)" : "none", letterSpacing: "-0.01em" }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
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
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 4px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font)", position: "relative" }}>
              {active && <span style={{ position: "absolute", top: 0, width: 26, height: 3, borderRadius: 99, background: "var(--brand)" }} />}
              <span style={{ fontSize: 21, filter: active ? "none" : "grayscale(0.5)", opacity: active ? 1 : 0.6, transition: "all .15s" }}>{n.icon}</span>
              <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? "var(--brand-deep)" : "var(--muted)" }}>{n.label}</span>
            </button>
          );
        })}
        <button onClick={onMore}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 4px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font)", position: "relative" }}>
          {moreActive && <span style={{ position: "absolute", top: 0, width: 26, height: 3, borderRadius: 99, background: "var(--brand)" }} />}
          <span style={{ fontSize: 21, opacity: moreActive ? 1 : 0.6 }}>☰</span>
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
                <div style={{ width: 40, height: 40, borderRadius: 11, background: active ? "var(--brand)" : "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{n.icon}</div>
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
        <div onClick={() => setPage("stores")} style={{ background: "linear-gradient(120deg, #E07B1A 0%, #C2611A 100%)", borderRadius: "var(--r)", padding: "18px 22px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 12px 30px rgba(224,123,26,0.28)", position: "relative", overflow: "hidden" }}>
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
        <StatCard label="Omset Hari Ini" value={fmtShort(todayIncome)} icon="💸" color="var(--green)" soft="var(--green-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Omset Bulan Ini" value={fmtShort(monthIncome)} icon="📈" color="var(--brand)" soft="var(--brand-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Pengeluaran" value={fmtShort(monthExpense)} icon="💳" color="var(--red)" soft="var(--red-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Laba Bersih" value={fmtShort(monthIncome - monthExpense)} icon="✨" color="var(--amber)" soft="var(--amber-soft)" onClick={() => setPage("finance")} />
        <StatCard label="Toko Aktif" value={stores.length} icon="🏪" color="var(--blue)" soft="var(--blue-soft)" onClick={() => setPage("stores")} />
        <StatCard label="Titipan Beredar" value={`${activeC.length} item`} icon="📦" color="var(--brand-deep)" soft="var(--brand-soft)" onClick={() => setPage("stores")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>📊 Aktivitas 7 Hari Terakhir</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
              <XAxis dataKey="hari" tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1.5px solid var(--line)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font)" }} formatter={v => fmt(v)} cursor={{ fill: "rgba(224,123,26,0.06)" }} />
              <Bar dataKey="Omset" fill="#E07B1A" radius={[6,6,0,0]} maxBarSize={26} />
              <Bar dataKey="Biaya" fill="#D6453F" radius={[6,6,0,0]} maxBarSize={26} />
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
  const { transactions } = data;
  const [tab, setTab] = useState("ringkasan");
  const [period, setPeriod] = useState("bulanan");
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [metricDetail, setMetricDetail] = useState(null);
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

  return (
    <div className="fade-up">
      <SectionHeader title="Keuangan" sub="Catat omset, pengeluaran, dan lihat laporan"
        action={<Btn icon="+" onClick={() => setShowAdd(true)}>Catat Transaksi</Btn>} />

      <Tabs items={[{id:"ringkasan",label:"Ringkasan",icon:"📊"},{id:"grafik",label:"Grafik",icon:"📈"},{id:"riwayat",label:"Riwayat",icon:"📋"}]} active={tab} onChange={setTab} />

      <div style={{ marginTop: 20 }}>
        {tab === "ringkasan" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { l:"Omset Bulan Ini", v:fmt(totalIn), c:"var(--green)", bg:"var(--green-soft)", icon:"💚", key:"omset" },
                { l:"Pengeluaran Bulan Ini", v:fmt(totalEx), c:"var(--red)", bg:"var(--red-soft)", icon:"🔴", key:"pengeluaran" },
                { l:"Laba Bersih", v:fmt(totalIn-totalEx), c:"var(--brand)", bg:"var(--brand-soft)", icon:"✨", key:"laba" },
              ].map(x => (
                <button key={x.l} onClick={() => setMetricDetail(x.key)}
                  style={{ background: x.bg, borderRadius: "var(--r)", padding: 18, border: "1.5px solid " + x.c + "30", textAlign:"left", cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent:"space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize: 22 }}>{x.icon}</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: x.c }}>{x.l}</p>
                    </div>
                    <span style={{ color: x.c, fontSize: 14, opacity: 0.6 }}>📈</span>
                  </div>
                  <p className="tnum" style={{ fontSize: 22, fontWeight: 800, color: x.c }}>{x.v}</p>
                  <p style={{ fontSize: 11.5, color: x.c, opacity: 0.75, marginTop: 6, fontWeight: 600 }}>Ketuk untuk lihat grafik →</p>
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
                  <Tooltip contentStyle={{background:"var(--surface)",border:"1.5px solid var(--line)",borderRadius:12,fontSize:12,boxShadow:"var(--shadow)",fontFamily:"var(--font)"}} formatter={v => fmt(v)} cursor={{ fill: "rgba(224,123,26,0.06)" }} />
                  <Legend wrapperStyle={{fontSize:13,color:"var(--muted)",paddingTop:8}} />
                  <Bar dataKey="Omset" fill="#E07B1A" radius={[6,6,0,0]} maxBarSize={30} />
                  <Bar dataKey="Biaya" fill="#D6453F" radius={[6,6,0,0]} maxBarSize={30} />
                  {period === "bulanan" && <Bar dataKey="Laba" fill="#138A5E" radius={[6,6,0,0]} maxBarSize={30} />}
                </BarChart>
              </ResponsiveContainer>
            </Card>
            {period === "bulanan" && (
              <Card>
                <p style={{ fontWeight:800, fontSize:15, marginBottom:18 }}>Tren Laba Bersih</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs><linearGradient id="labaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#138A5E" stopOpacity={0.22} /><stop offset="100%" stopColor="#138A5E" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 4" stroke="#EFE8DB" vertical={false} />
                    <XAxis dataKey="label" tick={{fill:"var(--muted)",fontSize:12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                    <Tooltip contentStyle={{background:"var(--surface)",border:"1.5px solid var(--line)",borderRadius:12,fontSize:12,boxShadow:"var(--shadow)",fontFamily:"var(--font)"}} formatter={v => fmt(v)} />
                    <Area type="monotone" dataKey="Laba" stroke="#138A5E" strokeWidth={2.5} fill="url(#labaGrad)" dot={{fill:"#138A5E",r:4}} />
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
        <FG label="Jumlah (Rp)"><input type="number" placeholder="50000" value={form.amount} onChange={e => setForm(f => ({...f,amount:e.target.value}))} /></FG>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))} /></FG>
        <FG label="Keterangan"><input placeholder="Catatan singkat..." value={form.note} onChange={e => setForm(f => ({...f,note:e.target.value}))} /></FG>
        <div style={{ display:"flex",gap:10 }}>
          <Btn full variant="ghost" onClick={() => setShowAdd(false)}>Batal</Btn>
          <Btn full onClick={add}>Simpan</Btn>
        </div>
      </Modal>
      <MetricDetailModal metric={metricDetail} transactions={transactions} onClose={() => setMetricDetail(null)} />
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
  const [showEdit, setShowEdit] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dropItems, setDropItems] = useState([{ productId:"", quantity:"" }]);
  const [dropDate, setDropDate] = useState(today);
  const [visitItems, setVisitItems] = useState([]);
  const [editForm, setEditForm] = useState({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId, lat: store.lat, lng: store.lng });
  const [editStock, setEditStock] = useState(null);
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
    setData(d => ({ ...d, consignments: newConsignments, receipts: [newReceipt, ...(d.receipts||[])], receiptCounter: (d.receiptCounter||1) + 1 }));
    setPreview(newReceipt);
    setDropItems([{ productId:"", quantity:"" }]);
    setDropDate(today);
    setShowDrop(false);
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
      setData(d => ({ ...d, transactions: [...newTxs, ...d.transactions], consignments: newC, receipts: [newReceipt, ...(d.receipts||[])], receiptCounter: (d.receiptCounter||1) + 1 }));
      setPreview(newReceipt);
    } else {
      setData(d => ({...d, transactions:[...newTxs,...d.transactions], consignments:newC}));
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

        <div style={{ display:"grid", gridTemplateColumns: sc.length > 0 ? "1fr 1fr" : "1fr", gap:10 }}>
          <Btn full size="lg" icon="📦" onClick={() => setShowDrop(true)}>Drop Barang</Btn>
          {sc.length > 0 && (
            <Btn full size="lg" variant={tagihan > 0 ? "primary" : "outline"} icon="🤝" onClick={openVisit}>
              {tagihan > 0 ? `Tagih (${fmt(tagihan)})` : "Kunjungi & Catat"}
            </Btn>
          )}
        </div>
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
            {storeReceipts.map(r => (
              <div key={r.id} style={{ background:"var(--bg)", borderRadius:13, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", border:"1.5px solid var(--line)" }}>
                <div style={{ width:42, height:42, borderRadius:11, background: r.type==="drop" ? "var(--blue-soft)":"var(--green-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {r.type==="drop" ? "📦" : "💰"}
                </div>
                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <Tag color={r.type==="drop"?"var(--blue)":"var(--green)"}>{r.type==="drop"?"PENITIPAN":"PEMBAYARAN"}</Tag>
                    <span style={{ fontSize:11.5, color:"var(--muted)", fontWeight:700 }}>{r.notaNo}</span>
                  </div>
                  <p style={{ fontSize:12.5, color:"var(--muted)", marginTop:3, fontWeight:500 }}>{fmtDate(r.date)} · {(r.items||[]).length} item · <b style={{color:r.type==="drop"?"var(--blue)":"var(--green)"}}>{fmt(r.total)}</b></p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => setPreview(r)}>👁</Btn>
                  <Btn size="sm" variant="primary" onClick={() => printNota(r, COMPANY)}>🖨️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelReceipt(r)}>🗑</Btn>
                </div>
              </div>
            ))}
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
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateDropItem(i, "quantity", e.target.value)} min={1} style={{ textAlign:"center" }} />
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
                <input type="number" value={item.sisaNow} min={0} max={item.remaining} onChange={e => setSisa(i, e.target.value)}
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
        <div style={{ background:"linear-gradient(120deg, var(--brand), var(--brand-deep))", borderRadius:14, padding:"16px 20px", marginBottom:16, color:"#fff", boxShadow:"0 8px 22px rgba(224,123,26,0.25)" }}>
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
        <FG label="Alamat"><input value={editForm.address} onChange={e=>setEditForm(f=>({...f,address:e.target.value}))} /></FG>
        <FG label="Kontak"><input value={editForm.contact} onChange={e=>setEditForm(f=>({...f,contact:e.target.value}))} /></FG>
        <FG label="Rute">
          <select value={editForm.routeId} onChange={e=>setEditForm(f=>({...f,routeId:e.target.value}))}>
            <option value="">-- Pilih Rute --</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </FG>
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
          <input type="number" value={editStock?.qty ?? ""} min={0} onChange={e => setEditStock(s => ({ ...s, qty: e.target.value }))}
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
function SwipeableStoreCard({ store, route, sc, products, totalRem, totalOwed, stockValue = 0, dist = null, userLoc = null, onTap, onDelete }) {
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
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [sf, setSf] = useState({ name:"",address:"",contact:"",routeId:"" });
  const [rf, setRf] = useState({ name:"",color:"#E07B1A",days:[] });
  const { confirm, Dialog } = useConfirm();

  if (selectedStoreId) {
    const store = stores.find(s => s.id === selectedStoreId);
    if (store) return <StoreDetail store={store} data={data} setData={setData} onBack={() => setSelectedStoreId(null)} />;
  }

  const addStore = () => { if (!sf.name || !sf.routeId) return; setData(d => ({...d, stores:[...d.stores,{id:uid(),...sf}]})); setSf({name:"",address:"",contact:"",routeId:""}); setShowAddStore(false); };

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
  const addRoute = () => { if (!rf.name) return; setData(d => ({...d, routes:[...d.routes,{id:uid(),...rf}]})); setRf({name:"",color:"#E07B1A",days:[]}); setShowAddRoute(false); };
  const askDelRoute = (r) => {
    const cnt = stores.filter(s => s.routeId === r.id).length;
    confirm({ title: "Hapus Rute?", message: `Rute "${r.name}" akan dihapus.${cnt > 0 ? ` ${cnt} toko di rute ini akan kehilangan rute-nya.` : ""}`, confirmText: "Ya, Hapus Rute", onConfirm: () => { setData(d => ({...d, routes: d.routes.filter(x => x.id !== r.id)})); if(selRoute===r.id) setSelRoute(null); } });
  };
  const askDelStore = (s) => {
    const hasConsignments = consignments.some(c => c.storeId === s.id && c.status === "active");
    confirm({ title: "Hapus Toko?", message: `Toko "${s.name}" akan dihapus permanen.${hasConsignments ? " ⚠️ Toko ini masih punya titipan aktif!" : ""} Riwayat nota tetap tersimpan.`, confirmText: "Ya, Hapus Toko", onConfirm: () => setData(d => ({...d, stores: d.stores.filter(x => x.id !== s.id)})) });
  };
  const toggleDay = (day) => setRf(f => ({...f,days:f.days.includes(day)?f.days.filter(d=>d!==day):[...f.days,day]}));

  const storesWithMeta = stores.map(s => {
    const route = routes.find(r => r.id === s.routeId);
    const sc = consignments.filter(c => c.storeId === s.id && c.status === "active");
    const stockValue = sc.reduce((sum,c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? c.remaining * p.price : 0); }, 0);
    const totalOwed = sc.reduce((sum,c) => { const p = products.find(x => x.id === c.productId); return sum + (p ? (c.deposited-c.remaining)*p.price : 0); }, 0);
    const totalRem = sc.reduce((sum,c) => sum + c.remaining, 0);
    const dist = (userLoc && hasCoords(s)) ? distanceKm(userLoc.lat, userLoc.lng, s.lat, s.lng) : null;
    return { store: s, route, sc, stockValue, totalOwed, totalRem, dist };
  });

  const q = query.trim().toLowerCase();
  let shown = storesWithMeta
    .filter(m => !selRoute || m.store.routeId === selRoute)
    .filter(m => !q || m.store.name.toLowerCase().includes(q) || (m.store.address||"").toLowerCase().includes(q));
  if (sortBy === "value-desc") shown = [...shown].sort((a,b) => b.stockValue - a.stockValue);
  else if (sortBy === "value-asc") shown = [...shown].sort((a,b) => a.stockValue - b.stockValue);
  else if (sortBy === "has-stock") shown = [...shown].filter(m => m.stockValue > 0).sort((a,b) => b.stockValue - a.stockValue);
  else if (sortBy === "nearest") shown = [...shown].sort((a,b) => { if (a.dist == null && b.dist == null) return 0; if (a.dist == null) return 1; if (b.dist == null) return -1; return a.dist - b.dist; });
  const noCoordCount = shown.filter(m => !hasCoords(m.store)).length;

  const COLORS = ["#E07B1A","#D6453F","#138A5E","#D89215","#2563C9","#7C4DD6","#C2611A"];

  return (
    <div className="fade-up">
      <SectionHeader title="Daftar Toko" sub="Ketuk toko untuk drop barang, tagih, & cetak nota"
        action={<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" size="sm" icon="+" onClick={() => setShowAddRoute(true)}>Rute Baru</Btn>
          <Btn icon="+" onClick={() => setShowAddStore(true)}>Tambah Toko</Btn>
        </div>} />

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={() => setSelRoute(null)}
          style={{ padding:"9px 16px", borderRadius:99, border:`1.5px solid ${!selRoute?"var(--ink)":"var(--line-strong)"}`, background:!selRoute?"var(--ink)":"var(--surface)", color:!selRoute?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", transition:"all .15s" }}>
          Semua Toko ({stores.length})
        </button>
        {routes.map(r => {
          const cnt = stores.filter(s => s.routeId === r.id).length;
          const isTdy = r.days.includes(todayDay);
          const isActive = selRoute === r.id;
          return (
            <button key={r.id} onClick={() => setSelRoute(r.id)}
              style={{ padding:"9px 16px", borderRadius:99, border:`1.5px solid ${isActive?r.color:"var(--line-strong)"}`, background:isActive?r.color:"var(--surface)", color:isActive?"#fff":"var(--ink-2)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", display:"inline-flex", alignItems:"center", gap:6, transition:"all .15s" }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:isActive?"#fff":r.color,display:"inline-block"}}/>
              {r.name} ({cnt})
              {isTdy && <span style={{fontSize:11,background:isActive?"rgba(255,255,255,0.25)":"var(--green-soft)",color:isActive?"#fff":"var(--green)",padding:"1px 7px",borderRadius:99,fontWeight:800}}>Hari Ini</span>}
              <span onClick={e=>{e.stopPropagation();askDelRoute(r)}} style={{marginLeft:4,opacity:0.6,fontSize:13}}>✕</span>
            </button>
          );
        })}
      </div>

      <div style={{ position:"relative", marginBottom:12 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, opacity:0.55, pointerEvents:"none" }}>🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama toko atau alamat..."
          style={{ paddingLeft:42, paddingRight: query ? 42 : 14 }} />
        {query && (
          <button onClick={() => setQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:8, border:"none", background:"var(--bg-2)", color:"var(--muted)", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        )}
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em" }}>Urutkan:</span>
        <Btn size="sm" variant={sortBy==="nearest"?"primary":"ghost"} icon="📍" onClick={pickNearest}>Terdekat (GPS)</Btn>
        {[["default","Urutan Asli"],["value-desc","Nilai Tertinggi"],["value-asc","Nilai Terendah"],["has-stock","Ada Stok Saja"]].map(([v,l]) => (
          <Btn key={v} size="sm" variant={sortBy===v?"primary":"ghost"} onClick={() => setSortBy(v)}>{l}</Btn>
        ))}
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
              onTap={() => setSelectedStoreId(s.id)} onDelete={() => askDelStore(s)} />
        ))}
        {shown.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon="🔍" title={q || sortBy === "has-stock" ? "Tidak ada toko yang cocok" : "Belum ada toko"} sub={q ? `Tidak ada toko dengan nama/alamat "${query}"` : sortBy === "has-stock" ? "Tidak ada toko yang punya stok saat ini" : "Tambah toko baru ke rute ini"} /></Card>}
      </div>

      <Modal show={showAddStore} onClose={() => setShowAddStore(false)} title="Tambah Toko Baru">
        <FG label="Nama Toko"><input placeholder="Warung Bu Sari" value={sf.name} onChange={e=>setSf(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Alamat"><input placeholder="Jl. Melati No. 5" value={sf.address} onChange={e=>setSf(f=>({...f,address:e.target.value}))} /></FG>
        <FG label="Kontak"><input placeholder="0812..." value={sf.contact} onChange={e=>setSf(f=>({...f,contact:e.target.value}))} /></FG>
        <FG label="Rute">
          <select value={sf.routeId} onChange={e=>setSf(f=>({...f,routeId:e.target.value}))}>
            <option value="">-- Pilih Rute --</option>
            {routes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </FG>
        <div style={{ marginBottom:16 }}>
          <LocationPicker lat={sf.lat} lng={sf.lng} address={sf.address} onChange={(lat,lng)=>setSf(f=>({...f,lat,lng}))} />
        </div>
        <div style={{display:"flex",gap:10}}><Btn full variant="ghost" onClick={()=>setShowAddStore(false)}>Batal</Btn><Btn full onClick={addStore}>Simpan</Btn></div>
      </Modal>

      <Modal show={showAddRoute} onClose={() => setShowAddRoute(false)} title="Buat Rute Baru">
        <FG label="Nama Rute"><input placeholder="Rute Selatan" value={rf.name} onChange={e=>setRf(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Warna Rute">
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {COLORS.map(c=>(<div key={c} onClick={()=>setRf(f=>({...f,color:c}))} style={{width:36,height:36,borderRadius:11,background:c,cursor:"pointer",border:rf.color===c?"3px solid var(--ink)":"3px solid transparent",transition:"all .15s"}} />))}
          </div>
        </FG>
        <FG label="Hari Kunjungan">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {dayNames.slice(1).map(d=>(<button key={d} onClick={()=>toggleDay(d)} style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${rf.days.includes(d)?"var(--brand)":"var(--line-strong)"}`,background:rf.days.includes(d)?"var(--brand)":"var(--surface)",color:rf.days.includes(d)?"#fff":"var(--ink-2)",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s"}}>{d}</button>))}
          </div>
        </FG>
        <div style={{display:"flex",gap:10}}><Btn full variant="ghost" onClick={()=>setShowAddRoute(false)}>Batal</Btn><Btn full onClick={addRoute}>Simpan Rute</Btn></div>
      </Modal>

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
  return (
    <Modal show={true} onClose={onClose} title={isDrop ? "Nota Penitipan" : "Nota Pembayaran"} wide>
      <div style={{ background: "#fff", border: "1.5px solid var(--line)", borderRadius: 14, padding: 20, marginBottom: 16, color: "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "1px" }}>{COMPANY.name}</p>
            <p style={{ fontSize: 12, fontWeight: 700 }}>{COMPANY.tagline}</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{COMPANY.address}</p>
            <p style={{ fontSize: 11, color: "#555" }}>HP/WA: {COMPANY.phone}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "inline-block", background: "#000", color: "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{isDrop ? "NOTA PENITIPAN" : "NOTA PEMBAYARAN"}</span>
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
          {isDrop ? <><strong>Sistem Titip Jual:</strong> Barang dititipkan untuk dijual. Pembayaran dilakukan saat kunjungan berikutnya berdasarkan jumlah yang terjual.</> : <><strong>Pembayaran Lunas</strong> atas barang titip jual yang telah terjual. Terima kasih atas kerjasamanya.</>}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20, fontSize: 11.5 }}>
          <div style={{ textAlign:"center", flex:1 }}><p style={{ marginBottom:42 }}>{receipt.storeName}</p><div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div></div>
          <div style={{ textAlign:"center", flex:1 }}><p style={{ marginBottom:42 }}>Hormat Kami,<br/>{COMPANY.name}</p><div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div></div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn full variant="ghost" onClick={onClose}>Tutup</Btn>
        <Btn full icon="🖨️" onClick={() => printNota(receipt, COMPANY)}>Cetak Nota</Btn>
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

  return (
    <div className="fade-up">
      <SectionHeader title="Nota & Bukti" sub="Riwayat nota penitipan & pembayaran" />

      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Nota" value={receipts.length} icon="🧾" color="var(--brand)" soft="var(--brand-soft)" />
        <StatCard label="Nota Penitipan" value={receipts.filter(r=>r.type==="drop").length} sub={fmt(totalDrop)} icon="📦" color="var(--blue)" soft="var(--blue-soft)" />
        <StatCard label="Nota Pembayaran" value={receipts.filter(r=>r.type==="payment").length} sub={fmt(totalPay)} icon="💰" color="var(--green)" soft="var(--green-soft)" />
      </div>

      <Card style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>Filter:</span>
          {[["all","Semua"],["drop","Penitipan"],["payment","Pembayaran"]].map(([v,l]) => (
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
          {filtered.map(r => (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 13, background: r.type==="drop" ? "var(--blue-soft)" : "var(--green-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{r.type==="drop" ? "📦" : "💰"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <Tag color={r.type==="drop" ? "var(--blue)" : "var(--green)"}>{r.type==="drop" ? "NOTA PENITIPAN" : "NOTA PEMBAYARAN"}</Tag>
                      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{r.notaNo}</span>
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 2 }}>{r.storeName}</p>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>{fmtDate(r.date)} · {(r.items||[]).length} item</p>
                    <p className="tnum" style={{ fontSize: 18, fontWeight: 800, color: r.type==="drop" ? "var(--blue)" : "var(--green)", marginTop: 6 }}>{fmt(r.total)}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn size="sm" variant="outline" icon="👁" onClick={() => setPreview(r)}>Lihat</Btn>
                  <Btn size="sm" variant="primary" icon="🖨️" onClick={() => printNota(r, COMPANY)}>Cetak</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelete(r)}>🗑</Btn>
                </div>
              </div>
            </Card>
          ))}
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
        <FG label="Harga Jual (Rp)"><input type="number" placeholder="8000" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} /></FG>
        <FG label="Harga Pokok / HPP (Rp)" hint="Opsional, untuk hitung margin"><input type="number" placeholder="4000" value={form.costPrice} onChange={e=>setForm(f=>({...f,costPrice:e.target.value}))} /></FG>
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
      case "settings": return <Settings {...props} />;
      default: return null;
    }
  };

  const tdyDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long" });

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 500, background: "rgba(250,247,241,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #E07B1A, #C2611A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, boxShadow: "0 6px 16px rgba(224,123,26,0.32)", flexShrink: 0 }}>🍟</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>{COMPANY.name}</p>
                <p className="brand-subtitle" style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.1, marginTop: 2, whiteSpace: "nowrap", fontWeight: 500 }}>{COMPANY.tagline}</p>
              </div>
            </div>
            <div className="nav-wrap" style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
              <TopNav page={page} setPage={navigate} />
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }} className="date-display">
              <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{todayDay}</p>
              <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 500 }}>{tdyDate}</p>
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
