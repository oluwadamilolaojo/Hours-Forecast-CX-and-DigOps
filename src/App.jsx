import { useReducer, useEffect, useState } from 'react'
import { INITIAL_MONTHS, INITIAL_PROJECTS, INITIAL_CELLS, nextMonthKey } from './data/initial.js'
import { C, FONT } from './theme.js'
import Nav from './components/Nav.jsx'
import Dashboard from './components/Dashboard.jsx'
import ForecastBuilder from './components/ForecastBuilder.jsx'
import ProjectManager from './components/ProjectManager.jsx'
import Analysis from './components/Analysis.jsx'

// ─── STATE ────────────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  projects: INITIAL_PROJECTS,
  months:   INITIAL_MONTHS,
  cells:    INITIAL_CELLS,
}

function loadState() {
  try {
    const saved = localStorage.getItem('hugo-forecast-v2')
    return saved ? JSON.parse(saved) : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function reducer(state, action) {
  switch (action.type) {

    case 'UPDATE_CELL': {
      const key = `${action.projectId}_${action.monthKey}`
      return {
        ...state,
        cells: {
          ...state.cells,
          [key]: { ...state.cells[key], ...action.data },
        },
      }
    }

    case 'ADD_MONTH': {
      const next = nextMonthKey(state.months)
      // Seed each project's new month with defaults from its most recent unlocked month
      const newCells = { ...state.cells }
      state.projects.forEach(project => {
        const recent = [...state.months]
          .reverse()
          .find(m => !m.locked && state.cells[`${project.id}_${m.key}`])
        const ref = recent ? state.cells[`${project.id}_${recent.key}`] : {}
        newCells[`${project.id}_${next.key}`] = {
          headcount:    ref.headcount    || 0,
          hoursPerHead: ref.hoursPerHead || 160,
          otHours:      0,
          revenue:      project.billingMode === 'direct' ? (ref.revenue || 0) : undefined,
        }
      })
      return { ...state, months: [...state.months, next], cells: newCells }
    }

    case 'ADD_PROJECT': {
      const newCells = { ...state.cells }
      state.months.forEach(month => {
        newCells[`${action.project.id}_${month.key}`] = {
          headcount:    0,
          hoursPerHead: month.stdHours,
          otHours:      0,
          revenue:      action.project.billingMode === 'direct' ? 0 : undefined,
        }
      })
      return {
        ...state,
        projects: [...state.projects, action.project],
        cells: newCells,
      }
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.id ? { ...p, ...action.data } : p
        ),
      }
    }

    case 'DELETE_PROJECT': {
      const newCells = { ...state.cells }
      state.months.forEach(month => {
        delete newCells[`${action.id}_${month.key}`]
      })
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.id),
        cells: newCells,
      }
    }

    case 'RESET':
      return DEFAULT_STATE

    default:
      return state
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, loadState)
  const [tab, setTab] = useState('forecast')

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem('hugo-forecast-v2', JSON.stringify(state))
  }, [state])

  const shared = { state, dispatch }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: C.bg }}>
      <Nav tab={tab} setTab={setTab} onReset={() => {
        if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
          dispatch({ type: 'RESET' })
        }
      }} />

      <main style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'dashboard' && <Dashboard {...shared} />}
        {tab === 'forecast'  && <ForecastBuilder {...shared} />}
        {tab === 'projects'  && <ProjectManager {...shared} />}
        {tab === 'analysis'  && <Analysis {...shared} />}
      </main>

      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: C.surface,
      }}>
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono }}>
          HUGO REVENUE FORECAST · {state.projects.length} PROJECTS · {state.months.length} MONTHS
        </span>
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono }}>
          All data stored locally in your browser
        </span>
      </footer>
    </div>
  )
}
