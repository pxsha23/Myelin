import { useState } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function fmt(h) {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

export default function TimetablePanel({ mood, nodes }) {
  const taskNodes = nodes.filter(n => n.type === 'TASK' || n.type === 'HABIT' || n.type === 'PROJECT')
  const [blocks, setBlocks] = useState([])
  const [form, setForm] = useState(null) // { nodeId, startHour, duration }
  const [dragging, setDragging] = useState(null)

  const m = mood

  const openForm = (hour) => {
    if (taskNodes.length === 0) return
    setForm({ nodeId: taskNodes[0].id, startHour: hour, duration: 1 })
  }

  const addBlock = () => {
    if (!form) return
    const node = taskNodes.find(n => n.id === form.nodeId)
    if (!node) return
    setBlocks(b => [...b, { ...form, id: Date.now(), label: node.label, type: node.type }])
    setForm(null)
  }

  const removeBlock = (id) => setBlocks(b => b.filter(x => x.id !== id))

  const HOUR_H = 52

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid rgba(${m.r},${m.g},${m.b},0.08)`,
        fontSize: 10, letterSpacing: '0.1em',
        color: `rgba(${m.r},${m.g},${m.b},0.35)`
      }}>
        TIMETABLE — TODAY
      </div>

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* hour rows */}
        {HOURS.map(h => {
          const blocksThisHour = blocks.filter(b => b.startHour === h)
          return (
            <div key={h} onClick={() => openForm(h)} style={{
              display: 'flex', alignItems: 'flex-start',
              height: HOUR_H, borderBottom: `1px solid rgba(${m.r},${m.g},${m.b},0.05)`,
              cursor: 'pointer', position: 'relative',
              transition: 'background 0.1s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = `rgba(${m.r},${m.g},${m.b},0.03)`}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 52, flexShrink: 0, paddingTop: 6, paddingLeft: 10,
                fontSize: 9.5, color: `rgba(${m.r},${m.g},${m.b},0.25)`,
                letterSpacing: '0.04em', userSelect: 'none'
              }}>
                {fmt(h)}
              </div>
              <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {blocksThisHour.map(b => (
                  <div key={b.id} onClick={e => { e.stopPropagation(); removeBlock(b.id) }} style={{
                    background: `rgba(${m.r},${m.g},${m.b},0.12)`,
                    border: `1px solid rgba(${m.r},${m.g},${m.b},0.25)`,
                    borderRadius: 5, padding: '3px 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}>
                    <div>
                      <span style={{ fontSize: 11, color: m.hex }}>{b.label}</span>
                      <span style={{ fontSize: 9, color: `rgba(${m.r},${m.g},${m.b},0.4)`, marginLeft: 6 }}>
                        {b.duration}h
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.3)` }}>×</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* add block form */}
      {form && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#020c1a',
          borderTop: `1px solid rgba(${m.r},${m.g},${m.b},0.15)`,
          padding: '14px 16px', zIndex: 30,
          display: 'flex', flexDirection: 'column', gap: 10
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.4)` }}>
            SCHEDULE BLOCK — {fmt(form.startHour)}
          </div>
          <select
            value={form.nodeId}
            onChange={e => setForm(f => ({ ...f, nodeId: e.target.value }))}
            style={{
              background: `rgba(${m.r},${m.g},${m.b},0.06)`,
              border: `1px solid rgba(${m.r},${m.g},${m.b},0.15)`,
              borderRadius: 6, padding: '6px 9px',
              color: `rgba(${m.r},${m.g},${m.b},0.85)`,
              fontSize: 12, outline: 'none', fontFamily: 'inherit'
            }}
          >
            {taskNodes.map(n => (
              <option key={n.id} value={n.id} style={{ background: '#020c1a' }}>{n.label}</option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: `rgba(${m.r},${m.g},${m.b},0.4)` }}>Duration</span>
            {[1, 2, 3, 4].map(d => (
              <button key={d} onClick={() => setForm(f => ({ ...f, duration: d }))} style={{
                padding: '3px 10px', borderRadius: 5, fontSize: 11,
                border: `1px solid rgba(${m.r},${m.g},${m.b},${form.duration === d ? 0.4 : 0.12})`,
                background: form.duration === d ? `rgba(${m.r},${m.g},${m.b},0.1)` : 'transparent',
                color: form.duration === d ? m.hex : `rgba(${m.r},${m.g},${m.b},0.35)`,
                cursor: 'pointer', fontFamily: 'inherit'
              }}>{d}h</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addBlock} style={{
              flex: 1, padding: '7px', borderRadius: 6,
              background: `rgba(${m.r},${m.g},${m.b},0.1)`,
              border: `1px solid rgba(${m.r},${m.g},${m.b},0.25)`,
              color: m.hex, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
            }}>add</button>
            <button onClick={() => setForm(null)} style={{
              padding: '7px 12px', borderRadius: 6, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(180,180,220,0.25)', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit'
            }}>cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}