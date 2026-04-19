// Sub-components for the Baccarat table

// ─────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────
function TopBar({ theme, balance, handNum, P }) {
  return (
    <div style={{
      padding: '20px 20px 10px', display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', position: 'relative', zIndex: 5,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 9, letterSpacing: 2.5, color: P.textDim, textTransform: 'uppercase',
          fontWeight: 600,
        }}>Table 07 · 8-Deck Shoe</div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 22,
          color: P.text, letterSpacing: 0.3, lineHeight: 1.1, marginTop: 2,
          fontStyle: 'italic', fontWeight: 500,
        }}>9:41</div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 9, letterSpacing: 2.5, color: P.textDim, textTransform: 'uppercase', fontWeight: 600,
        }}>Balance</div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 24,
          color: P.gold, letterSpacing: 0.3, lineHeight: 1, marginTop: 2, fontWeight: 500,
        }}>${balance.toLocaleString()}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCOREBOARD — roadmaps
// ─────────────────────────────────────────────────────────
function Scoreboard({ history, P, theme }) {
  // Stats
  const counts = { P: 0, B: 0, T: 0 };
  for (const o of history) counts[o]++;
  const total = history.length || 1;

  return (
    <div style={{
      margin: '0 16px', padding: '10px 12px',
      background: theme === 'midnight' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.22)',
      borderRadius: 10,
      border: `0.5px solid ${P.line}`,
      position: 'relative', zIndex: 5,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 2, color: P.textDim, textTransform: 'uppercase', fontWeight: 600,
        }}>Shoe · {history.length} hands</div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ color: P.player }}>P {counts.P}</span>
          <span style={{ color: P.banker }}>B {counts.B}</span>
          <span style={{ color: P.tie }}>T {counts.T}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
        <div style={{ flexShrink: 0 }}>
          <BeadPlate outcomes={history.slice(-66)} rows={6} cols={11} />
          <div style={{
            fontSize: 7, letterSpacing: 1.5, color: P.textDim, marginTop: 3,
            textTransform: 'uppercase', fontFamily: 'Inter', fontWeight: 600,
          }}>Bead Plate</div>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <BigRoad outcomes={history} rows={6} cols={16} />
          <div style={{
            fontSize: 7, letterSpacing: 1.5, color: P.textDim, marginTop: 3,
            textTransform: 'uppercase', fontFamily: 'Inter', fontWeight: 600,
          }}>Big Road</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TABLE AREA — cards + bet spots
// ─────────────────────────────────────────────────────────
function TableArea({ theme, cardStyle, hand, phase, wagers, placeBet, lastResult, P }) {
  const showCards = phase === 'dealing' || phase === 'reveal' || phase === 'settled';
  const outcome = lastResult?.outcome || hand?.outcome;

  // Player + Banker card rows
  const player = hand?.player || [];
  const banker = hand?.banker || [];

  return (
    <div style={{
      margin: '16px 16px 250px',
      padding: '20px 18px 24px',
      background: `linear-gradient(180deg, ${P.felt} 0%, ${theme === 'midnight' ? '#0B1410' : '#143A2A'} 100%)`,
      borderRadius: 16,
      border: `0.5px solid ${P.line}`,
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)',
      position: 'absolute', top: 60, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Player row */}
      <HandRow
        label="Player"
        accent={P.player}
        total={hand ? Baccarat.handTotal(player) : null}
        cards={player}
        cardStyle={cardStyle}
        showCards={showCards}
        highlight={outcome === 'P' && phase === 'settled'}
        P={P}
      />

      {/* Divider with "vs" */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        margin: '14px 0',
      }}>
        <div style={{ flex: 1, height: 0.5, background: P.line }} />
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 18, fontStyle: 'italic', color: P.goldMuted, fontWeight: 500,
          letterSpacing: 1,
        }}>vs</div>
        <div style={{ flex: 1, height: 0.5, background: P.line }} />
      </div>

      {/* Banker row */}
      <HandRow
        label="Banker"
        accent={P.banker}
        total={hand ? Baccarat.handTotal(banker) : null}
        cards={banker}
        cardStyle={cardStyle}
        showCards={showCards}
        highlight={outcome === 'B' && phase === 'settled'}
        P={P}
      />

      {/* Flex spacer pushes bet spots to bottom */}
      <div style={{ flex: 1, minHeight: 14 }} />

      {/* Betting spots */}
      <BetSpots wagers={wagers} placeBet={placeBet} phase={phase} P={P} theme={theme} outcome={outcome} />
    </div>
  );
}

function HandRow({ label, accent, total, cards, cardStyle, showCards, highlight, P }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      minHeight: 132,
    }}>
      {/* Label + total column */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        width: 64, flexShrink: 0,
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 2.5, color: accent, fontWeight: 700, textTransform: 'uppercase',
        }}>{label}</div>
        {total !== null && showCards ? (
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 56, fontWeight: 500,
            color: highlight ? P.gold : P.text, lineHeight: 1, letterSpacing: -2,
            textShadow: highlight ? `0 0 16px ${P.gold}` : 'none',
            transition: 'all 0.4s', marginTop: 4,
          }}>{total}</div>
        ) : (
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 22,
            color: P.textDim, fontStyle: 'italic', marginTop: 10,
          }}>—</div>
        )}
      </div>

      {/* Cards row */}
      <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
        {showCards ? cards.map((c, i) => {
          const isThird = i === 2;
          return (
            <div key={i} style={{
              animation: `dealIn 0.5s cubic-bezier(.3,1.2,.4,1) ${i * 0.25}s both`,
              marginLeft: isThird ? -48 : 0,
              transform: isThird ? 'rotate(14deg) translateY(-4px)' : 'none',
              transformOrigin: 'bottom left',
              zIndex: isThird ? 2 : 1,
              filter: isThird ? 'drop-shadow(-4px 4px 6px rgba(0,0,0,0.4))' : 'none',
            }}>
              <Card card={c} style={cardStyle} size={1.5} delay={i * 250} />
            </div>
          );
        }) : (
          <div style={{
            fontSize: 10, color: P.textDim, letterSpacing: 2, fontStyle: 'italic',
            fontFamily: 'Cormorant Garamond, serif', alignSelf: 'center',
          }}>awaiting deal</div>
        )}
      </div>
    </div>
  );
}

function HandColumn({ label, accent, total, cards, cardStyle, showCards, highlight, align = 'left', P }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      minWidth: 120,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}>
        <div style={{
          fontSize: 9, letterSpacing: 2.5, color: accent, fontWeight: 700, textTransform: 'uppercase',
        }}>{label}</div>
        {total !== null && showCards && (
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 500,
            color: highlight ? P.gold : P.text, lineHeight: 0.9, letterSpacing: -0.5,
            textShadow: highlight ? `0 0 12px ${P.gold}` : 'none',
            transition: 'all 0.4s',
          }}>{total}</div>
        )}
      </div>
      <div style={{
        display: 'flex', gap: 4,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
        minHeight: 88,
      }}>
        {showCards ? cards.map((c, i) => (
          <div key={i} style={{
            animation: `dealIn 0.45s cubic-bezier(.3,1.2,.4,1) ${i * 0.25}s both`,
          }}>
            <Card card={c} style={cardStyle} size={1} delay={i * 250} />
          </div>
        )) : (
          <div style={{
            fontSize: 9, color: P.textDim, letterSpacing: 2, fontStyle: 'italic',
            fontFamily: 'Cormorant Garamond, serif', marginTop: 34,
          }}>awaiting deal</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BET SPOTS
// ─────────────────────────────────────────────────────────
function BetSpots({ wagers, placeBet, phase, P, theme, outcome }) {
  const spots = [
    { id: 'P', label: 'Player', odds: '1 : 1', color: P.player },
    { id: 'T', label: 'Tie',    odds: '8 : 1', color: P.tie },
    { id: 'B', label: 'Banker', odds: '0.95 : 1', color: P.banker, note: '5% comm.' },
  ];

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {spots.map(s => {
        const amt = wagers[s.id];
        const won = outcome === s.id && phase === 'settled';
        const lost = outcome && outcome !== s.id && amt > 0 && phase === 'settled';
        return (
          <button
            key={s.id}
            onClick={() => placeBet(s.id)}
            disabled={phase !== 'betting'}
            style={{
              flex: s.id === 'T' ? 0.7 : 1,
              height: 86, borderRadius: 10,
              background: won
                ? `linear-gradient(180deg, ${s.color}33 0%, ${s.color}11 100%)`
                : theme === 'midnight' ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.25)',
              border: `1.5px ${won ? 'solid' : 'dashed'} ${won ? s.color : s.color + '55'}`,
              color: P.text, cursor: phase === 'betting' ? 'pointer' : 'default',
              padding: '8px 6px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'space-between',
              position: 'relative', overflow: 'visible',
              opacity: lost ? 0.35 : 1,
              transition: 'all 0.3s',
              boxShadow: won ? `0 0 20px ${s.color}44, inset 0 0 20px ${s.color}22` : 'none',
            }}
          >
            <div style={{
              fontSize: 8.5, letterSpacing: 2, color: s.color, fontWeight: 700, textTransform: 'uppercase',
            }}>{s.label}</div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 14,
              color: P.textMuted, fontStyle: 'italic', fontWeight: 500,
            }}>{s.odds}</div>
            {/* Chip stack if bet placed */}
            {amt > 0 && (
              <div style={{
                position: 'absolute', top: -6, right: -6,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <MiniChipStack total={amt} />
              </div>
            )}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: amt > 0 ? P.gold : P.textDim, fontWeight: 600,
              letterSpacing: 0.3,
            }}>${amt}</div>
          </button>
        );
      })}
    </div>
  );
}

function MiniChipStack({ total }) {
  // Small version for on-spot chip pile
  const denoms = [1000, 500, 100, 25, 5];
  const pieces = [];
  let rem = total;
  for (const v of denoms) {
    while (rem >= v && pieces.length < 4) { pieces.push(v); rem -= v; }
  }
  if (pieces.length === 0) pieces.push(5);
  return (
    <div style={{ position: 'relative', width: 30, height: 30 + pieces.length * 3 }}>
      {pieces.slice().reverse().map((v, i) => (
        <div key={i} style={{ position: 'absolute', bottom: i * 3, left: 0 }}>
          <Chip denom={v} size={30} asDiv />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BOTTOM CONTROLS — chip tray + action button
// ─────────────────────────────────────────────────────────
function BottomControls({
  phase, selectedChip, setSelectedChip, balance, totalBet,
  clearBets, deal, nextHand, canDeal, P, theme,
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '14px 16px 30px',
      background: `linear-gradient(180deg, transparent 0%, ${theme === 'midnight' ? '#030403' : '#051410'} 40%)`,
      display: 'flex', flexDirection: 'column', gap: 22,
    }}>
      {/* Action row — above chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {phase === 'betting' && (
          <>
            <button
              onClick={clearBets}
              disabled={totalBet === 0}
              style={ghostBtn(P, totalBet === 0)}
            >CLEAR</button>
            <button
              onClick={deal}
              disabled={!canDeal}
              style={primaryBtn(P, !canDeal)}
            >DEAL · ${totalBet}</button>
          </>
        )}
        {(phase === 'dealing' || phase === 'reveal') && (
          <button disabled style={primaryBtn(P, true)}>
            {phase === 'dealing' ? 'DEALING…' : 'REVEALING…'}
          </button>
        )}
        {phase === 'settled' && (
          <button onClick={nextHand} style={primaryBtn(P, false)}>
            NEXT HAND
          </button>
        )}
      </div>

      {/* Chip tray */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 4px',
      }}>
        {CHIP_DENOMS.map(c => (
          <Chip
            key={c.v}
            denom={c.v}
            size={46}
            selected={selectedChip === c.v}
            dim={c.v > balance && phase === 'betting'}
            onClick={() => setSelectedChip(c.v)}
          />
        ))}
      </div>

      {/* Text input + voice button */}
      <ChatInput P={P} theme={theme} />
    </div>
  );
}

const DEALER_SYSTEM_PROMPT =
  "You are the dealer at Salon Privé, a private baccarat room. " +
  "Speak formally and concisely. Answer rules questions, comment briefly on hands, " +
  "and suggest bets when asked. Keep replies under 2 sentences unless explaining rules.";

function ChatInput({ P, theme }) {
  const [value, setValue] = React.useState('');
  const [listening, setListening] = React.useState(false);
  const [status, setStatus] = React.useState('connecting'); // connecting | ready | error

  const sessionRef = React.useRef(null);
  const outCtxRef = React.useRef(null);
  const nextPlayRef = React.useRef(0);
  const inCtxRef = React.useRef(null);
  const micStreamRef = React.useRef(null);
  const workletNodeRef = React.useRef(null);

  // Play a base64 PCM16 24kHz chunk, queued after any currently playing audio.
  const playPCM = React.useCallback((b64) => {
    const bin = atob(b64);
    const buf = new ArrayBuffer(bin.length);
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const int16 = new Int16Array(buf);
    const f32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) f32[i] = int16[i] / 32768;

    if (!outCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      outCtxRef.current = new AC({ sampleRate: 24000 });
    }
    const ctx = outCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const ab = ctx.createBuffer(1, f32.length, 24000);
    ab.getChannelData(0).set(f32);
    const src = ctx.createBufferSource();
    src.buffer = ab;
    src.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime, nextPlayRef.current);
    src.start(startAt);
    nextPlayRef.current = startAt + ab.duration;
  }, []);

  // Open Live session on mount.
  React.useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        if (!window.GoogleGenAI) {
          await new Promise(r => window.addEventListener('genai-ready', r, { once: true }));
        }
        const tokRes = await fetch('/api/gemini-token', { method: 'POST' });
        if (!tokRes.ok) throw new Error(`token ${tokRes.status}`);
        const { token, error } = await tokRes.json();
        if (error) throw new Error(error);
        if (cancelled) return;

        const ai = new window.GoogleGenAI({ apiKey: token });
        const Modality = window.GeminiModality;

        const session = await ai.live.connect({
          model: 'gemini-3.1-flash-live-preview',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
            },
            systemInstruction: { parts: [{ text: DEALER_SYSTEM_PROMPT }] },
          },
          callbacks: {
            onopen: () => { if (!cancelled) setStatus('ready'); },
            onmessage: (msg) => {
              const parts = msg?.serverContent?.modelTurn?.parts || [];
              for (const p of parts) {
                const b64 = p?.inlineData?.data;
                if (b64) playPCM(b64);
              }
              if (msg?.data) playPCM(msg.data);
            },
            onerror: (e) => { console.error('Live error', e); if (!cancelled) setStatus('error'); },
            onclose: () => { if (!cancelled) setStatus('connecting'); },
          },
        });
        sessionRef.current = session;
      } catch (err) {
        console.error('Gemini init failed:', err);
        if (!cancelled) setStatus('error');
      }
    };
    init();

    return () => {
      cancelled = true;
      stopMic();
      try { sessionRef.current?.close?.(); } catch {}
      sessionRef.current = null;
      try { outCtxRef.current?.close?.(); } catch {}
      outCtxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendText = () => {
    const text = value.trim();
    if (!text || status !== 'ready' || !sessionRef.current) return;
    sessionRef.current.sendClientContent({ turns: text, turnComplete: true });
    setValue('');
  };

  const startMic = async () => {
    if (status !== 'ready' || !sessionRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      micStreamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC({ sampleRate: 16000 });
      inCtxRef.current = ctx;

      const workletSrc = `
        class PCMSender extends AudioWorkletProcessor {
          process(inputs) {
            const input = inputs[0];
            if (!input || !input[0]) return true;
            const ch = input[0];
            const pcm = new Int16Array(ch.length);
            for (let i = 0; i < ch.length; i++) {
              const s = Math.max(-1, Math.min(1, ch[i]));
              pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.port.postMessage(pcm.buffer, [pcm.buffer]);
            return true;
          }
        }
        registerProcessor('pcm-sender', PCMSender);
      `;
      const blobUrl = URL.createObjectURL(new Blob([workletSrc], { type: 'application/javascript' }));
      await ctx.audioWorklet.addModule(blobUrl);
      const srcNode = ctx.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(ctx, 'pcm-sender');
      node.port.onmessage = (e) => {
        const bytes = new Uint8Array(e.data);
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        const b64 = btoa(bin);
        try {
          sessionRef.current?.sendRealtimeInput({
            audio: { data: b64, mimeType: 'audio/pcm;rate=16000' },
          });
        } catch (err) { console.error('send audio', err); }
      };
      srcNode.connect(node);
      workletNodeRef.current = node;
      setListening(true);
    } catch (err) {
      console.error('Mic start failed:', err);
    }
  };

  const stopMic = () => {
    try { workletNodeRef.current?.disconnect(); } catch {}
    workletNodeRef.current = null;
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    try { inCtxRef.current?.close(); } catch {}
    inCtxRef.current = null;
    setListening(false);
  };

  const toggleMic = () => { listening ? stopMic() : startMic(); };

  const disabled = status !== 'ready';
  const placeholder =
    status === 'connecting' ? 'Connecting to dealer…' :
    status === 'error' ? 'Dealer unavailable' :
    'Ask the dealer…';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div style={{
        flex: 1, height: 44, borderRadius: 12,
        background: theme === 'midnight' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.32)',
        border: `0.5px solid ${P.line}`,
        display: 'flex', alignItems: 'center',
        padding: '0 14px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
        opacity: disabled ? 0.6 : 1,
      }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendText(); }}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: P.text, fontFamily: 'Cormorant Garamond, serif',
            fontSize: 16, fontStyle: value ? 'normal' : 'italic',
            letterSpacing: 0.2,
          }}
        />
        {status === 'ready' && (
          <div style={{
            width: 6, height: 6, borderRadius: 3, background: P.tie,
            boxShadow: `0 0 6px ${P.tie}`, marginLeft: 6, flexShrink: 0,
          }} />
        )}
      </div>
      <button
        onClick={toggleMic}
        disabled={disabled}
        style={{
          width: 44, height: 44, borderRadius: 12, border: 'none',
          background: listening
            ? `linear-gradient(180deg, ${P.gold} 0%, #B8932C 100%)`
            : theme === 'midnight' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.32)',
          boxShadow: listening
            ? `0 0 16px ${P.gold}66, inset 0 1px 0 rgba(255,255,255,0.3)`
            : 'inset 0 1px 2px rgba(0,0,0,0.25)',
          border: listening ? 'none' : `0.5px solid ${P.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer', transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
        }}
        aria-label="Voice input"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {(() => {
            const bars = [4, 9, 14, 9, 4];
            const c = listening ? '#0A0E0C' : P.gold;
            return bars.map((h, i) => (
              <rect key={i}
                x={3 + i * 4} y={(22 - h) / 2}
                width="2.2" height={h} rx="1.1"
                fill={c} />
            ));
          })()}
        </svg>
      </button>
    </div>
  );
}

const primaryBtn = (P, disabled) => ({
  flex: 1, height: 52, borderRadius: 12, border: 'none',
  background: disabled ? 'rgba(212,175,55,0.15)' : `linear-gradient(180deg, ${P.gold} 0%, #B8932C 100%)`,
  color: disabled ? P.textDim : '#0A0E0C',
  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 2.5,
  cursor: disabled ? 'default' : 'pointer',
  boxShadow: disabled ? 'none' : '0 4px 14px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
  transition: 'all 0.2s',
});

const ghostBtn = (P, disabled) => ({
  width: 92, height: 52, borderRadius: 12,
  background: 'transparent',
  border: `0.5px solid ${P.line}`,
  color: disabled ? P.textDim : P.textMuted,
  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: 2,
  cursor: disabled ? 'default' : 'pointer',
});

// ─────────────────────────────────────────────────────────
// RESULT BANNER
// ─────────────────────────────────────────────────────────
function ResultBanner({ result, P }) {
  const { won, lost, push, net, outcome } = result;
  const colorMap = { P: P.player, B: P.banker, T: P.tie };
  const label = { P: 'Player Wins', B: 'Banker Wins', T: 'Tie' }[outcome];
  const netColor = net > 0 ? P.gold : net < 0 ? P.banker : P.textMuted;
  const netSign = net > 0 ? '+' : net < 0 ? '-' : '';

  return (
    <div style={{
      position: 'absolute', top: '46%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
      padding: '18px 32px', borderRadius: 14,
      background: 'rgba(10,16,12,0.92)',
      backdropFilter: 'blur(10px)',
      border: `0.5px solid ${colorMap[outcome]}`,
      boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${colorMap[outcome]}44`,
      textAlign: 'center',
      animation: 'bannerIn 0.5s cubic-bezier(.3,1.2,.4,1) both',
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 3, color: P.textDim, textTransform: 'uppercase', fontWeight: 600,
      }}>Round Result</div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: 28,
        color: colorMap[outcome], letterSpacing: 0.3, marginTop: 2, fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: netColor,
        marginTop: 8, fontWeight: 500,
      }}>{netSign}${Math.abs(Math.round(net)).toLocaleString()}</div>
      {push > 0 && (
        <div style={{
          fontSize: 9, color: P.textDim, marginTop: 4, letterSpacing: 1,
        }}>${push} returned · tie</div>
      )}
    </div>
  );
}

Object.assign(window, {
  TopBar, Scoreboard, TableArea, HandColumn, HandRow, BetSpots, MiniChipStack,
  BottomControls, ResultBanner, ChatInput,
});
