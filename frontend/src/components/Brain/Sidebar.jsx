const navItems = [
  { id: 'brain',     label: 'Brain map', icon: 'ti-brain'    },
  { id: 'timetable', label: 'Timetable', icon: 'ti-calendar' },
  { id: 'habits',    label: 'Habits',    icon: 'ti-flame'     },
  { id: 'report',    label: 'Report',    icon: 'ti-chart-bar' },
  { id: 'search',    label: 'Search',    icon: 'ti-search'    },
]

export default function Sidebar({ activePage, setActivePage, mood, setMood, moods, user, onLogout }) {
  return (
    <div style={{
      width: 188, background: 'rgba(2,8,20,0.98)',
      borderRight: '1px solid rgba(0,180,255,0.07)',
      display: 'flex', flexDirection: 'column',
      padding: '18px 10px', flexShrink: 0
    }}>
      <div style={{
  padding: '0 8px 28px',
  display: 'flex', alignItems: 'center', gap: 8
}}>
  <img
    src="/logo.png"
    alt="Myelin"
    style={{ width: 32, height: 32, imageRendering: 'pixelated' }}
  />
  <span style={{
    fontSize: 14, fontWeight: 700,
    letterSpacing: '0.18em', color: mood.hex,
    textShadow: `0 0 16px rgba(${mood.r},${mood.g},${mood.b},0.4)`,
    transition: 'all 0.3s'
  }}>MYELIN</span>
</div>

      {navItems.map(item => (
        <button key={item.id} onClick={() => setActivePage(item.id)} style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 10px', borderRadius: 7,
          border: activePage === item.id
            ? `1px solid rgba(${mood.r},${mood.g},${mood.b},0.2)`
            : '1px solid transparent',
          background: activePage === item.id
            ? `rgba(${mood.r},${mood.g},${mood.b},0.08)`
            : 'transparent',
          color: activePage === item.id ? mood.hex : 'rgba(150,180,220,0.28)',
          cursor: 'pointer', fontSize: 12, width: '100%',
          textAlign: 'left', marginBottom: 2,
          transition: 'all 0.15s', fontFamily: 'inherit'
        }}>
          <i className={`ti ${item.icon}`} style={{ fontSize: 15 }} />
          <span>{item.label}</span>
        </button>
      ))}

      <div style={{ marginTop: 'auto' }}>
        {/* mood dots */}
        <div style={{ padding: '0 8px', marginBottom: 16 }}>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginBottom: 10 }}>
            MOOD
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {moods.map(m => (
              <div key={m.id} title={m.label} onClick={() => setMood(m)} style={{
                width: mood.id === m.id ? 13 : 8,
                height: mood.id === m.id ? 13 : 8,
                borderRadius: '50%', background: m.hex,
                opacity: mood.id === m.id ? 1 : 0.3,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: mood.id === m.id ? `0 0 10px ${m.hex}` : 'none'
              }} />
            ))}
          </div>
        </div>

        {/* user info */}
        {user && (
          <div style={{
            padding: '10px 10px 0',
            borderTop: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6, letterSpacing: '0.04em' }}>
              {user.name || user.email?.split('@')[0]}
            </div>
            <button onClick={onLogout} style={{
              fontSize: 10.5, color: 'rgba(255,80,80,0.45)',
              background: 'transparent', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', padding: 0
            }}>
              sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}