import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/format';

function Barcode() {
  const bars = Array.from({length:40}, (_,i) => ({ w: [1,2,3,1,2,3,1][i%7], op: 0.5+Math.random()*0.5 }));
  return (
    <div className="ticket-barcode">
      <div className="barcode-lines">
        {bars.map((b,i) => <span key={i} style={{ width:b.w, opacity:b.op }} />)}
      </div>
    </div>
  );
}

export default function TicketPage({ ticket }) {
  const navigate = useNavigate();

  if (!ticket) return (
    <div className="empty-state" style={{ padding:'4rem 2rem' }}>
      <div className="empty-icon">🎫</div>
      <h3>No ticket to display</h3>
      <p>Book a trip first to see your ticket here.</p>
      <button className="btn-primary" style={{ width:'auto', padding:'10px 24px', marginTop:'1rem' }} onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  return (
    <div className="ticket-wrapper">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>Booking Confirmed! 🎉</h2>
          <p style={{ color:'var(--gray-400)', fontSize:'0.875rem' }}>Your e-ticket is ready. Show this at boarding.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/mybookings')}>View All Bookings</button>
      </div>

      <div className="ticket">
        <div className="ticket-header">
          <div className="ticket-logo">Pak<span>Ride</span> Express</div>
          <div className="ticket-status">✓ Confirmed</div>
        </div>
        <div className="ticket-route-strip">
          <div>
            <div className="ticket-city">{ticket.from?.slice(0,3).toUpperCase()}</div>
            <div className="ticket-city-name">{ticket.from}</div>
          </div>
          <div className="ticket-route-mid">
            <div className="ticket-bus-icon">🚌</div>
            <div className="ticket-duration">{ticket.busType}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="ticket-city">{ticket.to?.slice(0,3).toUpperCase()}</div>
            <div className="ticket-city-name">{ticket.to}</div>
          </div>
        </div>
        <div className="ticket-body">
          <div className="ticket-grid">
            <div className="ticket-field"><label>Date</label><p>{formatDate(ticket.date)}</p></div>
            <div className="ticket-field"><label>Departure</label><p>{ticket.dep || '—'}</p></div>
            <div className="ticket-field"><label>Bus Type</label><p>{ticket.busType}</p></div>
            <div className="ticket-field"><label>Seat(s)</label><p>{Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ticket.seats}</p></div>
            <div className="ticket-field"><label>Payment</label><p style={{ textTransform:'capitalize' }}>{ticket.payment}</p></div>
            <div className="ticket-field"><label>Total Fare</label><p>Rs. {ticket.total?.toLocaleString()}</p></div>
          </div>
          <hr className="ticket-divider" />
          <div style={{ marginBottom:'1rem' }}>
            {(ticket.passengers || [{ name: ticket.passengerName, cnic: ticket.cnic }]).map((p,i) => (
              <div key={i} style={{ fontSize:'0.8rem', padding:'4px 0', color:'var(--gray-600)' }}>
                <strong>{p.name}</strong> &nbsp;·&nbsp; CNIC: {p.cnic}
              </div>
            ))}
          </div>
          <Barcode />
          <div className="ticket-id" style={{ textAlign:'center', marginTop:8 }}>
            {ticket.ticketId || ticket.id}
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button className="btn-primary" style={{ width:'auto', padding:'10px 28px' }} onClick={() => window.print()}>🖨️ Print Ticket</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  );
}
