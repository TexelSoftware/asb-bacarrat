// Roadmap — Bead Plate + Big Road

// outcomes: array of 'P' | 'B' | 'T'
function BeadPlate({ outcomes, rows = 6, cols = 11 }) {
  const cells = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      cells.push({ r, c, o: outcomes[idx] });
    }
  }
  const cellSize = 16;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap: 1,
      background: 'rgba(255,255,255,0.05)',
      padding: 3, borderRadius: 4,
      gridAutoFlow: 'column',
    }}>
      {cells.map((cell, i) => (
        <BeadCell key={i} outcome={cell.o} size={cellSize} />
      ))}
    </div>
  );
}

function BeadCell({ outcome, size = 16 }) {
  const color = outcome === 'P' ? '#3B7BCC' : outcome === 'B' ? '#C93838' : '#2E9E5C';
  return (
    <div style={{
      width: size, height: size,
      background: 'rgba(255,255,255,0.02)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {outcome && (
        <div style={{
          width: size - 4, height: size - 4, borderRadius: '50%',
          background: color,
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), 0 1px 1px rgba(0,0,0,0.3)',
          fontSize: 7, color: '#fff', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}>{outcome === 'T' ? 'T' : ''}</div>
      )}
    </div>
  );
}

// Big Road: columns break on outcome change (ignoring Ties; ties mark on the previous cell)
function buildBigRoad(outcomes, rows = 6) {
  // grid[col][row] = { o: 'P'|'B', ties: n }
  const grid = [];
  let col = -1, row = 0, last = null;
  for (const o of outcomes) {
    if (o === 'T') {
      if (col >= 0 && grid[col] && grid[col][row - 1]) {
        grid[col][row - 1].ties = (grid[col][row - 1].ties || 0) + 1;
      } else {
        // leading ties — put in 0,0
        col = 0; row = 0;
        grid[0] = grid[0] || [];
        grid[0][0] = grid[0][0] || { o: null, ties: 0 };
        grid[0][0].ties++;
      }
      continue;
    }
    if (o !== last) {
      col++;
      row = 0;
      grid[col] = [];
    } else {
      row++;
      if (row >= rows) {
        // drag right
        col++;
        grid[col] = grid[col] || [];
        row = rows - 1;
      }
    }
    grid[col] = grid[col] || [];
    grid[col][row] = { o, ties: 0 };
    last = o;
  }
  return grid;
}

function BigRoad({ outcomes, rows = 6, cols = 24 }) {
  const grid = buildBigRoad(outcomes, rows);
  const cellSize = 16;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      gap: 1,
      background: 'rgba(255,255,255,0.05)',
      padding: 3, borderRadius: 4,
      overflow: 'hidden',
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = i % rows;
        const c = Math.floor(i / rows);
        const cell = grid[c]?.[r];
        return <BigRoadCell key={i} cell={cell} size={cellSize} />;
      })}
    </div>
  );
}

function BigRoadCell({ cell, size }) {
  const color = cell?.o === 'P' ? '#3B7BCC' : cell?.o === 'B' ? '#C93838' : null;
  return (
    <div style={{
      width: size, height: size,
      background: 'rgba(255,255,255,0.02)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {color && (
        <div style={{
          width: size - 5, height: size - 5, borderRadius: '50%',
          border: `1.5px solid ${color}`,
          boxSizing: 'border-box',
        }} />
      )}
      {cell?.ties > 0 && (
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <svg width={size} height={size} style={{ position: 'absolute' }}>
            <line x1="2" y1={size - 2} x2={size - 2} y2="2" stroke="#2E9E5C" strokeWidth="1.2" />
          </svg>
        </div>
      )}
    </div>
  );
}

window.BeadPlate = BeadPlate;
window.BigRoad = BigRoad;
