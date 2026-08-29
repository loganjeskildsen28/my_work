// Single-hue bar list: magnitude of one measure across labeled rows.
export function BarList({ title, items, color = 'var(--gold)', unit = '×' }) {
  const max = Math.max(...items.map((d) => d.value))
  return (
    <figure className="barlist">
      {title && <figcaption className="barlist-title">{title}</figcaption>}
      {items.map((d) => (
        <div className="barlist-row" key={d.label}>
          <span className="barlist-label">{d.label}</span>
          <span className="barlist-track">
            <span
              className="barlist-bar"
              style={{ width: `${(d.value / max) * 100}%`, background: color }}
            />
            <span className="barlist-value">
              {d.value}
              {unit}
            </span>
          </span>
        </div>
      ))}
    </figure>
  )
}

// Illustration of the fitted exponential decay (A − 1)e^(−λt) + 1 with the
// marginal half-life β marked.
export function DecayCurve({ color = 'var(--m-green)' }) {
  const W = 360
  const H = 150
  const pad = { l: 34, r: 12, t: 14, b: 26 }
  const A = 10
  const beta = 0.379
  const lambda = Math.log(2) / beta
  const tMax = 3
  const x = (t) => pad.l + ((W - pad.l - pad.r) * t) / tMax
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - (v - 1) / (A - 1))
  const pts = []
  for (let i = 0; i <= 120; i++) {
    const t = (tMax * i) / 120
    pts.push(`${x(t).toFixed(1)},${y((A - 1) * Math.exp(-lambda * t) + 1).toFixed(1)}`)
  }
  const half = (A - 1) / 2 + 1
  return (
    <figure className="decayfig">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Exponential decay of pageview engagement: the peak ratio falls to half within 0.38 days and returns to baseline within a day or two">
        {/* baseline (ratio = 1) */}
        <line x1={pad.l} y1={y(1)} x2={W - pad.r} y2={y(1)} stroke="rgba(255,255,255,0.28)" strokeDasharray="3 4" />
        <text x={pad.l - 6} y={y(1) + 4} textAnchor="end" className="chart-tick">1×</text>
        <text x={pad.l - 6} y={y(A) + 4} textAnchor="end" className="chart-tick">A</text>
        {/* half-life marker */}
        <line x1={x(beta)} y1={y(half)} x2={x(beta)} y2={H - pad.b} stroke={color} strokeDasharray="3 4" strokeOpacity="0.7" />
        <circle cx={x(beta)} cy={y(half)} r="4" fill={color} stroke="var(--bg-raise)" strokeWidth="2" />
        <text x={x(beta) + 7} y={y(half) - 8} className="chart-note" fill="currentColor">
          β = ln 2 / λ ≈ 0.38 d
        </text>
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {/* x axis */}
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="rgba(255,255,255,0.2)" />
        {[0, 1, 2, 3].map((t) => (
          <text key={t} x={x(t)} y={H - pad.b + 16} textAnchor="middle" className="chart-tick">
            {t}d
          </text>
        ))}
      </svg>
      <figcaption className="barlist-title">
        (A − 1)e<sup>−λt</sup> + 1 — fitted decay of match-day curiosity
      </figcaption>
    </figure>
  )
}
