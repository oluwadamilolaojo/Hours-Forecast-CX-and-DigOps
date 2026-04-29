import { C, FONT } from '../theme.js'

const TABS = [
  { id: 'forecast',  label: 'Forecast Builder' },
  { id: 'dashboard', label: 'Dashboard'         },
  { id: 'projects',  label: 'Projects'           },
  { id: 'analysis',  label: 'Analysis'           },
]

export default function Nav({ tab, setTab, onReset }) {
  return (
    <header style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 32, borderRight: `1px solid ${C.border}` }}>
        <div>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', color: C.gold }}>
            HUGO
          </div>
          <div style={{ fontSize: 9, color: C.textDim, letterSpacing: '0.12em', marginTop: 1 }}>
            REVENUE FORECAST
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav style={{ display: 'flex', gap: 0, flex: 1, paddingLeft: 12 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${C.gold}` : '2px solid transparent',
              color: tab === t.id ? C.gold : C.textMuted,
              fontFamily: FONT.mono,
              fontSize: 12,
              fontWeight: tab === t.id ? 600 : 400,
              letterSpacing: '0.06em',
              padding: '0 20px',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Reset */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: `1px solid ${C.border}`,
            color: C.textDim,
            fontFamily: FONT.mono,
            fontSize: 10,
            letterSpacing: '0.08em',
            padding: '6px 14px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          RESET DATA
        </button>
      </div>
    </header>
  )
}
