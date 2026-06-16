import { useState } from 'react'

export default function SearchPanel({ mood, nodes }) {
  const [query, setQuery] = useState('')
  const results = nodes.filter(n =>
    n.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 12 }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="search nodes..."
        style={{
          background: `rgba(${mood.r},${mood.g},${mood.b},0.05)`,
          border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.15)`,
          borderRadius: 7, padding: '8px 11px',
          color: `rgba(${mood.r},${mood.g},${mood.b},0.85)`,
          fontSize: 12, outline: 'none', fontFamily: 'inherit',
          marginBottom: 12
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {results.map(n => (
          <div key={n.id} style={{
            padding: '8px 11px', borderRadius: 7,
            background: `rgba(${mood.r},${mood.g},${mood.b},0.05)`,
            border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.1)`,
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: 12, color: mood.hex, marginBottom: 2 }}>{n.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(150,180,220,0.35)', letterSpacing: '0.06em' }}>{n.type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}