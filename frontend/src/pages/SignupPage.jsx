import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NeuralSphere from '../components/Sphere/NeuralSphere'
import api from '../api/client'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSignup = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    const res = await api.post('/auth/signup', form)
    const userData = { id: res.data.user_id, email: res.data.email, name: res.data.name }
    const token = res.data.token

    localStorage.setItem('myelin_token', token)
    localStorage.setItem('myelin_user', JSON.stringify(userData))

    setTimeout(() => navigate('/brain'), 100)
  } catch (err) {
    setError(err.response?.data?.detail || 'Signup failed')
    setLoading(false)
  }
}

  const fields = [
    { key: 'name', label: 'YOUR NAME', type: 'text', placeholder: 'Piyusha' },
    { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com' },
    { key: 'password', label: 'PASSWORD', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      height: '100vh', width: '100vw',
      background: 'linear-gradient(135deg, #03060f 0%, #060d1a 50%, #03060f 100%)',
      display: 'flex', overflow: 'hidden'
    }}>
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 56px',
        borderRight: '1px solid rgba(0,180,255,0.07)', flexShrink: 0
      }}>
        <div onClick={() => navigate('/')} style={{
          fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
          color: '#00c8ff', marginBottom: 52, cursor: 'pointer',
          textShadow: '0 0 20px rgba(0,200,255,0.4)'
        }}>
          MYELIN
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Build your second brain</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>
          Map your mind. Let AI do the rest.
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.2)',
            color: 'rgba(255,120,120,0.8)', fontSize: 13
          }}>{error}</div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, color: 'rgba(0,200,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
                {f.label}
              </label>
              <input
                type={f.type} value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder} required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 8,
                  border: '1px solid rgba(0,180,255,0.12)',
                  background: 'rgba(0,180,255,0.04)',
                  color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit'
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? 'rgba(0,200,255,0.2)' : 'linear-gradient(135deg, #00c8ff, #0080cc)',
            color: '#03060f', fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 0 24px rgba(0,200,255,0.25)'
          }}>
            {loading ? 'creating your brain...' : 'get started'}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#00c8ff', cursor: 'pointer' }}>
            sign in
          </span>
        </p>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: '20%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)'
        }} />
        <div style={{ width: '85%', height: '85%' }}>
          <NeuralSphere color="#00c8ff" interactive={true} />
        </div>
      </div>
    </div>
  )
}
