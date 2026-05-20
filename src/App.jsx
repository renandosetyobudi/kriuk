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
  body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
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
    { id: "c1", storeId: "s1", productId: "p1", deposited: 10, remaining: 7, date: "2026-05-13", status: "active" },
    { id: "c2", storeId: "s1", productId: "p2", deposited: 8, remaining: 5, date: "2026-05-13", status: "active" },
    { id: "c3", storeId: "s2", productId: "p1", deposited: 12, remaining: 9, date: "2026-05-14", status: "active" },
    { id: "c4", storeId: "s3", productId: "p3", deposited: 15, remaining: 10, date: "2026-05-14", status: "active" },
    { id: "c5", storeId: "s4", productId: "p4", deposited: 10, remaining: 8, date: "2026-05-15", status: "active" },
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
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function printHtml(html) {
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Snack Kriuk</title>
  <style>
    body{font-family:sans-serif;padding:28px;color:#111;font-size:13px;}
    table{width:100%;border-collapse:collapse;margin-top:8px;}
    th,td{border:1px solid #ddd;padding:8px 10px;text-align:left;font-size:12px;}
    th{background:#f5f5f5;font-weight:700;}
  </style></head><body>${html}</body></html>`);
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
  if (!show) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.4)", backdropFilter: "blur(4px)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="fade-up" onClick={e => e.stopPropagation()}
        style={{ background: "var(--white)", borderRadius: 18, padding: 26, width: "100%", maxWidth: wide ? 660 : 480,
          maxHeight: "92vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{title}</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--sub)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {children}
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
    { id: "routes", label: "Rute & Toko", icon: "🗺️", desc: "Jadwal kunjungan" },
    { id: "consignment", label: "Titip Jual", icon: "📦", desc: "Drop & tagih barang" },
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
        <div className="slide-down" style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          background: "var(--white)", border: "1.5px solid var(--border)",
          borderRadius: 16, boxShadow: "var(--shadow-lg)",
          minWidth: 280, zIndex: 800, overflow: "hidden", padding: 6,
        }}>
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
        <div onClick={() => setPage("routes")} style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: "var(--r)", padding: "18px 22px", marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 24px rgba(79,70,229,0.25)" }}>
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
        <StatCard label="Toko Aktif" value={stores.length} icon="🏪" color="var(--blue)" onClick={() => setPage("routes")} />
        <StatCard label="Titipan Beredar" value={`${activeC.length} item`} icon="📦" color="var(--orange)" onClick={() => setPage("consignment")} />
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
          <Card onClick={() => setPage("consignment")} style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "var(--sub)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>Stok Hampir Habis</p>
            {activeC.filter(c => c.remaining / c.deposited < 0.4).slice(0, 4).map(c => {
              const s = stores.find(x => x.id === c.storeId);
              const p = products.find(x => x.id === c.productId);
              return (
                <div key={c.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s?.name}</span>
                    <Tag color="var(--red)">{c.remaining} sisa</Tag>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--sub)", marginBottom: 5 }}>{p?.name}</p>
                  <ProgressBar value={c.remaining} max={c.deposited} />
                </div>
              );
            })}
            {activeC.filter(c => c.remaining / c.deposited < 0.4).length === 0 && (
              <p style={{ fontSize: 13.5, color: "var(--sub)", textAlign: "center", padding: "16px 0" }}>✅ Semua stok aman</p>
            )}
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
// FINANCE
// ─────────────────────────────────────────────
function Finance({ data, setData }) {
  const { transactions } = data;
  const [tab, setTab] = useState("ringkasan");
  const [period, setPeriod] = useState("bulanan");
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState({ type: "income", category: "Penjualan", amount: "", date: today, note: "" });

  const inCats = ["Penjualan","Bonus","Lain-lain"];
  const exCats = ["Produksi","Transport","Kemasan","Gaji","Sewa","Listrik","Lain-lain"];

  const add = () => {
    if (!form.amount || !form.date) return;
    setData(d => ({ ...d, transactions: [{ id: uid(), ...form, amount: +form.amount }, ...d.transactions] }));
    setForm({ type: "income", category: "Penjualan", amount: "", date: today, note: "" });
    setShowAdd(false);
  };

  const del = (id) => setData(d => ({ ...d, transactions: d.transactions.filter(t => t.id !== id) }));

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

  const filtered = typeFilter === "all" ? transactions : transactions.filter(t => t.type === typeFilter);

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
                { l:"Omset Bulan Ini", v:fmt(totalIn), c:"var(--green)", bg:"var(--green-light)", icon:"💚" },
                { l:"Pengeluaran Bulan Ini", v:fmt(totalEx), c:"var(--red)", bg:"var(--red-light)", icon:"🔴" },
                { l:"Laba Bersih", v:fmt(totalIn-totalEx), c:"var(--accent)", bg:"var(--accent-light)", icon:"✨" },
              ].map(x => (
                <div key={x.l} style={{ background: x.bg, borderRadius: "var(--r)", padding: 20, border: "1.5px solid " + x.c + "33" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{x.icon}</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: x.c }}>{x.l}</p>
                  </div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: x.c }}>{x.v}</p>
                </div>
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
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["all","Semua"],["income","Pemasukan"],["expense","Pengeluaran"]].map(([v,l]) => (
                <Btn key={v} size="sm" variant={typeFilter===v?"primary":"ghost"} onClick={() => setTypeFilter(v)}>{l}</Btn>
              ))}
            </div>
            <Card style={{ padding: "4px 18px" }}>
              {filtered.length === 0 && <EmptyState icon="📭" title="Belum ada transaksi" sub="Catat transaksi pertama Anda" />}
              {filtered.map(t => (
                <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, minWidth: 0, flex: 1 }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:t.type==="income"?"var(--green-light)":"var(--red-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:t.type==="income"?"var(--green)":"var(--red)",fontWeight:800 }}>
                      {t.type==="income"?"↑":"↓"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize:14.5,fontWeight:600, overflow: "hidden", textOverflow: "ellipsis" }}>{t.note||t.category}</p>
                      <div style={{ display:"flex",gap:8,marginTop:4,alignItems:"center" }}>
                        <span style={{ fontSize:12.5,color:"var(--sub)" }}>{fmtDate(t.date)}</span>
                        <Tag color={t.type==="income"?"var(--green)":"var(--red)"}>{t.category}</Tag>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:10, marginLeft: 12 }}>
                    <p style={{ fontWeight:700,fontSize:15,color:t.type==="income"?"var(--green)":"var(--red)",whiteSpace:"nowrap" }}>
                      {t.type==="income"?"+":"−"}{fmt(t.amount)}
                    </p>
                    <Btn size="sm" variant="danger" onClick={() => del(t.id)}>🗑</Btn>
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
    </div>
  );
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
function Routes({ data, setData }) {
  const { routes, stores, consignments, products } = data;
  const [selRoute, setSelRoute] = useState(null);
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [sf, setSf] = useState({ name:"",address:"",contact:"",routeId:"" });
  const [rf, setRf] = useState({ name:"",color:"#4F46E5",days:[] });

  const addStore = () => {
    if (!sf.name||!sf.routeId) return;
    setData(d => ({...d, stores:[...d.stores,{id:uid(),...sf}]}));
    setSf({name:"",address:"",contact:"",routeId:""}); setShowAddStore(false);
  };
  const addRoute = () => {
    if (!rf.name) return;
    setData(d => ({...d, routes:[...d.routes,{id:uid(),...rf}]}));
    setRf({name:"",color:"#4F46E5",days:[]}); setShowAddRoute(false);
  };
  const delStore = (id) => setData(d => ({...d,stores:d.stores.filter(s=>s.id!==id)}));
  const delRoute = (id) => { setData(d => ({...d,routes:d.routes.filter(r=>r.id!==id)})); if(selRoute===id) setSelRoute(null); };
  const toggleDay = (day) => setRf(f => ({...f,days:f.days.includes(day)?f.days.filter(d=>d!==day):[...f.days,day]}));

  const shown = selRoute ? stores.filter(s => s.routeId === selRoute) : stores;
  const COLORS = ["#4F46E5","#EF4444","#10B981","#F59E0B","#3B82F6","#F97316","#8B5CF6"];

  return (
    <div className="fade-up">
      <SectionHeader title="Rute & Toko" sub="Atur rute kunjungan dan daftar toko"
        action={<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn variant="ghost" size="sm" icon="+" onClick={() => setShowAddRoute(true)}>Rute Baru</Btn>
          <Btn icon="+" onClick={() => setShowAddStore(true)}>Tambah Toko</Btn>
        </div>} />

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={() => setSelRoute(null)}
          style={{ padding:"9px 16px",borderRadius:99,border:`1.5px solid ${!selRoute?"var(--accent)":"var(--border)"}`,background:!selRoute?"var(--accent)":"var(--white)",color:!selRoute?"#fff":"var(--text-2)",fontWeight:600,fontSize:13.5,cursor:"pointer",fontFamily:"var(--font)" }}>
          Semua Toko ({stores.length})
        </button>
        {routes.map(r => {
          const cnt = stores.filter(s => s.routeId === r.id).length;
          const isTdy = r.days.includes(todayDay);
          const isActive = selRoute === r.id;
          return (
            <button key={r.id} onClick={() => setSelRoute(r.id)}
              style={{ padding:"9px 16px",borderRadius:99,border:`1.5px solid ${isActive?r.color:"var(--border)"}`,background:isActive?r.color:"var(--white)",color:isActive?"#fff":"var(--text-2)",fontWeight:600,fontSize:13.5,cursor:"pointer",fontFamily:"var(--font)",display:"inline-flex",alignItems:"center",gap:6 }}>
              <span style={{width:8,height:8,borderRadius:"50%",background:isActive?"#fff":r.color,display:"inline-block"}}/>
              {r.name} ({cnt})
              {isTdy && <span style={{fontSize:11,background:isActive?"rgba(255,255,255,0.25)":"var(--green-light)",color:isActive?"#fff":"var(--green)",padding:"1px 7px",borderRadius:99,fontWeight:700}}>Hari Ini</span>}
              <span onClick={e=>{e.stopPropagation();delRoute(r.id)}} style={{marginLeft:4,opacity:0.6,fontSize:13}}>✕</span>
            </button>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
        {shown.map(s => {
          const route = routes.find(r => r.id === s.routeId);
          const sc = consignments.filter(c => c.storeId === s.id && c.status === "active");
          const totalOwed = sc.reduce((sum,c) => {
            const p = products.find(x => x.id === c.productId);
            return sum + (p ? (c.deposited-c.remaining)*p.price : 0);
          }, 0);
          return (
            <Card key={s.id}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12,minWidth:0,flex:1 }}>
                  <div style={{ width:44,height:44,borderRadius:11,background:(route?.color||"#4F46E5")+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>🏪</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight:700,fontSize:15.5,lineHeight:1.3 }}>{s.name}</p>
                    <p style={{ fontSize:13,color:"var(--sub)",marginTop:2 }}>{s.address}</p>
                  </div>
                </div>
                <Btn size="sm" variant="danger" onClick={() => delStore(s.id)}>🗑</Btn>
              </div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
                {route && <Tag color={route.color}>{route.name}</Tag>}
                {s.contact && <Tag color="var(--sub)">📱 {s.contact}</Tag>}
              </div>
              {sc.length > 0 ? (
                <div style={{ background:"var(--bg)",borderRadius:10,padding:"12px 14px" }}>
                  <p style={{ fontSize:11.5,fontWeight:700,color:"var(--sub)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em" }}>Titipan Aktif</p>
                  {sc.map(c => {
                    const p = products.find(x => x.id === c.productId);
                    return (
                      <div key={c.id} style={{ display:"flex",justifyContent:"space-between",fontSize:13.5,padding:"4px 0" }}>
                        <span>{p?.name}</span>
                        <span><b style={{ color:"var(--orange)" }}>{c.remaining}</b><span style={{color:"var(--sub)"}}>/{c.deposited}</span></span>
                      </div>
                    );
                  })}
                  {totalOwed > 0 && <p style={{ fontSize:12.5,color:"var(--yellow)",fontWeight:700,marginTop:8,paddingTop:8,borderTop:"1px solid var(--border)" }}>💰 Tagihan: {fmt(totalOwed)}</p>}
                </div>
              ) : (
                <p style={{ fontSize:13,color:"var(--sub)",fontStyle:"italic" }}>Belum ada titipan aktif</p>
              )}
            </Card>
          );
        })}
        {shown.length === 0 && <Card style={{gridColumn:"1/-1"}}><EmptyState icon="🏪" title="Belum ada toko" sub="Tambah toko ke rute ini" /></Card>}
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
        <div style={{display:"flex",gap:10}}><Btn full variant="ghost" onClick={()=>setShowAddStore(false)}>Batal</Btn><Btn full onClick={addStore}>Simpan</Btn></div>
      </Modal>

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
    </div>
  );
}

// ─────────────────────────────────────────────
// CONSIGNMENT
// ─────────────────────────────────────────────
function Consignment({ data, setData }) {
  const { consignments, stores, products } = data;
  const [showDrop, setShowDrop] = useState(false);
  const [visitStore, setVisitStore] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [df, setDf] = useState({ storeId:"",productId:"",quantity:"",date:today });
  const [visitItems, setVisitItems] = useState([]);
  const [filterStore, setFilterStore] = useState("all");

  const activeC = consignments.filter(c => c.status === "active");

  const drop = () => {
    if (!df.storeId||!df.productId||!df.quantity) return;
    const ex = consignments.find(c => c.storeId===df.storeId && c.productId===df.productId && c.status==="active");
    if (ex) {
      setData(d => ({...d, consignments: d.consignments.map(c => c.id===ex.id ? {...c,deposited:c.deposited+ +df.quantity,remaining:c.remaining+ +df.quantity} : c)}));
    } else {
      setData(d => ({...d, consignments:[...d.consignments,{id:uid(),storeId:df.storeId,productId:df.productId,deposited:+df.quantity,remaining:+df.quantity,date:df.date,status:"active"}]}));
    }
    setPrintData({ type:"drop", store:stores.find(s=>s.id===df.storeId), product:products.find(p=>p.id===df.productId), qty:+df.quantity, date:df.date });
    setDf({storeId:"",productId:"",quantity:"",date:today}); setShowDrop(false);
  };

  const openVisit = (store) => {
    const sc = activeC.filter(c => c.storeId===store.id);
    setVisitItems(sc.map(c => ({...c, soldNow: c.deposited-c.remaining, replenish: c.deposited-c.remaining})));
    setVisitStore(store);
  };

  const confirmVisit = () => {
    const newTxs = [];
    const newC = consignments.map(c => {
      const item = visitItems.find(x => x.id===c.id);
      if (!item) return c;
      const prod = products.find(p => p.id===c.productId);
      if (item.soldNow > 0 && prod) {
        newTxs.push({id:uid(),type:"income",category:"Penjualan",amount:item.soldNow*prod.price,date:today,note:`${visitStore.name} - ${prod.name} ${item.soldNow}bks`});
      }
      const newRem = item.remaining - item.soldNow + item.replenish;
      return {...c, deposited:newRem, remaining:newRem, status:newRem<=0?"closed":"active"};
    });
    setData(d => ({...d, transactions:[...newTxs,...d.transactions], consignments:newC}));
    setPrintData({ type:"visit", store:visitStore, items:visitItems, products, date:today });
    setVisitStore(null);
  };

  const totalTagihan = (visitItems||[]).reduce((s,item) => {
    const p = products.find(x=>x.id===item.productId);
    return s + (p ? item.soldNow*p.price : 0);
  }, 0);

  const shown = filterStore==="all" ? stores.filter(s => activeC.some(c=>c.storeId===s.id)) : stores.filter(s=>s.id===filterStore && activeC.some(c=>c.storeId===s.id));

  return (
    <div className="fade-up">
      <SectionHeader title="Titip Jual" sub="Drop barang ke toko & tagih saat kunjungan"
        action={<Btn icon="📦" onClick={() => setShowDrop(true)}>Drop Barang</Btn>} />

      <div style={{ marginBottom:18 }}>
        <select value={filterStore} onChange={e=>setFilterStore(e.target.value)} style={{ maxWidth:260 }}>
          <option value="all">Semua Toko ({stores.filter(s=>activeC.some(c=>c.storeId===s.id)).length})</option>
          {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {shown.length === 0 && <Card><EmptyState icon="📭" title="Belum ada titipan aktif" sub="Mulai drop barang ke toko" /></Card>}

      {shown.map(store => {
        const sc = activeC.filter(c => c.storeId===store.id);
        const tagihan = sc.reduce((sum,c) => {
          const p = products.find(x=>x.id===c.productId);
          return sum + (p ? (c.deposited-c.remaining)*p.price : 0);
        }, 0);
        return (
          <Card key={store.id} style={{ marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12 }}>
              <div>
                <p style={{ fontWeight:700,fontSize:17 }}>{store.name}</p>
                <p style={{ fontSize:13.5,color:"var(--sub)",marginTop:2 }}>{store.address}</p>
              </div>
              <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
                {tagihan > 0 && (
                  <div style={{ background:"var(--yellow-light)",border:"1.5px solid #FDE68A",borderRadius:10,padding:"6px 14px" }}>
                    <p style={{ fontSize:11,color:"var(--yellow)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em" }}>Tagihan</p>
                    <p style={{ fontSize:16,fontWeight:800,color:"var(--orange)" }}>{fmt(tagihan)}</p>
                  </div>
                )}
                <Btn onClick={() => openVisit(store)} icon="🤝">Kunjungi & Tagih</Btn>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10 }}>
              {sc.map(c => {
                const p = products.find(x=>x.id===c.productId);
                const sold = c.deposited - c.remaining;
                return (
                  <div key={c.id} style={{ background:"var(--bg)",borderRadius:11,padding:"14px 14px" }}>
                    <p style={{ fontWeight:700,fontSize:14,marginBottom:10 }}>{p?.name}</p>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:10,textAlign:"center" }}>
                      {[["Dititip","var(--sub)",c.deposited],["Terjual","var(--green)",sold],["Sisa","var(--orange)",c.remaining]].map(([l,color,v])=>(
                        <div key={l} style={{ background:"var(--white)",borderRadius:8,padding:"7px 4px",border:"1px solid var(--border)" }}>
                          <p style={{ fontSize:18,fontWeight:800,color }}>{v}</p>
                          <p style={{ fontSize:10.5,color:"var(--sub)",fontWeight:600,textTransform:"uppercase" }}>{l}</p>
                        </div>
                      ))}
                    </div>
                    <ProgressBar value={c.remaining} max={c.deposited} />
                    {p && <p style={{ fontSize:12,color:"var(--sub)",marginTop:8 }}>Tagihan: <b style={{color:"var(--green)"}}>{fmt(sold*p.price)}</b></p>}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      <Modal show={showDrop} onClose={() => setShowDrop(false)} title="Drop Barang ke Toko">
        <FG label="Toko Tujuan">
          <select value={df.storeId} onChange={e=>setDf(f=>({...f,storeId:e.target.value}))}>
            <option value="">-- Pilih Toko --</option>
            {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FG>
        <FG label="Produk">
          <select value={df.productId} onChange={e=>setDf(f=>({...f,productId:e.target.value}))}>
            <option value="">-- Pilih Produk --</option>
            {products.map(p=><option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
          </select>
        </FG>
        <FG label="Jumlah (bungkus)">
          <input type="number" placeholder="10" value={df.quantity} onChange={e=>setDf(f=>({...f,quantity:e.target.value}))} />
        </FG>
        <FG label="Tanggal Drop">
          <input type="date" value={df.date} onChange={e=>setDf(f=>({...f,date:e.target.value}))} />
        </FG>
        <div style={{display:"flex",gap:10}}>
          <Btn full variant="ghost" onClick={()=>setShowDrop(false)}>Batal</Btn>
          <Btn full onClick={drop}>Drop & Buat Bukti</Btn>
        </div>
      </Modal>

      {visitStore && (
        <Modal show={true} onClose={() => setVisitStore(null)} title={`Kunjungan: ${visitStore.name}`} wide>
          <p style={{ fontSize:14,color:"var(--sub)",marginBottom:18 }}>Hitung yang terjual & isi ulang stok</p>
          {visitItems.map((item,i) => {
            const p = products.find(x=>x.id===item.productId);
            return (
              <div key={item.id} style={{ background:"var(--bg)",borderRadius:12,padding:16,marginBottom:12 }}>
                <p style={{ fontWeight:700,fontSize:15,marginBottom:12 }}>{p?.name}</p>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
                  <div>
                    <p style={{ fontSize:11.5,fontWeight:600,color:"var(--sub)",textTransform:"uppercase",marginBottom:6 }}>Sisa di Toko</p>
                    <div style={{ background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:9,padding:"11px",fontSize:20,fontWeight:800,color:"var(--orange)",textAlign:"center" }}>
                      {item.remaining - item.soldNow}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:11.5,fontWeight:600,color:"var(--green)",textTransform:"uppercase",marginBottom:6 }}>Terjual ✏️</p>
                    <input type="number" value={item.soldNow} min={0} max={item.remaining}
                      onChange={e=>setVisitItems(v=>v.map((x,j)=>j===i?{...x,soldNow:Math.min(+e.target.value,x.remaining)}:x))}
                      style={{ textAlign:"center",fontSize:20,fontWeight:800,color:"var(--green)",padding:"11px" }} />
                  </div>
                  <div>
                    <p style={{ fontSize:11.5,fontWeight:600,color:"var(--accent)",textTransform:"uppercase",marginBottom:6 }}>Isi Ulang ✏️</p>
                    <input type="number" value={item.replenish} min={0}
                      onChange={e=>setVisitItems(v=>v.map((x,j)=>j===i?{...x,replenish:+e.target.value}:x))}
                      style={{ textAlign:"center",fontSize:20,fontWeight:800,color:"var(--accent)",padding:"11px" }} />
                  </div>
                </div>
                {p && (
                  <div style={{ marginTop:11,background:"var(--white)",borderRadius:8,padding:"9px 14px",display:"flex",justifyContent:"space-between",fontSize:13,flexWrap:"wrap",gap:8 }}>
                    <span style={{ color:"var(--sub)" }}>Tagihan: <b style={{color:"var(--green)"}}>{fmt(item.soldNow*p.price)}</b></span>
                    <span style={{ color:"var(--sub)" }}>Stok baru: <b style={{color:"var(--accent)"}}>{item.remaining-item.soldNow+item.replenish}</b> bks</span>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ background:"var(--accent-light)",border:"2px solid var(--accent)",borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8 }}>
            <p style={{ fontWeight:700,fontSize:15 }}>Total Tagihan</p>
            <p style={{ fontSize:24,fontWeight:800,color:"var(--accent)" }}>{fmt(totalTagihan)}</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn full variant="ghost" onClick={()=>setVisitStore(null)}>Batal</Btn>
            <Btn full onClick={confirmVisit}>✓ Konfirmasi & Catat</Btn>
          </div>
        </Modal>
      )}

      {printData && (
        <Modal show={true} onClose={() => setPrintData(null)} title="Bukti Siap Dicetak" wide>
          <div id="print-area">
            {printData.type === "drop" ? (
              <div style={{ padding:"16px 0" }}>
                <div style={{ textAlign:"center",borderBottom:"2px solid var(--border)",paddingBottom:16,marginBottom:18 }}>
                  <p style={{ fontSize:22,marginBottom:2 }}>🍟</p>
                  <p style={{ fontSize:20,fontWeight:800 }}>SNACK KRIUK</p>
                  <p style={{ color:"var(--sub)",fontSize:13 }}>BUKTI PENITIPAN BARANG</p>
                </div>
                {[["Tanggal",fmtDate(printData.date)],["Toko",printData.store?.name],["Alamat",printData.store?.address],["Produk",printData.product?.name],["Jumlah",`${printData.qty} bungkus`],["Harga/bks",fmt(printData.product?.price)],["Total Nilai",fmt(printData.qty*(printData.product?.price||0))]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)",fontSize:14 }}>
                    <span style={{ color:"var(--sub)" }}>{l}</span>
                    <span style={{ fontWeight:700 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:32,textAlign:"center" }}>
                  <div>
                    <p style={{ fontSize:12,color:"var(--sub)" }}>Penerima</p>
                    <div style={{ marginTop:48,borderTop:"1.5px solid var(--text)",paddingTop:6,fontSize:12 }}>( ______________ )</div>
                  </div>
                  <div>
                    <p style={{ fontSize:12,color:"var(--sub)" }}>Yang Menitip</p>
                    <div style={{ marginTop:48,borderTop:"1.5px solid var(--text)",paddingTop:6,fontSize:12 }}>( ______________ )</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding:"16px 0" }}>
                <div style={{ textAlign:"center",borderBottom:"2px solid var(--border)",paddingBottom:16,marginBottom:18 }}>
                  <p style={{ fontSize:22,marginBottom:2 }}>🍟</p>
                  <p style={{ fontSize:20,fontWeight:800 }}>SNACK KRIUK</p>
                  <p style={{ color:"var(--sub)",fontSize:13 }}>BUKTI PEMBAYARAN TITIP JUAL</p>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:6 }}>
                  <span style={{color:"var(--sub)"}}>Tanggal:</span><span style={{fontWeight:700}}>{fmtDate(printData.date)}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:14 }}>
                  <span style={{color:"var(--sub)"}}>Toko:</span><span style={{fontWeight:700}}>{printData.store?.name}</span>
                </div>
                <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:14 }}>
                  <thead>
                    <tr style={{ background:"var(--bg)" }}>
                      {["Produk","Terjual","Harga","Total"].map(h=>(
                        <th key={h} style={{ padding:"9px 10px",textAlign:h==="Total"?"right":"left",fontSize:12,fontWeight:700,color:"var(--sub)",borderBottom:"2px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {printData.items?.map(item => {
                      const p = printData.products?.find(x=>x.id===item.productId);
                      return (
                        <tr key={item.id} style={{ borderBottom:"1px solid var(--border)" }}>
                          <td style={{ padding:"9px 10px",fontSize:14,fontWeight:600 }}>{p?.name}</td>
                          <td style={{ padding:"9px 10px",fontSize:14 }}>{item.soldNow}</td>
                          <td style={{ padding:"9px 10px",fontSize:14 }}>{p?fmt(p.price):"-"}</td>
                          <td style={{ padding:"9px 10px",fontSize:14,fontWeight:700,textAlign:"right",color:"var(--green)" }}>{p?fmt(item.soldNow*p.price):"-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ padding:"11px 10px",fontWeight:700,fontSize:14,textAlign:"right" }}>TOTAL</td>
                      <td style={{ padding:"11px 10px",fontWeight:800,fontSize:16,textAlign:"right",color:"var(--green)" }}>
                        {fmt(printData.items?.reduce((s,item)=>{const p=printData.products?.find(x=>x.id===item.productId);return s+(p?item.soldNow*p.price:0);},0)||0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:24,textAlign:"center" }}>
                  <div>
                    <p style={{ fontSize:12,color:"var(--sub)" }}>Penerima</p>
                    <div style={{ marginTop:48,borderTop:"1.5px solid var(--text)",paddingTop:6,fontSize:12 }}>( ______________ )</div>
                  </div>
                  <div>
                    <p style={{ fontSize:12,color:"var(--sub)" }}>Yang Membayar</p>
                    <div style={{ marginTop:48,borderTop:"1.5px solid var(--text)",paddingTop:6,fontSize:12 }}>( ______________ )</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <Btn full variant="ghost" onClick={() => setPrintData(null)}>Tutup</Btn>
            <Btn full icon="🖨️" onClick={() => printHtml(document.getElementById("print-area")?.innerHTML || "")}>Cetak / Print</Btn>
          </div>
        </Modal>
      )}
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

  const save = () => {
    if (!form.content.trim()) return;
    if (editId) setData(d => ({...d, notes: d.notes.map(n => n.id===editId ? {...n,...form} : n)}));
    else setData(d => ({...d, notes:[{id:uid(),...form},...d.notes]}));
    setForm({content:"",date:today,pinned:false}); setEditId(null); setShowAdd(false);
  };
  const del = (id) => setData(d => ({...d, notes: d.notes.filter(n => n.id !== id)}));
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
                <button onClick={() => del(n.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>🗑</button>
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

  const save = () => {
    if (!form.name || !form.price) return;
    if (editId) setData(d => ({...d, products: d.products.map(p => p.id===editId ? {...p,...form,price:+form.price,costPrice:+form.costPrice} : p)}));
    else setData(d => ({...d, products:[...d.products,{id:uid(),...form,price:+form.price,costPrice:+form.costPrice}]}));
    setForm({name:"",price:"",costPrice:""}); setEditId(null); setShowAdd(false);
  };
  const del = (id) => setData(d => ({...d, products: d.products.filter(p => p.id !== id)}));

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
                  <Btn size="sm" variant="danger" onClick={() => del(p.id)}>🗑</Btn>
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
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [data, setData] = useLocalStorage("kriuk_v3", INIT);
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    const props = { data, setData, setPage };
    switch (page) {
      case "dashboard": return <Dashboard {...props} />;
      case "finance": return <Finance {...props} />;
      case "routes": return <Routes {...props} />;
      case "consignment": return <Consignment {...props} />;
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
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }}>🍟</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>Snack Kriuk</p>
                  <p style={{ fontSize: 11, color: "var(--sub)", lineHeight: 1.1, marginTop: 2 }}>Bisnis Manager</p>
                </div>
              </div>
              <div style={{ marginLeft: 8 }}>
                <OverflowMenu page={page} setPage={setPage} />
              </div>
            </div>
            <div style={{ textAlign: "right" }} className="date-display">
              <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{todayDay}</p>
              <p style={{ fontSize: 11.5, color: "var(--sub)" }}>{tdyDate}</p>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
          {renderPage()}
        </main>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .date-display { display: none !important; }
          main { padding: 16px !important; }
        }
      `}</style>
    </>
  );
}
