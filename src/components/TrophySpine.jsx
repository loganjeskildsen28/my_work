import { useEffect, useRef, useState } from 'react'
import { Flag } from './Flags'

// The trophy silhouette, defined as [t, halfWidth] stations where t is the
// fraction of total page height and halfWidth is a fraction of the widest
// point. Globe up top, spiraling body, flared malachite-banded base.
const STATIONS = [
  [0.0, 0.05],
  [0.008, 0.09],
  [0.022, 0.46],
  [0.05, 0.78],
  [0.085, 0.94],
  [0.12, 0.98],
  [0.155, 0.93],
  [0.19, 0.76],
  [0.218, 0.5],
  [0.236, 0.4],
  [0.256, 0.56],
  [0.278, 0.46],
  [0.31, 0.32],
  [0.36, 0.24],
  [0.43, 0.205],
  [0.5, 0.195],
  [0.565, 0.22],
  [0.63, 0.26],
  [0.69, 0.23],
  [0.75, 0.28],
  [0.8, 0.45],
  [0.845, 0.6],
  [0.868, 0.65],
  [0.878, 0.62],
  [0.9, 0.64],
  [0.912, 0.62],
  [0.934, 0.66],
  [0.96, 0.7],
  [0.985, 0.72],
  [1.0, 0.72],
]

function halfWidthAt(t) {
  if (t <= STATIONS[0][0]) return STATIONS[0][1]
  for (let i = 0; i < STATIONS.length - 1; i++) {
    const [t0, w0] = STATIONS[i]
    const [t1, w1] = STATIONS[i + 1]
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0)
      const s = 0.5 - 0.5 * Math.cos(Math.PI * u)
      return w0 + (w1 - w0) * s
    }
  }
  return STATIONS[STATIONS.length - 1][1]
}

function buildSilhouettePath(width, height, maxHW) {
  const cx = width / 2
  const n = 280
  const right = []
  const left = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const hw = halfWidthAt(t) * maxHW
    const y = (t * height).toFixed(1)
    right.push(`${(cx + hw).toFixed(1)},${y}`)
    left.push(`${(cx - hw).toFixed(1)},${y}`)
  }
  return `M${right.join(' L')} L${left.reverse().join(' L')} Z`
}

// Flags cycle through the five opponents + the USA as they trace the outline.
const SEQ = ['usa', 'tur', 'par', 'bih', 'bel', 'aus']

function edgeFlags(width, height, maxHW, flagW) {
  const cx = width / 2
  const count = Math.max(10, Math.min(34, Math.round(height / 300)))
  const flags = []
  const t0 = 0.015
  const t1 = 0.985
  for (let i = 0; i < count; i++) {
    const t = t0 + ((t1 - t0) * i) / (count - 1)
    const hw = halfWidthAt(t) * maxHW
    // slope of the outline -> tilt the flag to follow the contour
    const e = 0.004
    const dHW = (halfWidthAt(Math.min(1, t + e)) - halfWidthAt(Math.max(0, t - e))) * maxHW
    const dy = 2 * e * height
    const angle = Math.max(-26, Math.min(26, (Math.atan2(dHW, dy) * 180) / Math.PI))
    const gap = 10 + flagW / 2
    flags.push({
      key: `r${i}`,
      id: SEQ[i % SEQ.length],
      x: cx + hw + gap,
      y: t * height,
      angle,
    })
    flags.push({
      key: `l${i}`,
      id: SEQ[(i + 3) % SEQ.length],
      x: cx - hw - gap,
      y: t * height,
      angle: -angle,
    })
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

  const { w, h } = size
  const ready = w > 0 && h > 0
  const maxHW = w * 0.34
  const flagW = Math.max(30, Math.min(46, w * 0.11))
  const path = ready ? buildSilhouettePath(w, h, maxHW) : ''
  const flags = ready ? edgeFlags(w, h, maxHW, flagW) : []

  // Globe detailing (latitude / meridian lines) lives in the top ~23% of the height.
  const cx = w / 2
  const globe = { top: 0.012 * h, bottom: 0.235 * h, mid: 0.12 * h }

  return (
    <div className="trophy-spine" aria-hidden="true">
      <div className="trophy-spine-inner" ref={ref}>
        {ready && (
          <>
            <svg width={w} height={h} className="trophy-svg">
              <defs>
                <linearGradient id="trophy-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fbe7a0" />
                  <stop offset="0.16" stopColor="#f4c84b" />
                  <stop offset="0.45" stopColor="#d99a2b" />
                  <stop offset="0.8" stopColor="#b97c1d" />
                  <stop offset="1" stopColor="#8f5c14" />
                </linearGradient>
                <linearGradient id="trophy-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#000" stopOpacity="0.32" />
                  <stop offset="0.32" stopColor="#fff" stopOpacity="0.24" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
                  <stop offset="0.78" stopColor="#000" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.4" />
                </linearGradient>
                <clipPath id="trophy-clip">
                  <path d={path} />
                </clipPath>
              </defs>

              <path d={path} fill="url(#trophy-gold)" />
              <path d={path} fill="url(#trophy-sheen)" />

              <g clipPath="url(#trophy-clip)">
                {/* globe latitude + meridian engraving */}
                <g stroke="#7a5210" strokeOpacity="0.55" strokeWidth="2" fill="none">
                  <path d={`M${cx - maxHW} ${globe.mid * 0.62} Q ${cx} ${globe.mid * 0.62 + 0.045 * h} ${cx + maxHW} ${globe.mid * 0.62}`} />
                  <path d={`M${cx - maxHW} ${globe.mid} Q ${cx} ${globe.mid + 0.05 * h} ${cx + maxHW} ${globe.mid}`} />
                  <path d={`M${cx - maxHW} ${globe.mid * 1.45} Q ${cx} ${globe.mid * 1.45 + 0.045 * h} ${cx + maxHW} ${globe.mid * 1.45}`} />
                  <path d={`M${cx} ${globe.top} Q ${cx - maxHW * 0.72} ${globe.mid} ${cx} ${globe.bottom}`} />
                  <path d={`M${cx} ${globe.top} Q ${cx + maxHW * 0.72} ${globe.mid} ${cx} ${globe.bottom}`} />
                  <path d={`M${cx} ${globe.top} Q ${cx - maxHW * 1.35} ${globe.mid} ${cx} ${globe.bottom}`} />
                  <path d={`M${cx} ${globe.top} Q ${cx + maxHW * 1.35} ${globe.mid} ${cx} ${globe.bottom}`} />
                </g>
                {/* seam under the globe */}
                <path
                  d={`M${cx - maxHW} ${0.238 * h} Q ${cx} ${0.253 * h} ${cx + maxHW} ${0.238 * h}`}
                  stroke="#7a5210"
                  strokeOpacity="0.6"
                  strokeWidth="2.5"
                  fill="none"
                />
                {/* malachite bands on the base */}
                <rect x="0" y={0.879 * h} width={w} height={0.02 * h} fill="#1f7a4d" />
                <rect x="0" y={0.879 * h} width={w} height={0.004 * h} fill="#2e9c66" />
                <rect x="0" y={0.913 * h} width={w} height={0.02 * h} fill="#1f7a4d" />
                <rect x="0" y={0.913 * h} width={w} height={0.004 * h} fill="#2e9c66" />
                {/* engraved plaque line on the base */}
                <rect
                  x={cx - maxHW * 0.36}
                  y={0.948 * h}
                  width={maxHW * 0.72}
                  height={0.022 * h}
                  rx="4"
                  fill="none"
                  stroke="#7a5210"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                />
              </g>

              <path d={path} fill="none" stroke="#5f3d0a" strokeOpacity="0.55" strokeWidth="2" />
            </svg>

            {flags.map((f) => (
              <div
                key={f.key}
                className="spine-flag"
                style={{
                  left: f.x,
                  top: f.y,
                  transform: `translate(-50%, -50%) rotate(${f.angle}deg)`,
                }}
              >
                <Flag id={f.id} width={flagW} decorative />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
