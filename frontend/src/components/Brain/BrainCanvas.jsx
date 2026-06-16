// import { useEffect, useRef, useState } from 'react'
// import api from '../../api/client'

// const NODE_TYPES = ['PROJECT', 'IDEA', 'TASK', 'FEATURE', 'HABIT', 'GOAL']

// function rgba(m, a) {
//   return `rgba(${m.r},${m.g},${m.b},${a})`
// }

// function placeOnSphere(index, total, radius) {
//   const phi = Math.acos(1 - 2 * (index + 0.5) / total)
//   const theta = Math.PI * (1 + Math.sqrt(5)) * index
//   return {
//     ox: radius * Math.sin(phi) * Math.cos(theta),
//     oy: radius * Math.sin(phi) * Math.sin(theta),
//     oz: radius * Math.cos(phi),
//   }
// }

// export default function BrainCanvas({ mood, nodes, addNode }) {
//   const canvasRef = useRef(null)
//   const tickRef = useRef(0)
//   const rotRef = useRef({ x: 0.3, y: 0 })
//   const mouseRef = useRef({ x: 0, y: 0, down: false, lastX: 0, lastY: 0 })
//   const moodRef = useRef(mood)
//   const nodesRef = useRef(nodes)
//   const [aiResult, setAiResult] = useState(null) // { action, label, result }
//   const [aiLoading, setAiLoading] = useState(false)
//   const [hovered, setHovered] = useState(null)
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
//   const [showForm, setShowForm] = useState(false)
//   const [newLabel, setNewLabel] = useState('')
//   const [newType, setNewType] = useState('IDEA')

//   useEffect(() => { moodRef.current = mood }, [mood])
//   useEffect(() => { nodesRef.current = nodes }, [nodes])

//   useEffect(() => {
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     let raf

//     const resize = () => {
//       canvas.width = canvas.offsetWidth
//       canvas.height = canvas.offsetHeight
//     }
//     resize()
//     window.addEventListener('resize', resize)

//     const project = (x, y, z, W, H) => {
//       const fov = 900
//       const scale = fov / (fov + z)
//       return {
//         x: W / 2 + x * scale,
//         y: H / 2 + y * scale,
//         scale,
//         z
//       }
//     }

//     const rotate = (pt, rx, ry) => {
//       let { ox: x, oy: y, oz: z } = pt
//       const x1 = x * Math.cos(ry) - z * Math.sin(ry)
//       const z1 = x * Math.sin(ry) + z * Math.cos(ry)
//       const y1 = y * Math.cos(rx) - z1 * Math.sin(rx)
//       const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
//       return { x: x1, y: y1, z: z2 }
//     }

//     const loop = () => {
//       tickRef.current++
//       const t = tickRef.current
//       const W = canvas.width, H = canvas.height
//       const m = moodRef.current
//       const inner = nodesRef.current

//       if (!mouseRef.current.down) {
//         rotRef.current.y += 0.004
//       }

//       ctx.clearRect(0, 0, W, H)

//       const radius = Math.min(W, H) * 0.32
//       const bgRadius = Math.min(W, H) * 0.38

//       // build background sphere points
//       const bgPts = []
//       const bgCount = 100
//       for (let i = 0; i < bgCount; i++) {
//         const pt = placeOnSphere(i, bgCount, bgRadius)
//         const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
//         bgPts.push({ ...project(rot.x, rot.y, rot.z, W, H), orig: pt })
//       }

//       // ambient glow
//       const gr = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, bgRadius * 1.2)
//       gr.addColorStop(0, rgba(m, 0.08))
//       gr.addColorStop(1, rgba(m, 0))
//       ctx.fillStyle = gr
//       ctx.fillRect(0, 0, W, H)

//       // background sphere edges
//       for (let i = 0; i < bgPts.length; i++) {
//         for (let j = i + 1; j < bgPts.length; j++) {
//           const a = bgPts[i], b = bgPts[j]
//           const dist = Math.sqrt(
//             (a.orig.ox - b.orig.ox) ** 2 +
//             (a.orig.oy - b.orig.oy) ** 2 +
//             (a.orig.oz - b.orig.oz) ** 2
//           )
//           if (dist < bgRadius * 0.55) {
//             const alpha = ((a.scale + b.scale) / 2 - 0.5) * 0.4
//             ctx.beginPath()
//             ctx.moveTo(a.x, a.y)
//             ctx.lineTo(b.x, b.y)
//             ctx.strokeStyle = rgba(m, Math.max(0, alpha * 0.35))
//             ctx.lineWidth = 0.4
//             ctx.stroke()
//           }
//         }
//       }

//       // background sphere dots
//       bgPts.forEach(p => {
//         const alpha = (p.scale - 0.5) * 1.5
//         ctx.beginPath()
//         ctx.arc(p.x, p.y, p.scale * 2.2, 0, Math.PI * 2)
//         ctx.fillStyle = rgba(m, Math.max(0, alpha * 0.5))
//         ctx.fill()
//       })

//       // node points on sphere surface
//       const nodePts = inner.map((n, i) => {
//         const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
//         const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
//         return {
//           ...project(rot.x, rot.y, rot.z, W, H),
//           orig: pt, node: n, index: i
//         }
//       })

//       // node edges
//       nodePts.forEach((a, i) => {
//         nodePts.forEach((b, j) => {
//           if (j <= i) return
//           const dist = Math.sqrt(
//             (a.orig.ox - b.orig.ox) ** 2 +
//             (a.orig.oy - b.orig.oy) ** 2 +
//             (a.orig.oz - b.orig.oz) ** 2
//           )
//           if (dist < radius * 0.9) {
//             const isH = hovered && (a.node.id === hovered.id || b.node.id === hovered.id)
//             ctx.beginPath()
//             ctx.moveTo(a.x, a.y)
//             ctx.lineTo(b.x, b.y)
//             ctx.strokeStyle = rgba(m, isH ? 0.6 : 0.2)
//             ctx.lineWidth = isH ? 1.2 : 0.6
//             ctx.stroke()
//           }
//         })
//       })

//       // node dots + labels
//       nodePts.forEach(p => {
//         const isH = hovered && hovered.id === p.node.id
//         const alpha = (p.scale - 0.5) * 2
//         const nr = isH ? 7 : p.scale * 5

//         if (isH) {
//           const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30)
//           g.addColorStop(0, rgba(m, 0.35))
//           g.addColorStop(1, rgba(m, 0))
//           ctx.beginPath()
//           ctx.arc(p.x, p.y, 30, 0, Math.PI * 2)
//           ctx.fillStyle = g
//           ctx.fill()
//         }

//         ctx.beginPath()
//         ctx.arc(p.x, p.y, nr, 0, Math.PI * 2)
//         ctx.fillStyle = isH ? m.hex : rgba(m, Math.max(0.4, alpha * 0.9))
//         ctx.fill()
//         ctx.strokeStyle = rgba(m, isH ? 1 : 0.5)
//         ctx.lineWidth = isH ? 1.5 : 0.8
//         ctx.stroke()

//         if (p.scale > 0.85 || isH) {
//           ctx.font = `${isH ? 500 : 400} ${isH ? 10 : 9}px system-ui`
//           ctx.fillStyle = isH ? rgba(m, 1) : rgba(m, 0.65)
//           ctx.textAlign = 'center'
//           ctx.fillText(p.node.label, p.x, p.y + nr + 12)
//         }
//       })

//       raf = requestAnimationFrame(loop)
//     }
//     loop()

//     // mouse drag to rotate
//     const onDown = (e) => {
//       mouseRef.current.down = true
//       mouseRef.current.lastX = e.clientX
//       mouseRef.current.lastY = e.clientY
//     }
//     const onUp = () => { mouseRef.current.down = false }
//     const onMove = (e) => {
//       if (mouseRef.current.down) {
//         const dx = e.clientX - mouseRef.current.lastX
//         const dy = e.clientY - mouseRef.current.lastY
//         rotRef.current.y += dx * 0.005
//         rotRef.current.x += dy * 0.005
//         mouseRef.current.lastX = e.clientX
//         mouseRef.current.lastY = e.clientY
//         canvas.style.cursor = 'grabbing'
//         return
//       }

//       // hover detection
//       const rect = canvas.getBoundingClientRect()
//       const mx = (e.clientX - rect.left) * (canvas.width / rect.width)
//       const my = (e.clientY - rect.top) * (canvas.height / rect.height)
//       const W = canvas.width, H = canvas.height
//       const radius = Math.min(W, H) * 0.32
//       const inner = nodesRef.current

//       let found = null
//       let minDist = 30
//       inner.forEach((n, i) => {
//         const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
//         const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
//         const p = { x: W/2 + rot.x * (900/(900+rot.z)), y: H/2 + rot.y * (900/(900+rot.z)) }
//         const d = Math.hypot(mx - p.x, my - p.y)
//         if (d < minDist) { minDist = d; found = n }
//       })

//       setHovered(found)
//       if (found) {
//         const i = inner.indexOf(found)
//         const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
//         const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
//         const sx = rect.width / canvas.width
//         const sy = rect.height / canvas.height
//         const px = (W/2 + rot.x * (900/(900+rot.z))) * sx
//         const py = (H/2 + rot.y * (900/(900+rot.z))) * sy
//         setTooltipPos({
//           x: Math.min(px + 16, rect.width - 175),
//           y: Math.max(py - 60, 6)
//         })
//         canvas.style.cursor = 'pointer'
//       } else {
//         canvas.style.cursor = 'grab'
//       }
//     }

//     canvas.addEventListener('mousedown', onDown)
//     canvas.addEventListener('mouseup', onUp)
//     canvas.addEventListener('mousemove', onMove)
//     canvas.addEventListener('mouseleave', () => {
//       mouseRef.current.down = false
//       setHovered(null)
//       canvas.style.cursor = 'grab'
//     })

//     return () => {
//       cancelAnimationFrame(raf)
//       window.removeEventListener('resize', resize)
//     }
//   }, [])

//   // const handleAiAction = async (action) => {
//   //   if (!hovered) return
//   //   try {
//   //     const res = await api.post(`/nodes/${hovered.id}/${action}`)
//   //     window.dispatchEvent(new CustomEvent('myelin-ai-result', {
//   //       detail: { action, label: hovered.label, result: res.data.result }
//   //     }))
//   //   } catch (err) {
//   //     window.dispatchEvent(new CustomEvent('myelin-ai-result', {
//   //       detail: { action, label: hovered.label, result: 'AI unavailable — check your Gemini API key.' }
//   //     }))
//   //   }
//   //   setHovered(null)
//   // }
//   const handleAiAction = async (action) => {
//   if (!hovered) return
//   setAiLoading(true)
//   setAiResult({ action, label: hovered.label, result: null })
//   setHovered(null)
//   try {
//     const res = await api.post(`/nodes/${hovered.id}/${action}`)
//     setAiResult({ action, label: hovered.label, result: res.data.result })
//   } catch (err) {
//     setAiResult({ action, label: hovered.label, result: 'AI unavailable — check your Gemini API key.' })
//   } finally {
//     setAiLoading(false)
//   }
// }

//   const handleAdd = () => {
//     if (!newLabel.trim()) return
//     addNode(newLabel.trim(), newType)
//     setNewLabel('')
//     setNewType('IDEA')
//     setShowForm(false)
//   }

//   return (
//     <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab' }}>
//       <canvas
//         ref={canvasRef}
//         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
//       />

//       {/* drag hint */}
//       <div style={{
//         position: 'absolute', top: 12, left: '50%',
//         transform: 'translateX(-50%)',
//         fontSize: 10, color: `rgba(${mood.r},${mood.g},${mood.b},0.25)`,
//         letterSpacing: '0.08em', pointerEvents: 'none'
//       }}>
//         drag to rotate · scroll to zoom
//       </div>

//       {/* hover tooltip */}
//       {hovered && (
//         <div style={{
//           position: 'absolute', left: tooltipPos.x, top: tooltipPos.y,
//           background: '#020c1a',
//           border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.25)`,
//           borderRadius: 9, padding: '10px 13px', minWidth: 155,
//           pointerEvents: 'all', zIndex: 20,
//           boxShadow: `0 0 20px rgba(${mood.r},${mood.g},${mood.b},0.08)`
//         }}>
//           <div style={{ fontSize: 11.5, fontWeight: 600, color: mood.hex, marginBottom: 3 }}>
//             {hovered.label}
//           </div>
//           <div style={{
//             fontSize: 9.5, color: 'rgba(150,180,220,0.38)',
//             marginBottom: 9, letterSpacing: '0.07em'
//           }}>
//             {hovered.type}
//           </div>
//           <div style={{ display: 'flex', gap: 5 }}>
//             {['brainstorm', 'improve'].map(a => (
//               <button key={a} onClick={() => handleAiAction(a)} style={{
//                 padding: '4px 9px', borderRadius: 5,
//                 border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.22)`,
//                 background: 'transparent',
//                 color: `rgba(${mood.r},${mood.g},${mood.b},0.8)`,
//                 fontSize: 10, cursor: 'pointer', fontFamily: 'inherit'
//               }}>{a}</button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* add form */}
//       {showForm && (
//         <div style={{
//           position: 'absolute', bottom: 60, left: '50%',
//           transform: 'translateX(-50%)',
//           background: '#020c1a',
//           border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.18)`,
//           borderRadius: 12, padding: '16px 18px',
//           display: 'flex', flexDirection: 'column', gap: 11,
//           zIndex: 30, minWidth: 268,
//           boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
//         }}>
//           <div style={{ fontSize: 10, letterSpacing: '0.1em', color: `rgba(${mood.r},${mood.g},${mood.b},0.45)` }}>
//             NEW NODE
//           </div>
//           <input
//             autoFocus
//             value={newLabel}
//             onChange={e => setNewLabel(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && handleAdd()}
//             placeholder="node name..."
//             style={{
//               background: `rgba(${mood.r},${mood.g},${mood.b},0.05)`,
//               border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.15)`,
//               borderRadius: 7, padding: '8px 11px',
//               color: `rgba(${mood.r},${mood.g},${mood.b},0.9)`,
//               fontSize: 13, outline: 'none', fontFamily: 'inherit'
//             }}
//           />
//           <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//             {NODE_TYPES.map(t => (
//               <button key={t} onClick={() => setNewType(t)} style={{
//                 padding: '3px 9px', borderRadius: 5, fontSize: 10,
//                 border: `1px solid rgba(${mood.r},${mood.g},${mood.b},${newType === t ? 0.45 : 0.13})`,
//                 background: newType === t ? `rgba(${mood.r},${mood.g},${mood.b},0.1)` : 'transparent',
//                 color: newType === t ? mood.hex : `rgba(${mood.r},${mood.g},${mood.b},0.38)`,
//                 cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
//               }}>{t}</button>
//             ))}
//           </div>
//           <div style={{ display: 'flex', gap: 8 }}>
//             <button onClick={handleAdd} style={{
//               flex: 1, padding: '8px', borderRadius: 7,
//               background: `rgba(${mood.r},${mood.g},${mood.b},0.12)`,
//               border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.28)`,
//               color: mood.hex, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
//             }}>add to brain</button>
//             <button onClick={() => setShowForm(false)} style={{
//               padding: '8px 13px', borderRadius: 7, background: 'transparent',
//               border: '1px solid rgba(255,255,255,0.06)',
//               color: 'rgba(180,180,220,0.3)', fontSize: 12,
//               cursor: 'pointer', fontFamily: 'inherit'
//             }}>cancel</button>
//           </div>
//         </div>
//       )}

//       {/* add button */}
//       <button onClick={() => setShowForm(s => !s)} style={{
//         position: 'absolute', bottom: 18, left: '50%',
//         transform: 'translateX(-50%)',
//         background: `rgba(${mood.r},${mood.g},${mood.b},0.08)`,
//         border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.22)`,
//         borderRadius: 20, color: mood.hex,
//         padding: '7px 20px', fontSize: 11.5,
//         cursor: 'pointer', fontFamily: 'inherit',
//         letterSpacing: '0.06em', zIndex: 20, transition: 'all 0.2s',
//         boxShadow: `0 0 16px rgba(${mood.r},${mood.g},${mood.b},0.1)`
//       }}>
//         + add node
//       </button>
//       {aiResult && (
//   <div style={{
//     position: 'absolute', top: 16, right: 16,
//     width: 280, maxHeight: 'calc(100% - 32px)',
//     background: '#020c1a',
//     border: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.22)`,
//     borderRadius: 12, zIndex: 40,
//     display: 'flex', flexDirection: 'column',
//     boxShadow: `0 0 32px rgba(${mood.r},${mood.g},${mood.b},0.08)`
//   }}>
//     {/* header */}
//     <div style={{
//       padding: '10px 13px',
//       borderBottom: `1px solid rgba(${mood.r},${mood.g},${mood.b},0.1)`,
//       display: 'flex', alignItems: 'center', justifyContent: 'space-between'
//     }}>
//       <div>
//         <div style={{ fontSize: 10, letterSpacing: '0.1em', color: `rgba(${mood.r},${mood.g},${mood.b},0.4)` }}>
//           {aiResult.action.toUpperCase()}
//         </div>
//         <div style={{ fontSize: 12, fontWeight: 500, color: mood.hex, marginTop: 2 }}>
//           {aiResult.label}
//         </div>
//       </div>
//       <button onClick={() => setAiResult(null)} style={{
//         background: 'transparent', border: 'none',
//         color: `rgba(${mood.r},${mood.g},${mood.b},0.35)`,
//         cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 2
//       }}>×</button>
//     </div>

//     {/* body */}
//     <div style={{
//       padding: '11px 13px', overflowY: 'auto', flex: 1,
//       fontSize: 11, lineHeight: 1.7,
//       color: aiLoading
//         ? `rgba(${mood.r},${mood.g},${mood.b},0.35)`
//         : `rgba(${mood.r},${mood.g},${mood.b},0.8)`,
//       whiteSpace: 'pre-wrap'
//     }}>
//       {aiLoading ? 'thinking...' : aiResult.result}
//     </div>
//   </div>
// )}
//     </div>
//   )
// }






import { useEffect, useRef, useState } from 'react'
import api from '../../api/client'

const NODE_TYPES = ['PROJECT', 'IDEA', 'TASK', 'FEATURE', 'HABIT', 'GOAL']

const TYPE_CONNECTIONS = {
  PROJECT: ['TASK', 'FEATURE', 'GOAL'],
  TASK:    ['PROJECT', 'HABIT'],
  FEATURE: ['PROJECT', 'TASK'],
  IDEA:    ['GOAL', 'PROJECT', 'FEATURE'],
  GOAL:    ['HABIT', 'IDEA', 'PROJECT'],
  HABIT:   ['GOAL', 'TASK'],
}

function shouldConnect(typeA, typeB) {
  return TYPE_CONNECTIONS[typeA]?.includes(typeB) || TYPE_CONNECTIONS[typeB]?.includes(typeA)
}

function rgba(m, a) { return `rgba(${m.r},${m.g},${m.b},${a})` }

function placeOnSphere(index, total, radius) {
  const phi = Math.acos(1 - 2 * (index + 0.5) / total)
  const theta = Math.PI * (1 + Math.sqrt(5)) * index
  return {
    ox: radius * Math.sin(phi) * Math.cos(theta),
    oy: radius * Math.sin(phi) * Math.sin(theta),
    oz: radius * Math.cos(phi),
  }
}

export default function BrainCanvas({ mood, nodes, addNode }) {
  const canvasRef = useRef(null)
  const rotRef = useRef({ x: 0.3, y: 0 })
  const mouseRef = useRef({ down: false, lastX: 0, lastY: 0 })
  const moodRef = useRef(mood)
  const nodesRef = useRef(nodes)
  const tooltipHoveredRef = useRef(false)

  const [hovered, setHovered] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showForm, setShowForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState('IDEA')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => { moodRef.current = mood }, [mood])
  useEffect(() => { nodesRef.current = nodes }, [nodes])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const project = (x, y, z, W, H) => {
      const fov = 900
      const scale = fov / (fov + z)
      return { x: W / 2 + x * scale, y: H / 2 + y * scale, scale, z }
    }

    const rotate = (pt, rx, ry) => {
      let { ox: x, oy: y, oz: z } = pt
      const x1 = x * Math.cos(ry) - z * Math.sin(ry)
      const z1 = x * Math.sin(ry) + z * Math.cos(ry)
      const y1 = y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
      return { x: x1, y: y1, z: z2 }
    }

    const loop = () => {
      const W = canvas.width, H = canvas.height
      const m = moodRef.current
      const inner = nodesRef.current

      ctx.clearRect(0, 0, W, H)

      const radius = Math.min(W, H) * 0.32
      const bgRadius = Math.min(W, H) * 0.38

      const bgPts = []
      for (let i = 0; i < 100; i++) {
        const pt = placeOnSphere(i, 100, bgRadius)
        const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
        bgPts.push({ ...project(rot.x, rot.y, rot.z, W, H), orig: pt })
      }

      const gr = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, bgRadius * 1.2)
      gr.addColorStop(0, rgba(m, 0.08))
      gr.addColorStop(1, rgba(m, 0))
      ctx.fillStyle = gr
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < bgPts.length; i++) {
        for (let j = i + 1; j < bgPts.length; j++) {
          const a = bgPts[i], b = bgPts[j]
          const dist = Math.sqrt(
            (a.orig.ox - b.orig.ox) ** 2 + (a.orig.oy - b.orig.oy) ** 2 + (a.orig.oz - b.orig.oz) ** 2
          )
          if (dist < bgRadius * 0.55) {
            const alpha = ((a.scale + b.scale) / 2 - 0.5) * 0.4
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = rgba(m, Math.max(0, alpha * 0.35))
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      bgPts.forEach(p => {
        const alpha = (p.scale - 0.5) * 1.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.scale * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = rgba(m, Math.max(0, alpha * 0.5))
        ctx.fill()
      })

      const nodePts = inner.map((n, i) => {
        const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
        const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
        return { ...project(rot.x, rot.y, rot.z, W, H), orig: pt, node: n }
      })

      // meaningful connections
      nodePts.forEach((a, i) => {
        nodePts.forEach((b, j) => {
          if (j <= i) return
          if (!shouldConnect(a.node.type, b.node.type)) return
          const isH = hovered && (a.node.id === hovered.id || b.node.id === hovered.id)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = rgba(m, isH ? 0.55 : 0.18)
          ctx.lineWidth = isH ? 1.4 : 0.7
          ctx.stroke()
        })
      })

      // draw back nodes first (z < 0), then front
      const sorted = [...nodePts].sort((a, b) => a.z - b.z)

      sorted.forEach(p => {
        const isH = hovered && hovered.id === p.node.id
        const nr = isH ? 7 : Math.max(4, p.scale * 5)

        if (isH) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30)
          g.addColorStop(0, rgba(m, 0.35))
          g.addColorStop(1, rgba(m, 0))
          ctx.beginPath()
          ctx.arc(p.x, p.y, 30, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, nr, 0, Math.PI * 2)
        ctx.fillStyle = isH ? m.hex : rgba(m, 0.55)
        ctx.fill()
        ctx.strokeStyle = rgba(m, isH ? 1 : 0.45)
        ctx.lineWidth = isH ? 1.5 : 0.8
        ctx.stroke()

        // ALWAYS show label
        const fontSize = isH ? 10.5 : 9.5
        ctx.font = `${isH ? 500 : 400} ${fontSize}px system-ui`
        const textAlpha = isH ? 1 : 0.55 + (p.scale - 0.5) * 0.4
        ctx.fillStyle = isH ? rgba(m, 1) : rgba(m, Math.min(1, Math.max(0.4, textAlpha)))
        ctx.textAlign = 'center'

        // background pill for readability
        const label = p.node.label
        const tw = ctx.measureText(label).width
        const tx = p.x
        const ty = p.y + nr + 13
        ctx.fillStyle = 'rgba(2,8,20,0.55)'
        ctx.beginPath()
        ctx.roundRect(tx - tw/2 - 4, ty - fontSize, tw + 8, fontSize + 4, 3)
        ctx.fill()

        ctx.fillStyle = isH ? rgba(m, 1) : rgba(m, Math.min(1, Math.max(0.45, textAlpha)))
        ctx.fillText(label, tx, ty)
      })

      raf = requestAnimationFrame(loop)
    }
    loop()

    // drag to rotate
    const onDown = (e) => {
      mouseRef.current.down = true
      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
    }
    const onUp = () => { mouseRef.current.down = false }

    const onMove = (e) => {
      if (mouseRef.current.down) {
        const dx = e.clientX - mouseRef.current.lastX
        const dy = e.clientY - mouseRef.current.lastY
        rotRef.current.y += dx * 0.005
        rotRef.current.x += dy * 0.005
        mouseRef.current.lastX = e.clientX
        mouseRef.current.lastY = e.clientY
        canvas.style.cursor = 'grabbing'
        return
      }

      if (tooltipHoveredRef.current) return

      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width)
      const my = (e.clientY - rect.top) * (canvas.height / rect.height)
      const W = canvas.width, H = canvas.height
      const radius = Math.min(W, H) * 0.32
      const inner = nodesRef.current

      let found = null, minDist = 32
      inner.forEach((n, i) => {
        const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
        const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
        const p = { x: W/2 + rot.x * (900/(900+rot.z)), y: H/2 + rot.y * (900/(900+rot.z)) }
        const d = Math.hypot(mx - p.x, my - p.y)
        if (d < minDist) { minDist = d; found = n }
      })

      setHovered(found)
      if (found) {
        const i = inner.indexOf(found)
        const pt = placeOnSphere(i, Math.max(inner.length, 1), radius)
        const rot = rotate(pt, rotRef.current.x, rotRef.current.y)
        const sx = rect.width / canvas.width
        const sy = rect.height / canvas.height
        const px = (W/2 + rot.x * (900/(900+rot.z))) * sx
        const py = (H/2 + rot.y * (900/(900+rot.z))) * sy
        setTooltipPos({
          x: Math.min(px + 16, rect.width - 180),
          y: Math.max(py - 60, 6)
        })
        canvas.style.cursor = 'pointer'
      } else {
        canvas.style.cursor = 'grab'
      }
    }

    // scroll to rotate Y axis
    const onWheel = (e) => {
      e.preventDefault()
      rotRef.current.y += e.deltaX * 0.003
      rotRef.current.y += e.deltaY * 0.003
    }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mouseleave', () => {
      mouseRef.current.down = false
      if (!tooltipHoveredRef.current) setHovered(null)
      canvas.style.cursor = 'grab'
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleAiAction = async (action) => {
    if (!hovered) return
    const node = hovered
    setHovered(null)
    setAiLoading(true)
    setAiResult({ action, label: node.label, result: null })
    try {
      const res = await api.post(`/nodes/${node.id}/${action}`)
      setAiResult({ action, label: node.label, result: res.data.result })
    } catch {
      setAiResult({ action, label: node.label, result: 'AI unavailable.' })
    } finally {
      setAiLoading(false)
    }
  }

  const handleAdd = () => {
    if (!newLabel.trim()) return
    addNode(newLabel.trim(), newType)
    setNewLabel('')
    setNewType('IDEA')
    setShowForm(false)
  }

  const m = mood

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        fontSize: 10, color: `rgba(${m.r},${m.g},${m.b},0.22)`,
        letterSpacing: '0.08em', pointerEvents: 'none'
      }}>
        drag or scroll to rotate
      </div>

      {/* sticky tooltip */}
      {hovered && (
        <div
          onMouseEnter={() => { tooltipHoveredRef.current = true }}
          onMouseLeave={() => { tooltipHoveredRef.current = false; setHovered(null) }}
          style={{
            position: 'absolute', left: tooltipPos.x, top: tooltipPos.y,
            background: '#020c1a',
            border: `1px solid rgba(${m.r},${m.g},${m.b},0.25)`,
            borderRadius: 9, padding: '10px 13px', minWidth: 155,
            pointerEvents: 'all', zIndex: 20,
          }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: m.hex, marginBottom: 3 }}>{hovered.label}</div>
          <div style={{ fontSize: 9.5, color: 'rgba(150,180,220,0.38)', marginBottom: 9, letterSpacing: '0.07em' }}>
            {hovered.type}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['brainstorm', 'improve'].map(a => (
              <button key={a} onClick={() => handleAiAction(a)} style={{
                padding: '4px 9px', borderRadius: 5,
                border: `1px solid rgba(${m.r},${m.g},${m.b},0.22)`,
                background: 'transparent',
                color: `rgba(${m.r},${m.g},${m.b},0.8)`,
                fontSize: 10, cursor: 'pointer', fontFamily: 'inherit'
              }}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {/* AI result panel */}
      {aiResult && (
        <div style={{
          position: 'absolute', top: 16, right: 16, width: 268,
          maxHeight: 'calc(100% - 32px)', background: '#020c1a',
          border: `1px solid rgba(${m.r},${m.g},${m.b},0.22)`,
          borderRadius: 12, zIndex: 40, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '10px 13px',
            borderBottom: `1px solid rgba(${m.r},${m.g},${m.b},0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.4)` }}>
                {aiResult.action.toUpperCase()}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: m.hex, marginTop: 2 }}>{aiResult.label}</div>
            </div>
            <button onClick={() => setAiResult(null)} style={{
              background: 'transparent', border: 'none',
              color: `rgba(${m.r},${m.g},${m.b},0.35)`,
              cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2
            }}>×</button>
          </div>
          <div style={{
            padding: '11px 13px', overflowY: 'auto', flex: 1,
            fontSize: 11, lineHeight: 1.75,
            color: aiLoading ? `rgba(${m.r},${m.g},${m.b},0.35)` : `rgba(${m.r},${m.g},${m.b},0.8)`,
            whiteSpace: 'pre-wrap'
          }}>
            {aiLoading ? 'thinking...' : aiResult.result}
          </div>
        </div>
      )}

      {/* add form */}
      {showForm && (
        <div style={{
          position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
          background: '#020c1a',
          border: `1px solid rgba(${m.r},${m.g},${m.b},0.18)`,
          borderRadius: 12, padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 11,
          zIndex: 30, minWidth: 268,
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: `rgba(${m.r},${m.g},${m.b},0.45)` }}>NEW NODE</div>
          <input
            autoFocus value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="node name..."
            style={{
              background: `rgba(${m.r},${m.g},${m.b},0.05)`,
              border: `1px solid rgba(${m.r},${m.g},${m.b},0.15)`,
              borderRadius: 7, padding: '8px 11px',
              color: `rgba(${m.r},${m.g},${m.b},0.9)`,
              fontSize: 13, outline: 'none', fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {NODE_TYPES.map(t => (
              <button key={t} onClick={() => setNewType(t)} style={{
                padding: '3px 9px', borderRadius: 5, fontSize: 10,
                border: `1px solid rgba(${m.r},${m.g},${m.b},${newType === t ? 0.45 : 0.13})`,
                background: newType === t ? `rgba(${m.r},${m.g},${m.b},0.1)` : 'transparent',
                color: newType === t ? m.hex : `rgba(${m.r},${m.g},${m.b},0.38)`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{
              flex: 1, padding: '8px', borderRadius: 7,
              background: `rgba(${m.r},${m.g},${m.b},0.12)`,
              border: `1px solid rgba(${m.r},${m.g},${m.b},0.28)`,
              color: m.hex, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
            }}>add to brain</button>
            <button onClick={() => setShowForm(false)} style={{
              padding: '8px 13px', borderRadius: 7, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(180,180,220,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
            }}>cancel</button>
          </div>
        </div>
      )}

      <button onClick={() => setShowForm(s => !s)} style={{
        position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
        background: `rgba(${m.r},${m.g},${m.b},0.08)`,
        border: `1px solid rgba(${m.r},${m.g},${m.b},0.22)`,
        borderRadius: 20, color: m.hex, padding: '7px 20px', fontSize: 11.5,
        cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em',
        zIndex: 20, transition: 'all 0.2s',
        boxShadow: `0 0 16px rgba(${m.r},${m.g},${m.b},0.1)`
      }}>
        + add node
      </button>
    </div>
  )
}