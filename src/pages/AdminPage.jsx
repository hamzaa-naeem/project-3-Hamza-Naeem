import { useState, useEffect } from 'react';
import { formatDate, formatDateTime } from '../utils/format';
import { bookingService } from '../services/bookingService';
import { routeService } from '../services/routeService';
import { complaintService } from '../services/complaintService';
import { refundService } from '../services/refundService';
import { dashboardService, passengerService } from '../services/dashboardService';
import RevenueChart from '../components/admin/RevenueChart';
import RouteChart from '../components/admin/RouteChart';
import PassengersChart from '../components/admin/PassengersChart';
import StatusChart from '../components/admin/StatusChart';

// Shared KPI Card Component
function KpiCard({ icon, iconClass, label, value, delta, deltaClass }) {
  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${iconClass}`}>{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {delta && <div className={`kpi-delta ${deltaClass || 'up'}`}>{delta}</div>}
    </div>
  );
}

// Dashboard Section
function Dashboard({ chartPeriod, setChartPeriod }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await dashboardService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading-state">Loading dashboard stats...</div>;

  const { totalRevenue = 0, ticketsSold = 0, passengers = 0, openComplaints = 0 } = stats || {};

  return (
    <div>
      <div className="admin-page-title">Dashboard</div>
      <div className="admin-page-sub">{dateStr}</div>
      <div className="kpi-grid">
        <KpiCard icon="💰" iconClass="blue" label="Total Revenue" value={`Rs. ${(totalRevenue/1000).toFixed(0)}K`} delta="↑ 12.5%" />
        <KpiCard icon="🎫" iconClass="green" label="Tickets Sold" value={ticketsSold} delta="↑ 8.1%" />
        <KpiCard icon="👥" iconClass="amber" label="Passengers" value={passengers} delta="↑ 8.2%" />
        <KpiCard icon="🚨" iconClass="red" label="Open Complaints" value={openComplaints} delta={openComplaints > 0 ? `${openComplaints} open` : '✓ All resolved'} deltaClass={openComplaints > 0 ? 'down' : 'up'} />
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Revenue Overview</div>
              <div className="chart-sub">{{ month: 'Monthly revenue (current year)', week: 'Weekly revenue (last 12 weeks)', day: 'Daily revenue (last 30 days)' }[chartPeriod]}</div>
            </div>
            <div className="chart-period-btns">
              {['month', 'week', 'day'].map(p => (
                <button key={p} className={`period-btn${chartPeriod === p ? ' active' : ''}`} onClick={() => setChartPeriod(p)}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
          </div>
          <RevenueChart id="revenueChart" period={chartPeriod} />
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-title">Routes Distribution</div><div className="chart-sub">Top 5 routes by bookings</div></div>
          </div>
          <RouteChart />
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-header"><div><div className="chart-title">Daily Passengers</div><div className="chart-sub">Last 30 days</div></div></div>
          <PassengersChart />
        </div>
        <div className="chart-card">
          <div className="chart-card-header"><div><div className="chart-title">Booking Status</div></div></div>
          <StatusChart />
        </div>
      </div>
    </div>
  );
}

// Revenue Section
function Revenue() {
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const bRes = await bookingService.getAllBookings();
        const rRes = await refundService.getAllRefunds();
        if (bRes.success) setBookings(bRes.data);
        if (rRes.success) setRefunds(rRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="loading-state">Loading revenue analytics...</div>;

  const totalRev = bookings.filter(b => b.status !== 'Cancelled' && b.status !== 'Refunded').reduce((s, b) => s + b.total, 0);
  const now = new Date();
  const monthRev = bookings.filter(b => { const d = new Date(b.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.status === 'Confirmed'; }).reduce((s, b) => s + b.total, 0);
  const todayStr = now.toISOString().slice(0, 10);
  const todayRev = bookings.filter(b => b.date === todayStr && b.status === 'Confirmed').reduce((s, b) => s + b.total, 0);
  const refundAmt = refunds.filter(r => r.status === 'Processed').reduce((s, r) => s + (r.amount || 0), 0);
  const recent = [...bookings].reverse().slice(0, 20);

  return (
    <div>
      <div className="admin-page-title">Revenue Analytics</div>
      <div className="admin-page-sub">Detailed financial breakdown</div>
      <div className="kpi-grid">
        <KpiCard icon="💰" iconClass="blue" label="Total Revenue" value={`Rs. ${totalRev.toLocaleString()}`} />
        <KpiCard icon="📅" iconClass="green" label="This Month" value={`Rs. ${monthRev.toLocaleString()}`} />
        <KpiCard icon="📆" iconClass="amber" label="Today" value={`Rs. ${todayRev.toLocaleString()}`} />
        <KpiCard icon="💸" iconClass="red" label="Refunds Issued" value={`Rs. ${refundAmt.toLocaleString()}`} />
      </div>
      <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
        <div className="chart-card-header"><div className="chart-title">Monthly Revenue Trend</div></div>
        <RevenueChart id="revenueChart2" period="month" />
      </div>
      <div className="table-card">
        <div className="table-card-header"><div className="chart-title">Recent Transactions</div></div>
        <table className="data-table">
          <thead><tr><th>Ticket ID</th><th>Route</th><th>Passenger</th><th>Date</th><th>Amount</th><th>Method</th></tr></thead>
          <tbody>
            {recent.map(b => (
              <tr key={b._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{b.ticketId}</td>
                <td>{b.from} → {b.to}</td>
                <td>{b.passengerName}</td>
                <td>{formatDate(b.date)}</td>
                <td style={{ fontWeight: 700 }}>Rs. {b.total.toLocaleString()}</td>
                <td>{b.payment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// All Bookings Section
function AllBookings({ showToast }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await bookingService.getAllBookings(status, query);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [status, query]);

  async function cancel(id) {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const res = await bookingService.cancelBooking(id);
      if (res.success) {
        showToast('Booking cancelled', 'success');
        loadBookings();
      } else {
        showToast(res.message || 'Failed to cancel booking', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error cancelling booking', 'error');
    }
  }

  return (
    <div>
      <div className="admin-page-title">All Bookings</div>
      <div className="admin-page-sub">Complete booking records</div>
      <div className="table-card">
        <div className="table-card-header">
          <div className="chart-title">Booking Records</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" className="search-input" placeholder="Search bookings..." value={query} onChange={e => setQuery(e.target.value)} />
            <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option>Confirmed</option><option>Pending</option><option>Cancelled</option><option>Refunded</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading bookings...</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Ticket ID</th><th>Passenger</th><th>Route</th><th>Date</th><th>Seat(s)</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{b.ticketId}</td>
                  <td><div className="cell-user"><div className="avatar">{b.passengerName.slice(0, 2).toUpperCase()}</div>{b.passengerName}</div></td>
                  <td>{b.from} → {b.to}</td>
                  <td>{formatDate(b.date)}</td>
                  <td>{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</td>
                  <td style={{ fontWeight: 700 }}>Rs. {b.total.toLocaleString()}</td>
                  <td><span className={`status status-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'Confirmed' && (
                      <button className="btn-danger" onClick={() => cancel(b._id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Routes Section
function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const res = await routeService.getRoutes();
        if (res.success) {
          setRoutes(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  return (
    <div>
      <div className="admin-page-title">Route Management</div>
      <div className="admin-page-sub">All active bus routes</div>
      <div className="table-card">
        <div className="table-card-header"><div className="chart-title">Active Routes</div></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading routes...</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Route</th><th>Distance</th><th>Duration</th><th>Fare (AC)</th><th>Fare (Non-AC)</th><th>Status</th></tr></thead>
            <tbody>
              {routes.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.from}</strong> → <strong>{r.to}</strong></td>
                  <td>{r.dist}</td>
                  <td>{r.dur}</td>
                  <td>Rs. {r.fareAC.toLocaleString()}</td>
                  <td>Rs. {r.fareNAC.toLocaleString()}</td>
                  <td><span className={`route-badge ${r.status === 'active' ? 'ac' : ''}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Passengers Section
function Passengers() {
  const [query, setQuery] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPassengers() {
      setLoading(true);
      try {
        const res = await passengerService.getPassengers(query);
        if (res.success) {
          setPassengers(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPassengers();
  }, [query]);

  return (
    <div>
      <div className="admin-page-title">Passenger Records</div>
      <div className="admin-page-sub">Complete passenger database with CNIC and contact details</div>
      <div className="table-card">
        <div className="table-card-header">
          <div className="chart-title">Passenger Database</div>
          <input type="text" className="search-input" placeholder="Search by name, CNIC, phone..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading passengers...</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Passenger</th><th>CNIC</th><th>Contact</th><th>City</th><th>Trips</th><th>Total Spent</th><th>Last Trip</th></tr></thead>
            <tbody>
              {passengers.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>No passengers found</td></tr>
                : passengers.map(p => (
                  <tr key={p._id}>
                    <td><div className="cell-user"><div className="avatar">{p.name.slice(0, 2).toUpperCase()}</div><div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{p.city || '—'}</div></div></div></td>
                    <td className="cnic">{p.cnic}</td>
                    <td>{p.phone}</td>
                    <td>{p.city || '—'}</td>
                    <td>{p.trips}</td>
                    <td style={{ fontWeight: 700 }}>Rs. {(p.totalSpent || 0).toLocaleString()}</td>
                    <td>{p.lastTrip ? formatDate(p.lastTrip) : '—'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Complaints Section
function Complaints({ showToast }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComplaints() {
    setLoading(true);
    try {
      const res = await complaintService.getAllComplaints(statusFilter);
      if (res.success) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  async function resolve(id) {
    try {
      const res = await complaintService.resolveComplaint(id);
      if (res.success) {
        showToast(`Complaint resolved`, 'success');
        loadComplaints();
      } else {
        showToast(res.message || 'Failed to resolve complaint', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error resolving complaint', 'error');
    }
  }

  return (
    <div>
      <div className="admin-page-title">Complaint Management</div>
      <div className="admin-page-sub">Review and resolve customer complaints</div>
      <div className="table-card">
        <div className="table-card-header">
          <div className="chart-title">All Complaints</div>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option><option>Open</option><option>In Review</option><option>Resolved</option>
          </select>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading complaints...</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Complaint ID</th><th>Ticket ID</th><th>Passenger</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{c.complaintId}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{c.ticketId || '—'}</td>
                  <td>{c.name}</td>
                  <td>{c.category}</td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td><span className={`complaint-badge${c.status === 'Resolved' ? ' resolved' : ''}`}>{c.status}</span></td>
                  <td>
                    {c.status !== 'Resolved'
                      ? <button style={{ background: 'var(--green-light)', color: '#065F46', border: 'none', padding: '5px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => resolve(c._id)}>Resolve</button>
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Refunds Section
function Refunds({ showToast }) {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRefunds() {
    setLoading(true);
    try {
      const res = await refundService.getAllRefunds();
      if (res.success) {
        setRefunds(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRefunds();
  }, []);

  async function process(id) {
    try {
      const res = await refundService.processRefund(id);
      if (res.success) {
        showToast(`Refund processed successfully`, 'success');
        loadRefunds();
      } else {
        showToast(res.message || 'Failed to process refund', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error processing refund', 'error');
    }
  }

  return (
    <div>
      <div className="admin-page-title">Refund Requests</div>
      <div className="admin-page-sub">Manage pending and processed refunds</div>
      <div className="table-card">
        <div className="table-card-header"><div className="chart-title">Refund Requests</div></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading refunds...</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Request ID</th><th>Ticket ID</th><th>Passenger</th><th>CNIC</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {refunds.map(r => (
                <tr key={r._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{r.refundId}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{r.ticketId}</td>
                  <td>{r.name}</td>
                  <td className="cnic">{r.cnic}</td>
                  <td style={{ fontWeight: 700 }}>Rs. {r.amount?.toLocaleString()}</td>
                  <td>{r.method}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td><span className={`complaint-badge${r.status === 'Processed' ? ' resolved' : ''}`}>{r.status}</span></td>
                  <td>
                    {r.status === 'Pending'
                      ? <button style={{ background: 'var(--green-light)', color: '#065F46', border: 'none', padding: '5px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => process(r._id)}>Process</button>
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Admin Page Container
export default function AdminPage({ showToast }) {
  const [section, setSection] = useState('dashboard');
  const [chartPeriod, setChartPeriod] = useState('month');
  const [counts, setCounts] = useState({ paxCount: 0, compCount: 0 });

  useEffect(() => {
    async function loadCounts() {
      try {
        const statsRes = await dashboardService.getStats();
        if (statsRes.success) {
          setCounts({
            paxCount: statsRes.data.passengers,
            compCount: statsRes.data.openComplaints
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCounts();
  }, [section]);

  const sidebarItems = [
    {
      group: 'Overview', items: [
        { key: 'dashboard', icon: '📊', label: 'Dashboard' },
        { key: 'revenue', icon: '💰', label: 'Revenue' },
      ]
    },
    {
      group: 'Operations', items: [
        { key: 'bookings', icon: '🎫', label: 'All Bookings' },
        { key: 'routes', icon: '🗺️', label: 'Routes' },
      ]
    },
    {
      group: 'Passengers', items: [
        { key: 'passengers', icon: '👥', label: 'Passengers', badge: counts.paxCount },
      ]
    },
    {
      group: 'Support', items: [
        { key: 'complaints', icon: '🚨', label: 'Complaints', badge: counts.compCount },
        { key: 'refunds', icon: '💸', label: 'Refunds' },
      ]
    },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {sidebarItems.map(group => (
          <div key={group.group}>
            <div className="sidebar-label">{group.group}</div>
            {group.items.map(item => (
              <button key={item.key} className={`sidebar-item${section === item.key ? ' active' : ''}`} onClick={() => setSection(item.key)}>
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main className="admin-main">
        {section === 'dashboard' && <Dashboard chartPeriod={chartPeriod} setChartPeriod={setChartPeriod} />}
        {section === 'revenue' && <Revenue />}
        {section === 'bookings' && <AllBookings showToast={showToast} />}
        {section === 'routes' && <Routes />}
        {section === 'passengers' && <Passengers />}
        {section === 'complaints' && <Complaints showToast={showToast} />}
        {section === 'refunds' && <Refunds showToast={showToast} />}
      </main>
    </div>
  );
}
