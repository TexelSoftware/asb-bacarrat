// Card component — 3 styles: classic, modern, abstract

const SUIT_GLYPH = { S: '♠', H: '♥', D: '♦', C: '♣' };
const SUIT_COLOR = {
  S: '#0A0E0C', C: '#0A0E0C',
  H: '#B8232A', D: '#B8232A',
};

function Card({ card, style = 'classic', size = 1, faceDown = false, delay = 0, flipped = true }) {
  const w = 62 * size;
  const h = 88 * size;

  const [visible, setVisible] = React.useState(flipped);
  React.useEffect(() => {
    if (!flipped) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [flipped, delay]);

  const rank = card?.r === 'T' ? '10' : card?.r;
  const suit = card?.s;
  const color = suit ? SUIT_COLOR[suit] : '#0A0E0C';
  const glyph = suit ? SUIT_GLYPH[suit] : '';

  // back
  const back = (
    <div style={{
      width: w, height: h, borderRadius: 6 * size,
      background: 'linear-gradient(135deg, #1a3a2a 0%, #0f2a1c 100%)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(212,175,55,0.35)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 3 * size, borderRadius: 4 * size,
        border: `0.5px solid rgba(212,175,55,0.3)`,
        backgroundImage: `repeating-linear-gradient(45deg, transparent 0 4px, rgba(212,175,55,0.12) 4px 5px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Cormorant Garamond, serif', fontSize: 22 * size, color: 'rgba(212,175,55,0.6)',
        fontStyle: 'italic', fontWeight: 500,
      }}>B</div>
    </div>
  );

  if (faceDown || !visible) return back;

  // CLASSIC — traditional corner pips + center
  if (style === 'classic') {
    return (
      <div style={{
        width: w, height: h, borderRadius: 6 * size,
        background: '#FAF8F3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(0,0,0,0.1)',
        position: 'relative', color,
        fontFamily: 'Cormorant Garamond, serif',
      }}>
        <div style={{
          position: 'absolute', top: 4 * size, left: 5 * size,
          display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9,
        }}>
          <div style={{ fontSize: 14 * size, fontWeight: 600, letterSpacing: -0.5 }}>{rank}</div>
          <div style={{ fontSize: 12 * size }}>{glyph}</div>
        </div>
        <div style={{
          position: 'absolute', bottom: 4 * size, right: 5 * size, transform: 'rotate(180deg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9,
        }}>
          <div style={{ fontSize: 14 * size, fontWeight: 600, letterSpacing: -0.5 }}>{rank}</div>
          <div style={{ fontSize: 12 * size }}>{glyph}</div>
        </div>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30 * size,
        }}>{glyph}</div>
      </div>
    );
  }

  // MODERN — big numeral, tiny suit
  if (style === 'modern') {
    return (
      <div style={{
        width: w, height: h, borderRadius: 8 * size,
        background: '#F4F2ED',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        position: 'relative', color,
        fontFamily: 'Cormorant Garamond, serif',
      }}>
        <div style={{
          position: 'absolute', top: 6 * size, left: 7 * size,
          fontSize: 11 * size, fontFamily: 'Inter, sans-serif', fontWeight: 600,
          letterSpacing: 1, color: color,
        }}>{glyph}</div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: rank?.length === 2 ? 32 * size : 44 * size,
          fontWeight: 400, letterSpacing: -2, lineHeight: 1,
        }}>{rank}</div>
        <div style={{
          position: 'absolute', bottom: 5 * size, right: 0, left: 0,
          textAlign: 'center', fontFamily: 'Inter, sans-serif',
          fontSize: 7 * size, color: 'rgba(10,14,12,0.4)', letterSpacing: 1.5, textTransform: 'uppercase',
        }}>{{S:'Spade',H:'Heart',D:'Diamond',C:'Club'}[suit]}</div>
      </div>
    );
  }

  // ABSTRACT — no suits, numeric + color block, inspired by modern playing card design
  if (style === 'abstract') {
    const num = cardNumericValue(card?.r);
    const hue = { S: 220, C: 150, H: 10, D: 40 }[suit] || 0;
    return (
      <div style={{
        width: w, height: h, borderRadius: 10 * size,
        background: '#F4F2ED', position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
          background: `oklch(0.55 0.15 ${hue})`,
        }} />
        <div style={{
          position: 'absolute', top: 6 * size, left: 7 * size,
          fontFamily: 'Inter, sans-serif', fontSize: 9 * size, fontWeight: 700,
          letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)',
        }}>{rank}</div>
        <div style={{
          position: 'absolute', top: 6 * size, right: 7 * size,
          width: 6 * size, height: 6 * size, borderRadius: 10,
          background: 'rgba(255,255,255,0.7)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: '15%',
          textAlign: 'center',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 38 * size, fontWeight: 400, letterSpacing: -2,
          color: '#0A0E0C', lineHeight: 1,
        }}>{num}</div>
        <div style={{
          position: 'absolute', bottom: 5 * size, left: 0, right: 0,
          textAlign: 'center', fontFamily: 'Inter, sans-serif',
          fontSize: 6.5 * size, color: 'rgba(10,14,12,0.5)', letterSpacing: 2, textTransform: 'uppercase',
        }}>VALUE</div>
      </div>
    );
  }
}

function cardNumericValue(r) {
  if (!r) return '';
  if (r === 'A') return '1';
  if (['T','J','Q','K'].includes(r)) return '0';
  return r;
}

// Corner rank + suit glyph (traditional French playing-card style)
function CornerIndex({ rank, glyph, color, size, inline }) {
  const base = inline ? {} : {
    position: 'absolute', top: 3 * size, left: 5 * size,
  };
  return (
    <div style={{
      ...base,
      display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.82,
      color,
    }}>
      <div style={{
        fontSize: 13 * size, fontWeight: 900, letterSpacing: -0.5,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}>{rank}</div>
      <div style={{ fontSize: 11 * size, marginTop: 1 * size }}>{glyph}</div>
    </div>
  );
}

// Traditional pip layouts — positions given as fractions of card interior
const PIP_POSITIONS = {
  '2':  [[0.5,0.22],[0.5,0.78]],
  '3':  [[0.5,0.22],[0.5,0.5],[0.5,0.78]],
  '4':  [[0.32,0.22],[0.68,0.22],[0.32,0.78],[0.68,0.78]],
  '5':  [[0.32,0.22],[0.68,0.22],[0.5,0.5],[0.32,0.78],[0.68,0.78]],
  '6':  [[0.32,0.22],[0.68,0.22],[0.32,0.5],[0.68,0.5],[0.32,0.78],[0.68,0.78]],
  '7':  [[0.32,0.22],[0.68,0.22],[0.5,0.35],[0.32,0.5],[0.68,0.5],[0.32,0.78],[0.68,0.78]],
  '8':  [[0.32,0.22],[0.68,0.22],[0.5,0.35],[0.32,0.5],[0.68,0.5],[0.5,0.65],[0.32,0.78],[0.68,0.78]],
  '9':  [[0.32,0.22],[0.68,0.22],[0.32,0.39],[0.68,0.39],[0.5,0.5],[0.32,0.61],[0.68,0.61],[0.32,0.78],[0.68,0.78]],
  '10': [[0.32,0.2],[0.68,0.2],[0.5,0.31],[0.32,0.42],[0.68,0.42],[0.32,0.58],[0.68,0.58],[0.5,0.69],[0.32,0.8],[0.68,0.8]],
};

function CardCenter({ rank, glyph, color, size, w, h }) {
  // Ace — single large pip
  if (rank === 'A') {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 38 * size, color,
      }}>{glyph}</div>
    );
  }
  // Face card — classic red/black framed letter treatment
  if (['J','Q','K'].includes(rank)) {
    const crown = rank === 'K' ? '♛' : rank === 'Q' ? '✿' : '❦';
    return (
      <div style={{
        position: 'absolute',
        top: 11 * size, bottom: 11 * size,
        left: 9 * size, right: 9 * size,
        background: '#FEF9E6',
        border: `1.2px solid ${color}`,
        borderRadius: 2 * size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 1 * size,
      }}>
        <div style={{
          fontSize: 10 * size, color,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          lineHeight: 1,
        }}>{crown}</div>
        <div style={{
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: 26 * size, fontWeight: 900, color,
          lineHeight: 1, letterSpacing: -1,
        }}>{rank}</div>
        <div style={{
          fontSize: 10 * size, color,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          lineHeight: 1,
        }}>{glyph}</div>
      </div>
    );
  }
  // Numeric 2–10 — traditional pip layout
  const pips = PIP_POSITIONS[rank] || [];
  const pipFont = 11 * size;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {pips.map(([x, y], i) => {
        const flip = y > 0.5;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x * 100}%`, top: `${y * 100}%`,
            transform: `translate(-50%, -50%) ${flip ? 'rotate(180deg)' : ''}`,
            fontSize: pipFont, color, lineHeight: 1,
          }}>{glyph}</div>
        );
      })}
    </div>
  );
}

window.Card = Card;
