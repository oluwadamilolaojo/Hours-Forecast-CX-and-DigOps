import { useState } from 'react'
import { C, FONT, tag as tagStyle } from '../theme.js'
import { computeRevenue, getRevenue, getTotalHours, fmtMoney, fmtNum } from '../lib/revenue.js'

const COL_WIDTH  = 172
const ROW_HEIGHT = 148
const LABEL_W    = 210

// ─── LOCKED CELL ─────────────────────────────────────────────────────────────
function LockedCell({ project, cell }) {
  const rev   = cell?.revenue   || 0
  const hc    = cell?.headcount || 0
  const hours = cell?.totalHours || 0
  const ot    = cell?.otHours   || 0

  return (
    <div style={{
      height: ROW_HEIGHT,
      background: C.locked,
      borderRight: `1px solid ${C.lockedBorder}`,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 9, color: C.textDim, letterSpacing: '0.1em', marginBottom: 2,
      }}>
        🔒 ACTUAL
      </div>

      <div style={{
        fontFamily: FONT.display,
        fontSize: 18,
        fontWeight: 700,
        color: rev > 0 ? C.text : C.textDim,
      }}>
        {fmtMoney(rev, true)}
      </div>

      {hc > 0 && (
        <div style={{ fontSize: 10, color: C.textMuted }}>
          {hc} HC
        </div>
      )}
      {hours > 0 && (
        <div style={{ fontSize: 10, color: C.textMuted }}>
          {fmtNum(hours)} hrs
        </div>
      )}
      {ot > 0 && (
        <div style={{ fontSize: 10, color: C.goldDim }}>
          {fmtNum(ot)} OT hrs
        </div>
      )}
    </div>
  )
}

// ─── EDITABLE CELL — hourly billing ──────────────────────────────────────────
function HourlyCell({ project, cell, onChange }) {
  const hc  = cell?.headcount   ?? 0
  const hph = cell?.hoursPerHead ?? 160
  const ot  = cell?.otHours     ?? 0
  const rev = computeRevenue(project, cell)

  const inp = {
    background: '#F8FAFC',
    border: `1px solid ${C.border}`,
    borderRadius: 3,
    color: C.text,
    fontFamily: FONT.mono,
    fontSize: 13,
    padding: '4px 8px',
    width: 72,
    textAlign: 'right',
    outline: 'none',
  }
  const focusInp = (e) => { e.target.style.borderColor = C.gold; e.target.style.background = '#FFFFFF' }
  const blurInp  = (e) => { e.target.style.borderColor = C.border; e.target.style.background = '#F8FAFC' }

  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }
  const lbl = { fontSize: 10, color: C.textMuted, letterSpacing: '0.06em', minWidth: 52 }

  return (
    <div style={{
      height: ROW_HEIGHT,
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={row}>
        <span style={lbl}>HC</span>
        <input
          type="number" style={inp} value={hc || ''}
          placeholder="0"
          onFocus={focusInp} onBlur={blurInp}
          onChange={e => onChange({ headcount: Math.max(0, +e.target.value || 0) })}
        />
      </div>
      <div style={row}>
        <span style={lbl}>Hrs/HC</span>
        <input
          type="number" style={inp} value={hph || ''}
          placeholder="160"
          onFocus={focusInp} onBlur={blurInp}
          onChange={e => onChange({ hoursPerHead: Math.max(0, +e.target.value || 0) })}
        />
      </div>
      <div style={row}>
        <span style={lbl}>OT Hrs</span>
        <input
          type="number" style={inp} value={ot || ''}
          placeholder="0"
          onFocus={focusInp} onBlur={blurInp}
          onChange={e => onChange({ otHours: Math.max(0, +e.target.value || 0) })}
        />
      </div>

      <div style={{
        marginTop: 'auto',
        paddingTop: 6,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 9, color: C.textDim }}>
          {hc > 0 && hph > 0 ? `${fmtNum(hc * hph)} hrs` : ''}
        </span>
        <span style={{
          fontFamily: FONT.display,
          fontSize: 16,
          fontWeight: 700,
          color: rev > 0 ? C.gold : C.textDim,
        }}>
          {fmtMoney(rev, true)}
        </span>
      </div>
    </div>
  )
}

// ─── EDITABLE CELL — direct billing ──────────────────────────────────────────
function DirectCell({ project, cell, onChange }) {
  const hc  = cell?.headcount ?? 0
  const rev = cell?.revenue   ?? 0

  const inp = {
    background: '#F8FAFC',
    border: `1px solid ${C.border}`,
    borderRadius: 3,
    color: C.text,
    fontFamily: FONT.mono,
    fontSize: 13,
    padding: '4px 8px',
    width: 120,
    textAlign: 'right',
    outline: 'none',
  }
  const focusInp = (e) => { e.target.style.borderColor = C.gold; e.target.style.background = '#FFFFFF' }
  const blurInp  = (e) => { e.target.style.borderColor = C.border; e.target.style.background = '#F8FAFC' }
  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }
  const lbl = { fontSize: 10, color: C.textMuted, letterSpacing: '0.06em', minWidth: 52 }

  return (
    <div style={{
      height: ROW_HEIGHT,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={row}>
        <span style={lbl}>HC</span>
        <input
          type="number" style={{ ...inp, width: 72 }} value={hc || ''}
          placeholder="0"
          onFocus={focusInp} onBlur={blurInp}
          onChange={e => onChange({ headcount: Math.max(0, +e.target.value || 0) })}
        />
      </div>
      <div style={row}>
        <span style={lbl}>Revenue</span>
        <input
          type="number" style={inp} value={rev || ''}
          placeholder="0"
          onFocus={focusInp} onBlur={blurInp}
          onChange={e => onChange({ revenue: Math.max(0, +e.target.value || 0) })}
        />
      </div>
      <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>Direct billing</div>

      <div style={{
        marginTop: 'auto',
        paddingTop: 6,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <span style={{
          fontFamily: FONT.display,
          fontSize: 16,
          fontWeight: 700,
          color: rev > 0 ? C.gold : C.textDim,
        }}>
          {fmtMoney(rev, true)}
        </span>
      </div>
    </div>
  )
}

// ─── PROJECT LABEL ────────────────────────────────────────────────────────────
function ProjectLabel({ project, totalRev }) {
  return (
    <div style={{
      width: LABEL_W,
      minWidth: LABEL_W,
      height: ROW_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 16px',
      borderRight: `1px solid ${C.border}`,
      background: C.surface,
      position: 'sticky',
      left: 0,
      zIndex: 2,
    }}>
      <div style={{
        width: 3,
        height: 48,
        background: project.color,
        borderRadius: 2,
        flexShrink: 0,
      }} />
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          fontFamily: FONT.display,
          fontSize: 13,
          fontWeight: 700,
          color: C.text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {project.name}
        </div>
        <div style={{ marginTop: 3 }}>
          <span style={tagStyle(project.tag)}>{project.tag}</span>
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>
          {project.billingMode === 'hourly'
            ? `$${project.rate}${project.unit ? '/model' : '/hr'}`
            : 'Direct billing'}
        </div>
        <div style={{ fontSize: 11, color: C.gold, fontWeight: 600, marginTop: 2 }}>
          {fmtMoney(totalRev, true)} total
        </div>
      </div>
    </div>
  )
}

// ─── MONTH HEADER ─────────────────────────────────────────────────────────────
function MonthHeader({ month }) {
  return (
    <th style={{
      width: COL_WIDTH,
      minWidth: COL_WIDTH,
      padding: '12px 14px',
      textAlign: 'center',
      background: month.locked ? C.locked : C.surface,
      borderRight: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      color: month.locked ? C.textDim : C.gold,
      fontFamily: FONT.mono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      position: 'sticky',
      top: 0,
      zIndex: 3,
    }}>
      <div>{month.label} {month.year}</div>
      <div style={{
        fontSize: 9,
        marginTop: 3,
        color: month.locked ? C.textDim : C.textMuted,
        letterSpacing: '0.12em',
      }}>
        {month.locked ? '🔒 ACTUAL' : `${month.stdHours} std hrs`}
      </div>
    </th>
  )
}

// ─── FORECAST BUILDER ────────────────────────────────────────────────────────
export default function ForecastBuilder({ state, dispatch }) {
  const { projects, months, cells } = state

  function updateCell(projectId, monthKey, data) {
    dispatch({ type: 'UPDATE_CELL', projectId, monthKey, data })
  }

  // Monthly totals row
  const monthTotals = months.map(month => ({
    month,
    total: projects.reduce((sum, project) => {
      const cell = cells[`${project.id}_${month.key}`]
      return sum + getRevenue(project, cell, month.locked)
    }, 0),
  }))

  const grandTotal = monthTotals.reduce((s, m) => s + m.total, 0)

  return (
    <div style={{ padding: '20px 28px' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div>
          <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.gold }}>
            Forecast Builder
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
            Set HC + hrs/person for each unlocked month. Revenue computes automatically.
            Jan–Mar are locked actuals.
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'ADD_MONTH' })}
          style={{
            background: C.goldBg,
            border: `1px solid ${C.goldDim}`,
            color: C.gold,
            fontFamily: FONT.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            padding: '9px 18px',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          + ADD MONTH
        </button>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto', borderRadius: 6, border: `1px solid ${C.border}` }}>
        <table style={{ borderCollapse: 'collapse', minWidth: LABEL_W + months.length * COL_WIDTH }}>
          <thead>
            <tr>
              {/* Project column header */}
              <th style={{
                width: LABEL_W,
                minWidth: LABEL_W,
                padding: '12px 16px',
                textAlign: 'left',
                background: C.surface,
                borderRight: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
                color: C.textMuted,
                fontFamily: FONT.mono,
                fontSize: 11,
                letterSpacing: '0.08em',
                position: 'sticky',
                left: 0,
                zIndex: 4,
              }}>
                PROJECT
              </th>
              {months.map(m => <MonthHeader key={m.key} month={m} />)}
              {/* Total column header */}
              <th style={{
                width: 120,
                padding: '12px 14px',
                textAlign: 'right',
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                color: C.textMuted,
                fontFamily: FONT.mono,
                fontSize: 11,
                letterSpacing: '0.08em',
                position: 'sticky',
                top: 0,
                right: 0,
                zIndex: 3,
              }}>
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map(project => {
              const projTotal = monthTotals.reduce((s, mt) => {
                const cell = cells[`${project.id}_${mt.month.key}`]
                return s + getRevenue(project, cell, mt.month.locked)
              }, 0)

              return (
                <tr key={project.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 0, verticalAlign: 'top' }}>
                    <ProjectLabel project={project} totalRev={projTotal} />
                  </td>

                  {months.map(month => {
                    const cell = cells[`${project.id}_${month.key}`] || {}
                    return (
                      <td key={month.key} style={{ padding: 0, verticalAlign: 'top' }}>
                        {month.locked ? (
                          <LockedCell project={project} cell={cell} />
                        ) : project.billingMode === 'direct' ? (
                          <DirectCell
                            project={project}
                            cell={cell}
                            onChange={data => updateCell(project.id, month.key, data)}
                          />
                        ) : (
                          <HourlyCell
                            project={project}
                            cell={cell}
                            onChange={data => updateCell(project.id, month.key, data)}
                          />
                        )}
                      </td>
                    )
                  })}

                  {/* Row total */}
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    verticalAlign: 'middle',
                    background: C.surface,
                    position: 'sticky',
                    right: 0,
                    zIndex: 1,
                    borderLeft: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      fontFamily: FONT.display,
                      fontSize: 14,
                      fontWeight: 700,
                      color: projTotal > 0 ? C.text : C.textDim,
                    }}>
                      {fmtMoney(projTotal, true)}
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
                      {months.length}m total
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* Totals row */}
            <tr style={{ background: C.goldBgStrong }}>
              <td style={{
                padding: '14px 20px',
                background: 'rgba(245,166,35,0.12)',
                position: 'sticky',
                left: 0,
                zIndex: 2,
                borderTop: `2px solid ${C.goldDim}`,
              }}>
                <div style={{
                  fontFamily: FONT.display,
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.gold,
                  letterSpacing: '0.06em',
                }}>
                  TOTAL REVENUE
                </div>
              </td>

              {monthTotals.map(({ month, total }) => (
                <td key={month.key} style={{
                  padding: '14px 14px',
                  textAlign: 'right',
                  borderTop: `2px solid ${C.goldDim}`,
                  background: month.locked ? 'rgba(245,166,35,0.04)' : 'rgba(245,166,35,0.08)',
                }}>
                  <div style={{
                    fontFamily: FONT.display,
                    fontSize: 15,
                    fontWeight: 700,
                    color: total > 0 ? C.gold : C.textDim,
                  }}>
                    {fmtMoney(total, true)}
                  </div>
                </td>
              ))}

              <td style={{
                padding: '14px 16px',
                textAlign: 'right',
                background: 'rgba(245,166,35,0.12)',
                position: 'sticky',
                right: 0,
                zIndex: 2,
                borderTop: `2px solid ${C.goldDim}`,
                borderLeft: `1px solid ${C.border}`,
              }}>
                <div style={{
                  fontFamily: FONT.display,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.gold,
                }}>
                  {fmtMoney(grandTotal, true)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 10, color: C.textDim, marginTop: 10 }}>
        Tip: HC × Hrs/HC gives total billed hours. OT hours are charged at rate × OT multiplier set per project.
        Direct billing projects (GiftHealth, Outschool) take revenue as a direct input.
      </div>
    </div>
  )
}
