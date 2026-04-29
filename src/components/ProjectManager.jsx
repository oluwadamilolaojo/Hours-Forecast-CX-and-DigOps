import { useState } from 'react'
import { C, FONT, tag as tagStyle } from '../theme.js'
import { fmtMoney, getRevenue } from '../lib/revenue.js'

const COLORS = ['#F5A623','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316','#06B6D4','#A78BFA','#84CC16','#FB7185','#FBBF24','#34D399','#F87171','#60A5FA','#C084FC']

const EMPTY_PROJECT = {
  id: '', name: '', tag: 'CX', geo: '', color: '#3B82F6',
  rate: 12.00, otMultiplier: 1.25, billingMode: 'hourly', unit: '',
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_PROJECT)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inp = {
    background: '#F8FAFC',
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    color: C.text,
    fontFamily: FONT.mono,
    fontSize: 13,
    padding: '8px 10px',
    width: '100%',
    outline: 'none',
  }
  const focus = e => { e.target.style.borderColor = C.gold; e.target.style.background = '#FFFFFF' }
  const blur  = e => { e.target.style.borderColor = C.border; e.target.style.background = '#F8FAFC' }
  const lbl   = { fontSize: 10, color: C.textMuted, letterSpacing: '0.1em', display: 'block', marginBottom: 5 }

  function handleSave() {
    if (!form.name.trim()) return
    const id = form.id || `proj_${Date.now()}`
    onSave({ ...form, id, rate: parseFloat(form.rate) || 0, otMultiplier: parseFloat(form.otMultiplier) || 1.25 })
  }

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.borderLight}`,
      borderRadius: 6,
      padding: 24,
    }}>
      <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 20 }}>
        {initial?.id ? `Edit: ${initial.name}` : 'Add New Project'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Name */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>PROJECT NAME</label>
          <input style={inp} value={form.name} placeholder="e.g. Acme Corp"
            onFocus={focus} onBlur={blur}
            onChange={e => set('name', e.target.value)} />
        </div>

        {/* Tag */}
        <div>
          <label style={lbl}>TYPE</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['CX','Ops'].map(t => (
              <button key={t} onClick={() => set('tag', t)} style={{
                flex: 1, padding: '8px 0',
                background: form.tag === t ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${form.tag === t ? C.goldDim : C.borderLight}`,
                color: form.tag === t ? C.gold : C.textMuted,
                borderRadius: 4, cursor: 'pointer',
                fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.06em',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Geo */}
        <div>
          <label style={lbl}>GEOGRAPHY</label>
          <input style={inp} value={form.geo} placeholder="e.g. Lagos"
            onFocus={focus} onBlur={blur}
            onChange={e => set('geo', e.target.value)} />
        </div>

        {/* Billing mode */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>BILLING MODE</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'hourly', label: 'Hourly  ·  HC × Hrs × Rate' },
              { id: 'direct', label: 'Direct  ·  Enter revenue manually' },
            ].map(b => (
              <button key={b.id} onClick={() => set('billingMode', b.id)} style={{
                flex: 1, padding: '10px',
                background: form.billingMode === b.id ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${form.billingMode === b.id ? C.goldDim : C.borderLight}`,
                color: form.billingMode === b.id ? C.gold : C.textMuted,
                borderRadius: 4, cursor: 'pointer',
                fontFamily: FONT.mono, fontSize: 11,
                textAlign: 'left',
              }}>{b.label}</button>
            ))}
          </div>
        </div>

        {/* Rate (hourly only) */}
        {form.billingMode === 'hourly' && (
          <>
            <div>
              <label style={lbl}>BILLING RATE ($/hr or $/unit)</label>
              <input style={inp} type="number" value={form.rate} min="0" step="0.01"
                onFocus={focus} onBlur={blur}
                onChange={e => set('rate', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>OT MULTIPLIER</label>
              <input style={inp} type="number" value={form.otMultiplier} min="1" step="0.05"
                onFocus={focus} onBlur={blur}
                onChange={e => set('otMultiplier', e.target.value)} />
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>
                e.g. 1.25 = OT billed at 125% of base rate
              </div>
            </div>
            <div>
              <label style={lbl}>UNIT LABEL (optional)</label>
              <input style={inp} value={form.unit || ''} placeholder="leave blank for hrs"
                onFocus={focus} onBlur={blur}
                onChange={e => set('unit', e.target.value)} />
            </div>
          </>
        )}

        {/* Color */}
        <div style={{ gridColumn: form.billingMode === 'hourly' ? 'auto' : '1 / -1' }}>
          <label style={lbl}>COLOUR</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => set('color', c)} style={{
                width: 22, height: 22, borderRadius: '50%',
                background: c, cursor: 'pointer',
                border: form.color === c ? `3px solid white` : `2px solid transparent`,
                transition: 'transform 0.1s',
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={handleSave} style={{
          background: C.goldBg, border: `1px solid ${C.goldDim}`,
          color: C.gold, fontFamily: FONT.mono, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.08em', padding: '10px 24px', borderRadius: 4, cursor: 'pointer',
        }}>
          {initial?.id ? 'SAVE CHANGES' : 'ADD PROJECT'}
        </button>
        <button onClick={onCancel} style={{
          background: 'none', border: `1px solid ${C.border}`,
          color: C.textMuted, fontFamily: FONT.mono, fontSize: 12,
          padding: '10px 24px', borderRadius: 4, cursor: 'pointer',
        }}>
          CANCEL
        </button>
      </div>
    </div>
  )
}

export default function ProjectManager({ state, dispatch }) {
  const { projects, months, cells } = state
  const [editing, setEditing] = useState(null) // null | 'new' | project.id
  const [confirmDelete, setConfirmDelete] = useState(null)

  function saveProject(project) {
    if (editing === 'new') {
      dispatch({ type: 'ADD_PROJECT', project })
    } else {
      dispatch({ type: 'UPDATE_PROJECT', id: project.id, data: project })
    }
    setEditing(null)
  }

  function deleteProject(id) {
    dispatch({ type: 'DELETE_PROJECT', id })
    setConfirmDelete(null)
  }

  const projectTotals = projects.map(p => ({
    p, total: months.reduce((s, m) => s + getRevenue(p, cells[`${p.id}_${m.key}`], m.locked), 0)
  }))

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.gold }}>Projects</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
            Add, edit, or remove projects. Changes apply to all forecast months.
          </div>
        </div>
        {editing !== 'new' && (
          <button onClick={() => setEditing('new')} style={{
            background: C.goldBg, border: `1px solid ${C.goldDim}`,
            color: C.gold, fontFamily: FONT.mono, fontSize: 11,
            fontWeight: 600, letterSpacing: '0.08em',
            padding: '9px 18px', borderRadius: 4, cursor: 'pointer',
          }}>
            + ADD PROJECT
          </button>
        )}
      </div>

      {editing === 'new' && (
        <div style={{ marginBottom: 20 }}>
          <ProjectForm onSave={saveProject} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projectTotals.map(({ p, total }) => (
          editing === p.id ? (
            <ProjectForm key={p.id} initial={p} onSave={saveProject} onCancel={() => setEditing(null)} />
          ) : (
            <div key={p.id} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{ width: 4, height: 44, background: p.color, borderRadius: 2, flexShrink: 0 }} />

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                    <span style={tagStyle(p.tag)}>{p.tag}</span>
                    <span style={{ fontSize: 10, color: C.textDim }}>{p.geo}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.08em' }}>BILLING</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {p.billingMode === 'hourly' ? `$${p.rate}/${p.unit || 'hr'}` : 'Direct'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.08em' }}>OT MULT</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {p.billingMode === 'hourly' ? `${p.otMultiplier}×` : '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.08em' }}>FORECAST TOTAL</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.gold, marginTop: 2 }}>
                    {fmtMoney(total, true)}
                  </div>
                </div>

                <div style={{ fontSize: 10, color: C.textDim }}>
                  {months.length} months
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setEditing(p.id)} style={{
                  background: 'none', border: `1px solid ${C.border}`,
                  color: C.textMuted, fontFamily: FONT.mono, fontSize: 11,
                  padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                }}>
                  EDIT
                </button>
                {confirmDelete === p.id ? (
                  <>
                    <button onClick={() => deleteProject(p.id)} style={{
                      background: C.redBg, border: `1px solid ${C.red}`,
                      color: C.red, fontFamily: FONT.mono, fontSize: 11,
                      padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                    }}>
                      CONFIRM
                    </button>
                    <button onClick={() => setConfirmDelete(null)} style={{
                      background: 'none', border: `1px solid ${C.border}`,
                      color: C.textMuted, fontFamily: FONT.mono, fontSize: 11,
                      padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                    }}>
                      CANCEL
                    </button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} style={{
                    background: 'none', border: `1px solid ${C.border}`,
                    color: C.textDim, fontFamily: FONT.mono, fontSize: 11,
                    padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                  }}>
                    DELETE
                  </button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
