import { useEffect, useRef, useState } from 'react'
import { TEAMS } from '../teams.jsx'

// Trophy modeled on the FIFA World Cup: a round globe held aloft, a draped
// stem, and a stepped base with dark engraved bands. The globe and base keep
// their true proportions (sized from the trophy width); only the stem
// stretches so the trophy spans the full height of the site.

function smooth(u) {
  return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(Math.max(u, 0), 1))
}

function lerpStations(stations, u) {
  if (u <= stations[0][0]) return stations[0][1]
  for (let i = 0; i < stations.length - 1; i++) {
    const [u0, v0] = stations[i]
    const [u1, v1] = stations[i + 1]
    if (u <= u1) return v0 + (v1 - v0) * smooth((u - u0) / (u1 - u0))
  }
  return stations[stations.length - 1][1]
}

const BASE_STATIONS = [
  [0, 0.24],
  [0.1, 0.27],
  [0.17, 0.33],
  [0.22, 0.3],
  [0.3, 0.31],
  [0.53, 0.33],
  [0.58, 0.365],
  [0.82, 0.375],
  [0.88, 0.355],
  [1, 0.38],
]

const SHOULDER_STATIONS = [
  [0, 0.06],
  [0.45, 0.3],
  [1, 0.24],
]

function geometry(W, H) {
  const R = 0.4 * W
  const cx = W / 2
  const cy = 0.06 * W + R
  const topH = 0.98 * W
  const baseH = 0.44 * W
  const baseTop = H - baseH
  const shStart = cy + R * 0.55

  const hwAt = (y) => {
    if (y >= baseTop) return W * lerpStations(BASE_STATIONS, (y - baseTop) / baseH)
    if (y >= topH) {
      const p = (y - topH) / (baseTop - topH)
      return W * (0.24 - 0.045 * Math.sin(Math.PI * Math.min(p * 1.12, 1)) + 0.006 * Math.sin(6 * Math.PI * p))
    }
    const circle = R * R - (y - cy) * (y - cy) > 0 ? Math.sqrt(R * R - (y - cy) * (y - cy)) : 0
    const sh = y < shStart ? 0 : W * lerpStations(SHOULDER_STATIONS, (y - shStart) / (topH - shStart))
    return Math.max(circle, sh)
  }

  return { R, cx, cy, topH, baseH, baseTop, hwAt }
}

function silhouettePath(geo, W, H) {
  const right = []
  const left = []
  const n = 340
  const y0 = geo.cy - geo.R + 1
  for (let i = 0; i <= n; i++) {
    const y = y0 + ((H - y0) * i) / n
    const hw = geo.hwAt(y)
    right.push(`${(geo.cx + hw).toFixed(1)},${y.toFixed(1)}`)
    left.push(`${(geo.cx - hw).toFixed(1)},${y.toFixed(1)}`)
  }
  return `M${right.join(' L')} L${left.reverse().join(' L')} Z`
}

// Continent blobs in globe-unit coordinates (x, y in radii, rx, ry, rotation).
const CONTINENTS = [
  [-0.45, -0.42, 0.22, 0.13, -24],
  [-0.3, -0.24, 0.13, 0.17, 12],
  [-0.2, -0.55, 0.12, 0.08, 18],
  [-0.52, 0.05, 0.1, 0.2, 8],
  [-0.34, 0.38, 0.09, 0.18, -10],
  [0.18, -0.38, 0.24, 0.14, 20],
  [0.44, -0.14, 0.14, 0.11, -16],
  [0.28, 0.16, 0.13, 0.15, 6],
  [0.42, 0.44, 0.12, 0.1, -8],
  [0.05, 0.55, 0.08, 0.06, 0],
  [-0.05, -0.05, 0.07, 0.05, 30],
  [0.62, 0.18, 0.06, 0.05, 0],
]

function edgeFlags(geo, W, H) {
  const count = Math.max(12, Math.min(44, Math.round(H / 240)))
  const baseW = Math.max(24, Math.min(38, W * 0.03))
  const flags = []
  const t0 = 0.012
  const t1 = 0.988
  for (let i = 0; i < count; i++) {
    const y = (t0 + ((t1 - t0) * i) / (count - 1)) * H
    const hw = geo.hwAt(y)
    const e = H * 0.004
    const dHW = geo.hwAt(Math.min(H, y + e)) - geo.hwAt(Math.max(0, y - e))
    const angle = Math.max(-26, Math.min(26, (Math.atan2(dHW, 2 * e) * 180) / Math.PI))
    const teamR = TEAMS[i % TEAMS.length]
    const teamL = TEAMS[(i + 24) % TEAMS.length]
    const wR = teamR.opponent ? baseW * 1.7 : baseW
    const wL = teamL.opponent ? baseW * 1.7 : baseW
    flags.push({ key: `r${i}`, team: teamR, w: wR, x: geo.cx + hw + 10 + wR / 2, y, angle })
    flags.push({ key: `l${i}`, team: teamL, w: wL, x: geo.cx - hw - 10 - wL / 2, y, angle: -angle })
  }
  return flags
}

export default function TrophySpine() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w: W, h: H } = size
  const ready = W > 0 && H > W * 2
  const geo = ready ? geometry(W, H) : null
  const path = ready ? silhouettePath(geo, W, H) : ''
  const flags = ready ? edgeFlags(geo, W, H) : []

  return (
    <div className="trophy-spine" aria-hidden="true">
      <div className="trophy-spine-inner" ref={ref}>
        {ready && (
          <>
            <svg width={W} height={H} className="trophy-svg">
              <defs>
                <linearGradient id="gold-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e9c470" />
                  <stop offset="0.2" stopColor="#c99a3f" />
                  <stop offset="0.6" stopColor="#a87c2e" />
                  <stop offset="0.92" stopColor="#8a6220" />
                  <stop offset="1" stopColor="#6b4a16" />
                </linearGradient>
                <linearGradient id="gold-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#1a1002" stopOpacity="0.55" />
                  <stop offset="0.3" stopColor="#ffe9b0" stopOpacity="0.2" />
                  <stop offset="0.52" stopColor="#fff3cf" stopOpacity="0.06" />
                  <stop offset="0.78" stopColor="#1a1002" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#0d0801" stopOpacity="0.6" />
                </linearGradient>
                <radialGradient id="globe-shade" cx="0.38" cy="0.32" r="0.85">
                  <stop offset="0" stopColor="#f2d488" />
                  <stop offset="0.55" stopColor="#c99a3f" />
                  <stop offset="0.85" stopColor="#96702a" />
                  <stop offset="1" stopColor="#6b4a16" />
                </radialGradient>
                <linearGradient id="band-dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#100a02" />
                  <stop offset="0.5" stopColor="#2c1d08" />
                  <stop offset="1" stopColor="#0c0701" />
                </linearGradient>
                <clipPath id="trophy-clip">
                  <path d={path} />
                </clipPath>
                <clipPath id="globe-clip">
                  <circle cx={geo.cx} cy={geo.cy} r={geo.R} />
                </clipPath>
              </defs>

              {/* body */}
              <path d={path} fill="url(#gold-v)" />

              {/* globe */}
              <circle cx={geo.cx} cy={geo.cy} r={geo.R} fill="url(#globe-shade)" />
              <g clipPath="url(#globe-clip)">
                {CONTINENTS.map(([x, y, rx, ry, rot], i) => (
                  <ellipse
                    key={i}
                    cx={geo.cx + x * geo.R}
                    cy={geo.cy + y * geo.R}
                    rx={rx * geo.R}
                    ry={ry * geo.R}
                    transform={`rotate(${rot} ${geo.cx + x * geo.R} ${geo.cy + y * geo.R})`}
                    fill="#7c5a1a"
                    opacity="0.38"
                  />
                ))}
                {/* sphere edge shading */}
                <circle cx={geo.cx} cy={geo.cy} r={geo.R} fill="none" stroke="#503409" strokeOpacity="0.5" strokeWidth={geo.R * 0.06} />
              </g>

              <g clipPath="url(#trophy-clip)">
                {/* the figure: raised arms and head beneath the globe */}
                <path
                  d={`M${geo.cx - 0.21 * W} ${geo.topH}
                      C ${geo.cx - 0.26 * W} ${geo.cy + geo.R * 0.9}, ${geo.cx - 0.34 * W} ${geo.cy + geo.R * 0.55}, ${geo.cx - 0.3 * W} ${geo.cy + geo.R * 0.3}
                      C ${geo.cx - 0.24 * W} ${geo.cy + geo.R * 0.62}, ${geo.cx - 0.16 * W} ${geo.cy + geo.R * 0.86}, ${geo.cx - 0.1 * W} ${geo.topH}
                      Z`}
                  fill="#9a7226"
                  opacity="0.75"
                />
                <path
                  d={`M${geo.cx + 0.21 * W} ${geo.topH}
                      C ${geo.cx + 0.26 * W} ${geo.cy + geo.R * 0.9}, ${geo.cx + 0.34 * W} ${geo.cy + geo.R * 0.55}, ${geo.cx + 0.3 * W} ${geo.cy + geo.R * 0.3}
                      C ${geo.cx + 0.24 * W} ${geo.cy + geo.R * 0.62}, ${geo.cx + 0.16 * W} ${geo.cy + geo.R * 0.86}, ${geo.cx + 0.1 * W} ${geo.topH}
                      Z`}
                  fill="#9a7226"
                  opacity="0.75"
                />
                <circle cx={geo.cx} cy={geo.cy + geo.R * 0.94} r={0.075 * W} fill="#b5893a" />
                <circle cx={geo.cx - 0.02 * W} cy={geo.cy + geo.R * 0.9} r={0.05 * W} fill="#d3ab5c" opacity="0.5" />

                {/* drapery folds down the stem */}
                {[-0.1, 0, 0.1].map((dx, i) => (
                  <path
                    key={i}
                    d={`M${geo.cx + dx * W} ${geo.topH + 10}
                        C ${geo.cx + (dx - 0.03) * W} ${geo.topH + (geo.baseTop - geo.topH) * 0.3},
                          ${geo.cx + (dx + 0.03) * W} ${geo.topH + (geo.baseTop - geo.topH) * 0.7},
                          ${geo.cx + dx * 0.6 * W} ${geo.baseTop}`}
                    stroke="#7c5a1a"
                    strokeOpacity="0.45"
                    strokeWidth="2.5"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* base rings */}
                <rect x="0" y={geo.baseTop + geo.baseH * 0.17} width={W} height={geo.baseH * 0.045} fill="#efd189" opacity="0.7" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.28} width={W} height={geo.baseH * 0.15} fill="url(#band-dark)" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.5} width={W} height={geo.baseH * 0.17} fill="url(#band-dark)" />
                <text
                  x={geo.cx}
                  y={geo.baseTop + geo.baseH * 0.615}
                  textAnchor="middle"
                  fill="#caa14e"
                  style={{
                    font: `700 ${Math.max(14, geo.baseH * 0.085)}px 'FWC26 Ultra Condensed', sans-serif`,
                    letterSpacing: '0.35em',
                  }}
                >
                  FIFA WORLD CUP
                </text>
                <rect x="0" y={geo.baseTop + geo.baseH * 0.86} width={W} height={geo.baseH * 0.02} fill="#efd189" opacity="0.5" />

                {/* global sheen */}
                <path d={path} fill="url(#gold-sheen)" />
              </g>

              <path d={path} fill="none" stroke="#3c2a0c" strokeOpacity="0.8" strokeWidth="2" />
            </svg>

            {flags.map((f) => (
              <div
                key={f.key}
                className={`spine-flag${f.team.opponent ? ' spine-flag-opponent' : ''}`}
                style={{
                  left: f.x,
                  top: f.y,
                  transform: `translate(-50%, -50%) rotate(${f.angle}deg)`,
                }}
              >
                <img src={f.team.flag} alt="" width={f.w} height={f.w * 0.75} loading="lazy" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
