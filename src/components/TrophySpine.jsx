import { useEffect, useRef, useState } from 'react'
import { TEAMS } from '../teams.jsx'

// Trophy modeled on the FIFA World Cup: a round globe held aloft, a draped
// stem, and a stepped base with malachite bands. The globe and base keep
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
  [0, 0.34],
  [0.1, 0.36],
  [0.17, 0.415],
  [0.22, 0.39],
  [0.3, 0.4],
  [0.53, 0.415],
  [0.58, 0.44],
  [0.82, 0.45],
  [0.88, 0.43],
  [1, 0.455],
]

const SHOULDER_STATIONS = [
  [0, 0.06],
  [0.45, 0.37],
  [1, 0.34],
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
      return W * (0.34 - 0.04 * Math.sin(Math.PI * Math.min(p * 1.12, 1)) + 0.006 * Math.sin(6 * Math.PI * p))
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

// Flags trace the outline continuously from the globe down to the foot of the
// base. All 48 nations cycle through; the five opponents render larger.
function edgeFlags(geo, W, H) {
  const count = Math.max(18, Math.min(80, Math.round(H / 150)))
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

// Orbit of the soccer ball: an ellipse around the globe with its low point
// (periapsis) dropped below the globe so it clears the hero text. The
// horizontal radius is clamped so the ball never leaves the page edges.
function orbitParams(geo, viewportW, ballSize) {
  const maxRx = Math.max(geo.R * 0.6, viewportW / 2 - ballSize * 0.6 - 12)
  return {
    rx: Math.min(geo.R * 1.35, maxRx),
    ry: geo.R * 0.55,
    yc: geo.cy + geo.R * 0.18,
  }
}

function orbitPath(geo, orb) {
  const { rx, ry, yc } = orb
  return `M ${geo.cx} ${yc + ry} A ${rx} ${ry} 0 1 1 ${geo.cx} ${yc - ry} A ${rx} ${ry} 0 1 1 ${geo.cx} ${yc + ry} Z`
}

// CSS offset-distance is measured by arc length, not angle, so the fractions
// of the cycle where the ball sits behind the globe must be computed
// numerically for the depth/occlusion keyframes to line up with the path.
function depthKeyframes(geo, orb) {
  const { rx, ry, yc } = orb
  const N = 720
  const pts = []
  for (let i = 0; i <= N; i++) {
    const a = (2 * Math.PI * i) / N
    pts.push([geo.cx - rx * Math.sin(a), yc + ry * Math.cos(a)])
  }
  const lens = [0]
  for (let i = 1; i <= N; i++) {
    const dx = pts[i][0] - pts[i - 1][0]
    const dy = pts[i][1] - pts[i - 1][1]
    lens.push(lens[i - 1] + Math.hypot(dx, dy))
  }
  const total = lens[N]
  const behind = (i) => {
    const [x, y] = pts[i]
    const far = y < yc
    return far && Math.hypot(x - geo.cx, y - geo.cy) < geo.R * 1.03
  }
  let f1 = null
  let f2 = null
  for (let i = 0; i <= N; i++) {
    if (behind(i)) {
      if (f1 === null) f1 = lens[i] / total
      f2 = lens[i] / total
    }
  }
  if (f1 === null) {
    f1 = 0.45
    f2 = 0.55
  }
  const pc = (v) => `${Math.min(99.9, Math.max(0.1, v * 100)).toFixed(1)}%`
  return `@keyframes orbit-depth {
    0% { transform: scale(1); opacity: 1; }
    ${pc(f1 - 0.05)} { transform: scale(0.82); opacity: 1; }
    ${pc(f1)} { transform: scale(0.78); opacity: 0; }
    50% { transform: scale(0.72); opacity: 0; }
    ${pc(f2)} { transform: scale(0.78); opacity: 0; }
    ${pc(f2 + 0.05)} { transform: scale(0.82); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }`
}

function pentagon(cx, cy, r, rot = -90) {
  const pts = []
  for (let i = 0; i < 5; i++) {
    const a = ((rot + i * 72) * Math.PI) / 180
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

function SoccerBall({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="ball-svg">
      <defs>
        <radialGradient id="ball-shade" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#e8e8e8" />
          <stop offset="1" stopColor="#9a9a9a" />
        </radialGradient>
        <clipPath id="ball-clip">
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#ball-shade)" stroke="#333" strokeWidth="2" />
      <g clipPath="url(#ball-clip)" fill="#1c1c1c">
        <polygon points={pentagon(50, 44, 15)} />
        <polygon points={pentagon(14, 26, 13, -70)} />
        <polygon points={pentagon(86, 26, 13, -110)} />
        <polygon points={pentagon(8, 72, 13, -90)} />
        <polygon points={pentagon(92, 72, 13, -90)} />
        <polygon points={pentagon(50, 102, 15, -90)} />
        <g stroke="#1c1c1c" strokeWidth="2.4" fill="none">
          <path d="M50 29 L50 12" />
          <path d="M36 48 L20 36" />
          <path d="M64 48 L80 36" />
          <path d="M41 57 L20 63" />
          <path d="M59 57 L80 63" />
          <path d="M50 59 L50 87" />
        </g>
      </g>
    </svg>
  )
}

export default function TrophySpine() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }))
    })
    ro.observe(el)
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const { w: W, h: H } = size
  const ready = W > 0 && H > W * 2
  const geo = ready ? geometry(W, H) : null
  const path = ready ? silhouettePath(geo, W, H) : ''
  const flags = ready ? edgeFlags(geo, W, H) : []

  const ballSize = ready ? Math.max(38, Math.min(90, W * 0.065)) : 0
  const orbitEl = ready ? orbitParams(geo, vw || W, ballSize) : null
  const orbit = ready ? orbitPath(geo, orbitEl) : ''

  return (
    <div className="trophy-spine" aria-hidden="true">
      <div className="trophy-spine-inner" ref={ref}>
        {ready && (
          <>
            <style>{depthKeyframes(geo, orbitEl)}</style>
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
                <linearGradient id="flutes" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#000" stopOpacity="0.3" />
                  <stop offset="0.12" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="0.24" stopColor="#000" stopOpacity="0.22" />
                  <stop offset="0.38" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="0.5" stopColor="#000" stopOpacity="0.12" />
                  <stop offset="0.62" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="0.76" stopColor="#000" stopOpacity="0.22" />
                  <stop offset="0.88" stopColor="#fff" stopOpacity="0.06" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.32" />
                </linearGradient>
                <radialGradient id="globe-shade" cx="0.36" cy="0.3" r="0.9">
                  <stop offset="0" stopColor="#f6dd96" />
                  <stop offset="0.45" stopColor="#d3a747" />
                  <stop offset="0.78" stopColor="#a87c2e" />
                  <stop offset="0.95" stopColor="#7a5417" />
                  <stop offset="1" stopColor="#5f400f" />
                </radialGradient>
                <linearGradient id="malachite" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0a2a1b" />
                  <stop offset="0.35" stopColor="#17573a" />
                  <stop offset="0.6" stopColor="#0f3d28" />
                  <stop offset="1" stopColor="#071e13" />
                </linearGradient>
                <filter id="soft-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation={geo.R * 0.045} />
                </filter>
                <clipPath id="trophy-clip">
                  <path d={path} />
                </clipPath>
                <clipPath id="globe-clip">
                  <circle cx={geo.cx} cy={geo.cy} r={geo.R} />
                </clipPath>
              </defs>

              {/* body */}
              <path d={path} fill="url(#gold-v)" />

              {/* far half of the orbit ring, occluded by the globe */}
              <path
                d={`M ${geo.cx - orbitEl.rx} ${orbitEl.yc} A ${orbitEl.rx} ${orbitEl.ry} 0 0 1 ${geo.cx + orbitEl.rx} ${orbitEl.yc}`}
                fill="none"
                stroke="#f4c84b"
                strokeOpacity="0.16"
                strokeWidth="2"
                strokeDasharray="5 9"
              />

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
                    stroke="#5f4410"
                    strokeOpacity="0.4"
                    strokeWidth={geo.R * 0.012}
                  />
                ))}
                <ellipse
                  cx={geo.cx - geo.R * 0.34}
                  cy={geo.cy - geo.R * 0.44}
                  rx={geo.R * 0.3}
                  ry={geo.R * 0.16}
                  transform={`rotate(-28 ${geo.cx - geo.R * 0.34} ${geo.cy - geo.R * 0.44})`}
                  fill="#fff6d8"
                  opacity="0.4"
                  filter="url(#soft-blur)"
                />
                <ellipse
                  cx={geo.cx + geo.R * 0.2}
                  cy={geo.cy + geo.R * 0.82}
                  rx={geo.R * 0.5}
                  ry={geo.R * 0.14}
                  fill="#f2d488"
                  opacity="0.14"
                  filter="url(#soft-blur)"
                />
                <circle cx={geo.cx} cy={geo.cy} r={geo.R} fill="none" stroke="#503409" strokeOpacity="0.55" strokeWidth={geo.R * 0.05} />
              </g>

              <g clipPath="url(#trophy-clip)">
                {/* shadow cast by the globe onto the shoulders */}
                <ellipse
                  cx={geo.cx}
                  cy={geo.cy + geo.R * 1.04}
                  rx={geo.R * 0.55}
                  ry={geo.R * 0.09}
                  fill="#2a1a04"
                  opacity="0.4"
                  filter="url(#soft-blur)"
                />

                {/* the figure: raised arms and head beneath the globe */}
                <path
                  d={`M${geo.cx - 0.29 * W} ${geo.topH}
                      C ${geo.cx - 0.33 * W} ${geo.cy + geo.R * 0.9}, ${geo.cx - 0.39 * W} ${geo.cy + geo.R * 0.55}, ${geo.cx - 0.35 * W} ${geo.cy + geo.R * 0.3}
                      C ${geo.cx - 0.29 * W} ${geo.cy + geo.R * 0.62}, ${geo.cx - 0.2 * W} ${geo.cy + geo.R * 0.86}, ${geo.cx - 0.13 * W} ${geo.topH}
                      Z`}
                  fill="#9a7226"
                  opacity="0.75"
                />
                <path
                  d={`M${geo.cx + 0.29 * W} ${geo.topH}
                      C ${geo.cx + 0.33 * W} ${geo.cy + geo.R * 0.9}, ${geo.cx + 0.39 * W} ${geo.cy + geo.R * 0.55}, ${geo.cx + 0.35 * W} ${geo.cy + geo.R * 0.3}
                      C ${geo.cx + 0.29 * W} ${geo.cy + geo.R * 0.62}, ${geo.cx + 0.2 * W} ${geo.cy + geo.R * 0.86}, ${geo.cx + 0.13 * W} ${geo.topH}
                      Z`}
                  fill="#9a7226"
                  opacity="0.75"
                />
                <circle cx={geo.cx} cy={geo.cy + geo.R * 0.94} r={0.075 * W} fill="#b5893a" />
                <circle cx={geo.cx - 0.02 * W} cy={geo.cy + geo.R * 0.9} r={0.05 * W} fill="#d3ab5c" opacity="0.5" />

                {/* fluted shading + fold lines down the stem */}
                <rect x="0" y={geo.topH} width={W} height={geo.baseTop - geo.topH} fill="url(#flutes)" opacity="0.55" />
                {[-0.16, -0.06, 0.05, 0.15].map((dx, i) => (
                  <path
                    key={i}
                    d={`M${geo.cx + dx * W} ${geo.topH + 10}
                        C ${geo.cx + (dx - 0.03) * W} ${geo.topH + (geo.baseTop - geo.topH) * 0.3},
                          ${geo.cx + (dx + 0.03) * W} ${geo.topH + (geo.baseTop - geo.topH) * 0.7},
                          ${geo.cx + dx * 0.6 * W} ${geo.baseTop}`}
                    stroke="#7c5a1a"
                    strokeOpacity="0.4"
                    strokeWidth="2.5"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* base: rim, malachite bands with gold separators, plinth */}
                <rect x="0" y={geo.baseTop + geo.baseH * 0.17} width={W} height={geo.baseH * 0.045} fill="#efd189" opacity="0.7" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.275} width={W} height={geo.baseH * 0.006} fill="#f2d488" opacity="0.6" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.28} width={W} height={geo.baseH * 0.15} fill="url(#malachite)" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.43} width={W} height={geo.baseH * 0.006} fill="#f2d488" opacity="0.6" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.495} width={W} height={geo.baseH * 0.006} fill="#f2d488" opacity="0.6" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.5} width={W} height={geo.baseH * 0.17} fill="url(#malachite)" />
                <rect x="0" y={geo.baseTop + geo.baseH * 0.67} width={W} height={geo.baseH * 0.006} fill="#f2d488" opacity="0.6" />
                <text
                  x={geo.cx}
                  y={geo.baseTop + geo.baseH * 0.615}
                  textAnchor="middle"
                  fill="#d8b45c"
                  style={{
                    font: `700 ${Math.max(14, geo.baseH * 0.085)}px 'FWC26 Ultra Condensed', sans-serif`,
                    letterSpacing: '0.35em',
                  }}
                >
                  FIFA WORLD CUP
                </text>
                <rect x="0" y={geo.baseTop + geo.baseH * 0.86} width={W} height={geo.baseH * 0.02} fill="#efd189" opacity="0.5" />
                <rect x="0" y={H - geo.baseH * 0.06} width={W} height={geo.baseH * 0.06} fill="#000" opacity="0.35" />

                {/* global sheen */}
                <path d={path} fill="url(#gold-sheen)" />
              </g>

              <path d={path} fill="none" stroke="#3c2a0c" strokeOpacity="0.8" strokeWidth="2" />

              {/* near half of the orbit ring, passing in front of the trophy */}
              <path
                d={`M ${geo.cx - orbitEl.rx} ${orbitEl.yc} A ${orbitEl.rx} ${orbitEl.ry} 0 0 0 ${geo.cx + orbitEl.rx} ${orbitEl.yc}`}
                fill="none"
                stroke="#f4c84b"
                strokeOpacity="0.24"
                strokeWidth="2"
                strokeDasharray="5 9"
              />
            </svg>

            {/* faint trail behind the orbiting ball */}
            {[
              { d: -17.4, s: 14, o: 0.5 },
              { d: -16.8, s: 10, o: 0.32 },
              { d: -16.2, s: 7, o: 0.18 },
            ].map((g) => (
              <div
                key={g.d}
                className="orbit-ball orbit-ghost"
                style={{ offsetPath: `path('${orbit}')`, animationDelay: `${g.d}s`, opacity: g.o }}
              >
                <span className="orbit-ball-inner" style={{ animationDelay: `${g.d}s` }}>
                  <span className="orbit-trail-dot" style={{ width: g.s, height: g.s }} />
                </span>
              </div>
            ))}

            {/* soccer ball orbiting the globe */}
            <div className="orbit-ball" style={{ offsetPath: `path('${orbit}')` }}>
              <span className="orbit-ball-inner">
                <SoccerBall size={ballSize} />
              </span>
            </div>

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
                <img src={f.team.flag} alt="" width={f.w} height={f.w * 0.75} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
