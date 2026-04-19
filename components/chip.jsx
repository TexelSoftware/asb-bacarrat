// Chip component + chip stack renderer

const CHIP_DENOMS = [
  { v: 5,    color: '#D32F2F', ring: '#fff' },      // red $5
  { v: 25,   color: '#2E7D32', ring: '#fff' },      // green $25
  { v: 100,  color: '#212121', ring: '#D4AF37' },   // black $100
  { v: 500,  color: '#6A1B9A', ring: '#D4AF37' },   // purple $500
  { v: 1000, color: '#D4AF37', ring: '#0A0E0C' },   // gold $1000
];

function Chip({ denom, size = 44, onClick, selected = false, dim = false, label, asDiv = false }) {
  const d = CHIP_DENOMS.find(c => c.v === denom) || CHIP_DENOMS[0];
  const displayLabel = label ?? (denom >= 1000 ? `${denom/1000}K` : denom);
  const Tag = asDiv ? 'div' : 'button';
  return (
    <Tag onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%',
      border: 'none', padding: 0, cursor: onClick ? 'pointer' : 'default',
      background: d.color,
      boxShadow: selected
        ? `0 0 0 2px #D4AF37, 0 6px 14px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.18)`
        : `0 4px 10px rgba(0,0,0,0.45), inset 0 -3px 6px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.18)`,
      position: 'relative',
      opacity: dim ? 0.4 : 1,
      transition: 'transform 0.15s, box-shadow 0.2s',
      transform: selected ? 'translateY(-4px)' : 'translateY(0)',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* dashed ring pattern */}
      <div style={{
        position: 'absolute', inset: size * 0.11, borderRadius: '50%',
        border: `1.5px dashed ${d.ring}`,
        opacity: 0.85,
      }} />
      {/* inner disc */}
      <div style={{
        position: 'absolute', inset: size * 0.22, borderRadius: '50%',
        background: d.color,
        boxShadow: `inset 0 0 0 0.5px ${d.ring}, inset 0 1px 2px rgba(255,255,255,0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: d.ring,
        fontSize: size * 0.28, fontWeight: 700, letterSpacing: -0.5,
      }}>{displayLabel}</div>
    </Tag>
  );
}

// Render a stacked pile of chips given a total value
function ChipStack({ total, max = 8 }) {
  if (total <= 0) return null;
  // Greedy decomposition
  const pieces = [];
  let remaining = total;
  const denoms = [...CHIP_DENOMS].reverse();
  for (const { v } of denoms) {
    while (remaining >= v && pieces.length < max) {
      pieces.push(v);
      remaining -= v;
    }
  }
  if (remaining > 0 && pieces.length === 0) pieces.push(5);

  return (
    <div style={{ position: 'relative', width: 44, height: 44 + pieces.length * 4 }}>
      {pieces.slice().reverse().map((v, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: i * 4,
          left: 0,
        }}>
          <Chip denom={v} size={44} />
        </div>
      ))}
    </div>
  );
}

window.Chip = Chip;
window.ChipStack = ChipStack;
window.CHIP_DENOMS = CHIP_DENOMS;
