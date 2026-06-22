import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const current = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/mybookings', label: 'My Bookings', icon: '🎫', auth: true },
    { path: '/support', label: 'Support', icon: '💬', auth: true },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  const visibleItems = navItems.filter((item) => !item.auth || isAuthenticated);

  function handleLogout() {
    logout();
    setMobileOpen(false);
  }

  return (
    <>
      <nav className="top-nav">
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <div className="nav-logo-icon">🚌</div>
          NAEEM<span>MOVERS</span> 
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links nav-desktop">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link${current === item.path ? ' active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="nav-user-section">
              <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
              <button className="nav-logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className={`nav-link${current === '/login' ? ' active' : ''}`}>
                🔐 Login
              </Link>
              <Link to="/register" className="nav-register-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${mobileOpen ? 'open-1' : ''}`} />
          <span className={`hamburger-line ${mobileOpen ? 'open-2' : ''}`} />
          <span className={`hamburger-line ${mobileOpen ? 'open-3' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link${current === item.path ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}

          <div className="mobile-nav-divider" />

          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">
                <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                <span>{user?.name}</span>
              </div>
              <button className="mobile-nav-link logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                🔐 Login
              </Link>
              <Link to="/register" className="mobile-nav-link register" onClick={() => setMobileOpen(false)}>
                🚀 Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
