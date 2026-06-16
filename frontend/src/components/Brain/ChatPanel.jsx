import { useState } from 'react'
import api from '../../api/client'

export default function ChatPanel({ mood, nodes, user }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Neural map loaded. ${nodes.length} nodes active. Ask me anything about your brain.` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/chat/', {
  user_id: user?.id || 'guest',
  message: userMsg,
  mood: mood.id
})
      setMessages(m => [...m, { role: 'ai', text: res.data.response }])
    } catch (err) {
      setMessages(m => [...m, { role: 'ai', text: 'Could not reach Myelin API. Check your backend.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.08)`,
        fontSize: 10, letterSpacing: '0.1em',
        color: `rgba(${mood.r},${mood.g},${mood.b},0.35)`
      }}>
        MYELIN CHAT — RAG
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: 10,
        display: 'flex', flexDirection: 'column', gap: 7
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: 7,
            fontSize: 11, lineHeight: 1.6,
            background: msg.role === 'ai'
              ? `rgba(${mood.r},${mood.g},${mood.b},0.06)`
              : 'rgba(255,255,255,0.02)',
            color: msg.role === 'ai'
              ? `rgba(${mood.r},${mood.g},${mood.b},0.85)`
              : 'rgba(200,210,230,0.5)',
            border: msg.role === 'ai'
              ? `1px solid rgba(${mood.r},${mood.g},${mood.b},0.1)`
              : '1px solid rgba(255,255,255,0.05)',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'stretch',
            maxWidth: '94%', whiteSpace: 'pre-wrap'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{
            padding: '8px 10px', borderRadius: 7, fontSize: 11,
            color: `rgba(${mood.r},${mood.g},${mood.b},0.4)`,
            border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.08)`,
            background: `rgba(${mood.r},${mood.g},${mood.b},0.04)`
          }}>
            thinking...
          </div>
        )}
      </div>

      <div style={{
        padding: 9,
        borderTop: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.07)`,
        display: 'flex', gap: 6
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="ask about your nodes..."
          style={{
            flex: 1,
            background: `rgba(${mood.r},${mood.g},${mood.b},0.05)`,
            border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.12)`,
            borderRadius: 6, padding: '6px 9px',
            color: `rgba(${mood.r},${mood.g},${mood.b},0.85)`,
            fontSize: 11, outline: 'none', fontFamily: 'inherit'
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: `rgba(${mood.r},${mood.g},${mood.b},0.1)`,
          border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.2)`,
          borderRadius: 6, color: mood.hex,
          padding: '6px 10px', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 12, opacity: loading ? 0.5 : 1
        }}>→</button>
      </div>
    </div>
  )
}