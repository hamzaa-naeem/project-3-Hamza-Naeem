import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatGrid from '../components/booking/SeatGrid';
import BookingSummaryCard from '../components/booking/BookingSummaryCard';
import { bookingService } from '../services/bookingService';

function Steps({ step }) {
  const items = ['Select Seat','Passenger Info','Confirm & Pay','Ticket'];
  return (
    <div className="booking-steps">
      {items.map((label, i) => {
        const n = i + 1;
        const cls = n < step ? 'done' : n === step ? 'active' : '';
        return (
          <div key={n} className={`step-item ${cls}`} id={`step-${n}`}>
            <div className="step-num">{n < step ? '✓' : n}</div>
            <span className="step-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function PassengerForm({ seat, index, data, onChange }) {
  const f = (field, val) => onChange(index, field, val);
  return (
    <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:'1.25rem', marginBottom:'1rem' }}>
      <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--blue)', marginBottom:'0.75rem' }}>PASSENGER {index+1} — SEAT {seat}</p>
      <div className="form-row">
        <div><label className="input-label">Full Name</label><input className="input-field" placeholder="As on CNIC" value={data.name||''} onChange={e=>f('name',e.target.value)} /></div>
        <div><label className="input-label">CNIC / B-Form</label><input className="input-field" placeholder="XXXXX-XXXXXXX-X" value={data.cnic||''} onChange={e=>f('cnic',e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div><label className="input-label">Contact Number</label><input className="input-field" placeholder="03XX-XXXXXXX" value={data.phone||''} onChange={e=>f('phone',e.target.value)} /></div>
        <div><label className="input-label">Age</label><input className="input-field" type="number" placeholder="e.g. 28" value={data.age||''} onChange={e=>f('age',e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div>
          <label className="input-label">Gender</label>
          <select className="input-field" value={data.gender||'Male'} onChange={e=>f('gender',e.target.value)}>
            <option>Male</option><option>Female</option><option>Prefer not to say</option>
          </select>
        </div>
        <div><label className="input-label">City</label><input className="input-field" placeholder="Home city" value={data.city||''} onChange={e=>f('city',e.target.value)} /></div>
      </div>
    </div>
  );
}

export default function BookingPage({ booking, setLastTicket, showToast }) {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paxData, setPaxData] = useState([]);
  const [payMethod, setPayMethod] = useState('easypaisa');
  const [takenSeats, setTakenSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const navigate = useNavigate();

  const { route, date } = booking || {};

  useEffect(() => {
    async function fetchBookedSeats() {
      if (!route?._id || !date) return;
      setLoadingSeats(true);
      try {
        const res = await bookingService.getBookedSeats(route._id, date);
        if (res.success) {
          setTakenSeats(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch booked seats:', err);
      } finally {
        setLoadingSeats(false);
      }
    }
    fetchBookedSeats();
  }, [route?._id, date]);

  function toggleSeat(n) {
    setSelectedSeats(prev => prev.includes(n) ? prev.filter(s=>s!==n) : [...prev, n]);
  }

  function goStep2() {
    if (selectedSeats.length === 0) { showToast('Please select at least one seat', 'error'); return; }
    setPaxData(selectedSeats.map((_,i) => paxData[i] || {}));
    setStep(2);
  }

  function updatePax(i, field, val) {
    setPaxData(prev => { const d=[...prev]; d[i]={...d[i],[field]:val}; return d; });
  }

  function goStep3() {
    const valid = selectedSeats.every((_,i) => paxData[i]?.name?.trim() && paxData[i]?.cnic?.trim() && paxData[i]?.phone?.trim());
    if (!valid) { showToast('Please fill all passenger details', 'error'); return; }
    setStep(3);
  }

  async function confirmBooking() {
    const now = new Date();
    const tDate = date || now.toISOString().slice(0,10);
    const passengers = selectedSeats.map((seat,i) => ({
      name: paxData[i].name,
      cnic: paxData[i].cnic,
      phone: paxData[i].phone,
      age: Number(paxData[i].age) || undefined,
      gender: paxData[i].gender || 'Male',
      city: paxData[i].city || '',
      seat: String(seat)
    }));

    const booking_data = {
      routeId: route._id,
      passengerName: passengers[0].name,
      cnic: passengers[0].cnic,
      phone: passengers[0].phone,
      from: route.from,
      to: route.to,
      date: tDate,
      dep: route.dep,
      arr: route.arr,
      busType: route.busType,
      seats: selectedSeats.map(String),
      passengers,
      farePerSeat: route.type === 'AC' ? route.fareAC : route.fareNAC,
      total: (route.type === 'AC' ? route.fareAC : route.fareNAC) * selectedSeats.length,
      payment: payMethod
    };

    try {
      const res = await bookingService.createBooking(booking_data);
      if (res.success) {
        setLastTicket(res.data);
        showToast('🎉 Booking confirmed! Enjoy your journey.', 'success');
        navigate('/ticket');
      } else {
        showToast(res.message || 'Booking failed', 'error');
      }
    } catch (err) {
      showToast('Error creating booking', 'error');
      console.error(err);
    }
  }

  const payOptions = [
    { value:'easypaisa', label:'📱 Easypaisa' },
    { value:'jazzcash', label:'💜 JazzCash' },
    { value:'card', label:'💳 Debit/Credit Card' },
    { value:'counter', label:'🏢 Pay at Counter' },
  ];

  if (!booking) return <div className="empty-state"><div className="empty-icon">🔍</div><h3>No route selected</h3><p>Please search and select a route first.</p></div>;

  return (
    <div className="booking-container">
      <Steps step={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="booking-layout">
          <div className="booking-form-card">
            <h3>🪑 Select Your Seat</h3>
            <div id="booking-route-info" style={{ background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:'1rem', marginBottom:'1rem', fontSize:'0.875rem', color:'var(--gray-600)' }}>
              <strong>{route.from} → {route.to}</strong> &nbsp;|&nbsp; {route.busType} &nbsp;|&nbsp; Dep: {route.dep} → Arr: {route.arr} &nbsp;|&nbsp; {route.dur}
            </div>
            <div className="seat-legend">
              <div className="seat-legend-item"><div className="legend-dot"></div> Available</div>
              <div className="seat-legend-item"><div className="legend-dot sel"></div> Selected</div>
              <div className="seat-legend-item"><div className="legend-dot tak"></div> Taken</div>
            </div>
            {loadingSeats ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                ⏳ Loading seat availability...
              </div>
            ) : (
              <SeatGrid selected={selectedSeats} takenSeats={takenSeats} onToggle={toggleSeat} />
            )}
            <p style={{ marginTop:'1rem', fontSize:'0.85rem', color:'var(--gray-600)' }}>
              Selected: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
            </p>
          </div>
          <BookingSummaryCard route={route} date={date} selectedSeats={selectedSeats} passengers={[]} step={1} onContinue={goStep2} />
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="booking-layout">
          <div className="booking-form-card">
            <h3>👤 Passenger Information</h3>
            {selectedSeats.map((seat, i) => (
              <PassengerForm key={seat} seat={seat} index={i} data={paxData[i]||{}} onChange={updatePax} />
            ))}
          </div>
          <BookingSummaryCard route={route} date={date} selectedSeats={selectedSeats} passengers={[]} step={2} onContinue={goStep3} onBack={() => setStep(1)} backLabel="Back" />
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="booking-layout">
          <div className="booking-form-card">
            <h3>✅ Confirm Booking</h3>
            <div id="confirm-summary" style={{ marginBottom:'1.25rem' }}>
              <div style={{ border:'1.5px solid var(--gray-100)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
                <div style={{ background:'var(--gray-50)', padding:'10px 16px', fontWeight:700, fontSize:'0.85rem', color:'var(--navy)' }}>
                  {route.from} → {route.to} · {date || 'Open Date'}
                </div>
                {selectedSeats.map((seat,i) => (
                  <div key={seat} style={{ padding:'10px 16px', borderTop:'1px solid var(--gray-100)', fontSize:'0.85rem' }}>
                    <strong>{paxData[i]?.name}</strong> &nbsp; Seat {seat} &nbsp;·&nbsp; CNIC: <span className="cnic">{paxData[i]?.cnic}</span> &nbsp;·&nbsp; {paxData[i]?.phone}
                  </div>
                ))}
              </div>
            </div>
            <h3 style={{ borderTop:'1px solid var(--gray-100)', paddingTop:'1rem' }}>💳 Payment Method</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:'1rem' }}>
              {payOptions.map(opt => (
                <label key={opt.value} style={{ display:'flex', alignItems:'center', gap:12, padding:14, border: payMethod===opt.value ? '2px solid var(--blue)' : '1.5px solid var(--gray-200)', borderRadius:'var(--radius-md)', cursor:'pointer', background: payMethod===opt.value ? 'rgba(37,99,235,0.04)' : 'white' }}>
                  <input type="radio" name="payment" value={opt.value} checked={payMethod===opt.value} onChange={() => setPayMethod(opt.value)} />
                  <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <BookingSummaryCard route={route} date={date} selectedSeats={selectedSeats} passengers={selectedSeats.map((seat,i) => ({ ...paxData[i], seat }))} step={3} onContinue={confirmBooking} onBack={() => setStep(2)} backLabel="Back" />
        </div>
      )}
    </div>
  );
}
