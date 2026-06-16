// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import NeuralSphere from '../components/Sphere/NeuralSphere'

// export default function LoginPage() {
//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     // auth wired up next session
//     setTimeout(() => {
//       setLoading(false)
//       navigate('/brain')
//     }, 1000)
//   }

//   return (
//     <div style={{
//       height: '100vh', width: '100vw',
//       background: 'linear-gradient(135deg, #05070f 0%, #080d1a 50%, #05070f 100%)',
//       display: 'flex', overflow: 'hidden'
//     }}>
//       {/* left — form */}
//       <div style={{
//         width: 480, display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', padding: '0 56px',
//         borderRight: '1px solid rgba(255,255,255,0.04)', flexShrink: 0
//       }}>
//         <div
//           onClick={() => navigate('/')}
//           style={{
//             fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
//             color: '#8db2e1', marginBottom: 52, cursor: 'pointer'
//           }}
//         >
//           MYELIN
//         </div>

//         <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
//           Welcome back
//         </h2>
//         <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>
//           Your brain is waiting
//         </p>

//         <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               EMAIL
//             </label>
//             <input
//               type="email" value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(255,255,255,0.09)',
//                 background: 'rgba(255,255,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none',
//                 fontFamily: 'inherit', transition: 'border 0.2s'
//               }}
//             />
//           </div>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               PASSWORD
//             </label>
//             <input
//               type="password" value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(255,255,255,0.09)',
//                 background: 'rgba(255,255,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none',
//                 fontFamily: 'inherit'
//               }}
//             />
//           </div>

//           <button type="submit" disabled={loading} style={{
//             marginTop: 8, padding: '13px', borderRadius: 10,
//             border: 'none',
//             background: loading ? 'rgba(134,197,134,0.3)' : 'linear-gradient(135deg, #3968b3, #7daed0)',
//             color: '#05070f', fontSize: 14, fontWeight: 700,
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontFamily: 'inherit', letterSpacing: '0.02em',
//             transition: 'all 0.2s',
//             boxShadow: loading ? 'none' : '0 0 24px rgba(152, 134, 197, 0.2)'
//           }}>
//             {loading ? 'signing in...' : 'sign in'}
//           </button>
//         </form>

//         <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
//           No account?{' '}
//           <span
//             onClick={() => navigate('/signup')}
//             style={{ color: '#86a8c5', cursor: 'pointer' }}
//           >
//             create one
//           </span>
//         </p>
//       </div>

//       {/* right — sphere */}
//       <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{
//           position: 'absolute', inset: '20%',
//           background: 'radial-gradient(circle, rgba(117, 115, 253, 0.1) 0%, transparent 70%)',
//           borderRadius: '50%', filter: 'blur(60px)'
//         }} />
//         <div style={{ width: '60%', height: '80%' }}>
//           <NeuralSphere color="#86a8c5" interactive={false} />
//         </div>
//         <div style={{
//           position: 'absolute', bottom: 30, left: 0, right: 0,
//           textAlign: 'center', fontSize: 12,
//           color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em'
//         }}>
//           EXPLORE YOUR MIND PALACE
//         </div>
//       </div>
//     </div>
//   )
// }









// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import NeuralSphere from '../components/Sphere/NeuralSphere'
// import api from '../api/client'

// export default function LoginPage() {
//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     try {
//       const res = await api.post('/auth/login', { email, password })
//       localStorage.setItem('myelin_token', res.data.token)
//       localStorage.setItem('myelin_user', JSON.stringify({
//         id: res.data.user_id,
//         email: res.data.email,
//         name: res.data.name
//       }))
//       navigate('/brain')
//     } catch (err) {
//       setError('Invalid email or password')
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{
//       height: '100vh', width: '100vw',
//       background: 'linear-gradient(135deg, #03060f 0%, #060d1a 50%, #03060f 100%)',
//       display: 'flex', overflow: 'hidden'
//     }}>
//       <div style={{
//         width: 480, display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', padding: '0 56px',
//         borderRight: '1px solid rgba(0,180,255,0.07)', flexShrink: 0
//       }}>
//         <div onClick={() => navigate('/')} style={{
//           fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
//           color: '#00c8ff', marginBottom: 52, cursor: 'pointer',
//           textShadow: '0 0 20px rgba(0,200,255,0.4)'
//         }}>
//           MYELIN
//         </div>

//         <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
//         <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>
//           Your brain is waiting
//         </p>

//         {error && (
//           <div style={{
//             padding: '10px 14px', borderRadius: 8, marginBottom: 16,
//             background: 'rgba(255,80,80,0.08)',
//             border: '1px solid rgba(255,80,80,0.2)',
//             color: 'rgba(255,120,120,0.8)', fontSize: 13
//           }}>{error}</div>
//         )}

//         <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(0,200,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               EMAIL
//             </label>
//             <input
//               type="email" value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="you@example.com" required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(0,180,255,0.12)',
//                 background: 'rgba(0,180,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit'
//               }}
//             />
//           </div>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(0,200,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               PASSWORD
//             </label>
//             <input
//               type="password" value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••" required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(0,180,255,0.12)',
//                 background: 'rgba(0,180,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit'
//               }}
//             />
//           </div>

//           <button type="submit" disabled={loading} style={{
//             marginTop: 8, padding: '13px', borderRadius: 10, border: 'none',
//             background: loading ? 'rgba(0,200,255,0.2)' : 'linear-gradient(135deg, #00c8ff, #0080cc)',
//             color: '#03060f', fontSize: 14, fontWeight: 700,
//             cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
//             boxShadow: loading ? 'none' : '0 0 24px rgba(0,200,255,0.25)'
//           }}>
//             {loading ? 'signing in...' : 'sign in'}
//           </button>
//         </form>

//         <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
//           No account?{' '}
//           <span onClick={() => navigate('/signup')} style={{ color: '#00c8ff', cursor: 'pointer' }}>
//             create one
//           </span>
//         </p>
//       </div>

//       <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{
//           position: 'absolute', inset: '20%',
//           background: 'radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%)',
//           borderRadius: '50%', filter: 'blur(60px)'
//         }} />
//         <div style={{ width: '85%', height: '85%' }}>
//           <NeuralSphere color="#00c8ff" interactive={true} />
//         </div>
//       </div>
//     </div>
//   )
// }













// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import NeuralSphere from '../components/Sphere/NeuralSphere'

// export default function LoginPage() {
//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     // auth wired up next session
//     setTimeout(() => {
//       setLoading(false)
//       navigate('/brain')
//     }, 1000)
//   }

//   return (
//     <div style={{
//       height: '100vh', width: '100vw',
//       background: 'linear-gradient(135deg, #05070f 0%, #080d1a 50%, #05070f 100%)',
//       display: 'flex', overflow: 'hidden'
//     }}>
//       {/* left — form */}
//       <div style={{
//         width: 480, display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', padding: '0 56px',
//         borderRight: '1px solid rgba(255,255,255,0.04)', flexShrink: 0
//       }}>
//         <div
//           onClick={() => navigate('/')}
//           style={{
//             fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
//             color: '#8db2e1', marginBottom: 52, cursor: 'pointer'
//           }}
//         >
//           MYELIN
//         </div>

//         <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
//           Welcome back
//         </h2>
//         <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>
//           Your brain is waiting
//         </p>

//         <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               EMAIL
//             </label>
//             <input
//               type="email" value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(255,255,255,0.09)',
//                 background: 'rgba(255,255,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none',
//                 fontFamily: 'inherit', transition: 'border 0.2s'
//               }}
//             />
//           </div>
//           <div>
//             <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
//               PASSWORD
//             </label>
//             <input
//               type="password" value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               style={{
//                 width: '100%', padding: '11px 14px', borderRadius: 8,
//                 border: '1px solid rgba(255,255,255,0.09)',
//                 background: 'rgba(255,255,255,0.04)',
//                 color: '#fff', fontSize: 14, outline: 'none',
//                 fontFamily: 'inherit'
//               }}
//             />
//           </div>

//           <button type="submit" disabled={loading} style={{
//             marginTop: 8, padding: '13px', borderRadius: 10,
//             border: 'none',
//             background: loading ? 'rgba(134,197,134,0.3)' : 'linear-gradient(135deg, #3968b3, #7daed0)',
//             color: '#05070f', fontSize: 14, fontWeight: 700,
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontFamily: 'inherit', letterSpacing: '0.02em',
//             transition: 'all 0.2s',
//             boxShadow: loading ? 'none' : '0 0 24px rgba(152, 134, 197, 0.2)'
//           }}>
//             {loading ? 'signing in...' : 'sign in'}
//           </button>
//         </form>

//         <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
//           No account?{' '}
//           <span
//             onClick={() => navigate('/signup')}
//             style={{ color: '#86a8c5', cursor: 'pointer' }}
//           >
//             create one
//           </span>
//         </p>
//       </div>

//       {/* right — sphere */}
//       <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{
//           position: 'absolute', inset: '20%',
//           background: 'radial-gradient(circle, rgba(117, 115, 253, 0.1) 0%, transparent 70%)',
//           borderRadius: '50%', filter: 'blur(60px)'
//         }} />
//         <div style={{ width: '60%', height: '80%' }}>
//           <NeuralSphere color="#86a8c5" interactive={false} />
//         </div>
//         <div style={{
//           position: 'absolute', bottom: 30, left: 0, right: 0,
//           textAlign: 'center', fontSize: 12,
//           color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em'
//         }}>
//           EXPLORE YOUR MIND PALACE
//         </div>
//       </div>
//     </div>
//   )
// }









import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NeuralSphere from '../components/Sphere/NeuralSphere'
import api from '../api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('myelin_token', res.data.token)
      localStorage.setItem('myelin_user', JSON.stringify({
        id: res.data.user_id,
        email: res.data.email,
        name: res.data.name
      }))
      setTimeout(() => navigate('/brain'), 100)
    } catch (err) {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

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

        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 36 }}>
          Your brain is waiting
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.2)',
            color: 'rgba(255,120,120,0.8)', fontSize: 13
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(0,200,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
              EMAIL
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 8,
                border: '1px solid rgba(0,180,255,0.12)',
                background: 'rgba(0,180,255,0.04)',
                color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(0,200,255,0.35)', letterSpacing: '0.08em', display: 'block', marginBottom: 7 }}>
              PASSWORD
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 8,
                border: '1px solid rgba(0,180,255,0.12)',
                background: 'rgba(0,180,255,0.04)',
                color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? 'rgba(0,200,255,0.2)' : 'linear-gradient(135deg, #00c8ff, #0080cc)',
            color: '#03060f', fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            boxShadow: loading ? 'none' : '0 0 24px rgba(0,200,255,0.25)'
          }}>
            {loading ? 'signing in...' : 'sign in'}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
          No account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: '#00c8ff', cursor: 'pointer' }}>
            create one
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