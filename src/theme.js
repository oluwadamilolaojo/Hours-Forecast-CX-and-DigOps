export const C = {
  bg:            '#F0F4F8',
  surface:       '#FFFFFF',
  surfaceHover:  '#F8FAFC',
  border:        '#E2E8F0',
  borderLight:   '#CBD5E1',
  gold:          '#1E40AF',               // deep navy — primary accent
  goldDim:       '#3B82F6',               // medium blue
  goldBg:        'rgba(30,64,175,0.06)',
  goldBgStrong:  'rgba(30,64,175,0.10)',
  text:          '#0F172A',
  textMuted:     '#475569',
  textDim:       '#94A3B8',
  green:         '#059669',
  greenBg:       'rgba(5,150,105,0.08)',
  red:           '#DC2626',
  redBg:         'rgba(220,38,38,0.08)',
  blue:          '#2563EB',
  purple:        '#7C3AED',
  locked:        '#F8FAFC',
  lockedBorder:  '#E2E8F0',
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
  background: type === 'CX' ? 'rgba(37,99,235,0.10)' : 'rgba(124,58,237,0.10)',
  color: type === 'CX' ? '#1D4ED8' : '#6D28D9',
})
