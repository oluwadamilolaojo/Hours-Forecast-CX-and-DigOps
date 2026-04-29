// ─── REVENUE COMPUTATION ─────────────────────────────────────────────────────

/**
 * Compute revenue for a given project × cell.
 *
 * billingMode === 'hourly':
 *   revenue = (HC × hrs/HC × rate) + (OT hrs × rate × otMultiplier)
 *
 * billingMode === 'direct':
 *   revenue = cell.revenue (user-entered directly)
 */
export function computeRevenue(project, cell) {
  if (!cell) return 0
  if (project.billingMode === 'direct') return cell.revenue || 0

  const hc       = cell.headcount   || 0
  const hph      = cell.hoursPerHead || 0
  const ot       = cell.otHours     || 0
  const rate     = project.rate     || 0
  const otMult   = project.otMultiplier || 1.25

  const regularRev = hc * hph * rate
  const otRev      = ot * rate * otMult

  return Math.round(regularRev + otRev)
}

/**
 * For locked cells, revenue is stored directly.
 * For unlocked, compute it.
 */
export function getRevenue(project, cell, isLocked) {
  if (isLocked) return cell?.revenue || 0
  return computeRevenue(project, cell)
}

// ─── TOTALS ───────────────────────────────────────────────────────────────────

export function monthTotal(projects, cells, months, monthKey) {
  const month = months.find(m => m.key === monthKey)
  if (!month) return 0
  return projects.reduce((sum, project) => {
    const cell = cells[`${project.id}_${monthKey}`]
    return sum + getRevenue(project, cell, month.locked)
  }, 0)
}

export function projectTotal(project, cells, months) {
  return months.reduce((sum, month) => {
    const cell = cells[`${project.id}_${month.key}`]
    return sum + getRevenue(project, cell, month.locked)
  }, 0)
}

// ─── TOTALHOURS (for display in locked cells) ─────────────────────────────────

export function getTotalHours(cell, isLocked) {
  if (!cell) return 0
  if (isLocked) return cell.totalHours || 0
  return (cell.headcount || 0) * (cell.hoursPerHead || 0)
}

// ─── FORMATTING ───────────────────────────────────────────────────────────────

export function fmtMoney(n, compact = false) {
  if (n == null || isNaN(n) || n === 0) return '—'
  if (compact) {
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
    return `$${n}`
  }
  return `$${n.toLocaleString()}`
}

export function fmtNum(n) {
  if (n == null || n === 0) return '—'
  return n.toLocaleString()
}

export function fmtPct(a, b) {
  if (!b || !a) return '—'
  const d = ((a / b) - 1) * 100
  return `${d > 0 ? '+' : ''}${d.toFixed(1)}%`
}

// ─── ANOMALY DETECTION ───────────────────────────────────────────────────────

export function getAnomalies(projects, cells, months) {
  const flags = []
  projects.forEach(project => {
    const revHistory = []
    months.forEach(month => {
      const cell = cells[`${project.id}_${month.key}`]
      const rev = getRevenue(project, cell, month.locked)
      if (rev > 0) revHistory.push({ month, rev })
    })

    for (let i = 1; i < revHistory.length; i++) {
      const hist = revHistory.slice(0, i).map(h => h.rev)
      const avg = hist.reduce((a, b) => a + b, 0) / hist.length
      const { rev, month } = revHistory[i]
      const delta = avg > 0 ? (rev - avg) / avg : 0
      if (Math.abs(delta) > 0.25) {
        flags.push({
          project,
          month,
          rev,
          avg,
          delta,
          type: delta > 0 ? 'high' : 'low',
        })
      }
    }
  })
  return flags
}
