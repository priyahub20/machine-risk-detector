import { useState, useEffect } from "react";

// ── Inline styles as a design token system ──────────────────────────────────
const COLORS = {
  bg: "#0f1117",
  surface: "#1a1d27",
  surfaceHover: "#1f2335",
  border: "#2a2d3e",
  borderLight: "#363a52",
  low: "#22c55e",
  lowBg: "#0f2d1a",
  lowBorder: "#166534",
  medium: "#f59e0b",
  mediumBg: "#2d1f07",
  mediumBorder: "#854d0e",
  high: "#ef4444",
  highBg: "#2d0f0f",
  highBorder: "#991b1b",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentBg: "#1e1f3a",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
};

// ── ML Logic (Rule-based simulation) ────────────────────────────────────────
function predictRisk({ temperature, runtime, vibration, oilLevel }) {
  let score = 100;
  const issues = [];

  if (temperature > 85) { score -= 30; issues.push("Critical overheating detected"); }
  else if (temperature > 70) { score -= 15; issues.push("Temperature above normal range"); }

  if (runtime > 5000) { score -= 25; issues.push("Excessive runtime hours — overdue for service"); }
  else if (runtime > 3000) { score -= 10; issues.push("High runtime — schedule inspection soon"); }

  if (vibration > 8) { score -= 30; issues.push("Dangerous vibration levels"); }
  else if (vibration > 5) { score -= 15; issues.push("Elevated vibration — check bearings"); }

  if (oilLevel < 20) { score -= 25; issues.push("Critical low oil — immediate refill required"); }
  else if (oilLevel < 40) { score -= 10; issues.push("Oil level below optimal range"); }

  score = Math.max(0, score);

  let risk, recommendation, color;
  if (score >= 70) {
    risk = "Low Risk";
    recommendation = "Machine is healthy. Continue regular monitoring and scheduled maintenance.";
    color = "low";
  } else if (score >= 40) {
    risk = "Medium Risk";
    recommendation = "Schedule a maintenance check within the next 7 days. Monitor parameters closely.";
    color = "medium";
  } else {
    risk = "High Risk";
    recommendation = "Immediate inspection required! Stop machine if possible to prevent failure.";
    color = "high";
  }

  return { risk, score, recommendation, issues, color };
}

// ── Sub-components ───────────────────────────────────────────────────────────
function GaugeBar({ score, color }) {
  const barColor = COLORS[color];
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.textMuted }}>Health Score</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: barColor }}>{score}/100</span>
      </div>
      <div style={{ height: 10, background: COLORS.border, borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${score}%`,
          background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
          borderRadius: 999,
          transition: "width 0.8s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
    </div>
  );
}

function RiskBadge({ risk, color }) {
  const icons = { low: "🟢", medium: "🟡", high: "🔴" };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: COLORS[`${color}Bg`],
      border: `1.5px solid ${COLORS[`${color}Border`]}`,
      color: COLORS[color],
      borderRadius: 10, padding: "8px 18px",
      fontWeight: 700, fontSize: 18, marginBottom: 8,
    }}>
      {icons[color]} {risk}
    </div>
  );
}

function SliderInput({ label, name, value, onChange, min, max, unit, thresholds }) {
  const pct = ((value - min) / (max - min)) * 100;
  let thumbColor = COLORS.low;
  if (thresholds) {
    if (name === "oilLevel") {
      thumbColor = value < thresholds.high ? COLORS.high : value < thresholds.medium ? COLORS.medium : COLORS.low;
    } else {
      thumbColor = value > thresholds.high ? COLORS.high : value > thresholds.medium ? COLORS.medium : COLORS.low;
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{label}</label>
        <span style={{ fontSize: 15, fontWeight: 700, color: thumbColor }}>
          {value} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} value={value} name={name}
        onChange={e => onChange(name, Number(e.target.value))}
        style={{
          width: "100%", height: 6, appearance: "none", outline: "none",
          borderRadius: 999, cursor: "pointer",
          background: `linear-gradient(90deg, ${thumbColor} ${pct}%, ${COLORS.border} ${pct}%)`,
          accentColor: thumbColor,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: COLORS.textDim }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: COLORS.textDim }}>{max}{unit}</span>
      </div>
    </div>
  );
}

function HistoryItem({ entry, index, onDelete }) {
  const color = entry.result.color;
  const icons = { low: "🟢", medium: "🟡", high: "🔴" };

  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS[`${color}Border`]}`,
      borderLeft: `4px solid ${COLORS[color]}`,
      borderRadius: 10, padding: "14px 16px", marginBottom: 10,
      transition: "background 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS[color] }}>
              {icons[color]} {entry.result.risk}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              background: COLORS[`${color}Bg`], color: COLORS[color],
              borderRadius: 6, padding: "2px 8px"
            }}>
              {entry.result.score}/100
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
            {[
              { label: "🌡️", val: `${entry.params.temperature}°C` },
              { label: "⏱️", val: `${entry.params.runtime}h` },
              { label: "📳", val: `${entry.params.vibration} mm/s` },
              { label: "🛢️", val: `${entry.params.oilLevel}%` },
            ].map(p => (
              <span key={p.label} style={{
                fontSize: 12, color: COLORS.textMuted,
                background: COLORS.bg, borderRadius: 6, padding: "3px 8px",
                border: `1px solid ${COLORS.border}`
              }}>
                {p.label} {p.val}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: COLORS.textDim, margin: 0 }}>
            🕐 {entry.timestamp}
          </p>
        </div>
        <button onClick={() => onDelete(index)} style={{
          background: "none", border: "none", color: COLORS.textDim,
          cursor: "pointer", fontSize: 16, padding: "4px 6px", borderRadius: 6,
          marginLeft: 8
        }}>🗑️</button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [params, setParams] = useState({ temperature: 55, runtime: 1200, vibration: 3, oilLevel: 65 });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("mrd_history") || "[]");
    } catch { return []; }
  });
  const [tab, setTab] = useState("check"); // "check" | "history"
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("mrd_history", JSON.stringify(history));
  }, [history]);

  function handleChange(name, val) {
    setParams(p => ({ ...p, [name]: val }));
    setResult(null);
    setAnimIn(false);
  }

  function handleCheck() {
    const res = predictRisk(params);
    setResult(res);
    setAnimIn(false);
    setTimeout(() => setAnimIn(true), 30);
    const entry = {
      params: { ...params },
      result: res,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    };
    setHistory(h => [entry, ...h].slice(0, 50));
  }

  function handleDeleteHistory(idx) {
    setHistory(h => h.filter((_, i) => i !== idx));
  }

  function handleClearHistory() {
    setHistory([]);
  }

  const lowCount = history.filter(h => h.result.color === "low").length;
  const medCount = history.filter(h => h.result.color === "medium").length;
  const highCount = history.filter(h => h.result.color === "high").length;

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: "0 0 40px 0",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.accentBg} 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "24px 24px 20px",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🔧</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                Machine Risk Detector
              </h1>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>
                Real-time industrial machine health monitoring
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
            {[["check", "⚡ Check Machine"], ["history", `📋 Call Log (${history.length})`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: "8px 18px", borderRadius: 8, border: "none",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                background: tab === key ? COLORS.accent : COLORS.border,
                color: tab === key ? "#fff" : COLORS.textMuted,
                transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 0" }}>

        {/* ── CHECK TAB ── */}
        {tab === "check" && (
          <div>
            {/* Input Card */}
            <div style={{
              background: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 14, padding: "24px", marginBottom: 20,
            }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                Machine Parameters
              </h2>

              <SliderInput label="🌡️ Temperature" name="temperature" value={params.temperature}
                onChange={handleChange} min={0} max={120} unit="°C"
                thresholds={{ medium: 70, high: 85 }} />
              <SliderInput label="⏱️ Runtime Hours" name="runtime" value={params.runtime}
                onChange={handleChange} min={0} max={8000} unit="h"
                thresholds={{ medium: 3000, high: 5000 }} />
              <SliderInput label="📳 Vibration" name="vibration" value={params.vibration}
                onChange={handleChange} min={0} max={15} unit=" mm/s"
                thresholds={{ medium: 5, high: 8 }} />
              <SliderInput label="🛢️ Oil Level" name="oilLevel" value={params.oilLevel}
                onChange={handleChange} min={0} max={100} unit="%"
                thresholds={{ high: 20, medium: 40 }} />

              <button onClick={handleCheck} style={{
                width: "100%", padding: "14px", marginTop: 8,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                letterSpacing: 0.3, transition: "opacity 0.2s",
              }}>
                ⚡ Analyse Machine Health
              </button>
            </div>

            {/* Result Card */}
            {result && (
              <div style={{
                background: COLORS[`${result.color}Bg`],
                border: `1.5px solid ${COLORS[`${result.color}Border`]}`,
                borderRadius: 14, padding: "24px",
                opacity: animIn ? 1 : 0,
                transform: animIn ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
                marginBottom: 20,
              }}>
                <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                  Health Report
                </h2>
                <RiskBadge risk={result.risk} color={result.color} />
                <GaugeBar score={result.score} color={result.color} />

                <div style={{
                  background: COLORS.surface + "99", borderRadius: 8,
                  padding: "12px 14px", marginTop: 16,
                  borderLeft: `4px solid ${COLORS[result.color]}`,
                }}>
                  <p style={{ margin: 0, fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
                    💡 {result.recommendation}
                  </p>
                </div>

                {result.issues.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>
                      Issues Detected:
                    </p>
                    {result.issues.map((issue, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 10px", borderRadius: 7, marginBottom: 6,
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: 13, color: COLORS.text,
                      }}>
                        ⚠️ {issue}
                      </div>
                    ))}
                  </div>
                )}

                {result.issues.length === 0 && (
                  <div style={{
                    marginTop: 16, padding: "10px 14px", borderRadius: 8,
                    background: COLORS.surface, border: `1px solid ${COLORS.lowBorder}`,
                    fontSize: 13, color: COLORS.low,
                  }}>
                    ✅ All parameters within normal operating range.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY / CALL LOG TAB ── */}
        {tab === "history" && (
          <div>
            {/* Summary Cards */}
            {history.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Low Risk", count: lowCount, color: "low", icon: "🟢" },
                  { label: "Medium Risk", count: medCount, color: "medium", icon: "🟡" },
                  { label: "High Risk", count: highCount, color: "high", icon: "🔴" },
                ].map(s => (
                  <div key={s.color} style={{
                    background: COLORS[`${s.color}Bg`],
                    border: `1px solid ${COLORS[`${s.color}Border`]}`,
                    borderRadius: 10, padding: "14px 12px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS[s.color] }}>{s.count}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* History Header */}
            {history.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                  📋 Call Log — {history.length} Readings
                </h2>
                <button onClick={handleClearHistory} style={{
                  background: COLORS.highBg, border: `1px solid ${COLORS.highBorder}`,
                  color: COLORS.high, borderRadius: 7, padding: "6px 12px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>
                  🗑️ Clear All
                </button>
              </div>
            )}

            {/* History List */}
            {history.length === 0 ? (
              <div style={{
                background: COLORS.surface, border: `1px dashed ${COLORS.border}`,
                borderRadius: 14, padding: "48px 24px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 15 }}>
                  No readings yet.
                </p>
                <p style={{ color: COLORS.textDim, margin: "8px 0 0", fontSize: 13 }}>
                  Run a check to see results saved here automatically.
                </p>
                <button onClick={() => setTab("check")} style={{
                  marginTop: 16, padding: "10px 20px",
                  background: COLORS.accent, color: "#fff",
                  border: "none", borderRadius: 8, fontWeight: 600,
                  cursor: "pointer", fontSize: 14,
                }}>⚡ Check Machine Now</button>
              </div>
            ) : (
              history.map((entry, i) => (
                <HistoryItem key={i} entry={entry} index={i} onDelete={handleDeleteHistory} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
