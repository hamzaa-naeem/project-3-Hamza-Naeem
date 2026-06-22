import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routeService } from '../services/routeService';
import { formatDate } from '../utils/format';

const FALLBACK_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan',
  'Peshawar','Quetta','Hyderabad','Sialkot','Gujranwala','Bahawalpur',
  'Muzaffarabad','Sukkur','Larkana'
];

export default function HomePage({ setCurrentBooking, showToast }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [passengers, setPassengers] = useState('1');
  const [results, setResults] = useState(null);
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await routeService.getCities();
        if (res.success && res.data && res.data.length > 0) {
          setCities(res.data);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    }
    loadCities();
  }, []);

  async function searchRoutes() {
    if (!from || !to) { showToast('Please select origin and destination', 'error'); return; }
    if (from === to) { showToast('Origin and destination must be different', 'error'); return; }
    
    setLoading(true);
    try {
      const res = await routeService.getRoutes(from, to);
      if (res.success) {
        setResults({ list: res.data, from, to, date });
      } else {
        showToast(res.message || 'Failed to fetch routes', 'error');
      }
    } catch (err) {
      showToast('Error searching routes', 'error');
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
    }
  }

  function selectRoute(route) {
    setCurrentBooking({ route, date, seats:[], passengers:[] });
    navigate('/booking');
  }

  return (
    <div id="page-home">
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag">🇵🇰 Pakistan's Trusted Bus Network</div>
          <h1>Travel Anywhere in<br /><em>Pakistan — Easily</em></h1>
          <p>Book tickets online for 200+ routes across Punjab, Sindh, KPK, Balochistan & AJK. Safe, reliable, on time.</p>
          <div className="stats-row">
            <div className="stat-pill"><strong>200+</strong> Routes</div>
            <div className="stat-pill"><strong>15+</strong> Cities</div>
            <div className="stat-pill"><strong>200k+</strong> Passengers</div>
            <div className="stat-pill"><strong>98%</strong> On-time</div>
          </div>
        </div>
      </div>

      {/* SEARCH CARD */}
      <div style={{ padding:'0 1rem' }}>
        <div className="search-card">
          <div className="search-tabs">
            <button className="search-tab active">One Way</button>
          </div>
          <div className="search-grid">
            <div className="form-group">
              <label>From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}>
                <option value="">Select City</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>To</label>
              <select value={to} onChange={e => setTo(e.target.value)}>
                <option value="">Select City</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Passengers</label>
              <select value={passengers} onChange={e => setPassengers(e.target.value)}>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} Passenger{n>1?'s':''}</option>)}
              </select>
            </div>
            <button className="btn-search" onClick={searchRoutes} disabled={loading}>
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {results && (
        <div className="results-section" id="results-section">
          <div className="section-header">
            <div>
              <div className="section-title">{results.from} → {results.to} ({results.list.length} buses found)</div>
              <div style={{ fontSize:'0.8rem', color:'var(--gray-400)', marginTop:2 }}>
                {results.date ? `For ${formatDate(results.date)}` : 'Select a date for accurate availability'}
              </div>
            </div>
          </div>
          <div>
            {results.list.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '2rem' }}>🚌</div>
                <h3>No Buses Found</h3>
                <p>Try searching for other popular routes like Lahore to Karachi or Islamabad to Lahore.</p>
              </div>
            ) : (
              results.list.map(r => (
                <div key={r._id} className="route-card" onClick={() => selectRoute(r)}>
                  <div>
                    <div className="route-city">{r.from}</div>
                    <div className="route-time">Dep: {r.dep}</div>
                  </div>
                  <div className="route-arrow">
                    <div>{r.dur}</div>
                    <div className="route-arrow-line" />
                    <div style={{ fontSize:'0.7rem' }}>{r.dist}</div>
                  </div>
                  <div>
                    <div className="route-city">{r.to}</div>
                    <div className="route-time">Arr: {r.arr}</div>
                    <div style={{ marginTop:6 }}>
                      <div className={`route-badge ${r.type==='AC' ? 'ac' : ''}`}>
                        {r.type==='AC' ? '❄️' : '🪟'} {r.busType}
                      </div>
                    </div>
                  </div>
                  <div className="route-info">
                    <div style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>{r.available} seats left</div>
                  </div>
                  <div className="route-price-block">
                    <div className="route-price">Rs. {r.fareAC.toLocaleString()} <span>AC</span></div>
                    <div style={{ fontSize:'0.8rem', color:'var(--gray-400)' }}>Rs. {r.fareNAC.toLocaleString()} Non-AC</div>
                    <button className="btn-book">Book Now →</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FEATURES */}
      <div className="container" style={{ marginTop:'3rem', marginBottom:'3rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { icon:'🛡️', title:'Secure Booking', desc:'Every transaction encrypted. Your data protected. Cancel anytime before departure.' },
            { icon:'📱', title:'Instant E-Ticket', desc:'Get your ticket instantly. Show it on your phone — no printing needed.' },
            { icon:'🔄', title:'Easy Refunds', desc:'Full refund up to 6 hours before departure. Process completed in 3–5 business days.' },
          ].map(f => (
            <div key={f.title} style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', padding:'1.5rem', border:'1.5px solid var(--gray-100)', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize:'0.85rem', color:'var(--gray-400)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
