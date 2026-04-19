// Baccarat game logic — shoe, deal, natural, draw rules, payout
// Punto Banco rules.

const SUITS = ['S', 'H', 'D', 'C'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

const cardValue = (r) => {
  if (r === 'A') return 1;
  if (['T','J','Q','K'].includes(r)) return 0;
  return parseInt(r, 10);
};

const handTotal = (cards) =>
  cards.reduce((a, c) => a + cardValue(c.r), 0) % 10;

function buildShoe(decks = 8) {
  const shoe = [];
  for (let d = 0; d < decks; d++) {
    for (const s of SUITS) for (const r of RANKS) shoe.push({ r, s });
  }
  // Fisher-Yates
  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }
  return shoe;
}

// Deal a complete coup. Returns { player, banker, playerTotal, bankerTotal, outcome, shoe }
function dealCoup(shoe) {
  const s = [...shoe];
  const draw = () => s.pop();

  const player = [draw(), draw()];
  const banker = [draw(), draw()];

  let pT = handTotal(player);
  let bT = handTotal(banker);

  // Natural 8 or 9 — stand
  const natural = pT >= 8 || bT >= 8;
  if (!natural) {
    // Player rule
    let playerThird = null;
    if (pT <= 5) {
      playerThird = draw();
      player.push(playerThird);
    }
    // Banker rule
    const pThirdVal = playerThird ? cardValue(playerThird.r) : null;
    let bankerDraws = false;
    if (playerThird === null) {
      bankerDraws = bT <= 5;
    } else {
      if (bT <= 2) bankerDraws = true;
      else if (bT === 3) bankerDraws = pThirdVal !== 8;
      else if (bT === 4) bankerDraws = pThirdVal >= 2 && pThirdVal <= 7;
      else if (bT === 5) bankerDraws = pThirdVal >= 4 && pThirdVal <= 7;
      else if (bT === 6) bankerDraws = pThirdVal === 6 || pThirdVal === 7;
    }
    if (bankerDraws) banker.push(draw());
  }

  pT = handTotal(player);
  bT = handTotal(banker);

  let outcome;
  if (pT > bT) outcome = 'P';
  else if (bT > pT) outcome = 'B';
  else outcome = 'T';

  return { player, banker, playerTotal: pT, bankerTotal: bT, outcome, shoe: s, natural };
}

// Payout: Player 1:1, Banker 1:1 minus 5% commission, Tie 8:1
function payout(betSide, wagers, outcome) {
  // wagers: { P, B, T }
  const w = wagers;
  let won = 0, lost = 0, push = 0;

  // P bet
  if (w.P > 0) {
    if (outcome === 'P') won += w.P;
    else if (outcome === 'T') push += w.P;
    else lost += w.P;
  }
  if (w.B > 0) {
    if (outcome === 'B') won += w.B * 0.95;
    else if (outcome === 'T') push += w.B;
    else lost += w.B;
  }
  if (w.T > 0) {
    if (outcome === 'T') won += w.T * 8;
    else lost += w.T;
  }
  return { won, lost, push, net: won - lost };
}

window.Baccarat = { buildShoe, dealCoup, handTotal, cardValue, payout, SUITS, RANKS };
