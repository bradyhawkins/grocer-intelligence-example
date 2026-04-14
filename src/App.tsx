import { useState, useEffect } from "react";

const BEACON_BLUE = "#003366";
const BEACON_LIGHT_BLUE = "#0066AA";
const BEACON_GOLD = "#C8AA6E";
const SCOREBOARD_BG = "#1a1a1a";

// Tool colors
const TOOL_COLORS = {
  encounters: "#E53935",
  conversions: "#FF9800",
  impressions: "#4CAF50",
  reputation: "#2196F3",
  brand: "#9C27B0",
};

// The Five Tools
const fiveTools = [
  {
    id: "encounters",
    tool: "Hitting for Average",
    name: "Encounters",
    color: TOOL_COLORS.encounters,
    icon: "⚾",
    weight: 25,
    score: 81,
    lastYear: 73,
    rolling3: 84,
    rolling3LY: 76,
    trend: [68, 70, 72, 74, 73, 76, 78, 77, 79, 80, 80, 81],
    subMetrics: [
      { name: "Total Appointments", value: "4,280", target: "4,500", score: 85 },
    ],
    description: "Consistently getting patients in the door",
  },
  {
    id: "conversions",
    tool: "Hitting for Power",
    name: "Conversions",
    color: TOOL_COLORS.conversions,
    icon: "💥",
    weight: 25,
    score: 78,
    lastYear: 69,
    rolling3: 82,
    rolling3LY: 71,
    trend: [62, 64, 66, 68, 70, 72, 71, 74, 75, 76, 77, 78],
    subMetrics: [
      { name: "Call Center Confirms", value: "1,840", target: "2,000", score: 82 },
      { name: "Referral Conversions", value: "620", target: "700", score: 78 },
      { name: "Web Click-to-Appt", value: "12.4%", target: "15%", score: 72 },
      { name: "BeaconNOW Bookings", value: "385", target: "450", score: 74 },
    ],
    description: "Converting interest into confirmed appointments",
  },
  {
    id: "impressions",
    tool: "Speed",
    name: "Quantifiable Impressions",
    color: TOOL_COLORS.impressions,
    icon: "⚡",
    weight: 20,
    score: 86,
    lastYear: 78,
    rolling3: 88,
    rolling3LY: 80,
    trend: [72, 74, 76, 78, 80, 82, 83, 84, 85, 85, 86, 86],
    subMetrics: [
      { name: "Web Traffic", value: "14,200", target: "15,000", score: 88 },
      { name: "Display Ad Impressions", value: "1.2M", target: "1M", score: 95 },
      { name: "Paid Search Clicks", value: "8,400", target: "9,000", score: 82 },
      { name: "SEO Organic Sessions", value: "8,100", target: "9,500", score: 76 },
      { name: "AIO Visibility", value: "68%", target: "75%", score: 80 },
      { name: "Newsletter Opens", value: "32%", target: "28%", score: 92 },
    ],
    description: "Reach and speed — how fast you get in front of patients",
  },
  {
    id: "reputation",
    tool: "Fielding (Glove)",
    name: "Social Climb / Reputation",
    color: TOOL_COLORS.reputation,
    icon: "🧤",
    weight: 15,
    score: 72,
    lastYear: 70,
    rolling3: 74,
    rolling3LY: 71,
    trend: [68, 69, 69, 70, 70, 71, 71, 70, 72, 71, 72, 72],
    subMetrics: [
      { name: "Overall Score", value: "4.3", target: "4.5", score: 78 },
      { name: "Patient Surveys", value: "88%", target: "90%", score: 72 },
      { name: "Meta/Google Reviews", value: "4.2★", target: "4.5★", score: 66 },
    ],
    description: "Defense — protecting your reputation in the field",
  },
  {
    id: "brand",
    tool: "Throwing (Arm)",
    name: "Brand Awareness",
    color: TOOL_COLORS.brand,
    icon: "🎯",
    weight: 15,
    score: 68,
    lastYear: 62,
    rolling3: 71,
    rolling3LY: 64,
    trend: [58, 59, 60, 62, 63, 64, 65, 66, 66, 67, 68, 68],
    subMetrics: [
      { name: "Awareness Spend / Encounter", value: "$18.40", target: "$15.00", score: 72 },
      { name: "HS Athletics Partnerships", value: "14", target: "20", score: 60 },
      { name: "Signage Reach (est.)", value: "85K/mo", target: "100K", score: 74 },
      { name: "Organic Social Engagement", value: "3.2%", target: "4%", score: 68 },
      { name: "Google Business Profile Views", value: "42K", target: "50K", score: 72 },
    ],
    description: "Throwing your name out there — how far your brand carries",
  },
];

// Calculate overall composite
const overallScore = fiveTools.reduce((sum, t) => sum + t.score * (t.weight / 100), 0);
const overallLastYear = fiveTools.reduce((sum, t) => sum + t.lastYear * (t.weight / 100), 0);
const overall3Mo = fiveTools.reduce((sum, t) => sum + t.rolling3 * (t.weight / 100), 0);
const overall3MoLY = fiveTools.reduce((sum, t) => sum + t.rolling3LY * (t.weight / 100), 0);

const monthlyOverall = [
  { month: "Mar", score: 68.2, lastYear: 64.1 },
  { month: "Apr", score: 70.1, lastYear: 65.8 },
  { month: "May", score: 72.0, lastYear: 66.9 },
  { month: "Jun", score: 73.4, lastYear: 68.0 },
  { month: "Jul", score: 74.1, lastYear: 68.8 },
  { month: "Aug", score: 75.6, lastYear: 69.2 },
  { month: "Sep", score: 76.2, lastYear: 70.0 },
  { month: "Oct", score: 76.8, lastYear: 70.4 },
  { month: "Nov", score: 77.5, lastYear: 71.1 },
  { month: "Dec", score: 78.0, lastYear: 71.5 },
  { month: "Jan", score: 78.6, lastYear: 72.0 },
  { month: "Feb", score: 79.2, lastYear: 72.4 },
];

function getColor(score, reference = null) {
  if (reference != null) {
    const pctChange = ((score - reference) / reference) * 100;
    if (pctChange >= 5) return "#4CAF50";
    if (pctChange <= -5) return "#E53935";
    return "#FFC107";
  }
  if (score >= 80) return "#4CAF50";
  if (score >= 65) return "#FFC107";
  return "#E53935";
}

function getGrade(score) {
  if (score >= 80) return { label: "ELITE", tier: "80 Grade" };
  if (score >= 65) return { label: "PLUS", tier: "60 Grade" };
  return { label: "NEEDS WORK", tier: "40 Grade" };
}

function getOverallLabel(score) {
  if (score >= 85) return "5-TOOL SUPERSTAR";
  if (score >= 78) return "ALL-STAR";
  if (score >= 70) return "EVERYDAY STARTER";
  if (score >= 60) return "UTILITY PLAYER";
  return "DEVELOPING PROSPECT";
}

function Sparkline({ data, width = 120, height = 32, color = BEACON_GOLD }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="3" fill={color} />
    </svg>
  );
}

function TrendArrow({ current, previous }) {
  const pctChange = ((current - previous) / previous) * 100;
  const color = getColor(current, previous);
  const arrow = pctChange >= 0 ? "▲" : "▼";
  return (
    <span style={{ color, fontSize: "13px", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
      {arrow} {Math.abs(pctChange).toFixed(1)}%
    </span>
  );
}

function StatusDot({ score, reference = null, size = 10 }) {
  const color = reference != null ? getColor(score, reference) : getColor(score);
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}66`,
      }}
    />
  );
}

// Pentagon / Radar chart for the 5 tools
function RadarChart({ tools, size = 280 }) {
  const pad = 55;
  const fullSize = size + pad * 2;
  const cx = fullSize / 2;
  const cy = fullSize / 2;
  const r = size * 0.35;
  const angles = tools.map((_, i) => (Math.PI * 2 * i) / tools.length - Math.PI / 2);

  const getPoint = (angle, value) => ({
    x: cx + Math.cos(angle) * r * (value / 100),
    y: cy + Math.sin(angle) * r * (value / 100),
  });

  const gridLevels = [20, 40, 60, 80, 100];

  const currentPoints = tools.map((t, i) => getPoint(angles[i], t.score));
  const lastYearPoints = tools.map((t, i) => getPoint(angles[i], t.lastYear));

  const currentPath = currentPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const lastYearPath = lastYearPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${fullSize} ${fullSize}`}>
      {/* Grid */}
      {gridLevels.map((level) => {
        const pts = angles.map((a) => getPoint(a, level));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        return <path key={level} d={path} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}

      {/* Last year area */}
      <path d={lastYearPath} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,4" />

      {/* Current area */}
      <path d={currentPath} fill={`${BEACON_GOLD}18`} stroke={BEACON_GOLD} strokeWidth="2" />

      {/* Data points */}
      {currentPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={tools[i].color} stroke="#fff" strokeWidth="1.5" />
      ))}

      {/* Labels */}
      {tools.map((t, i) => {
        const labelR = r + 28;
        const x = cx + Math.cos(angles[i]) * labelR;
        const y = cy + Math.sin(angles[i]) * labelR;
        return (
          <g key={t.id}>
            <text
              x={x}
              y={y - 6}
              fill={t.color}
              fontSize="10"
              fontFamily="'Oswald', sans-serif"
              fontWeight="600"
              textAnchor="middle"
              style={{ textTransform: "uppercase", letterSpacing: "1px" }}
            >
              {t.icon} {t.name.split("/")[0].trim()}
            </text>
            <text x={x} y={y + 8} fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="'DM Mono', monospace" fontWeight="700" textAnchor="middle">
              {t.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TrendChart({ data, width = "100%", height = 200 }) {
  const chartW = 600;
  const chartH = 160;
  const padding = { top: 10, right: 20, bottom: 30, left: 45 };
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;

  const allVals = [...data.map((d) => d.score), ...data.map((d) => d.lastYear)];
  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const range = maxVal - minVal || 10;

  const getX = (i) => padding.left + (i / (data.length - 1)) * innerW;
  const getY = (v) => padding.top + innerH - ((v - minVal + 2) / (range + 4)) * innerH;

  const thisYearPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d.score)}`).join(" ");
  const lastYearPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${getX(i)},${getY(d.lastYear)}`).join(" ");

  const areaPath =
    thisYearPath +
    data
      .slice()
      .reverse()
      .map((d, i) => `L${getX(data.length - 1 - i)},${getY(d.lastYear)}`)
      .join("") +
    " Z";

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width, height, display: "block" }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BEACON_GOLD} stopOpacity="0.2" />
          <stop offset="100%" stopColor={BEACON_GOLD} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[65, 70, 75, 80].map((v) => {
        if (v < minVal - 2 || v > maxVal + 2) return null;
        return (
          <g key={v}>
            <line x1={padding.left} y1={getY(v)} x2={chartW - padding.right} y2={getY(v)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
            <text x={padding.left - 6} y={getY(v) + 4} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="end" fontFamily="'DM Mono', monospace">
              {v}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => (
        <text key={d.month} x={getX(i)} y={chartH - 4} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" fontFamily="'DM Mono', monospace">
          {d.month}
        </text>
      ))}
      <path d={areaPath} fill="url(#areaFill)" />
      <path d={lastYearPath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6,4" />
      <path d={thisYearPath} fill="none" stroke={BEACON_GOLD} strokeWidth="2.5" />
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.score)} r="3" fill={BEACON_GOLD} />
      ))}
      <circle cx={getX(data.length - 1)} cy={getY(data[data.length - 1].score)} r="5" fill={BEACON_GOLD} stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

// Sub-metric bar
function MetricBar({ metric, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <div style={{ flex: "0 0 180px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
        {metric.name}
      </div>
      <div style={{ flex: 1, position: "relative", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${Math.min(metric.score, 100)}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 3,
            transition: "width 1s ease-out",
          }}
        />
      </div>
      <div style={{ flex: "0 0 40px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 600, color: getColor(metric.score) }}>
        {metric.score}
      </div>
      <div style={{ flex: "0 0 90px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
        {metric.value} / {metric.target}
      </div>
    </div>
  );
}

export default function BeaconDashboard() {
  const [activeTab, setActiveTab] = useState("scouting");
  const [expandedTool, setExpandedTool] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const target = overallScore;
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${BEACON_BLUE} 0%, #001a33 40%, ${SCOREBOARD_BG} 100%)`,
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
        padding: 0,
        margin: 0,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Oswald:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out forwards; opacity:0; }
        .slide-in { animation: slideIn 0.4s ease-out forwards; opacity:0; }
        .delay-1 { animation-delay:0.1s; } .delay-2 { animation-delay:0.2s; } .delay-3 { animation-delay:0.3s; }
        .delay-4 { animation-delay:0.4s; } .delay-5 { animation-delay:0.5s; } .delay-6 { animation-delay:0.6s; }
        .tab-btn { cursor:pointer; border:none; padding:10px 20px; font-size:13px; font-family:'Oswald',sans-serif; text-transform:uppercase; letter-spacing:2px; transition:all 0.3s; border-radius:4px; }
        .tab-btn:hover { background:rgba(200,170,110,0.15) !important; }
        .tool-card:hover { border-color:rgba(200,170,110,0.3) !important; }
        * { box-sizing:border-box; }
      `}</style>

      {/* Header */}
      <header
        className="fade-up"
        style={{
          padding: "24px 32px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(200,170,110,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${BEACON_BLUE}, ${BEACON_LIGHT_BLUE})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${BEACON_GOLD}`,
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "'Oswald', sans-serif",
              color: BEACON_GOLD,
            }}
          >
            B
          </div>
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px" }}>
              Beacon Orthopaedics
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: BEACON_GOLD, letterSpacing: "2px", textTransform: "uppercase" }}>
              Five-Tool Player — Marketing Analytics
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.4)", textAlign: "right" }}>
          <div>2025 Season</div>
          <div style={{ color: BEACON_GOLD }}>Updated Feb 25, 2026</div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="fade-up delay-1" style={{ padding: "16px 32px", display: "flex", gap: 8 }}>
        {[
          { id: "scouting", label: "⬥ Scouting Report" },
          { id: "tools", label: "⬥ The Five Tools" },
        ].map((tab) => (
          <button
            key={tab.id}
            className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "rgba(200,170,110,0.2)" : "transparent",
              color: activeTab === tab.id ? BEACON_GOLD : "rgba(255,255,255,0.5)",
              fontWeight: activeTab === tab.id ? 600 : 400,
              border: activeTab === tab.id ? "1px solid rgba(200,170,110,0.3)" : "1px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "0 32px 48px" }}>
        {/* SCOUTING REPORT TAB */}
        {activeTab === "scouting" && (
          <div>
            {/* Hero Section */}
            <div
              className="fade-up delay-2"
              style={{
                background: "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #222 100%)",
                borderRadius: 16,
                padding: "40px 48px",
                border: "1px solid rgba(200,170,110,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,170,110,0.08) 0%, transparent 70%)" }} />

              <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 48, alignItems: "center" }}>
                {/* Left: Overall Score */}
                <div style={{ flex: "0 0 auto" }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "4px", color: BEACON_GOLD, marginBottom: 8 }}>
                    Overall Scouting Grade
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "72px", fontWeight: 700, color: "#fff", letterSpacing: "2px", textShadow: "0 0 30px rgba(200,170,110,0.3)", lineHeight: 1 }}>
                      {animatedScore.toFixed(1)}
                    </span>
                    <div style={{ marginBottom: 8 }}>
                      <StatusDot score={overallScore} size={14} />
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "11px", color: getColor(overallScore), letterSpacing: "2px", fontWeight: 600, marginTop: 4 }}>
                        {getOverallLabel(overallScore)}
                      </div>
                    </div>
                  </div>

                  {/* Rolling averages */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                        Rolling 12-Month
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "28px", fontWeight: 700, color: "#fff" }}>
                          {overallScore.toFixed(1)}
                        </span>
                        <TrendArrow current={overallScore} previous={overallLastYear} />
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                        vs {overallLastYear.toFixed(1)} same period LY
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                        Rolling 3-Month
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "28px", fontWeight: 700, color: "#fff" }}>
                          {overall3Mo.toFixed(1)}
                        </span>
                        <TrendArrow current={overall3Mo} previous={overall3MoLY} />
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                        vs {overall3MoLY.toFixed(1)} same period LY
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Radar Chart */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <RadarChart tools={fiveTools} size={300} />
                </div>
              </div>
            </div>

            {/* Tool Summary Cards */}
            <div className="fade-up delay-3" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
              {fiveTools.map((tool) => {
                const grade = getGrade(tool.score);
                return (
                  <div
                    key={tool.id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 12,
                      padding: "20px 16px",
                      border: `1px solid ${tool.color}33`,
                      borderTop: `3px solid ${tool.color}`,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: 4 }}>{tool.icon}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", color: tool.color, marginBottom: 2 }}>
                      {tool.tool}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
                      {tool.name}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "28px", fontWeight: 700, color: getColor(tool.score), lineHeight: 1, marginBottom: 4 }}>
                      {tool.score}
                    </div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1.5px", color: getColor(tool.score), fontWeight: 600, marginBottom: 8 }}>
                      {grade.label}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 4, alignItems: "center" }}>
                      <TrendArrow current={tool.score} previous={tool.lastYear} />
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                      Weight: {tool.weight}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Season Trend */}
            <div className="fade-up delay-4" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "28px 32px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "13px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.5)" }}>
                  Overall Season Trend
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 16, height: 2, background: BEACON_GOLD, borderRadius: 1 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>This Year</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 16, height: 0, borderTop: "2px dashed rgba(255,255,255,0.25)" }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Last Year</span>
                  </div>
                </div>
              </div>
              <TrendChart data={monthlyOverall} />
            </div>
          </div>
        )}

        {/* THE FIVE TOOLS TAB */}
        {activeTab === "tools" && (
          <div>
            <div className="fade-up delay-1" style={{ fontFamily: "'Oswald', sans-serif", fontSize: "13px", textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              The Five Tools — Detailed Breakdown
            </div>

            {fiveTools.map((tool, idx) => {
              const grade = getGrade(tool.score);
              const isExpanded = expandedTool === tool.id;
              return (
                <div
                  key={tool.id}
                  className={`tool-card fade-up delay-${idx + 1}`}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 14,
                    marginBottom: 16,
                    border: `1px solid ${isExpanded ? tool.color + "44" : "rgba(255,255,255,0.06)"}`,
                    overflow: "hidden",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                >
                  {/* Tool Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      display: "grid",
                      gridTemplateColumns: "44px 1fr 100px 80px 130px 120px 30px",
                      alignItems: "center",
                      gap: 16,
                      borderLeft: `4px solid ${tool.color}`,
                    }}
                  >
                    <div style={{ fontSize: "28px", textAlign: "center" }}>{tool.icon}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                          {tool.name}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: tool.color, background: `${tool.color}15`, padding: "2px 8px", borderRadius: 4 }}>
                          {tool.tool}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                        {tool.description}
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "24px", fontWeight: 700, color: getColor(tool.score), lineHeight: 1 }}>
                        {tool.score}
                      </div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "8px", textTransform: "uppercase", letterSpacing: "1.5px", color: getColor(tool.score), fontWeight: 600, marginTop: 2 }}>
                        {grade.label} · {grade.tier}
                      </div>
                    </div>
                    <div style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      {tool.weight}%
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Sparkline data={tool.trend} color={tool.color} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <TrendArrow current={tool.score} previous={tool.lastYear} />
                    </div>
                    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px", transition: "transform 0.3s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ padding: "0 24px 24px 72px", borderTop: `1px solid ${tool.color}22` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 32, paddingTop: 20 }}>
                        {/* Sub-metrics */}
                        <div>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                            Component Metrics
                          </div>
                          {tool.subMetrics.map((m, i) => (
                            <div key={i} className="slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                              <MetricBar metric={m} color={tool.color} />
                            </div>
                          ))}
                        </div>

                        {/* Rolling averages */}
                        <div>
                          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                            Rolling Averages
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10 }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                              12-Month Rolling
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 700, color: "#fff" }}>{tool.score}</span>
                              <TrendArrow current={tool.score} previous={tool.lastYear} />
                            </div>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                              vs {tool.lastYear} LY
                            </div>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                              3-Month Rolling
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 700, color: "#fff" }}>{tool.rolling3}</span>
                              <TrendArrow current={tool.rolling3} previous={tool.rolling3LY} />
                            </div>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                              vs {tool.rolling3LY} LY
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Formula */}
            <div
              className="fade-up delay-6"
              style={{
                marginTop: 8,
                background: "rgba(200,170,110,0.05)",
                borderRadius: 12,
                padding: "20px 24px",
                border: "1px solid rgba(200,170,110,0.1)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
              }}
            >
              <span style={{ color: BEACON_GOLD }}>Overall Grade</span> = (Encounters × .25) + (Conversions × .25) + (Impressions × .20) + (Reputation × .15) + (Brand × .15)
              <br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>
                = ({fiveTools[0].score} × .25) + ({fiveTools[1].score} × .25) + ({fiveTools[2].score} × .20) + ({fiveTools[3].score} × .15) + ({fiveTools[4].score} × .15)
              </span>
              <br />
              <span style={{ color: BEACON_GOLD }}>= {overallScore.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Footer Legend */}
        <div
          className="fade-up delay-6"
          style={{
            marginTop: 40,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Elite (80+)", score: 85 },
              { label: "Plus (65–79)", score: 70 },
              { label: "Needs Work (<65)", score: 40 },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <StatusDot score={item.score} size={8} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
              </div>
            ))}
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>|</span>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
              Grading Scale: 80 = MLB Scout Grade (20–80 scale mapped to 0–100)
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
            Powered by ReadyUp Analytics
          </div>
        </div>
      </div>
    </div>
  );
}




