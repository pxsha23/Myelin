import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Brain/Sidebar'
import BrainCanvas from '../components/Brain/BrainCanvas'
import ChatPanel from '../components/Brain/ChatPanel'
import TimetablePanel from '../components/Brain/TimetablePanel'
import HabitsPanel from '../components/Brain/HabitsPanel'
import ReportPanel from '../components/Brain/ReportPanel'
import SearchPanel from '../components/Brain/SearchPanel'
import api from '../api/client'

const MOODS = [
  { id: 'focused',  hex: '#00c8ff', r: 0,   g: 200, b: 255, label: 'focused'  },
  { id: 'creative', hex: '#b4a0dc', r: 180, g: 160, b: 220, label: 'creative' },
  { id: 'tired',    hex: '#f0b4c8', r: 240, g: 180, b: 200, label: 'tired'    },
  { id: 'calm',     hex: '#82bedd', r: 130, g: 190, b: 221, label: 'calm'     },
  { id: 'stressed', hex: '#f0d278', r: 240, g: 210, b: 120, label: 'stressed' },
]

const STARTER_NODES = [
  { id: 's1', label: 'Myelin',    type: 'PROJECT', rx: 0.500, ry: 0.380 },
  { id: 's2', label: 'RAG',       type: 'IDEA',    rx: 0.390, ry: 0.270 },
  { id: 's3', label: 'Gemini',    type: 'PROJECT', rx: 0.340, ry: 0.580 },
  { id: 's4', label: 'Mood AI',   type: 'FEATURE', rx: 0.540, ry: 0.560 },
  { id: 's5', label: 'Habits',    type: 'IDEA',    rx: 0.650, ry: 0.430 },
  { id: 's6', label: 'Burnout',   type: 'TASK',    rx: 0.620, ry: 0.295 },
  { id: 's7', label: 'Brain UI',  type: 'FEATURE', rx: 0.510, ry: 0.195 },
  { id: 's8', label: 'Whisper',   type: 'TASK',    rx: 0.435, ry: 0.670 },
  { id: 's9', label: 'ChromaDB',  type: 'TASK',    rx: 0.285, ry: 0.450 },
]

export default function BrainPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [nodes, setNodes] = useState(STARTER_NODES)
  const [mood, setMood] = useState(MOODS[0])
  const [activePage, setActivePage] = useState('brain')

  useEffect(() => {
    // read directly from localStorage — no Zustand needed
    const token = localStorage.getItem('myelin_token')
    const stored = localStorage.getItem('myelin_user')

    if (!token || !stored) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(stored)
    setUser(parsedUser)

    // fetch nodes from DB
    api.get(`/nodes/?user_id=${parsedUser.id}`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setNodes(res.data)
        }
        // else keep starter nodes
      })
      .catch(() => {
        // keep starter nodes on error
      })
  }, [])

  const handleAddNode = async (label, type) => {
    const rx = 0.32 + Math.random() * 0.36
    const ry = 0.22 + Math.random() * 0.46
    const tempNode = { id: Date.now().toString(), label, type, rx, ry }
    setNodes(n => [...n, tempNode])

    if (user) {
      try {
        const res = await api.post(`/nodes/?user_id=${user.id}`, { label, type, rx, ry })
        setNodes(n => n.map(nd => nd.id === tempNode.id ? res.data : nd))
      } catch (err) {
        console.error('Failed to save node', err)
      }
    }
  }

  const handleMoodChange = async (m) => {
    setMood(m)
    if (user) {
      try {
        await api.post(`/mood/?user_id=${user.id}`, { mood: m.id })
      } catch (err) {}
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('myelin_token')
    localStorage.removeItem('myelin_user')
    navigate('/')
  }

  const rightPanel = () => {
    switch (activePage) {
      case 'timetable': return <TimetablePanel mood={mood} nodes={nodes} />
      case 'habits':    return <HabitsPanel mood={mood} nodes={nodes} />
      case 'report':    return <ReportPanel mood={mood} nodes={nodes} />
      case 'search':    return <SearchPanel mood={mood} nodes={nodes} />
      default:          return <ChatPanel mood={mood} nodes={nodes} user={user} />
    }
  }

  if (!user) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#03060f',
      color: '#00c8ff', fontSize: 13, letterSpacing: '0.1em'
    }}>
      loading...
    </div>
  )

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: '#03060f', overflow: 'hidden'
    }}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mood={mood}
        setMood={handleMoodChange}
        moods={MOODS}
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          height: 42,
          borderBottom: '1px solid rgba(0,180,255,0.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0
        }}>
          <span style={{
            fontSize: 11, letterSpacing: '0.08em',
            color: `rgba(${mood.r},${mood.g},${mood.b},0.35)`,
            transition: 'color 0.3s'
          }}>
            {mood.label} mode — {nodes.length} nodes
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
            {user.name || user.email}
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BrainCanvas mood={mood} nodes={nodes} addNode={handleAddNode} />
          <div style={{
            width: 272, flexShrink: 0,
            borderLeft: '1px solid rgba(0,180,255,0.07)',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(2,8,20,0.95)'
          }}>
            {rightPanel()}
          </div>
        </div>
      </div>
    </div>
  )
}