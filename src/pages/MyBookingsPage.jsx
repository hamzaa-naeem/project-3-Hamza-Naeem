import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { formatDate } from '../utils/format';

export default function MyBookingsPage({ setLastTicket, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings(query);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [query]);

  async function handleCancelBooking(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await bookingService.cancelBooking(id);
      if (res.success) {
        showToast('Booking cancelled. You may request a refund in Help & Support.', 'success');
        loadBookings();
      } else {
        showToast(res.message || 'Failed to cancel booking', 'error');
      }
    } catch (err) {
      showToast('Error cancelling booking', 'error');
      console.error(err);
    }
  }

  function viewTicket(b) {
    setLastTicket(b);
    navigate('/ticket');
  }

  return (
    <div className="bookings-container">
      <div className="section-header" style={{ marginTop:'2rem' }}>
        <div>
          <div className="section-title">My Bookings</div>
          <div style={{ fontSize:'0.8rem', color:'var(--gray-400)', marginTop:2 }}>All your trip history in one place</div>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search bookings..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading bookings...</h3>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>No bookings yet</h3>
          <p>Your trip bookings will appear here.</p>
          <button className="btn-primary" style={{ width:'auto', padding:'10px 24px', marginTop:'1rem' }} onClick={() => navigate('/')}>Book a Trip</button>
        </div>
      ) : (
        bookings.map(b => (
          <div key={b._id} className="booking-list-card">
            <div className="booking-icon">🚌</div>
            <div className="booking-info">
              <h4>{b.from} → {b.to}</h4>
              <p>{formatDate(b.date)} &nbsp;·&nbsp; {b.busType || 'AC Bus'} &nbsp;·&nbsp; Seat(s): {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</p>
              <p style={{ marginTop:4, fontFamily:'monospace', fontSize:'0.75rem', color:'var(--gray-400)' }}>{b.ticketId}</p>
            </div>
            <div className="booking-meta">
              <div className="price">Rs. {b.total.toLocaleString()}</div>
              <div className={`status status-${b.status.toLowerCase()}`}>{b.status}</div>
              <div style={{ marginTop:6, display:'flex', gap:6, justifyContent:'flex-end' }}>
                <button className="btn-secondary" style={{ padding:'5px 10px', fontSize:'0.75rem' }} onClick={() => viewTicket(b)}>View Ticket</button>
                {b.status === 'Confirmed' && (
                  <button className="btn-danger" onClick={() => handleCancelBooking(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
