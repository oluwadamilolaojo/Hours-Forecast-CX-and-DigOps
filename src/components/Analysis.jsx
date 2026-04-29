import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { C, FONT, tag as tagStyle } from '../theme.js'
import { getRevenue, getTotalHours, fmtMoney, fmtNum, getAnomalies } from '../lib/revenue.js'

export default function Analysis({ state }) {
  const { projects, months, cells } = state

  // OT % data per month
  const otChartData = months.map(month => {
    const obj = { month: `${month.label}`, locked: month.locked }
    projects.forEach(p => {
      const cell = cells[`${p.id}_${month.key}`] || {}
      const totalH = month.locked
        ? (cell.totalHours || 0)
        : (cell.headcount || 0) * (cell.hoursPerHead || 0)
      const ot = cell.otHours || 0
      obj[p.id] = totalH > 0 ? +((ot / totalH) * 100).toFixed(1) : 0
    })
    return obj
  })

  // HC summary
  const hcData = projects.map(p => {
    const latestLocked = [...months].filter(m => m.locked).reverse()
      .map(m => cells[`${p.id}_${m.key}`]?.headcount)
      .find(hc => hc != null)
    const firstForecast = months.find(m => !m.locked)
    const forecastHC = firstForecast ? cells[`${p.id}_${firstForecast.key}`]?.headcount : null
    return { p, latestLocked, forecastHC }
  }).filter(d => d.latestLocked || d.forecastHC)

  // Anomalies
  const anomalies = getAnomalies(projects, cells, months)

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 24 }}>
        Analysis
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* OT Chart */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
          padding: '18px 16px', gridColumn: '1 / -1',
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 4 }}>
            OT % of Total Hours — by Project
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 14 }}>
            Red line = 10% threshold. OT above 10% warrants attention.
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={otChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fill: C.textMuted, fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <ReferenceLine y={10} stroke={C.red} strokeDasharray="4 4" strokeOpacity={0.6}
                label={{ value: '10%', fill: C.red, fontSize: 10, fontFamily: 'JetBrains Mono', position: 'insideTopRight' }} />
              <Tooltip
                formatter={(v, name) => [`${v}%`, projects.find(p => p.id === name)?.name || name]}
                contentStyle={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono' }}
                labelStyle={{ color: C.gold }}
              />
              {projects.map(p => (
                <Line key={p.id} dataKey={p.id} stroke={p.color} strokeWidth={1.5} dot={false} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10, justifyContent: 'center' }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: C.textMuted }}>
                <div style={{ width: 10, height: 2, background: p.color, borderRadius: 1 }} />
                {p.name}
              </div>
            ))}
          </div>
        </div>

        {/* HC snapshot */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
            fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.gold,
          }}>
            Headcount: Actuals → Forecast
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Project', 'Mar (actual)', 'Apr (forecast)', 'Δ'].map(h => (
                    <th key={h} style={{
                      padding: '8px 14px', textAlign: h === 'Project' ? 'left' : 'right',
                      color: C.textMuted, fontSize: 10, letterSpacing: '0.08em',
                      borderBottom: `1px solid ${C.border}`, fontFamily: FONT.mono,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hcData.map(({ p, latestLocked, forecastHC }) => {
                  const delta = (latestLocked != null && forecastHC != null) ? forecastHC - latestLocked : null
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: '9px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 3, height: 16, background: p.color, borderRadius: 1 }} />
                          <span style={{ fontFamily: FONT.mono }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: C.textMuted }}>
                        {latestLocked ?? '—'}
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: C.gold }}>
                        {forecastHC ?? '—'}
                      </td>
                      <td style={{
                        padding: '9px 14px', textAlign: 'right',
                        color: delta == null ? C.textDim : delta > 0 ? C.green : delta < 0 ? C.red : C.textMuted,
                        fontWeight: 600,
                      }}>
                        {delta == null ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue anomalies */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
            fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.gold,
          }}>
            Revenue Anomalies  <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono, marginLeft: 8 }}>±25% from historical avg</span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!anomalies.length && (
              <div style={{ padding: '20px 0', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                No anomalies detected.
              </div>
            )}
            {anomalies.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: a.type === 'high' ? C.greenBg : C.redBg,
                border: `1px solid ${a.type === 'high' ? C.green : C.red}33`,
                borderLeft: `3px solid ${a.type === 'high' ? C.green : C.red}`,
                borderRadius: 4, padding: '10px 14px',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.project.color }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 12 }}>{a.project.name}</span>
                  <span style={{ color: C.textMuted, fontSize: 11, marginLeft: 8 }}>
                    {a.month.label} {a.month.year}
                    {!a.month.locked && ' (forecast)'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: a.type === 'high' ? C.green : C.red,
                    fontFamily: FONT.display, fontSize: 14, fontWeight: 700,
                  }}>
                    {a.delta > 0 ? '+' : ''}{(a.delta * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>
                    {fmtMoney(a.rev, true)} vs avg {fmtMoney(a.avg, true)}
                  </div>
                </div>
                <div style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 3, letterSpacing: '0.1em',
                  background: a.type === 'high' ? 'rgba(34,211,160,0.15)' : 'rgba(245,66,107,0.15)',
                  color: a.type === 'high' ? C.green : C.red,
                }}>
                  {a.type === 'high' ? '▲ ABOVE' : '▼ BELOW'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OT detail table */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
          fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.gold,
        }}>
          OT Hours Detail — All Projects
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{
                  padding: '8px 16px', textAlign: 'left',
                  color: C.textMuted, fontSize: 10, letterSpacing: '0.08em',
                  borderBottom: `1px solid ${C.border}`, fontFamily: FONT.mono,
                  background: C.surface, position: 'sticky', left: 0, zIndex: 1,
                }}>PROJECT</th>
                {months.map(m => (
                  <th key={m.key} style={{
                    padding: '8px 14px', textAlign: 'right', minWidth: 90,
                    color: m.locked ? C.textDim : C.gold, fontSize: 10, letterSpacing: '0.08em',
                    borderBottom: `1px solid ${C.border}`, fontFamily: FONT.mono,
                  }}>
                    {m.label}
                    <div style={{ fontSize: 8, color: C.textDim, marginTop: 1 }}>{m.locked ? 'ACTUAL' : 'FCST'}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const hasOT = months.some(m => (cells[`${p.id}_${m.key}`]?.otHours || 0) > 0)
                if (!hasOT) return null
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{
                      padding: '9px 16px', background: C.surface,
                      position: 'sticky', left: 0, zIndex: 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 3, height: 16, background: p.color, borderRadius: 1 }} />
                        <span style={{ fontFamily: FONT.mono, fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    {months.map(m => {
                      const cell = cells[`${p.id}_${m.key}`] || {}
                      const ot = cell.otHours || 0
                      const totalH = m.locked
                        ? (cell.totalHours || 0)
                        : (cell.headcount || 0) * (cell.hoursPerHead || 0)
                      const pct = totalH > 0 ? (ot / totalH) * 100 : 0
                      const high = pct > 10
                      return (
                        <td key={m.key} style={{
                          padding: '9px 14px', textAlign: 'right',
                          background: m.locked ? C.locked : 'transparent',
                        }}>
                          {ot > 0 ? (
                            <>
                              <div style={{ color: high ? C.red : C.text }}>{fmtNum(ot)}</div>
                              <div style={{ fontSize: 10, color: high ? C.red : C.textDim }}>
                                {pct.toFixed(1)}%{high ? ' ⚠' : ''}
                              </div>
                            </>
                          ) : (
                            <span style={{ color: C.textDim }}>—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
