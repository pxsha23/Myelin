import { useState, useEffect } from 'react'

const TODAY = new Date().toDateString()
const todayFmt = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

export default function ReportPanel({ mood, nodes }) {
  const m = mood

  const storageKey = `myelin_report_${TODAY}`
  const habitsKey = `myelin_habits_${TODAY}`
  const streaksKey = 'myelin_streaks'

  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') }
    catch { return [] }
  })
  const [input, setInput] = useState('')

  const habitsDone = (() => {
    try {
      const checked = JSON.parse(localStorage.getItem(habitsKey) || '{}')
      const streaks = JSON.parse(localStorage.getItem(streaksKey) || '{}')
      return nodes.filter(n => n.type === 'HABIT' && checked[n.id]).map(n => ({
        label: n.label, streak: streaks[n.id] || 0
      }))
    } catch { return [] }
  })()

  const habitNodes = nodes.filter(n => n.type === 'HABIT')
  const habitPct = habitNodes.length ? Math.round((habitsDone.length / habitNodes.length) * 100) : 0

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(logs))
  }, [logs])

  const addLog = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setLogs(l => [...l, { id: Date.now(), text: input.trim(), time: now }])
    setInput('')
  }

  const removeLog = (id) => setLogs(l => l.filter(x => x.id !== id))

  // node type breakdown
  const typeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid rgba(${m.r},${m.g},${m.b},0.08)`,
        fontSize: 10, letterSpacing: '0.1em',
        color: `rgba(${m.r},${m.g},${m.b},0.35)`
      }}>
        DAILY REPORT
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* date */}
        <div style={{ fontSize: 13, color: m.hex, fontWeight: 500 }}>{todayFmt}</div>

        {/* brain stats */}
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.3)`, marginBottom: 8 }}>
            BRAIN MAP
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} style={{
                padding: '4px 10px', borderRadius: 5,
                background: `rgba(${m.r},${m.g},${m.b},0.07)`,
                border: `1px solid rgba(${m.r},${m.g},${m.b},0.12)`,
                fontSize: 10
              }}>
                <span style={{ color: `rgba(${m.r},${m.g},${m.b},0.4)` }}>{type} </span>
                <span style={{ color: m.hex, fontWeight: 500 }}>{count}</span>
              </div>
            ))}
            {nodes.length === 0 && (
              <span style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.25)` }}>no nodes yet</span>
            )}
          </div>
        </div>

        {/* habits summary */}
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.3)`, marginBottom: 8 }}>
            HABITS — {habitsDone.length}/{habitNodes.length} ({habitPct}%)
          </div>
          {habitsDone.length === 0 ? (
            <div style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.22)` }}>none completed today</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {habitsDone.map(h => (
                <div key={h.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={m.hex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.7)` }}>{h.label}</span>
                  {h.streak > 0 && (
                    <span style={{ fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.35)` }}>🔥{h.streak}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* done log */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.3)`, marginBottom: 8 }}>
            DONE TODAY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {logs.length === 0 && (
              <div style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.22)` }}>nothing logged yet</div>
            )}
            {logs.map(log => (
              <div key={log.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '7px 10px', borderRadius: 6,
                background: `rgba(${m.r},${m.g},${m.b},0.05)`,
                border: `1px solid rgba(${m.r},${m.g},${m.b},0.08)`
              }}>
                <span style={{ fontSize: 9.5, color: `rgba(${m.r},${m.g},${m.b},0.3)`, flexShrink: 0, paddingTop: 1 }}>
                  {log.time}
                </span>
                <span style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.75)`, flex: 1, lineHeight: 1.5 }}>
                  {log.text}
                </span>
                <span onClick={() => removeLog(log.id)} style={{
                  fontSize: 12, color: `rgba(${m.r},${m.g},${m.b},0.2)`,
                  cursor: 'pointer', flexShrink: 0, paddingTop: 1
                }}>×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* log input */}
      <div style={{
        padding: 10,
        borderTop: `1px solid rgba(${m.r},${m.g},${m.b},0.07)`,
        display: 'flex', gap: 6
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addLog()}
          placeholder="log something done..."
          style={{
            flex: 1,
            background: `rgba(${m.r},${m.g},${m.b},0.05)`,
            border: `1px solid rgba(${m.r},${m.g},${m.b},0.12)`,
            borderRadius: 6, padding: '6px 9px',
            color: `rgba(${m.r},${m.g},${m.b},0.85)`,
            fontSize: 11, outline: 'none', fontFamily: 'inherit'
          }}
        />
        <button onClick={addLog} style={{
          background: `rgba(${m.r},${m.g},${m.b},0.1)`,
          border: `1px solid rgba(${m.r},${m.g},${m.b},0.2)`,
          borderRadius: 6, color: m.hex,
          padding: '6px 10px', cursor: 'pointer', fontSize: 12
        }}>+</button>
      </div>
    </div>
  )
}