function Grid({ label, start, end, taken, selected, onToggle }) {
  const seats = [];
  for (let i = start; i <= end; i++) seats.push(i);
  return (
    <div>
      <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-400)', marginBottom:8, textAlign:'center' }}>{label}</p>
      <div className="seat-grid">
        {seats.map(n => {
          const isTaken = taken.has(n);
          const isSel = selected.includes(n);
          return (
            <div
              key={n}
              className={`seat${isTaken?' taken':isSel?' selected':''}`}
              onClick={() => !isTaken && onToggle(n)}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SeatGrid({ selected, takenSeats = [], onToggle }) {
  const defaultTaken = [2, 5, 9, 12, 15, 18, 23, 27, 31, 35];
  const combinedTaken = new Set([
    ...defaultTaken,
    ...takenSeats.map(Number)
  ]);

  return (
    <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', flexWrap:'wrap' }}>
      <Grid label="UPPER DECK" start={1} end={20} taken={combinedTaken} selected={selected} onToggle={onToggle} />
      <Grid label="LOWER DECK" start={21} end={40} taken={combinedTaken} selected={selected} onToggle={onToggle} />
    </div>
  );
}
