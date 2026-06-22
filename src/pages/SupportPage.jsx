import { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { refundService } from '../services/refundService';
import { formatDateTime } from '../utils/format';

export default function SupportPage({ showToast }) {
  const [tab, setTab] = useState('complaint');

  // Complaint form
  const [cForm, setCForm] = useState({ ticketId:'', category:'', name:'', phone:'', desc:'' });
  // Refund form
  const [rForm, setRForm] = useState({ ticketId:'', cnic:'', phone:'', method:'', reason:'' });
  // Track
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  // History
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'history') loadHistory();
  }, [tab]);

  async function loadHistory() {
    setLoading(true);
    try {
      const cRes = await complaintService.getMyComplaints();
      const rRes = await refundService.getMyRefunds();
      
      const c = (cRes.data || []).map(x => ({ ...x, _type:'Complaint', id: x.complaintId }));
      const r = (rRes.data || []).map(x => ({ ...x, _type:'Refund', id: x.refundId }));
      
      setHistory([...c, ...r].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Failed to load history:', err);
      showToast('Failed to load request history', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function submitComplaint() {
    const { ticketId, category, name, phone, desc } = cForm;
    if (!category || !name || !phone || !desc) { showToast('Please fill all required fields', 'error'); return; }
    
    try {
      const res = await complaintService.fileComplaint({ ticketId, category, name, phone, desc });
      if (res.success) {
        showToast(`✅ Complaint submitted! Reference: ${res.data.complaintId}`, 'success');
        setCForm({ ticketId:'', category:'', name:'', phone:'', desc:'' });
      } else {
        showToast(res.message || 'Failed to submit complaint', 'error');
      }
    } catch (err) {
      showToast('Error submitting complaint', 'error');
      console.error(err);
    }
  }

  async function submitRefund() {
    const { ticketId, cnic, phone, method, reason } = rForm;
    if (!ticketId || !cnic || !phone || !method || !reason) { showToast('Please fill all fields', 'error'); return; }
    
    try {
      const res = await refundService.requestRefund({ ticketId, cnic, phone, method, reason });
      if (res.success) {
        showToast(`✅ Refund requested! Reference: ${res.data.refundId}. Processing 3-5 business days.`, 'success');
        setRForm({ ticketId:'', cnic:'', phone:'', method:'', reason:'' });
      } else {
        showToast(res.message || 'Failed to request refund', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error requesting refund. Make sure ticket exists and has not been refunded already.', 'error');
      console.error(err);
    }
  }

  async function trackRequest() {
    const q = trackId.trim().toUpperCase();
    if (!q) { showToast('Please enter an ID to track', 'error'); return; }
    
    setTrackResult(null);
    let found = false;

    // Try complaint track
    try {
      const res = await complaintService.trackComplaint(q);
      if (res.success && res.data) {
        setTrackResult({ ...res.data, _type: 'Complaint', id: res.data.complaintId });
        found = true;
      }
    } catch (err) {
      // If it fails, ignore and try refund
    }

    if (!found) {
      try {
        const res = await refundService.trackRefund(q);
        if (res.success && res.data) {
          setTrackResult({ ...res.data, _type: 'Refund', id: res.data.refundId });
          found = true;
        }
      } catch (err) {
        // If both failed, show no record
      }
    }

    if (!found) {
      setTrackResult(false); // false indicates search finished but not found
    }
  }

  const tabs = [
    { key:'complaint', label:'🚨 File Complaint' },
    { key:'refund', label:'💰 Request Refund' },
    { key:'status', label:'🔍 Track Status' },
    { key:'history', label:'📋 My Requests' },
  ];

  return (
    <div className="cr-container" style={{ marginTop:'2rem' }}>
      <div className="section-title" style={{ marginBottom:'0.5rem' }}>Help & Support</div>
      <p style={{ color:'var(--gray-400)', fontSize:'0.875rem', marginBottom:'1.5rem' }}>Submit complaints, request refunds, or check ticket status.</p>

      <div className="cr-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`cr-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* COMPLAINT */}
      {tab === 'complaint' && (
        <div className="cr-card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>📝 File a New Complaint</h3>
          <div className="form-row">
            <div><label className="input-label">Ticket ID / PNR</label><input className="input-field" placeholder="e.g. PRE-20241201-0001" value={cForm.ticketId} onChange={e => setCForm({...cForm, ticketId:e.target.value})} /></div>
            <div>
              <label className="input-label">Complaint Category</label>
              <select className="input-field" value={cForm.category} onChange={e => setCForm({...cForm, category:e.target.value})}>
                <option value="">Select Category</option>
                {['Bus Late / Delayed','Rude Staff Behavior','Seat Issue / Dirty Bus','Overcharging','Luggage Lost / Damaged','Safety Concern','AC Not Working','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div><label className="input-label">Your Full Name</label><input className="input-field" placeholder="Muhammad Ali" value={cForm.name} onChange={e => setCForm({...cForm, name:e.target.value})} /></div>
            <div><label className="input-label">Contact Number</label><input className="input-field" placeholder="03XX-XXXXXXX" value={cForm.phone} onChange={e => setCForm({...cForm, phone:e.target.value})} /></div>
          </div>
          <div className="form-full">
            <label className="input-label">Complaint Details</label>
            <textarea className="input-field" rows={5} placeholder="Please describe your complaint in detail..." style={{ resize:'vertical' }} value={cForm.desc} onChange={e => setCForm({...cForm, desc:e.target.value})} />
          </div>
          <div style={{ display:'flex', gap:12, marginTop:'0.5rem' }}>
            <button className="btn-primary" style={{ width:'auto', padding:'11px 28px' }} onClick={submitComplaint}>Submit Complaint</button>
            <button className="btn-secondary" onClick={() => setCForm({ ticketId:'', category:'', name:'', phone:'', desc:'' })}>Clear Form</button>
          </div>
        </div>
      )}

      {/* REFUND */}
      {tab === 'refund' && (
        <div className="cr-card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>💰 Request Ticket Refund</h3>
          <div style={{ background:'var(--amber-light)', border:'1px solid #FCD34D', borderRadius:'var(--radius-md)', padding:'12px 16px', marginBottom:'1.25rem', fontSize:'0.85rem', color:'#92400E' }}>
            ⚠️ Refund Policy: Full refund if cancelled 6+ hours before departure. 50% refund 2–6 hours before. No refund within 2 hours.
          </div>
          <div className="form-row">
            <div><label className="input-label">Ticket ID / PNR</label><input className="input-field" placeholder="PRE-XXXXXXXXXX" value={rForm.ticketId} onChange={e => setRForm({...rForm, ticketId:e.target.value})} /></div>
            <div><label className="input-label">CNIC (passenger)</label><input className="input-field" placeholder="XXXXX-XXXXXXX-X" value={rForm.cnic} onChange={e => setRForm({...rForm, cnic:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div><label className="input-label">Contact Number</label><input className="input-field" placeholder="03XX-XXXXXXX" value={rForm.phone} onChange={e => setRForm({...rForm, phone:e.target.value})} /></div>
            <div>
              <label className="input-label">Refund to</label>
              <select className="input-field" value={rForm.method} onChange={e => setRForm({...rForm, method:e.target.value})}>
                <option value="">Select method</option>
                <option>Easypaisa</option><option>JazzCash</option><option>Bank Account</option>
              </select>
            </div>
          </div>
          <div className="form-full">
            <label className="input-label">Reason for Cancellation</label>
            <textarea className="input-field" rows={3} placeholder="Please explain why you are cancelling..." style={{ resize:'vertical' }} value={rForm.reason} onChange={e => setRForm({...rForm, reason:e.target.value})} />
          </div>
          <button className="btn-primary" style={{ width:'auto', padding:'11px 28px' }} onClick={submitRefund}>Request Refund</button>
        </div>
      )}

      {/* TRACK */}
      {tab === 'status' && (
        <div className="cr-card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>🔍 Track Your Request</h3>
          <div style={{ display:'flex', gap:12, marginBottom:'1.5rem' }}>
            <input className="input-field" placeholder="Enter Complaint ID or Ticket ID" style={{ flex:1 }} value={trackId} onChange={e => setTrackId(e.target.value)} />
            <button className="btn-primary" style={{ width:'auto', padding:'11px 22px' }} onClick={trackRequest}>Track</button>
          </div>
          {trackResult === false && (
            <div style={{ background:'var(--red-light)', borderRadius:'var(--radius-md)', padding:'1rem', color:'#991B1B', fontSize:'0.875rem' }}>
              ❌ No record found for "<strong>{trackId.toUpperCase()}</strong>". Please check your ID and try again.
            </div>
          )}
          {trackResult && trackResult !== false && (
            <div style={{ background:'var(--green-light)', borderRadius:'var(--radius-md)', padding:'1.25rem' }}>
              <p style={{ fontWeight:700, fontSize:'0.9rem', color:'#065F46', marginBottom:'0.5rem' }}>✅ Record Found — {trackResult.id}</p>
              <p style={{ fontSize:'0.8rem', color:'#065F46' }}>Type: {trackResult._type} · Status: <strong>{trackResult.status}</strong></p>
              {trackResult._type === 'Complaint'
                ? <p style={{ fontSize:'0.8rem', color:'#065F46', marginTop:4 }}>Category: {trackResult.category}</p>
                : <p style={{ fontSize:'0.8rem', color:'#065F46', marginTop:4 }}>Amount: Rs. {trackResult.amount?.toLocaleString()} via {trackResult.method}</p>
              }
              <p style={{ fontSize:'0.75rem', color:'#065F46', marginTop:4 }}>Submitted: {formatDateTime(trackResult.createdAt)}</p>
            </div>
          )}
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div className="cr-card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>📋 My Requests History</h3>
          {loading ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>Loading requests history...</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No requests submitted yet.</div>
          ) : (
            history.map(item => (
              <div key={item._id} className="complaint-list-item">
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--navy)', marginBottom:2 }}>{item._type} — {item.id}</p>
                  {item._type === 'Complaint'
                    ? <p style={{ fontSize:'0.8rem', color:'var(--gray-400)' }}>{item.category}</p>
                    : <p style={{ fontSize:'0.8rem', color:'var(--gray-400)' }}>Rs. {item.amount?.toLocaleString()} via {item.method}</p>
                  }
                  <p style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:4 }}>Ticket: {item.ticketId || '—'} · {formatDateTime(item.createdAt)}</p>
                </div>
                <span className={`complaint-badge ${item.status === 'Resolved' || item.status === 'Processed' ? 'resolved' : ''}`}>{item.status}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
