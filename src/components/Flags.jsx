// Hand-drawn SVG flags (3:2, viewBox 60x40) for the five 2026 USMNT opponents + USA.

function Star({ cx, cy, r, fill = '#fff' }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} />
}

function Australia() {
  return (
    <g>
      <rect width="60" height="40" fill="#012169" />
      {/* simplified Union Jack canton */}
      <g>
        <path d="M0 0 L26 17 M26 0 L0 17" stroke="#fff" strokeWidth="4" />
        <path d="M0 0 L26 17 M26 0 L0 17" stroke="#C8102E" strokeWidth="1.6" />
        <path d="M13 0 V17 M0 8.5 H26" stroke="#fff" strokeWidth="5.4" />
        <path d="M13 0 V17 M0 8.5 H26" stroke="#C8102E" strokeWidth="3" />
      </g>
      <Star cx={13} cy={29} r={5} />
      <Star cx={44} cy={7} r={3} />
      <Star cx={52} cy={15} r={3} />
      <Star cx={38} cy={18} r={2.2} />
      <Star cx={44} cy={31} r={3} />
      <Star cx={51} cy={24} r={1.6} />
    </g>
  )
}

function Belgium() {
  return (
    <g>
      <rect width="20" height="40" fill="#000" />
      <rect x="20" width="20" height="40" fill="#FDDA24" />
      <rect x="40" width="20" height="40" fill="#EF3340" />
    </g>
  )
}

function Bosnia() {
  return (
    <g>
      <rect width="60" height="40" fill="#002F6C" />
      <polygon points="19,0 51,0 51,40" fill="#FECB00" />
      <Star cx={15} cy={3} r={3.1} />
      <Star cx={22} cy={12} r={3.1} />
      <Star cx={29} cy={21} r={3.1} />
      <Star cx={36} cy={30} r={3.1} />
      <Star cx={43} cy={39} r={3.1} />
    </g>
  )
}

function Paraguay() {
  return (
    <g>
      <rect width="60" height="13.4" fill="#D52B1E" />
      <rect y="13.4" width="60" height="13.2" fill="#fff" />
      <rect y="26.6" width="60" height="13.4" fill="#0038A8" />
      <circle cx="30" cy="20" r="4.6" fill="none" stroke="#5B7F3B" strokeWidth="1.2" />
      <Star cx={30} cy={20} r={2.4} fill="#FEDF00" />
    </g>
  )
}

function Turkiye() {
  return (
    <g>
      <rect width="60" height="40" fill="#E30A17" />
      <circle cx="23" cy="20" r="10" fill="#fff" />
      <circle cx="25.5" cy="20" r="8" fill="#E30A17" />
      <Star cx={36.5} cy={20} r={5} />
    </g>
  )
}

function USA() {
  const stripes = []
  for (let i = 0; i < 13; i++) {
    if (i % 2 === 0)
      stripes.push(<rect key={i} y={(40 / 13) * i} width="60" height={40 / 13} fill="#B22234" />)
  }
  const stars = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      stars.push(<circle key={`${r}-${c}`} cx={3.4 + c * 4.7} cy={2.8 + r * 4.4} r="1.1" fill="#fff" />)
    }
  }
  return (
    <g>
      <rect width="60" height="40" fill="#fff" />
      {stripes}
      <rect width="25.5" height={(40 / 13) * 7} fill="#3C3B6E" />
      {stars}
    </g>
  )
}

const FLAG_ART = {
  usa: USA,
  aus: Australia,
  bel: Belgium,
  bih: Bosnia,
  par: Paraguay,
  tur: Turkiye,
}

export const FLAG_LIST = [
  { id: 'aus', name: 'Australia' },
  { id: 'bel', name: 'Belgium' },
  { id: 'bih', name: 'Bosnia & Herzegovina' },
  { id: 'par', name: 'Paraguay' },
  { id: 'tur', name: 'Türkiye' },
  { id: 'usa', name: 'United States' },
]

export function Flag({ id, width = 44, decorative = false, name }) {
  const Art = FLAG_ART[id]
  if (!Art) return null
  return (
    <svg
      viewBox="0 0 60 40"
      width={width}
      height={(width * 2) / 3}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : name}
      style={{ display: 'block', borderRadius: 3, overflow: 'hidden' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <Art />
      <rect
        width="60"
        height="40"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.4"
        rx="2"
      />
    </svg>
  )
}
