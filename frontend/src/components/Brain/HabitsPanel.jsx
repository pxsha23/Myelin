import { useState, useEffect } from 'react'

const TODAY = new Date().toDateString()

export default function HabitsPanel({ mood, nodes }) {
  const habits = nodes.filter(n => n.type === 'HABIT')
  const m = mood

  const storageKey = `myelin_habits_${TODAY}`
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') }
    catch { return {} }
  })
  const [streaks, setStreaks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myelin_streaks') || '{}') }
    catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked))
  }, [checked])

  const toggle = (id) => {
    const wasChecked = checked[id]
    setChecked(c => ({ ...c, [id]: !c[id] }))
    setStreaks(s => {
      const next = { ...s, [id]: wasChecked ? Math.max(0, (s[id] || 0) - 1) : (s[id] || 0) + 1 }
      localStorage.setItem('myelin_streaks', JSON.stringify(next))
      return next
    })
  }

  const doneCount = habits.filter(h => checked[h.id]).length
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid rgba(${m.r},${m.g},${m.b},0.08)`,
        fontSize: 10, letterSpacing: '0.1em',
        color: `rgba(${m.r},${m.g},${m.b},0.35)`
      }}>
        HABITS — TODAY
      </div>

      {/* progress bar */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.35)` }}>
            {doneCount}/{habits.length} done
          </span>
          <span style={{ fontSize: 10, color: m.hex }}>{pct}%</span>
        </div>
        <div style={{
          height: 3, borderRadius: 2,
          background: `rgba(${m.r},${m.g},${m.b},0.1)`
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${pct}%`,
            background: m.hex,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* habit list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {habits.length === 0 && (
          <div style={{ padding: '20px 4px', fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.25)`, textAlign: 'center' }}>
            no HABIT nodes yet — add some in the brain map
          </div>
        )}
        {habits.map(h => {
          const done = !!checked[h.id]
          const streak = streaks[h.id] || 0
          return (
            <div key={h.id} onClick={() => toggle(h.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              background: done ? `rgba(${m.r},${m.g},${m.b},0.1)` : `rgba(${m.r},${m.g},${m.b},0.04)`,
              border: `1px solid rgba(${m.r},${m.g},${m.b},${done ? 0.25 : 0.08})`,
              transition: 'all 0.2s'
            }}>
              {/* checkbox */}
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                border: `1.5px solid rgba(${m.r},${m.g},${m.b},${done ? 0.8 : 0.22})`,
                background: done ? `rgba(${m.r},${m.g},${m.b},0.2)` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s'
              }}>
                {done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={m.hex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 12,
                  color: done ? m.hex : `rgba(${m.r},${m.g},${m.b},0.7)`,
                  textDecoration: done ? 'none' : 'none',
                  transition: 'color 0.2s'
                }}>
                  {h.label}
                </div>
                {h.description && (
                  <div style={{ fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.3)`, marginTop: 1 }}>
                    {h.description}
                  </div>
                )}
              </div>
              {/* streak */}
              {streak > 0 && (
                <div style={{
                  fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.5)`,
                  display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0
                }}>
                  <span style={{ fontSize: 12 }}>🔥</span>
                  <span>{streak}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}