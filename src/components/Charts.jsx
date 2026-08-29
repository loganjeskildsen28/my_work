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
