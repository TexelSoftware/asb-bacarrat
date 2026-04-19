// Baccarat Table — the primary gameplay screen
// Two theme variants: 'salon' (classic green felt) and 'midnight' (bold dark)

const { useState, useEffect, useRef } = React;

function BaccaratTable({ theme = 'salon', cardStyle = 'classic' }) {
  // ── state ──────────────────────────────────────────────────
  const [shoe, setShoe] = useState(() => Baccarat.buildShoe(8));
  const [balance, setBalance] = useState(2450);
  const [selectedChip, setSelectedChip] = useState(25);
  const [wagers, setWagers] = useState({ P: 0, B: 0, T: 0 });
  const [phase, setPhase] = useState('playing'); // betting | dealing | reveal | settled | playing
  const [hand, setHand] = useState(null);
  const [history, setHistory] = useState([]); // outcomes
  const [lastResult, setLastResult] = useState(null);
  const [handNum, setHandNum] = useState(247);

  // Start in mid-round state so the user lands on something visual
  useEffect(() => {
    // Seed with some history
    const fakeHistory = seedHistory();
    setHistory(fakeHistory);
    // Land mid-round with a dealt (not-yet-revealed) hand
    const freshShoe = Baccarat.buildShoe(8);
    const coup = Baccarat.dealCoup(freshShoe);
    setShoe(coup.shoe);
    setHand(coup);
    const seedWagers = { P: 0, B: 75, T: 0 };
    setWagers(seedWagers);
    setPhase('reveal');
    // Settle the seed hand after card reveal so user lands mid-round
    // then has a clear Next Hand prompt.
    setTimeout(() => {
      const result = Baccarat.payout(null, seedWagers, coup.outcome);
      setLastResult({ ...result, outcome: coup.outcome });
      setBalance(b => b + result.won + result.push);
      setHistory(h => [...h, coup.outcome]);
      setPhase('settled');
      setHandNum(n => n + 1);
    }, 1800);
  }, []);

  // ── handlers ───────────────────────────────────────────────
  const totalBet = wagers.P + wagers.B + wagers.T;

  const placeBet = (side) => {
    if (phase !== 'betting') return;
    if (balance < selectedChip) return;
    setWagers(w => ({ ...w, [side]: w[side] + selectedChip }));
    setBalance(b => b - selectedChip);
  };

  const clearBets = () => {
    if (phase !== 'betting') return;
    setBalance(b => b + totalBet);
    setWagers({ P: 0, B: 0, T: 0 });
  };

  const deal = () => {
    if (phase !== 'betting' || totalBet === 0) return;
    const coup = Baccarat.dealCoup(shoe);
    setShoe(coup.shoe);
    setHand(coup);
    setPhase('dealing');
    // Reveal after card animations
    setTimeout(() => setPhase('reveal'), 1600);
    setTimeout(() => {
      const result = Baccarat.payout(null, wagers, coup.outcome);
      setLastResult({ ...result, outcome: coup.outcome });
      setBalance(b => b + result.won + result.push);
      setHistory(h => [...h, coup.outcome]);
      setPhase('settled');
      setHandNum(n => n + 1);
    }, 3400);
  };

  const nextHand = () => {
    setHand(null);
    setLastResult(null);
    setWagers({ P: 0, B: 0, T: 0 });
    setPhase('betting');
  };

  // ── derived ────────────────────────────────────────────────
  const canDeal = phase === 'betting' && totalBet > 0;

  // ── palette ────────────────────────────────────────────────
  const P = theme === 'midnight' ? MIDNIGHT : SALON;

  return (
    <div style={{
      width: '100%', height: '100%', background: P.bg,
      backgroundImage: P.bgImage, position: 'relative', overflow: 'hidden',
      fontFamily: 'Inter, sans-serif', color: P.text,
    }}>
      {/* Top bar */}
      <TopBar theme={theme} balance={balance} handNum={handNum} P={P} />

      {/* Table area */}
      <TableArea
        theme={theme}
        cardStyle={cardStyle}
        hand={hand}
        phase={phase}
        wagers={wagers}
        placeBet={placeBet}
        lastResult={lastResult}
        P={P}
      />

      {/* Result banner */}
      {phase === 'settled' && lastResult && (
        <ResultBanner result={lastResult} P={P} />
      )}

      {/* Bottom controls: chip tray + action button */}
      <BottomControls
        phase={phase}
        selectedChip={selectedChip}
        setSelectedChip={setSelectedChip}
        balance={balance}
        totalBet={totalBet}
        clearBets={clearBets}
        deal={deal}
        nextHand={nextHand}
        canDeal={canDeal}
        P={P}
        theme={theme}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Palettes
// ────────────────────────────────────────────────────────────
const SALON = {
  bg: '#0D2820',
  bgImage: 'radial-gradient(ellipse at center top, #1A4734 0%, #0D2820 55%, #071812 100%)',
  felt: '#1A4734',
  text: '#F4EFDF',
  textMuted: 'rgba(244,239,223,0.6)',
  textDim: 'rgba(244,239,223,0.4)',
  gold: '#D4AF37',
  goldMuted: 'rgba(212,175,55,0.6)',
  player: '#3B7BCC',
  banker: '#C93838',
  tie: '#2E9E5C',
  line: 'rgba(212,175,55,0.25)',
  card: 'rgba(255,255,255,0.04)',
};
const MIDNIGHT = {
  bg: '#08110C',
  bgImage: 'radial-gradient(ellipse at 30% 10%, rgba(212,175,55,0.05) 0%, transparent 50%), linear-gradient(180deg, #08110C 0%, #050806 100%)',
  felt: '#0F1D15',
  text: '#EDE7D3',
  textMuted: 'rgba(237,231,211,0.55)',
  textDim: 'rgba(237,231,211,0.3)',
  gold: '#E8C568',
  goldMuted: 'rgba(232,197,104,0.65)',
  player: '#6FA3E8',
  banker: '#E16B6B',
  tie: '#6BC391',
  line: 'rgba(237,231,211,0.12)',
  card: 'rgba(255,255,255,0.03)',
};

window.BaccaratTable = BaccaratTable;
window.SALON = SALON;
window.MIDNIGHT = MIDNIGHT;

// ────────────────────────────────────────────────────────────
// Seed: plausible roadmap history (~60 hands)
// ────────────────────────────────────────────────────────────
function seedHistory() {
  const h = [];
  // Generate some streaks for a realistic scorecard
  const streaks = [
    ['B', 4], ['P', 2], ['B', 1], ['P', 3], ['B', 2], ['T'], ['B', 5], ['P', 1], ['P', 2],
    ['B', 3], ['P', 1], ['B', 2], ['T'], ['B', 1], ['P', 4], ['B', 2], ['P', 1], ['B', 6],
    ['P', 2], ['B', 1], ['P', 1], ['B', 3], ['T'], ['P', 2], ['B', 1],
  ];
  for (const s of streaks) {
    if (s.length === 1) h.push(s[0]);
    else for (let i = 0; i < s[1]; i++) h.push(s[0]);
  }
  return h;
}
