import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import NeuralSphere from '../components/Sphere/NeuralSphere'

const TAGLINES = [
  'Think faster.',
  'Build smarter.',
  'Never lose an idea again.',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [tagline, setTagline] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTagline(t => (t + 1) % TAGLINES.length)
        setVisible(true)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      height: '100vh', width: '100vw',
      background: 'linear-gradient(135deg, #05070f 0%, #080d1a 50%, #05070f 100%)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative'
    }}>

      {/* nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', flexShrink: 0, zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.18em', color: '#8da5dd' }}>
          MYELIN
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 20px', borderRadius: 8,
            border: '1px solid rgba(122, 188, 199, 0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s'
          }}>
            log in
          </button>
          <button onClick={() => navigate('/signup')} style={{
            padding: '8px 20px', borderRadius: 8,
            border: '1px solid rgba(75, 152, 194, 0.4)',
            background: 'rgba(134,197,134,0.1)', color: '#b4c5dc',
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: 500, transition: 'all 0.2s'
          }}>
            get started
          </button>
        </div>
      </nav>

      {/* main content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        padding: '0 48px', gap: 0, position: 'relative'
      }}>

        {/* left — copy */}
        <div style={{ flex: 1, zIndex: 10, maxWidth: 520 }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px', borderRadius: 20,
            border: '1px solid rgba(134,197,134,0.25)',
            background: 'rgba(134,197,134,0.07)',
            color: '#9abcf8', fontSize: 11,
            letterSpacing: '0.1em', marginBottom: 28
          }}>
            SECOND BRAIN OS — POWERED BY GEMINI AI
          </div>

          <h1 style={{
            fontSize: 54, fontWeight: 800, lineHeight: 1.1,
            marginBottom: 16, letterSpacing: '-0.02em'
          }}>
            Your mind,<br />
            <span style={{ color: '#7bb1e6' }}>mapped.</span>
          </h1>

          <div style={{
            fontSize: 22, color: 'rgba(255,255,255,0.45)',
            marginBottom: 12, height: 32,
            transition: 'opacity 0.4s ease',
            opacity: visible ? 1 : 0
          }}>
            {TAGLINES[tagline]}
          </div>

          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.3)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 420
          }}>
            Myelin is an AI-powered second brain for students and builders.
            Map your projects, ideas, and habits onto a living neural network.
            Let AI brainstorm, schedule, and surface what matters — before you burn out.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
            <button onClick={() => navigate('/signup')} style={{
              padding: '13px 32px', borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg,  #3968b3, #7daed0)',
              color: '#05070f', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '0.02em', transition: 'all 0.2s',
              boxShadow: '0 0 32px rgba(132, 158, 241, 0.25)'
            }}>
              build your brain
            </button>
            <button onClick={() => navigate('/login')} style={{
              padding: '13px 32px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.5)', fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
            }}>
              sign in
            </button>
          </div>

          {/* feature pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['RAG-powered chat', 'Mood tracking', 'Burnout detection', 'Semantic search', 'Habit AI'].map(f => (
              <span key={f} style={{
                padding: '4px 12px', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.3)', fontSize: 11
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* right — 3D sphere */}
        <div style={{
          width: 900, height: 500, flexShrink: 0,
          position: 'relative', right: -40
        }}>
          {/* glow behind sphere */}
          <div style={{
            position: 'absolute', inset: '10%',
            background: 'radial-gradient(circle, rgba(91, 140, 221, 0.12) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
          }} />
          <NeuralSphere color="#78b1d3" interactive={true} />
        </div>
      </div>

      {/* bottom stats bar */}
      <div style={{
        borderTop: '1px solid rgba(61, 166, 232, 0.04)',
        padding: '16px 48px',
        display: 'flex', gap: 48, flexShrink: 0, zIndex: 10
      }}>
        {[
          { label: 'AI models integrated', value: '4' },
          { label: 'Built for APAC builders', value: '1000+' },
          { label: 'Powered by', value: 'Gemini 1.5' },
          { label: 'Vector search', value: 'ChromaDB' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#6b80e8' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}