export const C = {
  bg:            '#080C14',
  surface:       '#0F1623',
  surfaceHover:  '#141E30',
  border:        '#1A2235',
  borderLight:   '#243048',
  gold:          '#F5A623',
  goldDim:       '#A06A0F',
  goldBg:        'rgba(245,166,35,0.07)',
  goldBgStrong:  'rgba(245,166,35,0.14)',
  text:          '#E8EDF5',
  textMuted:     '#6B7FA3',
  textDim:       '#3A4D6A',
  green:         '#22D3A0',
  greenBg:       'rgba(34,211,160,0.08)',
  red:           '#F5426B',
  redBg:         'rgba(245,66,107,0.08)',
  blue:          '#3B82F6',
  purple:        '#8B5CF6',
  locked:        '#111826',
  lockedBorder:  '#1A2235',
}

export const FONT = {
  mono: "'JetBrains Mono', monospace",
  display: "'Syne', sans-serif",
}

export const tag = (type) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 3,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.1em',
  background: type === 'CX' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)',
  color: type === 'CX' ? C.blue : C.purple,
})
