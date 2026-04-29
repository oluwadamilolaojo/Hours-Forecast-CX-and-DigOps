// ─── MONTHS ──────────────────────────────────────────────────────────────────
// locked: true = Jan–Mar 2026 actuals, cannot be edited
export const INITIAL_MONTHS = [
  { key: '2026-01', label: 'Jan',  year: 2026, locked: true,  stdHours: 176 },
  { key: '2026-02', label: 'Feb',  year: 2026, locked: true,  stdHours: 160 },
  { key: '2026-03', label: 'Mar',  year: 2026, locked: true,  stdHours: 168 },
  { key: '2026-04', label: 'Apr',  year: 2026, locked: false, stdHours: 176 },
  { key: '2026-05', label: 'May',  year: 2026, locked: false, stdHours: 168 },
  { key: '2026-06', label: 'Jun',  year: 2026, locked: false, stdHours: 168 },
]

// Helper: next month key after the last one in the list
export function nextMonthKey(months) {
  const last = months[months.length - 1]
  const [y, m] = last.key.split('-').map(Number)
  const nm = m === 12 ? 1 : m + 1
  const ny = m === 12 ? y + 1 : y
  const key = `${ny}-${String(nm).padStart(2, '0')}`
  const LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const STD_HRS = [176,160,168,176,168,168,184,176,168,184,176,168]
  return { key, label: LABELS[nm - 1], year: ny, locked: false, stdHours: STD_HRS[nm - 1] }
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
// billingMode:
//   'hourly'  → revenue = (HC × hrs/HC × rate) + (OT hrs × rate × otMultiplier)
//   'direct'  → user enters revenue directly; HC tracked but doesn't affect revenue

export const INITIAL_PROJECTS = [
  {
    id: 'gifthealth',
    name: 'GiftHealth',
    tag: 'CX',
    geo: 'MO / SA / Lagos',
    color: '#F5A623',
    rate: 25.00,          // blended avg across MO ($35), SA ($15), Lagos ($14)
    otMultiplier: 1.20,
    billingMode: 'direct', // complex multi-geo rates — enter revenue directly
  },
  {
    id: 'almedia',
    name: 'Almedia',
    tag: 'CX',
    geo: 'Lagos',
    color: '#3B82F6',
    rate: 10.25,
    otMultiplier: 1.25,
    billingMode: 'hourly',
  },
  {
    id: 'faire',
    name: 'Faire',
    tag: 'Ops',
    geo: 'Lagos',
    color: '#8B5CF6',
    rate: 12.72,
    otMultiplier: 1.35,
    billingMode: 'hourly',
  },
  {
    id: 'outschool',
    name: 'Outschool',
    tag: 'CX',
    geo: 'Lagos',
    color: '#EC4899',
    rate: 12.00,
    otMultiplier: 1.20,
    billingMode: 'direct', // multiple sub-queues at different rates
  },
  {
    id: 'curri',
    name: 'Curri',
    tag: 'CX',
    geo: 'Lagos',
    color: '#14B8A6',
    rate: 13.50,
    otMultiplier: 1.20,
    billingMode: 'hourly',
  },
  {
    id: 'csi',
    name: 'CSI',
    tag: 'CX',
    geo: 'Lagos',
    color: '#F97316',
    rate: 14.90,
    otMultiplier: 1.32,
    billingMode: 'hourly',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    tag: 'Ops',
    geo: 'Lagos',
    color: '#06B6D4',
    rate: 3.30,            // per model (avg of $3.18 std / $3.45 expedited)
    otMultiplier: 1.20,
    billingMode: 'hourly',
    unit: 'models',
  },
  {
    id: 'finix',
    name: 'Finix',
    tag: 'Ops',
    geo: 'Lagos',
    color: '#A78BFA',
    rate: 14.35,
    otMultiplier: 1.20,
    billingMode: 'hourly',
  },
  {
    id: 'streamhatchet',
    name: 'Stream Hatchet',
    tag: 'Ops',
    geo: 'Lagos',
    color: '#84CC16',
    rate: 10.00,
    otMultiplier: 1.20,
    billingMode: 'hourly',
  },
  {
    id: 'bask',
    name: 'Bask & Lather',
    tag: 'CX',
    geo: 'Lagos',
    color: '#FB7185',
    rate: 11.00,
    otMultiplier: 1.20,
    billingMode: 'hourly',
  },
  {
    id: 'pinata',
    name: 'Piñata',
    tag: 'CX',
    geo: 'Lagos',
    color: '#FBBF24',
    rate: 12.00,
    otMultiplier: 1.20,
    billingMode: 'hourly',
  },
]

// ─── CELLS ────────────────────────────────────────────────────────────────────
// Key format: `${projectId}_${monthKey}`
// Locked cells: totalHours = actual delivered hours (not HC × hrs/person)
// Unlocked cells: hoursPerHead = hrs per person; revenue computed on the fly
// revenue in locked cells = actual invoiced USD

export const INITIAL_CELLS = {
  // ── GiftHealth (direct billing) ───────────────────────────────────────────
  'gifthealth_2026-01': { headcount: 433, revenue: 850000 },
  'gifthealth_2026-02': { headcount: 444, revenue: 954104 },
  'gifthealth_2026-03': { headcount: 444, revenue: 967526 },
  'gifthealth_2026-04': { headcount: 444, revenue: 920000 },
  'gifthealth_2026-05': { headcount: 444, revenue: 920000 },
  'gifthealth_2026-06': { headcount: 444, revenue: 920000 },

  // ── Almedia ────────────────────────────────────────────────────────────────
  // Locked months: totalHours = actual agent hours delivered; revenue from invoice
  'almedia_2026-01': { headcount: 73, totalHours: 10170, otHours: 490,  revenue: 99220  },
  'almedia_2026-02': { headcount: 74, totalHours: 12320, otHours: 5493, revenue: 126280 },
  'almedia_2026-03': { headcount: 74, totalHours: 17248, otHours: 5967, revenue: 176792 },
  // Unlocked months: HC + hrs/person + OT, revenue auto-computed
  'almedia_2026-04': { headcount: 74, hoursPerHead: 143, otHours: 1021 },
  'almedia_2026-05': { headcount: 74, hoursPerHead: 160, otHours: 500  },
  'almedia_2026-06': { headcount: 74, hoursPerHead: 160, otHours: 500  },

  // ── Faire ──────────────────────────────────────────────────────────────────
  'faire_2026-01': { headcount: 42, totalHours: 5200,  otHours: 60,  revenue: 67000  },
  'faire_2026-02': { headcount: 42, totalHours: 5680,  otHours: 80,  revenue: 86919  },
  'faire_2026-03': { headcount: 42, totalHours: 5948,  otHours: 139, revenue: 91000  },
  'faire_2026-04': { headcount: 40, hoursPerHead: 160, otHours: 92  },
  'faire_2026-05': { headcount: 40, hoursPerHead: 168, otHours: 80  },
  'faire_2026-06': { headcount: 40, hoursPerHead: 168, otHours: 80  },

  // ── Outschool (direct billing) ────────────────────────────────────────────
  'outschool_2026-01': { headcount: 76, revenue: 90000  },
  'outschool_2026-02': { headcount: 76, revenue: 95079  },
  'outschool_2026-03': { headcount: 76, revenue: 97000  },
  'outschool_2026-04': { headcount: 76, revenue: 96000  },
  'outschool_2026-05': { headcount: 76, revenue: 96000  },
  'outschool_2026-06': { headcount: 76, revenue: 96000  },

  // ── Curri ─────────────────────────────────────────────────────────────────
  'curri_2026-01': { headcount: 23, totalHours: 3200, otHours: 0,  revenue: 45000 },
  'curri_2026-02': { headcount: 23, totalHours: 3369, otHours: 14, revenue: 51740 },
  'curri_2026-03': { headcount: 23, totalHours: 3909, otHours: 37, revenue: 56000 },
  'curri_2026-04': { headcount: 23, hoursPerHead: 160, otHours: 81 },
  'curri_2026-05': { headcount: 23, hoursPerHead: 168, otHours: 40 },
  'curri_2026-06': { headcount: 23, hoursPerHead: 168, otHours: 40 },

  // ── CSI ────────────────────────────────────────────────────────────────────
  'csi_2026-01': { headcount: 32, totalHours: 5120, otHours: 0, revenue: 60000 },
  'csi_2026-02': { headcount: 32, totalHours: 5120, otHours: 0, revenue: 65346 },
  'csi_2026-03': { headcount: 32, totalHours: 5120, otHours: 0, revenue: 65000 },
  'csi_2026-04': { headcount: 32, hoursPerHead: 160, otHours: 0 },
  'csi_2026-05': { headcount: 32, hoursPerHead: 168, otHours: 0 },
  'csi_2026-06': { headcount: 32, hoursPerHead: 168, otHours: 0 },

  // ── Aurora (model count) ───────────────────────────────────────────────────
  'aurora_2026-01': { headcount: 46, totalHours: 13755, otHours: 40, revenue: 45391 },
  'aurora_2026-02': { headcount: 46, totalHours: 13714, otHours: 0,  revenue: 39938 },
  'aurora_2026-03': { headcount: 45, totalHours: 13674, otHours: 14, revenue: 45098 },
  'aurora_2026-04': { headcount: 45, hoursPerHead: 300, otHours: 0  },
  'aurora_2026-05': { headcount: 45, hoursPerHead: 300, otHours: 0  },
  'aurora_2026-06': { headcount: 45, hoursPerHead: 300, otHours: 0  },

  // ── Finix ──────────────────────────────────────────────────────────────────
  'finix_2026-01': { headcount: 15, totalHours: 2000, otHours: 0, revenue: 28700 },
  'finix_2026-02': { headcount: 15, totalHours: 1920, otHours: 2, revenue: 32305 },
  'finix_2026-03': { headcount: 17, totalHours: 2400, otHours: 0, revenue: 39146 },
  'finix_2026-04': { headcount: 17, hoursPerHead: 160, otHours: 0 },
  'finix_2026-05': { headcount: 17, hoursPerHead: 168, otHours: 0 },
  'finix_2026-06': { headcount: 17, hoursPerHead: 168, otHours: 0 },

  // ── Stream Hatchet ────────────────────────────────────────────────────────
  'streamhatchet_2026-01': { headcount: 6, totalHours: 1109, otHours: 20, revenue: 11090 },
  'streamhatchet_2026-02': { headcount: 6, totalHours: 975,  otHours: 20, revenue: 9814  },
  'streamhatchet_2026-03': { headcount: 6, totalHours: 1012, otHours: 18, revenue: 10120 },
  'streamhatchet_2026-04': { headcount: 6, hoursPerHead: 168, otHours: 0 },
  'streamhatchet_2026-05': { headcount: 6, hoursPerHead: 168, otHours: 0 },
  'streamhatchet_2026-06': { headcount: 6, hoursPerHead: 168, otHours: 0 },

  // ── Bask & Lather ─────────────────────────────────────────────────────────
  'bask_2026-01': { headcount: 12, totalHours: 1800, otHours: 0,   revenue: 12000 },
  'bask_2026-02': { headcount: 12, totalHours: 1920, otHours: 0,   revenue: 14080 },
  'bask_2026-03': { headcount: 13, totalHours: 2110, otHours: 196, revenue: 23210 },
  'bask_2026-04': { headcount: 21, hoursPerHead: 160, otHours: 184 },
  'bask_2026-05': { headcount: 21, hoursPerHead: 168, otHours: 100 },
  'bask_2026-06': { headcount: 21, hoursPerHead: 168, otHours: 100 },

  // ── Piñata ────────────────────────────────────────────────────────────────
  'pinata_2026-01': { headcount: 3, totalHours: 541, otHours: 60, revenue: 7212 },
  'pinata_2026-02': { headcount: 3, totalHours: 496, otHours: 72, revenue: 5990 },
  'pinata_2026-03': { headcount: 3, totalHours: 545, otHours: 72, revenue: 6540 },
  'pinata_2026-04': { headcount: 3, hoursPerHead: 168, otHours: 58 },
  'pinata_2026-05': { headcount: 3, hoursPerHead: 168, otHours: 50 },
  'pinata_2026-06': { headcount: 3, hoursPerHead: 168, otHours: 50 },
}
