import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceLight: "#1A2236",
  border: "#1E2A3F",
  text: "#E2E8F0",
  textMuted: "#8B9DC3",
  accent: "#3B82F6",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10B981",
  greenMuted: "rgba(16,185,129,0.15)",
  red: "#EF4444",
  redMuted: "rgba(239,68,68,0.12)",
  amber: "#F59E0B",
  amberMuted: "rgba(245,158,11,0.12)",
  purple: "#8B5CF6",
  purpleMuted: "rgba(139,92,246,0.12)",
  cyan: "#06B6D4",
};

const stores = ["All Stores", "Oakwood Plaza", "Far Hills Ave", "Springboro"];

const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, i + 1);
  const day = d.getDay();
  const base = day === 0 || day === 6 ? 42000 : 28000;
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.round(base + Math.random() * 8000),
    lastYear: Math.round(base * 0.91 + Math.random() * 6000),
  };
});

const deptData = [
  { dept: "Produce", revenue: 148200, margin: 38.2, shrink: 6.1, trend: 4.3 },
  { dept: "Deli/Prep", revenue: 132800, margin: 52.1, shrink: 4.8, trend: 7.1 },
  { dept: "Bakery", revenue: 89400, margin: 61.3, shrink: 3.2, trend: 2.8 },
  { dept: "Meat & Seafood", revenue: 121600, margin: 29.7, shrink: 5.4, trend: -1.2 },
  { dept: "Dairy", revenue: 97300, margin: 24.1, shrink: 7.8, trend: 1.1 },
  { dept: "Center Store", revenue: 203500, margin: 22.4, shrink: 1.2, trend: -0.4 },
  { dept: "Wine & Beer", revenue: 78900, margin: 33.8, shrink: 0.4, trend: 9.2 },
  { dept: "Floral", revenue: 24100, margin: 58.7, shrink: 12.1, trend: 3.5 },
];

const loyaltySegments = [
  { name: "Champions", value: 2840, color: COLORS.green, spend: "$312/mo" },
  { name: "Loyal", value: 5120, color: COLORS.accent, spend: "$187/mo" },
  { name: "At Risk", value: 3200, color: COLORS.amber, spend: "$94/mo" },
  { name: "Lapsed", value: 4100, color: COLORS.red, spend: "$0" },
];

const promoData = [
  { promo: "BOGO Avocados", lift: 34, roi: 2.8, incremental: 4200 },
  { promo: "20% Off Wine", lift: 28, roi: 3.1, incremental: 6800 },
  { promo: "Family Meal Deal", lift: 42, roi: 4.2, incremental: 8900 },
  { promo: "Bakery Sampler", lift: 18, roi: 1.4, incremental: 1900 },
  { promo: "Loyalty 2x Points", lift: 22, roi: 2.1, incremental: 5100 },
];

const laborData = [
  { hour: "6a", demand: 12, staffed: 14 },
  { hour: "7a", demand: 18, staffed: 14 },
  { hour: "8a", demand: 28, staffed: 22 },
  { hour: "9a", demand: 35, staffed: 30 },
  { hour: "10a", demand: 42, staffed: 34 },
  { hour: "11a", demand: 55, staffed: 38 },
  { hour: "12p", demand: 62, staffed: 44 },
  { hour: "1p", demand: 58, staffed: 44 },
  { hour: "2p", demand: 45, staffed: 40 },
  { hour: "3p", demand: 50, staffed: 36 },
  { hour: "4p", demand: 58, staffed: 38 },
  { hour: "5p", demand: 68, staffed: 42 },
  { hour: "6p", demand: 72, staffed: 46 },
  { hour: "7p", demand: 52, staffed: 42 },
  { hour: "8p", demand: 30, staffed: 34 },
  { hour: "9p", demand: 15, staffed: 20 },
];

const storeComparison = [
  { metric: "Sales/Sq Ft", oakwood: "$18.40", farHills: "$22.10", springboro: "$14.80" },
  { metric: "Avg Basket", oakwood: "$47.20", farHills: "$62.80", springboro: "$38.90" },
  { metric: "Labor %", oakwood: "24.1%", farHills: "21.3%", springboro: "27.8%" },
  { metric: "Shrink %", oakwood: "3.8%", farHills: "2.9%", springboro: "5.1%" },
  { metric: "Loyalty Pen.", oakwood: "61%", farHills: "74%", springboro: "52%" },
];

const KPI = ({ label, value, change, prefix = "", suffix = "" }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "18px 20px",
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>
      {prefix}{value}{suffix}
    </div>
    {change !== undefined && (
      <div style={{ fontSize: 12, marginTop: 4, color: change >= 0 ? COLORS.green : COLORS.red, display: "flex", alignItems: "center", gap: 3 }}>
        {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs last year
      </div>
    )}
  </div>
);

const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{title}</span>
    </div>
    {subtitle && <div style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 24 }}>{subtitle}</div>}
  </div>
);

const tabs = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "departments", label: "Departments", icon: "▦" },
  { id: "customers", label: "Customers", icon: "◉" },
  { id: "promos", label: "Promotions", icon: "⚡" },
  { id: "labor", label: "Labor", icon: "⏱" },
  { id: "stores", label: "Stores", icon: "⊞" },
];

const customTooltipStyle = {
  background: COLORS.surfaceLight,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 12,
  color: COLORS.text,
};

export default function GroceryDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [store, setStore] = useState("All Stores");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.text,
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "12px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
          }}>R</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>ReadyUp Connect</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.05em" }}>GROCERY INTELLIGENCE SUITE</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select value={store} onChange={e => setStore(e.target.value)} style={{
            background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`,
            borderRadius: 6, padding: "6px 10px", color: COLORS.text, fontSize: 12, cursor: "pointer",
          }}>
            {stores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{
            background: COLORS.surfaceLight, border: `1px solid ${COLORS.border}`,
            borderRadius: 6, padding: "6px 10px", fontSize: 12, color: COLORS.textMuted,
          }}>Mar 1 – Mar 30, 2026</div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{
        display: "flex", gap: 2, padding: "10px 28px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
        overflowX: "auto",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? COLORS.accentGlow : "transparent",
            border: activeTab === t.id ? `1px solid ${COLORS.accent}40` : "1px solid transparent",
            borderRadius: 6, padding: "7px 14px", cursor: "pointer",
            color: activeTab === t.id ? COLORS.accent : COLORS.textMuted,
            fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI label="Total Revenue" value="895.8K" prefix="$" change={4.2} />
              <KPI label="Transactions" value="19,240" change={2.1} />
              <KPI label="Avg Basket" value="46.54" prefix="$" change={1.8} />
              <KPI label="Gross Margin" value="34.2" suffix="%" change={0.6} />
              <KPI label="Shrink Rate" value="3.9" suffix="%" change={-0.8} />
            </div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
              <SectionHeader icon="📈" title="Daily Revenue" subtitle="Current year vs. prior year" />
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyRevenue}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 10 }} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={v => [`$${v.toLocaleString()}`, ""]} />
                  <Area type="monotone" dataKey="lastYear" stroke={COLORS.textMuted} strokeWidth={1.5} strokeDasharray="4 3" fill="none" name="Last Year" />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.accent} strokeWidth={2} fill="url(#gRev)" name="This Year" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
                <SectionHeader icon="🏷️" title="Top Promos This Period" subtitle="By incremental revenue" />
                {promoData.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.promo}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.lift}% lift · {p.roi}x ROI</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>+${p.incremental.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
                <SectionHeader icon="⚠️" title="Alerts" subtitle="Requires attention" />
                {[
                  { msg: "Dairy shrink rate 7.8% — above 5% threshold", level: "red" },
                  { msg: "Springboro labor cost 27.8% — highest across stores", level: "amber" },
                  { msg: "4,100 loyalty members lapsed (>90 days inactive)", level: "amber" },
                ].map((a, i) => (
                  <div key={i} style={{
                    background: a.level === "red" ? COLORS.redMuted : COLORS.amberMuted,
                    borderLeft: `3px solid ${a.level === "red" ? COLORS.red : COLORS.amber}`,
                    borderRadius: 6, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: COLORS.text,
                  }}>{a.msg}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "departments" && (
          <div>
            <SectionHeader icon="▦" title="Department Performance" subtitle="Revenue, margin, and shrink by department" />
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Department", "Revenue", "Margin %", "Shrink %", "YoY Trend"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deptData.map((d, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.dept}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>${d.revenue.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: COLORS.surfaceLight, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${d.margin}%`, height: "100%", background: d.margin > 40 ? COLORS.green : COLORS.accent, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{d.margin}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: d.shrink > 5 ? COLORS.red : d.shrink > 3 ? COLORS.amber : COLORS.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        {d.shrink}%
                      </td>
                      <td style={{ padding: "12px 16px", color: d.trend >= 0 ? COLORS.green : COLORS.red, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        {d.trend >= 0 ? "▲" : "▼"} {Math.abs(d.trend)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 20, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
              <SectionHeader icon="📊" title="Revenue by Department" />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={deptData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis dataKey="dept" type="category" tick={{ fill: COLORS.textMuted, fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill={COLORS.accent} radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI label="Active Members" value="15,260" change={3.4} />
              <KPI label="Loyalty Penetration" value="62" suffix="%" change={5.1} />
              <KPI label="Avg Member Spend" value="187" prefix="$" suffix="/mo" change={2.3} />
              <KPI label="Churn Rate" value="8.2" suffix="%" change={-1.1} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
                <SectionHeader icon="◉" title="Loyalty Segments" subtitle="RFM-based segmentation" />
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={loyaltySegments} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                        {loyaltySegments.map((s, i) => <Cell key={i} fill={s.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    {loyaltySegments.map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{s.value.toLocaleString()}</div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted }}>{s.spend}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
                <SectionHeader icon="🧺" title="Basket Affinity" subtitle="Top product pairings" />
                {[
                  { pair: "Artisan Bread → Imported Cheese", lift: "3.2x", freq: "840/mo" },
                  { pair: "Organic Produce → Natural Deli", lift: "2.8x", freq: "1,240/mo" },
                  { pair: "Wine → Charcuterie", lift: "4.1x", freq: "620/mo" },
                  { pair: "Coffee Beans → Bakery Pastries", lift: "2.4x", freq: "1,080/mo" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none" }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{b.pair}</div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                      <span style={{ color: COLORS.purple, fontFamily: "'JetBrains Mono', monospace" }}>{b.lift}</span>
                      <span style={{ color: COLORS.textMuted }}>{b.freq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16, background: COLORS.redMuted, border: `1px solid ${COLORS.red}30`, borderRadius: 10, padding: 20 }}>
              <SectionHeader icon="🚨" title="Lapsed Member Recovery" subtitle="4,100 members inactive 90+ days — est. $385K annual revenue at risk" />
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                Recommended: Targeted win-back campaign with personalized offers based on last purchase category. Projected recovery rate: 18-24% with $2.40 ROI per dollar spent.
              </div>
            </div>
          </div>
        )}

        {activeTab === "promos" && (
          <div>
            <SectionHeader icon="⚡" title="Promotional Performance" subtitle="Measuring true incremental lift vs. baseline demand" />
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={promoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="promo" tick={{ fill: COLORS.textMuted, fontSize: 10 }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="incremental" fill={COLORS.green} radius={[4, 4, 0, 0]} barSize={36} name="Incremental Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Promotion", "Sales Lift", "ROI", "Incremental $", "Verdict"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {promoData.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.promo}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>+{p.lift}%</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.roi >= 2.5 ? COLORS.green : p.roi >= 1.5 ? COLORS.amber : COLORS.red }}>{p.roi}x</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>${p.incremental.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          background: p.roi >= 2.5 ? COLORS.greenMuted : p.roi >= 1.5 ? COLORS.amberMuted : COLORS.redMuted,
                          color: p.roi >= 2.5 ? COLORS.green : p.roi >= 1.5 ? COLORS.amber : COLORS.red,
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        }}>
                          {p.roi >= 2.5 ? "Strong" : p.roi >= 1.5 ? "Moderate" : "Weak"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "labor" && (
          <div>
            <SectionHeader icon="⏱" title="Labor Optimization" subtitle="Transaction demand vs. staffing levels — Saturday model" />
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={laborData}>
                  <defs>
                    <linearGradient id="gDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="hour" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} label={{ value: "Transactions / Staff", angle: -90, position: "insideLeft", fill: COLORS.textMuted, fontSize: 10 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area type="monotone" dataKey="demand" stroke={COLORS.amber} strokeWidth={2} fill="url(#gDemand)" name="Demand (Transactions)" />
                  <Line type="monotone" dataKey="staffed" stroke={COLORS.accent} strokeWidth={2} dot={false} name="Staff Scheduled" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: COLORS.redMuted, border: `1px solid ${COLORS.red}30`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.red, marginBottom: 6 }}>⚠ Understaffed Windows</div>
                <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                  11am–1pm and 4pm–7pm show demand exceeding staff by 20-38%. Estimated lost revenue from long checkout lines: <strong>$3,200/week</strong>.
                </div>
              </div>
              <div style={{ background: COLORS.amberMuted, border: `1px solid ${COLORS.amber}30`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.amber, marginBottom: 6 }}>💡 Overstaffed Windows</div>
                <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                  6am–7am and 8pm–9pm show 15-33% excess staffing. Reallocating these hours to peak windows saves est. <strong>$1,800/week</strong> with zero net labor cost change.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stores" && (
          <div>
            <SectionHeader icon="⊞" title="Store Benchmarking" subtitle="Cross-location performance comparison" />
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Metric", "Oakwood Plaza", "Far Hills Ave", "Springboro"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {storeComparison.map((row, i) => {
                    const vals = [row.oakwood, row.farHills, row.springboro];
                    const isLowerBetter = row.metric.includes("Labor") || row.metric.includes("Shrink");
                    const nums = vals.map(v => parseFloat(v.replace(/[$%]/g, "")));
                    const bestIdx = isLowerBetter ? nums.indexOf(Math.min(...nums)) : nums.indexOf(Math.max(...nums));
                    const worstIdx = isLowerBetter ? nums.indexOf(Math.max(...nums)) : nums.indexOf(Math.min(...nums));
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "14px 16px", fontWeight: 600 }}>{row.metric}</td>
                        {vals.map((v, j) => (
                          <td key={j} style={{
                            padding: "14px 16px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 13,
                            fontWeight: 600,
                            color: j === bestIdx ? COLORS.green : j === worstIdx ? COLORS.red : COLORS.text,
                          }}>{v}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
              <SectionHeader icon="🎯" title="Key Insight" />
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                <strong>Springboro</strong> is underperforming across every metric. Shrink (5.1%) and labor cost (27.8%) are the primary margin drags. 
                Loyalty penetration at 52% (vs. 74% at Far Hills) suggests a customer engagement gap. 
                Recommended: Targeted loyalty enrollment campaign + shrink audit focused on dairy and floral departments.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>
            Demo data · ReadyUp Analytics © 2026
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
            Pipeline: POS → PostgreSQL → dbt → Dashboard · Refresh: 15min
          </div>
        </div>
      </div>
    </div>
  );
}
