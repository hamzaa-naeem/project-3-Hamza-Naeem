import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', cnic: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = form;

    if (!name || !email || !password) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    const result = await register({ name, email, password, phone, cnic: form.cnic });
    setSubmitting(false);

    if (result.success) {
      showToast('Account created! Welcome to PakRide 🎉', 'success');
      navigate('/');
    } else {
      showToast(result.message || 'Registration failed', 'error');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">NAEEM<span>MOVERS</span></div>
          <h2>Create Account</h2>
          <p>Join us to book bus tickets online</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Full Name *</label>
              <input className="input-field" placeholder="Muhammad Ali" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="input-label">Email Address *</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Password *</label>
              <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="input-label">Confirm Password *</label>
              <input className="input-field" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Phone Number</label>
              <input className="input-field" placeholder="03XX-XXXXXXX" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="input-label">CNIC</label>
              <input className="input-field" placeholder="XXXXX-XXXXXXX-X" value={form.cnic} onChange={(e) => updateField('cnic', e.target.value)} />
            </div>
          </div>
          <button className="btn-primary auth-btn" type="submit" disabled={submitting}>
            {submitting ? '⏳ Creating Account...' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
