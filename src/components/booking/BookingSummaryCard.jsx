import { formatDate } from '../../utils/format';

export default function BookingSummaryCard({ route, date, selectedSeats, passengers, step, onContinue, onBack, backLabel }) {
  const fare = route?.fareAC || 0;
  const total = fare * Math.max(selectedSeats.length, 1);
  const routeBox = route ? (
    <div className="summary-route">
      <div className="summary-route-cities">{route.from} → {route.to}</div>
      <div style={{ fontSize:'0.75rem', color:'var(--sky)', marginTop:4 }}>{route.busType} · {route.dep} - {route.arr}</div>
    </div>
  ) : <div className="summary-route"><div className="summary-route-cities">— → —</div></div>;

  return (
    <div className="booking-summary-card">
      <h3>📋 {step === 3 ? 'Final Summary' : 'Booking Summary'}</h3>
      {routeBox}
      {step === 1 && (
        <>
          <div className="summary-row"><span className="label">Date</span><span className="value">{date ? formatDate(date) : 'Any Date'}</span></div>
          <div className="summary-row"><span className="label">Bus Type</span><span className="value">{route?.busType || '—'}</span></div>
          <div className="summary-row"><span className="label">Seat(s)</span><span className="value">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}</span></div>
          <div className="summary-row"><span className="label">Fare/seat</span><span className="value">Rs. {fare.toLocaleString()}</span></div>
        </>
      )}
      {step === 2 && (
        <div className="summary-row"><span className="label">Seat(s)</span><span className="value">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}</span></div>
      )}
      {step === 3 && passengers.map(p => (
        <div key={p.seat} className="summary-row"><span className="label">{p.name}</span><span className="value">Seat {p.seat}</span></div>
      ))}
      <div className="summary-total">
        <span className="total-label">Total Amount</span>
        <span className="total-price">Rs. {total.toLocaleString()}</span>
      </div>
      <button className="btn-primary" onClick={onContinue}>
        {step === 1 ? 'Continue →' : step === 2 ? 'Review Booking →' : '🎫 Confirm & Get Ticket'}
      </button>
      {onBack && <button className="btn-secondary" style={{ width:'100%', marginTop:8 }} onClick={onBack}>← {backLabel || 'Back'}</button>}
    </div>
  );
}
