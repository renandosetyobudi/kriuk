import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F8FB;
    --white: #FFFFFF;
    --border: #E5E7EB;
    --text: #111827;
    --text-2: #374151;
    --sub: #6B7280;
    --accent: #4F46E5;
    --accent-light: #EEF2FF;
    --green: #10B981;
    --green-light: #ECFDF5;
    --red: #EF4444;
    --red-light: #FEF2F2;
    --yellow: #F59E0B;
    --yellow-light: #FFFBEB;
    --blue: #3B82F6;
    --blue-light: #EFF6FF;
    --orange: #F97316;
    --orange-light: #FFF7ED;
    --font: 'Inter', sans-serif;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow: 0 4px 16px rgba(0,0,0,0.06);
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.12);
    --r: 14px;
    --r-sm: 10px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  html { overflow-x: hidden; }
  input, select, textarea {
    background: var(--white); border: 1.5px solid var(--border); color: var(--text);
    border-radius: var(--r-sm); padding: 11px 14px; font-family: var(--font);
    font-size: 15px; outline: none; width: 100%; transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
  }
  button { cursor: pointer; font-family: var(--font); }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 99px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.25s cubic-bezier(.22,1,.36,1) both; }
  .slide-down { animation: slideDown 0.18s ease both; }
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
    { id: "r1", name: "Rute Barat", color: "#4F46E5", days: ["Senin","Kamis"] },
    { id: "r2", name: "Rute Timur", color: "#EF4444", days: ["Selasa","Jumat"] },
    { id: "r3", name: "Rute Tengah", color: "#10B981", days: ["Rabu","Sabtu"] },
  ],
  stores: [
    { id: "s1", name: "Warung Bu Sari", address: "Jl. Melati No. 5", contact: "081234", routeId: "r1" },
    { id: "s2", name: "Toko Pak Budi", address: "Jl. Mawar No. 12", contact: "082345", routeId: "r1" },
    { id: "s3", name: "Minimart Ceria", address: "Jl. Anggrek No. 3", contact: "083456", routeId: "r2" },
    { id: "s4", name: "Warung Pak RT", address: "Jl. Dahlia No. 7", contact: "084567", routeId: "r2" },
    { id: "s5", name: "Kantin Sekolah", address: "Jl. Cemara No. 1", contact: "085678", routeId: "r3" },
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

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      if (!s) return init;
      const parsed = JSON.parse(s);
      // Backward compat: ensure new fields exist
      return { ...init, ...parsed };
    } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// Generate nota number: TYPE/MMYY/0001
const genNotaNo = (type, counter) => {
  const d = new Date();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  const seq = String(counter).padStart(4,"0");
  const prefix = type === "drop" ? "TTP" : "BYR"; // Titipan / Bayar
  return `${prefix}/${mm}${yy}/${seq}`;
};

// Number to Indonesian words (terbilang)
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

// Print a full Indonesian-style nota
function printNota(receipt, company) {
  const w = window.open("","_blank");
  const isDrop = receipt.type === "drop";
  const title = isDrop ? "NOTA PENITIPAN BARANG" : "NOTA PEMBAYARAN";
  const items = receipt.items || [];
  const total = receipt.total || 0;
  const dateStr = new Date(receipt.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const rowsHtml = items.map((item, i) => `
    <tr>
      <td style="text-align:center">${i+1}</td>
      <td>${item.name}</td>
      <td style="text-align:center">${item.qty}</td>
      <td style="text-align:right">${formatRp(item.price)}</td>
      <td style="text-align:right">${formatRp(item.qty * item.price)}</td>
    </tr>
  `).join("");

  function formatRp(n) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(n||0);
  }

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

function printHtml(html) {
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Print</title>
  <style>body{font-family:sans-serif;padding:28px;color:#111;font-size:13px;}</style>
  </head><body>${html}</body></html>`);
  w.document.close(); w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
}

// ─────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────
function Tag({ children, color = "var(--accent)", bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: bg || color + "18", color,
      borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap", lineHeight: 1.5,
    }}>{children}</span>
  );
}

function Card({ children, style, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--white)", borderRadius: "var(--r)",
        border: `1.5px solid ${hov && onClick ? "var(--accent)" : "var(--border)"}`,
        boxShadow: hov && onClick ? "var(--shadow)" : "var(--shadow-sm)",
        padding: 20, transition: "all 0.18s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon, full, disabled }) {
  const [hov, setHov] = useState(false);
  const v = {
    primary: { bg: hov ? "#4338CA" : "var(--accent)", color: "#fff", border: "transparent" },
    outline: { bg: hov ? "var(--accent-light)" : "var(--white)", color: "var(--accent)", border: "var(--accent)" },
    ghost: { bg: hov ? "var(--bg)" : "var(--white)", color: "var(--text-2)", border: "var(--border)" },
    danger: { bg: hov ? "#FEE2E2" : "var(--red-light)", color: "var(--red)", border: "#FECACA" },
  }[variant] || {};
  const pad = size === "sm" ? "7px 12px" : "10px 18px";
  const fs = size === "sm" ? 13 : 14;
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: pad, fontSize: fs, fontWeight: 600,
        borderRadius: "var(--r-sm)", border: `1.5px solid ${v.border}`, background: v.bg, color: v.color,
        transition: "all 0.15s", width: full ? "100%" : undefined,
        justifyContent: full ? "center" : undefined, opacity: disabled ? 0.5 : 1 }}>
      {icon && <span style={{ fontSize: fs + 2 }}>{icon}</span>}
      {children}
    </button>
  );
}

function Modal({ show, onClose, title, children, wide }) {
  // Lock body scroll when modal is open
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
      position: "fixed", inset: 0, background: "rgba(17,24,39,0.5)", backdropFilter: "blur(4px)",
      zIndex: 900,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: "max(20px, env(safe-area-inset-top))",
      paddingBottom: "max(40px, env(safe-area-inset-bottom))",
      paddingLeft: 16,
      paddingRight: 16,
    }}>
      <div className="fade-up" onClick={e => e.stopPropagation()}
        style={{
          background: "var(--white)", borderRadius: 18, padding: 24,
          width: "100%", maxWidth: wide ? 660 : 480,
          boxShadow: "var(--shadow-lg)",
          margin: "0 auto",
          marginBottom: "40px", // extra space at bottom so last button is reachable
        }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20,
          position: "sticky", top: -24, background: "var(--white)",
          padding: "8px 0 12px", marginTop: -8,
          borderBottom: "1px solid var(--border)", zIndex: 2,
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{title}</h3>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--sub)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ paddingTop: 4 }}>{children}</div>
      </div>
    </div>
  );
}

function FG({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

// Confirmation Dialog for destructive actions
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
      position: "fixed", inset: 0, background: "rgba(17,24,39,0.55)", backdropFilter: "blur(4px)",
      zIndex: 950, display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "80px 16px 24px", overflowY: "auto",
    }}>
      <div className="fade-up" onClick={e => e.stopPropagation()}
        style={{ background: "var(--white)", borderRadius: 18, padding: 24, width: "100%", maxWidth: 400, boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: danger ? "var(--red-light)" : "var(--yellow-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>
          {icon}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: "var(--sub)", lineHeight: 1.5, marginBottom: 22 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="ghost" onClick={onClose}>Batal</Btn>
          <Btn full variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Btn>
        </div>
      </div>
    </div>
  );
}

// Hook helper for confirmation dialog usage
function useConfirm() {
  const [state, setState] = useState({ show: false });
  const confirm = (opts) => setState({ ...opts, show: true });
  const close = () => setState(s => ({ ...s, show: false }));
  const Dialog = () => (
    <ConfirmDialog
      show={state.show}
      onClose={close}
      onConfirm={state.onConfirm || (()=>{})}
      title={state.title || "Konfirmasi"}
      message={state.message || "Apakah Anda yakin?"}
      confirmText={state.confirmText}
      danger={state.danger !== false}
      icon={state.icon}
    />
  );
  return { confirm, Dialog };
}

function ProgressBar({ value, max }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  const c = pct < 25 ? "var(--red)" : pct < 60 ? "var(--yellow)" : "var(--green)";
  return (
    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 99, transition: "width 0.4s" }} />
    </div>
  );
}

function StatCard({ label, value, sub, icon, color = "var(--accent)", onClick }) {
  return (
    <Card onClick={onClick} style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, color: "var(--sub)", marginBottom: 3 }}>{label}</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 3 }}>{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{title}</h2>
        {sub && <p style={{ fontSize: 14, color: "var(--sub)", marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Tabs({ items, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, background: "var(--white)", borderRadius: 11, padding: 4, border: "1.5px solid var(--border)", flexWrap: "wrap", boxShadow: "var(--shadow-sm)" }}>
      {items.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ padding: "9px 18px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font)", background: active === t.id ? "var(--accent)" : "transparent", color: active === t.id ? "#fff" : "var(--text-2)" }}>
          {t.icon && <span style={{ marginRight: 5 }}>{t.icon}</span>}{t.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>{title}</p>
      <p style={{ fontSize: 14, color: "var(--sub)" }}>{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// OVERFLOW MENU (HAMBURGER)
// ─────────────────────────────────────────────
function OverflowMenu({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "⚡", desc: "Ringkasan bisnis" },
    { id: "finance", label: "Keuangan", icon: "💰", desc: "Omset & pengeluaran" },
    { id: "stores", label: "Toko & Titipan", icon: "🏪", desc: "Drop, tagih, cetak nota" },
    { id: "receipts", label: "Riwayat Nota", icon: "🧾", desc: "Cetak ulang nota" },
    { id: "notes", label: "Catatan Harian", icon: "📝", desc: "Memo & pengingat" },
    { id: "products", label: "Produk", icon: "🍟", desc: "Kelola produk" },
  ];

  const current = nav.find(n => n.id === page);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--white)", border: `1.5px solid ${open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 12, padding: "10px 14px", cursor: "pointer", color: "var(--text)",
          transition: "all 0.15s", boxShadow: "var(--shadow-sm)",
        }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ width: 18, height: 2, background: "var(--text)", borderRadius: 99 }} />
          <span style={{ width: 18, height: 2, background: "var(--text)", borderRadius: 99 }} />
          <span style={{ width: 18, height: 2, background: "var(--text)", borderRadius: 99 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{current?.icon}</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{current?.label}</span>
        </div>
      </button>

      {open && (
        <div className="slide-down dropdown-menu" style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          background: "var(--white)", border: "1.5px solid var(--border)",
          borderRadius: 16, boxShadow: "var(--shadow-lg)",
          width: "max(280px, 0px)",
          maxWidth: "calc(100vw - 32px)",
          zIndex: 800, overflow: "hidden", padding: 6,
        }}>
          <style>{`
            @media (max-width: 480px) {
              .dropdown-menu { left: auto !important; right: 0 !important; }
            }
          `}</style>
          <div style={{ padding: "10px 14px 8px" }}>
            <p style={{ fontSize: 11, color: "var(--sub)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Menu</p>
          </div>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: page === n.id ? "var(--accent-light)" : "transparent",
                transition: "background 0.12s", textAlign: "left", marginBottom: 2,
              }}
              onMouseEnter={e => { if (page !== n.id) e.currentTarget.style.background = "var(--bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = page === n.id ? "var(--accent-light)" : "transparent"; }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: page === n.id ? "var(--accent)" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all 0.15s" }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: page === n.id ? "var(--accent)" : "var(--text)" }}>{n.label}</p>
                <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 1 }}>{n.desc}</p>
              </div>
              {page === n.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
            </button>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", padding: "10px 14px 6px", marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "var(--sub)" }}>Snack Kriuk · Bisnis Manager</p>
          </div>
        </div>
      )}
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

  return (
    <div className="fade-up">
      {todayRoutes.length > 0 && (
        <div onClick={() => setPage("stores")} style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: "var(--r)", padding: "18px 22px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 24px rgba(79,70,229,0.25)" }}>
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.22)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🗺️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Jadwal Hari Ini</p>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{todayRoutes.map(r => r.name).join(", ")} — Ketuk untuk lihat detail</p>
          </div>
          <span style={{ color: "#fff", fontSize: 22, opacity: 0.9 }}>→</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Omset Hari Ini" value={fmtShort(todayIncome)} icon="💸" color="var(--green)" onClick={() => setPage("finance")} />
        <StatCard label="Omset Bulan Ini" value={fmtShort(monthIncome)} icon="📈" color="var(--accent)" onClick={() => setPage("finance")} />
        <StatCard label="Pengeluaran Bulan" value={fmtShort(monthExpense)} icon="💳" color="var(--red)" onClick={() => setPage("finance")} />
        <StatCard label="Laba Bersih" value={fmtShort(monthIncome - monthExpense)} icon="✨" color="var(--yellow)" onClick={() => setPage("finance")} />
        <StatCard label="Toko Aktif" value={stores.length} icon="🏪" color="var(--blue)" onClick={() => setPage("stores")} />
        <StatCard label="Titipan Beredar" value={`${activeC.length} item`} icon="📦" color="var(--orange)" onClick={() => setPage("stores")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Aktivitas 7 Hari Terakhir</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="hari" tick={{ fill: "var(--sub)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--sub)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip contentStyle={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 12 }} formatter={v => fmt(v)} />
              <Bar dataKey="Omset" fill="#4F46E5" radius={[5,5,0,0]} />
              <Bar dataKey="Biaya" fill="#EF4444" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          {pinned && (
            <Card onClick={() => setPage("notes")} style={{ background: "var(--yellow-light)", borderColor: "#FDE68A" }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--yellow)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>📌 Catatan Pinned</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>{pinned.content}</p>
              <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 8 }}>{fmtDate(pinned.date)}</p>
            </Card>
          )}
          <Card onClick={() => setPage("stores")} style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "var(--sub)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>Toko Perlu Dikunjungi</p>
            {(() => {
              // Group by store, find oldest drop date per store
              const byStore = {};
              activeC.forEach(c => {
                if (!byStore[c.storeId] || c.date < byStore[c.storeId].oldestDate) {
                  byStore[c.storeId] = { storeId: c.storeId, oldestDate: c.date };
                }
              });
              const now = new Date();
              const overdueStores = Object.values(byStore)
                .map(s => {
                  const days = Math.floor((now - new Date(s.oldestDate)) / (1000 * 60 * 60 * 24));
                  return { ...s, days };
                })
                .sort((a, b) => b.days - a.days)
                .slice(0, 4);
              if (overdueStores.length === 0) return <p style={{ fontSize: 13.5, color: "var(--sub)", textAlign: "center", padding: "16px 0" }}>✅ Belum ada titipan</p>;
              return overdueStores.map(o => {
                const s = stores.find(x => x.id === o.storeId);
                return (
                  <div key={o.storeId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600 }}>{s?.name}</p>
                      <p style={{ fontSize: 12, color: "var(--sub)" }}>{fmtDate(o.oldestDate)}</p>
                    </div>
                    <Tag color={o.days >= 7 ? "var(--red)" : o.days >= 3 ? "var(--yellow)" : "var(--green)"}>
                      {o.days === 0 ? "Hari ini" : `${o.days} hari`}
                    </Tag>
                  </div>
                );
              });
            })()}
          </Card>
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Transaksi Terbaru</p>
          <Btn size="sm" variant="outline" onClick={() => setPage("finance")}>Lihat Semua →</Btn>
        </div>
        {transactions.slice(0,6).map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.type === "income" ? "var(--green-light)" : "var(--red-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: t.type === "income" ? "var(--green)" : "var(--red)", fontWeight: 800 }}>
                {t.type === "income" ? "↑" : "↓"}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note}</p>
                <p style={{ fontSize: 12, color: "var(--sub)", marginTop: 2 }}>{fmtDate(t.date)} · {t.category}</p>
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14.5, color: t.type === "income" ? "var(--green)" : "var(--red)", whiteSpace: "nowrap", marginLeft: 12 }}>
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
// METRIC DETAIL MODAL — line chart for omset/pengeluaran/laba
// ─────────────────────────────────────────────
function MetricDetailModal({ metric, transactions, onClose }) {
  if (!metric) return null;
  const config = {
    omset: { title: "Omset Penjualan", color: "#10B981", dataKey: "Omset", type: "income" },
    pengeluaran: { title: "Pengeluaran", color: "#EF4444", dataKey: "Biaya", type: "expense" },
    laba: { title: "Laba Bersih", color: "#4F46E5", dataKey: "Laba", type: "both" },
  }[metric];

  // Group by month (last 12 months)
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
    if (t.type === "income") m.Omset += t.amount;
    else m.Biaya += t.amount;
  });
  months.forEach(m => { m.Laba = m.Omset - m.Biaya; });

  // Daily for this month
  const thisM = now.toISOString().slice(0, 7);
  const dailyData = {};
  transactions.filter(t => t.date.startsWith(thisM)).forEach(t => {
    const day = t.date.slice(8);
    if (!dailyData[day]) dailyData[day] = { day, Omset: 0, Biaya: 0, Laba: 0 };
    if (t.type === "income") dailyData[day].Omset += t.amount;
    else dailyData[day].Biaya += t.amount;
  });
  Object.values(dailyData).forEach(d => { d.Laba = d.Omset - d.Biaya; });
  const dailyArr = Object.values(dailyData).sort((a,b) => +a.day - +b.day);

  // Stats
  const allValues = months.map(m => m[config.dataKey]);
  const total = allValues.reduce((s,v) => s + v, 0);
  const avg = total / Math.max(1, allValues.filter(v => v !== 0).length);
  const max = Math.max(...allValues, 0);
  const min = Math.min(...allValues.filter(v => v !== 0), 0);

  return (
    <Modal show={true} onClose={onClose} title={config.title} wide>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        <div style={{ background: config.color + "18", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 11, color: config.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total 12 Bulan</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: config.color, marginTop: 4 }}>{fmt(total)}</p>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 11, color: "var(--sub)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rata-rata/Bulan</p>
          <p style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>{fmt(avg)}</p>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 11, color: "var(--sub)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tertinggi</p>
          <p style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>{fmt(max)}</p>
        </div>
      </div>

      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--text)" }}>📈 Tren 12 Bulan Terakhir</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--sub)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--sub)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
          <Tooltip contentStyle={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 12 }} formatter={v => fmt(v)} />
          <Line type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={3} dot={{ fill: config.color, r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>

      {dailyArr.length > 0 && (
        <>
          <p style={{ fontWeight: 700, fontSize: 14, marginTop: 24, marginBottom: 12, color: "var(--text)" }}>📊 Harian Bulan Ini</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyArr} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--sub)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--sub)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip contentStyle={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 12 }} formatter={v => fmt(v)} labelFormatter={l => `Tanggal ${l}`} />
              <Line type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={2.5} dot={{ fill: config.color, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <Btn full variant="ghost" onClick={onClose}>Tutup</Btn>
      </div>
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
  const [metricDetail, setMetricDetail] = useState(null); // "omset" | "pengeluaran" | "laba"
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

  const askDelete = (t) => {
    confirm({
      title: "Hapus Transaksi?",
      message: `Transaksi "${t.note || t.category}" sebesar ${fmt(t.amount)} akan dihapus. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: "Ya, Hapus",
      onConfirm: () => setData(d => ({ ...d, transactions: d.transactions.filter(x => x.id !== t.id) })),
    });
  };

  const monthTxF = transactions.filter(t => t.date.startsWith(thisMonth));
  const totalIn = monthTxF.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const totalEx = monthTxF.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);

  const getMonthly = () => {
    const m = {};
    transactions.forEach(t => {
      const k = t.date.slice(0,7);
      if (!m[k]) m[k] = { key: k, Omset: 0, Biaya: 0 };
      t.type === "income" ? m[k].Omset += t.amount : m[k].Biaya += t.amount;
    });
    return Object.values(m).sort((a,b) => a.key.localeCompare(b.key)).map(x => ({
      ...x, Laba: x.Omset - x.Biaya,
      label: new Date(x.key+"-01").toLocaleDateString("id-ID",{month:"short",year:"2-digit"}),
    }));
  };
  const getDaily = () => {
    const d = {};
    transactions.filter(t => t.date.startsWith(thisMonth)).forEach(t => {
      if (!d[t.date]) d[t.date] = { day: t.date.slice(8), Omset: 0, Biaya: 0 };
      t.type === "income" ? d[t.date].Omset += t.amount : d[t.date].Biaya += t.amount;
    });
    return Object.values(d).sort((a,b) => +a.day - +b.day);
  };

  const chartData = period === "bulanan" ? getMonthly() : getDaily();
  const xKey = period === "bulanan" ? "label" : "day";

  const expByCat = {};
  monthTxF.filter(t => t.type === "expense").forEach(t => { expByCat[t.category] = (expByCat[t.category]||0) + t.amount; });
  const pieData = Object.entries(expByCat).map(([name,value]) => ({name,value}));
  const COLORS = ["#4F46E5","#EF4444","#F59E0B","#10B981","#3B82F6","#F97316","#8B5CF6"];

  // Time filter helper
  const inTimeRange = (dateStr) => {
    if (timeFilter === "all") return true;
    const d = new Date(dateStr + "T00:00:00");
    const now = new Date();
    if (timeFilter === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo && d <= now;
    }
    if (timeFilter === "month") return dateStr.startsWith(thisMonth);
    if (timeFilter === "year") return dateStr.startsWith(today.slice(0, 4));
    if (timeFilter === "custom") {
      if (!customRange.from || !customRange.to) return true;
      return dateStr >= customRange.from && dateStr <= customRange.to;
    }
    return true;
  };

  const filtered = transactions
    .filter(t => typeFilter === "all" || t.type === typeFilter)
    .filter(t => inTimeRange(t.date));

  // Stats for filtered
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
                { l:"Omset Bulan Ini", v:fmt(totalIn), c:"var(--green)", bg:"var(--green-light)", icon:"💚", key:"omset" },
                { l:"Pengeluaran Bulan Ini", v:fmt(totalEx), c:"var(--red)", bg:"var(--red-light)", icon:"🔴", key:"pengeluaran" },
                { l:"Laba Bersih", v:fmt(totalIn-totalEx), c:"var(--accent)", bg:"var(--accent-light)", icon:"✨", key:"laba" },
              ].map(x => (
                <button key={x.l} onClick={() => setMetricDetail(x.key)}
                  style={{ background: x.bg, borderRadius: "var(--r)", padding: 18, border: "1.5px solid " + x.c + "33", textAlign:"left", cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ display: "flex", justifyContent:"space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize: 22 }}>{x.icon}</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: x.c }}>{x.l}</p>
                    </div>
                    <span style={{ color: x.c, fontSize: 14, opacity: 0.6 }}>📈</span>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 800, color: x.c }}>{x.v}</p>
                  <p style={{ fontSize: 11.5, color: x.c, opacity: 0.7, marginTop: 6 }}>Tap untuk lihat grafik</p>
                </button>
              ))}
            </div>
            {pieData.length > 0 && (
              <Card>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Komposisi Pengeluaran Bulan Ini</p>
                <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie></PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {pieData.map((d,i) => (
                      <div key={d.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:11, height:11, borderRadius:3, background:COLORS[i%COLORS.length] }} />
                          <span style={{ fontSize:14, fontWeight:500 }}>{d.name}</span>
                        </div>
                        <span style={{ fontWeight:700, fontSize:14, color:COLORS[i%COLORS.length] }}>{fmt(d.value)}</span>
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
              <p style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>
                {period === "harian" ? "Omset Harian (Bulan Ini)" : "Omset & Pengeluaran Bulanan"}
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey={xKey} tick={{fill:"var(--sub)",fontSize:12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill:"var(--sub)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                  <Tooltip contentStyle={{background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:10,fontSize:12}} formatter={v => fmt(v)} />
                  <Legend wrapperStyle={{fontSize:13,color:"var(--sub)",paddingTop:8}} />
                  <Bar dataKey="Omset" fill="#4F46E5" radius={[5,5,0,0]} />
                  <Bar dataKey="Biaya" fill="#EF4444" radius={[5,5,0,0]} />
                  {period === "bulanan" && <Bar dataKey="Laba" fill="#10B981" radius={[5,5,0,0]} />}
                </BarChart>
              </ResponsiveContainer>
            </Card>
            {period === "bulanan" && (
              <Card>
                <p style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>Tren Laba Bersih</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="label" tick={{fill:"var(--sub)",fontSize:12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:"var(--sub)",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                    <Tooltip contentStyle={{background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:10,fontSize:12}} formatter={v => fmt(v)} />
                    <Line type="monotone" dataKey="Laba" stroke="#10B981" strokeWidth={2.5} dot={{fill:"#10B981",r:4}} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {tab === "riwayat" && (
          <div className="fade-up">
            {/* Type filter */}
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              {[["all","Semua"],["income","Pemasukan"],["expense","Pengeluaran"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={typeFilter===v?"primary":"ghost"} onClick={() => setTypeFilter(v)}>{l}</Btn>
              ))}
            </div>

            {/* Time filter */}
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize: 12, color: "var(--sub)", fontWeight: 700, textTransform:"uppercase", letterSpacing:"0.04em" }}>📅 Waktu:</span>
              {[["all","Semua"],["week","Minggu Ini"],["month","Bulan Ini"],["year","Tahun Ini"],["custom","Range Tanggal"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={timeFilter===v?"primary":"ghost"} onClick={() => setTimeFilter(v)}>{l}</Btn>
              ))}
            </div>

            {/* Custom date range inputs */}
            {timeFilter === "custom" && (
              <div style={{ background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 10, padding: 12, marginBottom: 14, display:"grid", gridTemplateColumns:"1fr 1fr", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>Dari Tanggal</p>
                  <input type="date" value={customRange.from} onChange={e => setCustomRange(r => ({...r, from: e.target.value}))} style={{ fontSize: 13, padding: "8px 10px" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>Sampai Tanggal</p>
                  <input type="date" value={customRange.to} onChange={e => setCustomRange(r => ({...r, to: e.target.value}))} style={{ fontSize: 13, padding: "8px 10px" }} />
                </div>
              </div>
            )}

            {/* Summary of filtered */}
            {(timeFilter !== "all" || typeFilter !== "all") && filtered.length > 0 && (
              <div style={{ background: "var(--accent-light)", border: "1.5px solid #C7D2FE", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 700 }}>📊 {filtered.length} transaksi</span>
                <div style={{ display: "flex", gap: 14, fontSize: 12.5, fontWeight: 700, flexWrap: "wrap" }}>
                  {(typeFilter === "all" || typeFilter === "income") && filteredIn > 0 && <span style={{ color: "var(--green)" }}>+ {fmt(filteredIn)}</span>}
                  {(typeFilter === "all" || typeFilter === "expense") && filteredEx > 0 && <span style={{ color: "var(--red)" }}>− {fmt(filteredEx)}</span>}
                  {typeFilter === "all" && <span style={{ color: "var(--accent)" }}>= {fmt(filteredIn - filteredEx)}</span>}
                </div>
              </div>
            )}

            <Card style={{ padding: "4px 18px" }}>
              {filtered.length === 0 && <EmptyState icon="📭" title="Tidak ada transaksi" sub="Coba ubah filter atau catat transaksi baru" />}
              {filtered.map(t => (
                <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--border)", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, minWidth: 0, flex: 1 }}>
                    <div style={{ width:38,height:38,borderRadius:10,background:t.type==="income"?"var(--green-light)":"var(--red-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:t.type==="income"?"var(--green)":"var(--red)",fontWeight:800 }}>
                      {t.type==="income"?"↑":"↓"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize:14,fontWeight:600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note||t.category}</p>
                      <div style={{ display:"flex",gap:6,marginTop:3,alignItems:"center", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:11.5,color:"var(--sub)", flexShrink:0 }}>{fmtDate(t.date)}</span>
                        <span style={{ fontSize:11, color:t.type==="income"?"var(--green)":"var(--red)", background:t.type==="income"?"var(--green-light)":"var(--red-light)", padding:"1px 7px", borderRadius:99, fontWeight:600, flexShrink:0 }}>{t.category}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6, flexShrink:0 }}>
                    <p style={{ fontWeight:700,fontSize:14,color:t.type==="income"?"var(--green)":"var(--red)",whiteSpace:"nowrap" }}>
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
            style={{ flex:1,padding:"12px",borderRadius:10,border:`2px solid ${form.type==="income"?"var(--green)":"var(--border)"}`,background:form.type==="income"?"var(--green-light)":"var(--white)",color:form.type==="income"?"var(--green)":"var(--sub)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"var(--font)" }}>
            💚 Pemasukan
          </button>
          <button onClick={() => setForm(f => ({...f,type:"expense",category:"Produksi"}))}
            style={{ flex:1,padding:"12px",borderRadius:10,border:`2px solid ${form.type==="expense"?"var(--red)":"var(--border)"}`,background:form.type==="expense"?"var(--red-light)":"var(--white)",color:form.type==="expense"?"var(--red)":"var(--sub)",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"var(--font)" }}>
            🔴 Pengeluaran
          </button>
        </div>
        <FG label="Kategori">
          <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))}>
            {(form.type==="income"?inCats:exCats).map(c => <option key={c}>{c}</option>)}
          </select>
        </FG>
        <FG label="Jumlah (Rp)">
          <input type="number" placeholder="50000" value={form.amount} onChange={e => setForm(f => ({...f,amount:e.target.value}))} />
        </FG>
        <FG label="Tanggal">
          <input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))} />
        </FG>
        <FG label="Keterangan">
          <input placeholder="Catatan singkat..." value={form.note} onChange={e => setForm(f => ({...f,note:e.target.value}))} />
        </FG>
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
// STORE DETAIL PAGE (combined: routes + consignment + nota)
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
  const [editForm, setEditForm] = useState({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId });
  const { confirm, Dialog } = useConfirm();

  const tagihan = sc.reduce((sum,c) => {
    const p = products.find(x => x.id === c.productId);
    return sum + (p ? (c.deposited - c.remaining) * p.price : 0);
  }, 0);
  const totalRemaining = sc.reduce((s,c) => s + c.remaining, 0);

  // Drop - support multiple products in one nota
  const addDropItem = () => setDropItems(arr => [...arr, { productId:"", quantity:"" }]);
  const updateDropItem = (i, field, val) => setDropItems(arr => arr.map((x,j) => j===i ? {...x, [field]: val} : x));
  const removeDropItem = (i) => setDropItems(arr => arr.length > 1 ? arr.filter((_,j) => j !== i) : arr);

  const dropTotal = dropItems.reduce((sum, it) => {
    if (!it.productId || !it.quantity) return sum;
    const p = products.find(x => x.id === it.productId);
    return sum + (p ? +it.quantity * p.price : 0);
  }, 0);

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
      if (ex) {
        newConsignments = newConsignments.map(c => c.id===ex.id ? {...c, deposited:c.deposited+qty, remaining:c.remaining+qty} : c);
      } else {
        newConsignments = [...newConsignments, { id: uid(), storeId: store.id, productId: it.productId, deposited: qty, remaining: qty, date: dropDate, status: "active" }];
      }
      receiptItems.push({ productId: it.productId, name: product?.name, qty, price: product?.price || 0 });
      total += qty * (product?.price || 0);
    });

    const notaNo = genNotaNo("drop", receiptCounter || 1);
    const newReceipt = {
      id: uid(), notaNo, type: "drop", date: dropDate,
      storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact,
      items: receiptItems, total,
    };
    setData(d => ({
      ...d,
      consignments: newConsignments,
      receipts: [newReceipt, ...(d.receipts||[])],
      receiptCounter: (d.receiptCounter||1) + 1,
    }));
    setPreview(newReceipt);
    setDropItems([{ productId:"", quantity:"" }]);
    setDropDate(today);
    setShowDrop(false);
  };

  // Visit - input either sisa OR terjual, with auto-replenish
  const openVisit = () => {
    setVisitItems(sc.map(c => ({
      ...c,
      soldNow: 0,                  // user inputs how many sold
      sisaNow: c.remaining,        // OR user inputs current stock at store
      replenish: 0,                // auto = soldNow, can be overridden
      replenishManual: false,      // tracks if user overrode replenish
    })));
    setShowVisit(true);
  };

  // When user changes "Terjual" → update sisa + auto-replenish
  const setSold = (i, val) => {
    setVisitItems(arr => arr.map((x,j) => {
      if (j !== i) return x;
      const sold = Math.max(0, Math.min(+val, x.remaining));
      return {
        ...x,
        soldNow: sold,
        sisaNow: x.remaining - sold,
        replenish: x.replenishManual ? x.replenish : sold, // auto-sync unless user overrode
      };
    }));
  };

  // When user changes "Sisa" → update terjual + auto-replenish
  const setSisa = (i, val) => {
    setVisitItems(arr => arr.map((x,j) => {
      if (j !== i) return x;
      const sisa = Math.max(0, Math.min(+val, x.remaining));
      const sold = x.remaining - sisa;
      return {
        ...x,
        sisaNow: sisa,
        soldNow: sold,
        replenish: x.replenishManual ? x.replenish : sold,
      };
    }));
  };

  // When user manually changes "Isi Ulang" → mark as manual
  const setReplenish = (i, val) => {
    setVisitItems(arr => arr.map((x,j) => j===i ? {...x, replenish: Math.max(0, +val), replenishManual: true} : x));
  };

  // Reset replenish back to auto (= soldNow)
  const resetReplenish = (i) => {
    setVisitItems(arr => arr.map((x,j) => j===i ? {...x, replenish: x.soldNow, replenishManual: false} : x));
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
      // New stock: (sisa) + (replenish)
      const newRem = (c.remaining - item.soldNow) + item.replenish;
      // deposited becomes the new "target" stock level
      return {...c, deposited:newRem, remaining:newRem, status:newRem<=0?"closed":"active"};
    });
    if (itemsForReceipt.length > 0) {
      const notaNo = genNotaNo("pay", receiptCounter||1);
      const newReceipt = {
        id: uid(), notaNo, type: "payment", date: today,
        storeId: store.id, storeName: store.name, storeAddress: store.address, storeContact: store.contact,
        items: itemsForReceipt, total,
      };
      setData(d => ({
        ...d,
        transactions: [...newTxs, ...d.transactions],
        consignments: newC,
        receipts: [newReceipt, ...(d.receipts||[])],
        receiptCounter: (d.receiptCounter||1) + 1,
      }));
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

  const askDelStore = () => confirm({
    title: "Hapus Toko?",
    message: `Toko "${store.name}" akan dihapus permanen. Riwayat nota tetap tersimpan.`,
    confirmText: "Ya, Hapus Toko",
    onConfirm: () => { setData(d => ({...d, stores: d.stores.filter(s => s.id !== store.id)})); onBack(); },
  });

  const askDelReceipt = (r) => confirm({
    title: "Hapus Nota?",
    message: `Nota "${r.notaNo}" akan dihapus dari riwayat.`,
    confirmText: "Ya, Hapus",
    onConfirm: () => setData(d => ({...d, receipts: d.receipts.filter(x => x.id !== r.id)})),
  });

  const totalTagihanVisit = (visitItems||[]).reduce((s,item) => {
    const p = products.find(x => x.id === item.productId);
    return s + (p ? item.soldNow * p.price : 0);
  }, 0);

  return (
    <div className="fade-up">
      {/* Back */}
      <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:"var(--accent)", fontSize:14, fontWeight:600, marginBottom:16, padding:"6px 0", cursor:"pointer", fontFamily:"var(--font)" }}>
        ← Kembali ke daftar toko
      </button>

      {/* Store Header Card */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
          <div style={{ width:60, height:60, borderRadius:14, background:(route?.color||"#4F46E5")+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>🏪</div>
          <div style={{ minWidth:0, flex:1 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginBottom:3, wordBreak:"break-word" }}>{store.name}</h2>
            <p style={{ fontSize:13.5, color:"var(--sub)", wordBreak:"break-word" }}>📍 {store.address}</p>
            {store.contact && <p style={{ fontSize:13, color:"var(--sub)", marginTop:2 }}>📱 {store.contact}</p>}
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {route && <Tag color={route.color}>{route.name}</Tag>}
              {totalRemaining > 0 && <Tag color="var(--orange)">{totalRemaining} bks di toko</Tag>}
            </div>
          </div>
        </div>

        {/* Edit/Delete row (below info to avoid overlap) */}
        <div style={{ display:"flex", gap:8, marginBottom:12, paddingBottom:12, borderBottom:"1px solid var(--border)", flexWrap:"wrap" }}>
          <Btn variant="ghost" size="sm" icon="✏️" onClick={() => { setEditForm({ name: store.name, address: store.address, contact: store.contact, routeId: store.routeId }); setShowEdit(true); }}>Edit Info</Btn>
          <Btn variant="danger" size="sm" icon="🗑" onClick={askDelStore}>Hapus Toko</Btn>
        </div>

        {/* Action buttons */}
        <div style={{ display:"grid", gridTemplateColumns: sc.length > 0 ? "1fr 1fr" : "1fr", gap:10 }}>
          <Btn full size="lg" icon="📦" onClick={() => setShowDrop(true)}>Drop Barang</Btn>
          {sc.length > 0 && (
            <Btn full size="lg" variant={tagihan > 0 ? "primary" : "outline"} icon="🤝" onClick={openVisit}>
              {tagihan > 0 ? `Tagih (${fmt(tagihan)})` : "Kunjungi & Catat"}
            </Btn>
          )}
        </div>
      </Card>

      {/* Active consignments — Stok di toko */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <p style={{ fontWeight:700, fontSize:15 }}>📦 Stok di Toko ({sc.length} jenis)</p>
        </div>
        {sc.length === 0 ? (
          <EmptyState icon="📭" title="Belum ada titipan" sub="Tap 'Drop Barang' di atas untuk mulai menitipkan" />
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:10 }}>
            {sc.map(c => {
              const p = products.find(x => x.id === c.productId);
              const stockValue = p ? c.remaining * p.price : 0;
              return (
                <div key={c.id} style={{ background:"var(--bg)", borderRadius:11, padding:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:8 }}>
                    <p style={{ fontWeight:700, fontSize:14.5, flex:1 }}>{p?.name}</p>
                    <Tag color="var(--accent)">{p ? fmt(p.price) : "-"}</Tag>
                  </div>
                  <div style={{ background:"var(--white)", borderRadius:10, padding:"14px 12px", textAlign:"center", border:"1.5px solid var(--border)", marginBottom:10 }}>
                    <p style={{ fontSize:32, fontWeight:800, color:"var(--accent)", lineHeight:1 }}>{c.remaining}</p>
                    <p style={{ fontSize:11, color:"var(--sub)", fontWeight:600, marginTop:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>bks di toko</p>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--sub)" }}>
                    <span>Nilai: <b style={{color:"var(--text)"}}>{fmt(stockValue)}</b></span>
                    <span>Drop: <b style={{color:"var(--text)"}}>{fmtDate(c.date)}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Receipt history */}
      <Card>
        <p style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>🧾 Riwayat Nota ({storeReceipts.length})</p>
        {storeReceipts.length === 0 ? (
          <EmptyState icon="📄" title="Belum ada nota" sub="Nota otomatis dibuat saat drop & tagih" />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {storeReceipts.map(r => (
              <div key={r.id} style={{ background:"var(--bg)", borderRadius:11, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                <div style={{ width:40, height:40, borderRadius:10, background: r.type==="drop" ? "var(--blue-light)":"var(--green-light)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {r.type==="drop" ? "📦" : "💰"}
                </div>
                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <Tag color={r.type==="drop"?"var(--blue)":"var(--green)"}>{r.type==="drop"?"PENITIPAN":"PEMBAYARAN"}</Tag>
                    <span style={{ fontSize:11.5, color:"var(--sub)", fontWeight:600 }}>{r.notaNo}</span>
                  </div>
                  <p style={{ fontSize:12.5, color:"var(--sub)", marginTop:3 }}>{fmtDate(r.date)} · {(r.items||[]).length} item · <b style={{color:r.type==="drop"?"var(--blue)":"var(--green)"}}>{fmt(r.total)}</b></p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn size="sm" variant="outline" onClick={() => setPreview(r)}>👁</Btn>
                  <Btn size="sm" variant="primary" onClick={() => printNota(r, COMPANY)}>🖨️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDelReceipt(r)}>🗑</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Drop modal — multi-product */}
      <Modal show={showDrop} onClose={() => setShowDrop(false)} title={`Drop Barang ke ${store.name}`} wide>
        <FG label="Tanggal Drop">
          <input type="date" value={dropDate} onChange={e=>setDropDate(e.target.value)} />
        </FG>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>Daftar Barang yang Dititipkan</label>
          {dropItems.map((item, i) => {
            const p = products.find(x => x.id === item.productId);
            const subtotal = p && item.quantity ? +item.quantity * p.price : 0;
            return (
              <div key={i} style={{ background:"var(--bg)", borderRadius:12, padding:12, marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <p style={{ fontSize:12.5, fontWeight:700, color:"var(--sub)" }}>Barang #{i+1}</p>
                  {dropItems.length > 1 && (
                    <Btn size="sm" variant="danger" onClick={() => removeDropItem(i)}>🗑</Btn>
                  )}
                </div>
                <div style={{ display:"grid", gridTemplateColumns: "2fr 1fr", gap:8, marginBottom: subtotal > 0 ? 8 : 0 }}>
                  <select value={item.productId} onChange={e => updateDropItem(i, "productId", e.target.value)}>
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({fmt(p.price)})</option>)}
                  </select>
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateDropItem(i, "quantity", e.target.value)} min={1} style={{ textAlign:"center" }} />
                </div>
                {subtotal > 0 && (
                  <p style={{ fontSize:12.5, color:"var(--sub)", textAlign:"right" }}>
                    Subtotal: <b style={{ color:"var(--accent)" }}>{fmt(subtotal)}</b>
                  </p>
                )}
              </div>
            );
          })}
          <Btn variant="outline" full icon="+" onClick={addDropItem}>Tambah Barang Lain</Btn>
        </div>

        {dropTotal > 0 && (
          <div style={{ background:"var(--accent-light)", border:"2px solid var(--accent)", borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p style={{ fontWeight:700, fontSize:14 }}>Total Nilai Titipan</p>
            <p style={{ fontSize:20, fontWeight:800, color:"var(--accent)" }}>{fmt(dropTotal)}</p>
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowDrop(false)}>Batal</Btn>
          <Btn full onClick={drop}>Drop & Buat Nota</Btn>
        </div>
      </Modal>

      {/* Visit modal — matches user's actual workflow */}
      <Modal show={showVisit} onClose={() => setShowVisit(false)} title={`Kunjungan: ${store.name}`} wide>
        <div style={{ background:"var(--accent-light)", border:"1.5px solid #C7D2FE", borderRadius:10, padding:"12px 14px", marginBottom:18, fontSize:13.5, color:"var(--text-2)", lineHeight:1.55 }}>
          <p style={{ fontWeight:700, marginBottom:4, color:"var(--accent)" }}>📋 Cara Pakai</p>
          <p>1. Hitung <b>sisa fisik</b> tiap produk di toko, isi di kolom <b>SISA</b>.</p>
          <p>2. Sistem hitung otomatis yang <b>laku</b> = tagihan pemilik toko.</p>
          <p>3. <b>Isi ulang</b> otomatis = jumlah yang laku, supaya stok kembali seperti semula.</p>
        </div>
        {visitItems.map((item,i) => {
          const p = products.find(x=>x.id===item.productId);
          const stokAkhir = item.sisaNow + item.replenish;
          return (
            <div key={item.id} style={{ background:"var(--bg)", borderRadius:12, padding:16, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:6 }}>
                <p style={{ fontWeight:800, fontSize:16 }}>{p?.name}</p>
                <Tag color="var(--sub)">Stok awal: {item.remaining} bks</Tag>
              </div>

              {/* STEP 1: SISA (main input) */}
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--orange)", textTransform:"uppercase", marginBottom:6 }}>
                  📍 1. Hitung Sisa Fisik di Toko
                </p>
                <input type="number" value={item.sisaNow} min={0} max={item.remaining}
                  onChange={e => setSisa(i, e.target.value)}
                  style={{ textAlign:"center", fontSize:30, fontWeight:800, color:"var(--orange)", padding:"14px", background:"var(--white)", border:"2px solid var(--orange)" }} />
              </div>

              {/* STEP 2: Auto-calculated TERJUAL */}
              <div style={{ background:"var(--green-light)", border:"1.5px solid #A7F3D0", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <div>
                    <p style={{ fontSize:11.5, fontWeight:700, color:"var(--green)", textTransform:"uppercase" }}>💚 2. Yang Laku (Otomatis)</p>
                    <p style={{ fontSize:11.5, color:"var(--sub)", marginTop:2 }}>{item.remaining} stok awal − {item.sisaNow} sisa</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:26, fontWeight:800, color:"var(--green)", lineHeight:1 }}>{item.soldNow} bks</p>
                    {p && <p style={{ fontSize:13, fontWeight:700, color:"var(--green)", marginTop:3 }}>= {fmt(item.soldNow * p.price)}</p>}
                  </div>
                </div>
              </div>

              {/* STEP 3: Replenish (auto, manual override) */}
              <div style={{ background:"var(--white)", border:"1.5px solid var(--border)", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:6 }}>
                  <p style={{ fontSize:11.5, fontWeight:700, color:"var(--accent)", textTransform:"uppercase" }}>
                    📦 3. Isi Ulang {item.replenishManual ? "(manual)" : "(auto)"}
                  </p>
                  {item.replenishManual && (
                    <button onClick={() => resetReplenish(i)} style={{ background:"var(--accent-light)", border:"1px solid var(--accent)", color:"var(--accent)", fontSize:11, fontWeight:700, cursor:"pointer", padding:"3px 10px", borderRadius:6, fontFamily:"var(--font)" }}>↺ Reset Auto</button>
                  )}
                </div>
                <input type="number" value={item.replenish} min={0}
                  onChange={e => setReplenish(i, e.target.value)}
                  style={{ textAlign:"center", fontSize:22, fontWeight:800, color:"var(--accent)", padding:"11px" }} />
                <p style={{ fontSize:12, color:"var(--sub)", marginTop:6, lineHeight:1.4 }}>
                  {item.replenishManual
                    ? `Anda ubah manual jadi ${item.replenish} bks. Tap "↺ Reset Auto" untuk kembali ke jumlah yang laku.`
                    : `Otomatis = jumlah yang laku (${item.soldNow}), supaya stok kembali ke ${item.remaining} bks.`}
                </p>
              </div>

              {/* Final summary */}
              <div style={{ marginTop:12, padding:"10px 14px", background:"var(--white)", borderRadius:10, border:"1.5px dashed var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
                <span style={{ fontSize:12.5, color:"var(--sub)" }}>Stok akhir di toko setelah kunjungan:</span>
                <span style={{ fontSize:18, fontWeight:800, color: stokAkhir === item.remaining ? "var(--green)" : "var(--accent)" }}>
                  {stokAkhir} bks
                  {stokAkhir === item.remaining && <span style={{ fontSize:11, marginLeft:6, color:"var(--green)" }}>✓ kembali ke awal</span>}
                </span>
              </div>
            </div>
          );
        })}

        <div style={{ background:"var(--accent)", borderRadius:12, padding:"16px 20px", marginBottom:16, color:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <p style={{ fontSize:13.5, opacity:0.9 }}>💰 Setoran Pemilik Toko</p>
            <p style={{ fontSize:26, fontWeight:800 }}>{fmt(totalTagihanVisit)}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowVisit(false)}>Batal</Btn>
          <Btn full onClick={confirmVisit}>✓ Konfirmasi & Buat Nota</Btn>
        </div>
      </Modal>

      {/* Edit store modal */}
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
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowEdit(false)}>Batal</Btn>
          <Btn full onClick={saveEdit}>Simpan</Btn>
        </div>
      </Modal>

      <NotaPreviewModal receipt={preview} onClose={() => setPreview(null)} />
      <Dialog />
    </div>
  );
}

// Swipeable card with swipe-left-to-delete on touch devices
function SwipeableStoreCard({ store, route, sc, products, totalRem, totalOwed, onTap, onDelete }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isHorizontalSwipe = useRef(false);
  const cardRef = useRef(null);
  const ACTION_WIDTH = 90;
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Determine direction lock on first significant movement
    if (!isHorizontalSwipe.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
    }

    if (!isHorizontalSwipe.current) return;

    // Allow only left swipe (negative dx) from rest, or right swipe when open
    let newOffset = isOpen ? -ACTION_WIDTH + dx : dx;
    newOffset = Math.min(0, newOffset);                  // never positive
    newOffset = Math.max(-ACTION_WIDTH - 30, newOffset);  // limit overshoot
    setOffsetX(newOffset);
  };

  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current) {
      // Wasn't a horizontal swipe — keep current state
      setOffsetX(isOpen ? -ACTION_WIDTH : 0);
    } else {
      // Snap based on threshold
      if (offsetX < -SWIPE_THRESHOLD) {
        setOffsetX(-ACTION_WIDTH);
        setIsOpen(true);
      } else {
        setOffsetX(0);
        setIsOpen(false);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCardClick = (e) => {
    // If swiped open, first tap closes it
    if (isOpen) {
      e.stopPropagation();
      setOffsetX(0);
      setIsOpen(false);
      return;
    }
    // Only trigger tap if no significant movement happened
    if (isHorizontalSwipe.current) return;
    onTap();
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r)" }}>
      {/* Delete background (revealed on swipe) */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: ACTION_WIDTH,
        background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 4, color: "#fff", fontWeight: 700,
      }}
        onClick={() => { setOffsetX(0); setIsOpen(false); onDelete(); }}>
        <span style={{ fontSize: 22 }}>🗑</span>
        <span style={{ fontSize: 12 }}>Hapus</span>
      </div>

      {/* Card content */}
      <div ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: touchStartX.current == null ? "transform 0.25s ease" : "none",
          background: "var(--white)", borderRadius: "var(--r)",
          border: "1.5px solid var(--border)", boxShadow: "var(--shadow-sm)",
          padding: 20, cursor: "pointer",
          touchAction: "pan-y",
        }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:(route?.color||"#4F46E5")+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🏪</div>
          <div style={{ minWidth:0, flex:1 }}>
            <p style={{ fontWeight:700, fontSize:16, lineHeight:1.2 }}>{store.name}</p>
            <p style={{ fontSize:13, color:"var(--sub)", marginTop:2 }}>{store.address}</p>
          </div>
          <span style={{ color:"var(--accent)", fontSize:20, opacity:0.6 }}>→</span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: sc.length > 0 ? 12 : 0 }}>
          {route && <Tag color={route.color}>{route.name}</Tag>}
          {totalRem > 0 && <Tag color="var(--orange)">{totalRem} bks</Tag>}
          {totalOwed > 0 && <Tag color="var(--yellow)">💰 {fmt(totalOwed)}</Tag>}
          {sc.length === 0 && <Tag color="var(--sub)">Kosong</Tag>}
        </div>
        {sc.length > 0 && (
          <div style={{ background:"var(--bg)", borderRadius:9, padding:"8px 12px", fontSize:12.5, color:"var(--sub)" }}>
            {sc.length} produk dititipkan
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STORES PAGE (combined: routes + stores list)
// ─────────────────────────────────────────────
function Stores({ data, setData, setPage, selectedStoreId, setSelectedStoreId }) {
  const { routes, stores, consignments, products } = data;
  const [selRoute, setSelRoute] = useState(null);
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [sf, setSf] = useState({ name:"",address:"",contact:"",routeId:"" });
  const [rf, setRf] = useState({ name:"",color:"#4F46E5",days:[] });
  const { confirm, Dialog } = useConfirm();

  // If a store is selected, show its detail
  if (selectedStoreId) {
    const store = stores.find(s => s.id === selectedStoreId);
    if (store) {
      return <StoreDetail store={store} data={data} setData={setData} onBack={() => setSelectedStoreId(null)} />;
    }
  }

  const addStore = () => {
    if (!sf.name || !sf.routeId) return;
    setData(d => ({...d, stores:[...d.stores,{id:uid(),...sf}]}));
    setSf({name:"",address:"",contact:"",routeId:""}); setShowAddStore(false);
  };
  const addRoute = () => {
    if (!rf.name) return;
    setData(d => ({...d, routes:[...d.routes,{id:uid(),...rf}]}));
    setRf({name:"",color:"#4F46E5",days:[]}); setShowAddRoute(false);
  };
  const askDelRoute = (r) => {
    const cnt = stores.filter(s => s.routeId === r.id).length;
    confirm({
      title: "Hapus Rute?",
      message: `Rute "${r.name}" akan dihapus.${cnt > 0 ? ` ${cnt} toko di rute ini akan kehilangan rute-nya.` : ""}`,
      confirmText: "Ya, Hapus Rute",
      onConfirm: () => { setData(d => ({...d, routes: d.routes.filter(x => x.id !== r.id)})); if(selRoute===r.id) setSelRoute(null); },
    });
  };
  const askDelStore = (s) => {
    const hasConsignments = consignments.some(c => c.storeId === s.id && c.status === "active");
    confirm({
      title: "Hapus Toko?",
      message: `Toko "${s.name}" akan dihapus permanen.${hasConsignments ? " ⚠️ Toko ini masih punya titipan aktif!" : ""} Riwayat nota tetap tersimpan.`,
      confirmText: "Ya, Hapus Toko",
      onConfirm: () => setData(d => ({...d, stores: d.stores.filter(x => x.id !== s.id)})),
    });
  };
  const toggleDay = (day) => setRf(f => ({...f,days:f.days.includes(day)?f.days.filter(d=>d!==day):[...f.days,day]}));

  const shown = selRoute ? stores.filter(s => s.routeId === selRoute) : stores;
  const COLORS = ["#4F46E5","#EF4444","#10B981","#F59E0B","#3B82F6","#F97316","#8B5CF6"];

  return (
    <div className="fade-up">
      <SectionHeader title="Daftar Toko" sub="Tap toko untuk drop barang, tagih, & cetak nota"
        action={<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" size="sm" icon="+" onClick={() => setShowAddRoute(true)}>Rute Baru</Btn>
          <Btn icon="+" onClick={() => setShowAddStore(true)}>Tambah Toko</Btn>
        </div>} />

      {/* Route filter chips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={() => setSelRoute(null)}
          style={{ padding:"9px 16px", borderRadius:99, border:`1.5px solid ${!selRoute?"var(--accent)":"var(--border)"}`, background:!selRoute?"var(--accent)":"var(--white)", color:!selRoute?"#fff":"var(--text-2)", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)" }}>
          Semua Toko ({stores.length})
        </button>
        {routes.map(r => {
          const cnt = stores.filter(s => s.routeId === r.id).length;
          const isTdy = r.days.includes(todayDay);
          const isActive = selRoute === r.id;
          return (
            <button key={r.id} onClick={() => setSelRoute(r.id)}
              style={{ padding:"9px 16px", borderRadius:99, border:`1.5px solid ${isActive?r.color:"var(--border)"}`, background:isActive?r.color:"var(--white)", color:isActive?"#fff":"var(--text-2)", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"var(--font)", display:"inline-flex", alignItems:"center", gap:6 }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:isActive?"#fff":r.color,display:"inline-block"}}/>
              {r.name} ({cnt})
              {isTdy && <span style={{fontSize:11,background:isActive?"rgba(255,255,255,0.25)":"var(--green-light)",color:isActive?"#fff":"var(--green)",padding:"1px 7px",borderRadius:99,fontWeight:700}}>Hari Ini</span>}
              <span onClick={e=>{e.stopPropagation();askDelRoute(r)}} style={{marginLeft:4,opacity:0.6,fontSize:13}}>✕</span>
            </button>
          );
        })}
      </div>

      {/* Hint for swipe */}
      {shown.length > 0 && (
        <div style={{ background:"var(--bg)", border:"1px dashed var(--border)", borderRadius:10, padding:"8px 14px", marginBottom:12, fontSize:12.5, color:"var(--sub)", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14 }}>💡</span>
          <span>Tap toko untuk masuk. <b>Geser kiri</b> untuk hapus toko.</span>
        </div>
      )}

      {/* Store cards - CLICKABLE + SWIPEABLE */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {shown.map(s => {
          const route = routes.find(r => r.id === s.routeId);
          const sc = consignments.filter(c => c.storeId === s.id && c.status === "active");
          const totalOwed = sc.reduce((sum,c) => {
            const p = products.find(x => x.id === c.productId);
            return sum + (p ? (c.deposited-c.remaining)*p.price : 0);
          }, 0);
          const totalRem = sc.reduce((sum,c) => sum + c.remaining, 0);
          return (
            <SwipeableStoreCard
              key={s.id}
              store={s}
              route={route}
              sc={sc}
              products={products}
              totalRem={totalRem}
              totalOwed={totalOwed}
              onTap={() => setSelectedStoreId(s.id)}
              onDelete={() => askDelStore(s)}
            />
          );
        })}
        {shown.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon="🏪" title="Belum ada toko" sub="Tambah toko baru ke rute ini" /></Card>}
      </div>

      {/* Add Store */}
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
        <div style={{display:"flex",gap:10}}><Btn full variant="ghost" onClick={()=>setShowAddStore(false)}>Batal</Btn><Btn full onClick={addStore}>Simpan</Btn></div>
      </Modal>

      {/* Add Route */}
      <Modal show={showAddRoute} onClose={() => setShowAddRoute(false)} title="Buat Rute Baru">
        <FG label="Nama Rute"><input placeholder="Rute Selatan" value={rf.name} onChange={e=>setRf(f=>({...f,name:e.target.value}))} /></FG>
        <FG label="Warna Rute">
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {COLORS.map(c=>(
              <div key={c} onClick={()=>setRf(f=>({...f,color:c}))} style={{width:34,height:34,borderRadius:10,background:c,cursor:"pointer",border:rf.color===c?"3px solid #111":"3px solid transparent"}} />
            ))}
          </div>
        </FG>
        <FG label="Hari Kunjungan">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {dayNames.slice(1).map(d=>(
              <button key={d} onClick={()=>toggleDay(d)} style={{padding:"7px 13px",borderRadius:8,border:`1.5px solid ${rf.days.includes(d)?"var(--accent)":"var(--border)"}`,background:rf.days.includes(d)?"var(--accent)":"var(--white)",color:rf.days.includes(d)?"#fff":"var(--text-2)",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>{d}</button>
            ))}
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
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16, color: "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "1px" }}>{COMPANY.name}</p>
            <p style={{ fontSize: 12, fontWeight: 600 }}>{COMPANY.tagline}</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{COMPANY.address}</p>
            <p style={{ fontSize: 11, color: "#555" }}>HP/WA: {COMPANY.phone}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "inline-block", background: "#000", color: "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              {isDrop ? "NOTA PENITIPAN" : "NOTA PEMBAYARAN"}
            </span>
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
          <span style={{ color: "#555" }}>Terbilang: </span>
          <strong>{terbilang(receipt.total).replace(/^./, c => c.toUpperCase())} Rupiah</strong>
        </div>
        <div style={{ fontSize: 11, color: "#444", background: "#fafafa", padding: "8px 10px", borderLeft: "3px solid #888", marginBottom: 14 }}>
          {isDrop
            ? <><strong>Sistem Titip Jual:</strong> Barang dititipkan untuk dijual. Pembayaran dilakukan saat kunjungan berikutnya berdasarkan jumlah yang terjual.</>
            : <><strong>Pembayaran Lunas</strong> atas barang titip jual yang telah terjual. Terima kasih atas kerjasamanya.</>}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20, fontSize: 11.5 }}>
          <div style={{ textAlign:"center", flex:1 }}>
            <p style={{ marginBottom:42 }}>{receipt.storeName}</p>
            <div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div>
          </div>
          <div style={{ textAlign:"center", flex:1 }}>
            <p style={{ marginBottom:42 }}>Hormat Kami,<br/>{COMPANY.name}</p>
            <div style={{ borderTop:"1px solid #000", paddingTop:4, fontWeight:700 }}>( ........................ )</div>
          </div>
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

  const filtered = receipts.filter(r => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStore !== "all" && r.storeId !== filterStore) return false;
    return true;
  });

  const askDelete = (r) => {
    confirm({
      title: "Hapus Nota?",
      message: `Nota "${r.notaNo}" untuk ${r.storeName} akan dihapus dari riwayat. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: "Ya, Hapus",
      onConfirm: () => setData(d => ({ ...d, receipts: d.receipts.filter(x => x.id !== r.id) })),
    });
  };

  const allStores = [...new Set(receipts.map(r => r.storeId))]
    .map(id => receipts.find(r => r.storeId === id))
    .filter(Boolean);

  const totalDrop = receipts.filter(r=>r.type==="drop").reduce((s,r)=>s+(r.total||0),0);
  const totalPay = receipts.filter(r=>r.type==="payment").reduce((s,r)=>s+(r.total||0),0);

  return (
    <div className="fade-up">
      <SectionHeader title="🧾 Nota & Bukti" sub="Riwayat nota penitipan & pembayaran" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Nota" value={receipts.length} icon="🧾" color="var(--accent)" />
        <StatCard label="Nota Penitipan" value={receipts.filter(r=>r.type==="drop").length} sub={fmt(totalDrop)} icon="📦" color="var(--blue)" />
        <StatCard label="Nota Pembayaran" value={receipts.filter(r=>r.type==="payment").length} sub={fmt(totalPay)} icon="💰" color="var(--green)" />
      </div>

      <Card style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--sub)", fontWeight: 600 }}>Filter:</span>
          {[["all","Semua"],["drop","Penitipan"],["payment","Pembayaran"]].map(([v,l]) => (
            <Btn key={v} size="sm" variant={filterType===v?"primary":"ghost"} onClick={() => setFilterType(v)}>{l}</Btn>
          ))}
          {allStores.length > 0 && (
            <select value={filterStore} onChange={e=>setFilterStore(e.target.value)} style={{ width: "auto", minWidth: 140, padding: "7px 12px", fontSize: 13 }}>
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
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: r.type==="drop" ? "var(--blue-light)" : "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {r.type==="drop" ? "📦" : "💰"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <Tag color={r.type==="drop" ? "var(--blue)" : "var(--green)"}>
                        {r.type==="drop" ? "NOTA PENITIPAN" : "NOTA PEMBAYARAN"}
                      </Tag>
                      <span style={{ fontSize: 12, color: "var(--sub)", fontWeight: 600 }}>{r.notaNo}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 2 }}>{r.storeName}</p>
                    <p style={{ fontSize: 12.5, color: "var(--sub)" }}>{fmtDate(r.date)} · {(r.items||[]).length} item</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: r.type==="drop" ? "var(--blue)" : "var(--green)", marginTop: 6 }}>{fmt(r.total)}</p>
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
  const askDel = (n) => confirm({
    title: "Hapus Catatan?",
    message: `Catatan tanggal ${fmtDate(n.date)} akan dihapus permanen.`,
    confirmText: "Ya, Hapus",
    onConfirm: () => setData(d => ({...d, notes: d.notes.filter(x => x.id !== n.id)})),
  });
  const togglePin = (id) => setData(d => ({...d, notes: d.notes.map(n => n.id===id ? {...n, pinned: !n.pinned} : n)}));

  const sorted = [...notes].sort((a,b) => { if (a.pinned && !b.pinned) return -1; if (!a.pinned && b.pinned) return 1; return b.date.localeCompare(a.date); });

  return (
    <div className="fade-up">
      <SectionHeader title="Catatan Harian" sub="Simpan memo, rencana, dan pengingat"
        action={<Btn icon="+" onClick={() => { setForm({content:"",date:today,pinned:false}); setEditId(null); setShowAdd(true); }}>Catatan Baru</Btn>} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {sorted.map(n => (
          <Card key={n.id} style={{ background: n.pinned ? "var(--yellow-light)" : "var(--white)", borderColor: n.pinned ? "#FDE68A" : "var(--border)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <p style={{ fontSize:12.5,color:"var(--sub)",fontWeight:600 }}>{fmtDate(n.date)}</p>
              <div style={{ display:"flex",gap:6 }}>
                <button onClick={() => togglePin(n.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:15,opacity:n.pinned?1:0.35 }}>📌</button>
                <button onClick={() => { setForm({content:n.content,date:n.date,pinned:n.pinned}); setEditId(n.id); setShowAdd(true); }} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>✏️</button>
                <button onClick={() => askDel(n)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>🗑</button>
              </div>
            </div>
            <p style={{ fontSize:14.5,lineHeight:1.65,whiteSpace:"pre-wrap" }}>{n.content}</p>
          </Card>
        ))}
        {notes.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon="📓" title="Belum ada catatan" sub="Tulis catatan pertama Anda" /></Card>}
      </div>

      <Modal show={showAdd} onClose={()=>setShowAdd(false)} title={editId ? "Edit Catatan" : "Catatan Baru"}>
        <FG label="Tanggal"><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></FG>
        <FG label="Isi Catatan">
          <textarea rows={5} placeholder="Tulis catatanmu..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} style={{resize:"vertical"}} />
        </FG>
        <label style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer" }}>
          <input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))} style={{width:"auto"}} />
          <span style={{fontSize:13.5,color:"var(--text-2)"}}>📌 Pin catatan ini di dashboard</span>
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
  const askDel = (p) => confirm({
    title: "Hapus Produk?",
    message: `Produk "${p.name}" akan dihapus. Titipan yang sudah ada di toko tidak ikut terhapus, tapi tidak bisa drop produk ini lagi.`,
    confirmText: "Ya, Hapus",
    onConfirm: () => setData(d => ({...d, products: d.products.filter(x => x.id !== p.id)})),
  });

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
                <div style={{ width:48,height:48,borderRadius:12,background:"var(--accent-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>🍟</div>
                <div style={{ display:"flex",gap:6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setForm({name:p.name,price:p.price,costPrice:p.costPrice}); setEditId(p.id); setShowAdd(true); }}>✏️</Btn>
                  <Btn size="sm" variant="danger" onClick={() => askDel(p)}>🗑</Btn>
                </div>
              </div>
              <p style={{ fontWeight:700,fontSize:15.5,marginBottom:5 }}>{p.name}</p>
              <p style={{ fontSize:22,fontWeight:800,color:"var(--accent)",marginBottom:10 }}>{fmt(p.price)}</p>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {p.costPrice > 0 && <Tag color="var(--yellow)">HPP {fmt(p.costPrice)}</Tag>}
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
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [data, setData] = useLocalStorage("kriuk_v5", INIT);
  const [page, setPage] = useState("dashboard");
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  // Reset store selection when navigating away
  const navigate = (p) => {
    setPage(p);
    if (p !== "stores") setSelectedStoreId(null);
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
      default: return null;
    }
  };

  const tdyDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long" });

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 500,
          background: "rgba(247,248,251,0.85)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 0",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }} className="brand-area">
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, boxShadow: "0 4px 12px rgba(79,70,229,0.3)", flexShrink: 0 }}>🍟</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>{COMPANY.name}</p>
                  <p className="brand-subtitle" style={{ fontSize: 11, color: "var(--sub)", lineHeight: 1.1, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{COMPANY.tagline}</p>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <OverflowMenu page={page} setPage={navigate} />
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }} className="date-display">
              <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{todayDay}</p>
              <p style={{ fontSize: 11.5, color: "var(--sub)" }}>{tdyDate}</p>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px", overflowX: "hidden" }}>
          {renderPage()}
        </main>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .date-display { display: none !important; }
        }
        @media (max-width: 480px) {
          .brand-subtitle { display: none !important; }
          .brand-area { gap: 8px !important; }
        }
      `}</style>
    </>
  );
}
