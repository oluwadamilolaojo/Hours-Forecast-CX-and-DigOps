import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { C, FONT, tag as tagStyle } from '../theme.js'
import { getRevenue, fmtMoney } from '../lib/revenue.js'

export default function Dashboard({ state }) {
  const { projects, months, cells } = state

  // Chart data — stacked bar per month
  const chartData = months.map(month => {
    const obj = { month: `${month.label} '${String(month.year).slice(2)}`, locked: month.locked }
    projects.forEach(p => {
      const cell = cells[`${p.id}_${month.key}`]
      obj[p.id] = getRevenue(p, cell, month.locked)
    })
    return obj
  })

  // KPI: total per period
  const lockedRevenue    = months.filter(m => m.locked).reduce((s, m) => s + projects.reduce((ps, p) => ps + getRevenue(p, cells[`${p.id}_${m.key}`], true), 0), 0)
  const forecastRevenue  = months.filter(m => !m.locked).reduce((s, m) => s + projects.reduce((ps, p) => ps + getRevenue(p, cells[`${p.id}_${m.key}`], false), 0), 0)
  const grandTotal       = lockedRevenue + forecastRevenue
  const forecastMonths   = months.filter(m => !m.locked)
  const lastActualMonth  = [...months].filter(m => m.locked).pop()
  const firstForecast    = forecastMonths[0]
  const lastActualRev    = lastActualMonth ? projects.reduce((s, p) => s + getRevenue(p, cells[`${p.id}_${lastActualMonth.key}`], true), 0) : 0
  const firstForecastRev = firstForecast   ? projects.reduce((s, p) => s + getRevenue(p, cells[`${p.id}_${firstForecast.key}`], false), 0) : 0
  const momDelta = lastActualRev > 0 ? ((firstForecastRev / lastActualRev) - 1) * 100 : 0

  // Top projects by total revenue
  const projectTotals = projects.map(p => ({
    project: p,
    total: months.reduce((s, m) => s + getRevenue(p, cells[`${p.id}_${m.key}`], m.locked), 0),
  })).sort((a, b) => b.total - a.total)

  // Monthly totals table
  const monthTotals = months.map(m => ({
    month: m,
    total: projects.reduce((s, p) => s + getRevenue(p, cells[`${p.id}_${m.key}`], m.locked), 0),
  }))

  const KPI = ({ label, value, sub, color }) => (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 6,
      padding: '20px 24px',
      flex: 1,
    }}>
      <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: color || C.gold, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.gold, marginBottom: 20 }}>
        Dashboard
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <KPI label="YTD Actuals (Jan–Mar)" value={fmtMoney(lockedRevenue, true)} sub="Locked months only" />
        <KPI label="Forecast Period" value={fmtMoney(forecastRevenue, true)} sub={`${forecastMonths.length} forecast months`} />
        <KPI label="Grand Total" value={fmtMoney(grandTotal, true)} sub={`${months.length} months`} />
        <KPI
          label={`${lastActualMonth?.label} → ${firstForecast?.label}`}
          value={`${momDelta > 0 ? '+' : ''}${momDelta.toFixed(1)}%`}
          sub="Month-on-month change"
          color={momDelta >= 0 ? C.green : C.red}
        />
      </div>

      {/* Chart */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '20px 16px',
        marginBottom: 28,
      }}>
        <div style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 16 }}>
          Monthly Revenue — Actuals + Forecast
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={1} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: C.textMuted, fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fill: C.textMuted, fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              formatter={(val, name) => [fmtMoney(val), projects.find(p => p.id === name)?.name || name]}
              contentStyle={{
                background: C.surface,
                border: `1px solid ${C.borderLight}`,
                borderRadius: 4,
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
              }}
              labelStyle={{ color: C.gold, fontFamily: 'Syne', fontWeight: 700 }}
            />
            {projects.map(p => (
              <Bar key={p.id} dataKey={p.id} stackId="r" fill={p.color} opacity={0.88} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginTop: 14, justifyContent: 'center' }}>
          {projects.filter(p => months.some(m => getRevenue(p, cells[`${p.id}_${m.key}`], m.locked) > 0)).map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: C.textMuted }}>
              <div style={{ width: 10, height: 10, background: p.color, borderRadius: 2 }} />
              {p.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Monthly totals */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${C.border}`,
            fontFamily: FONT.display,
            fontSize: 13,
            fontWeight: 700,
            color: C.gold,
          }}>
            Monthly Totals
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Month', 'Revenue', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '8px 16px', textAlign: h === 'Revenue' ? 'right' : 'left',
                    color: C.textMuted, fontSize: 10, letterSpacing: '0.08em',
                    borderBottom: `1px solid ${C.border}`,
                    fontFamily: FONT.mono,
                    background: C.surface,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthTotals.map(({ month, total }) => (
                <tr key={month.key} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '9px 16px', fontWeight: 600, color: C.text, fontFamily: FONT.mono }}>
                    {month.label} {month.year}
                  </td>
                  <td style={{
                    padding: '9px 16px', textAlign: 'right',
                    fontFamily: FONT.display, fontSize: 14, fontWeight: 700,
                    color: total > 0 ? C.text : C.textDim,
                  }}>
                    {fmtMoney(total, true)}
                  </td>
                  <td style={{ padding: '9px 16px' }}>
                    <span style={{
                      fontSize: 9, padding: '2px 8px', borderRadius: 3,
                      background: month.locked ? 'rgba(107,127,163,0.1)' : 'rgba(245,166,35,0.1)',
                      color: month.locked ? C.textDim : C.goldDim,
                      letterSpacing: '0.1em',
                    }}>
                      {month.locked ? 'ACTUAL' : 'FORECAST'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top projects */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${C.border}`,
            fontFamily: FONT.display,
            fontSize: 13,
            fontWeight: 700,
            color: C.gold,
          }}>
            Revenue by Project
          </div>
          <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projectTotals.filter(pt => pt.total > 0).map(({ project, total }) => {
              const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0
              return (
                <div key={project.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color }} />
                      <span style={{ fontSize: 12, color: C.text, fontFamily: FONT.mono }}>{project.name}</span>
                      <span style={tagStyle(project.tag)}>{project.tag}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontFamily: FONT.display, fontWeight: 700, color: C.text }}>
                        {fmtMoney(total, true)}
                      </span>
                      <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 6 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: project.color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
