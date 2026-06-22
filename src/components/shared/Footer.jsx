import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content container">
        {/* Column 1: Brand & Badges */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">🚌</span>
            NAEEM<span>MOVERS</span>
          </Link>
          <p className="footer-desc">
            Pakistan's most trusted bus ticket booking network. Safe, reliable, and convenient travel across the country.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🛡️ Secure Payments</span>
            <span className="footer-badge">⚡ Instant Booking</span>
            <span className="footer-badge">🔄 Easy Refunds</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links-group">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">🏠 Home</Link></li>
            <li><Link to="/mybookings">🎫 My Bookings</Link></li>
            <li><Link to="/support">💬 Help &amp; Support</Link></li>
            <li><Link to="/login">🔐 Login</Link></li>
            <li><Link to="/register">🚀 Register</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📞</span>
            <div>
              <p className="contact-main-text">111-NAEEM-MOVERS</p>
              <p className="contact-sub-text">Mon–Sat, 8 AM – 10 PM</p>
            </div>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">✉️</span>
            <div>
              <a href="mailto:support@pakride.pk" className="contact-link">support@naeemmovers.pk</a>
            </div>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📍</span>
            <div>
              <p className="contact-main-text">Lahore, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p className="footer-desc">
            Subscribe to receive updates, travel tips, and special discounts.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email Address" className="newsletter-input" required />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">&copy; {year} NAEEM MOVERS. All rights reserved.</p>
          
          <div className="footer-socials">
            <a href="https://l.instagram.com/?u=https%3A%2F%2Fwww.facebook.com%2Fnaeemmover%3Fmibextid%3DZbWKwL%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio&e=AUBACP9hwSrzdgEuAEqIFYUwLARSg5pjCre4ZWDoBoYf03gFBuSz9ycPKecjhc3lTqsAkKuEpuFeQs5z2ifEQXDLMl60Sf9szAeZfwLAajoCtnaOJX_jQlSBWeVWz9BZBjzQGHU" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="https://www.instagram.com/naeem_movers/" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>

          <div className="footer-bottom-links">
            <Link to="/support">Privacy Policy</Link>
            <Link to="/support">Terms of Service</Link>
            <Link to="/support">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
