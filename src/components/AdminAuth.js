import React, { useState } from 'react';
import { LogIn, ShieldAlert } from 'lucide-react';
import './Auth.css';

const AdminAuth = ({ setIsAdminLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@hiretrack.com' && password === 'admin123') {
      setTimeout(() => {
        setIsAdminLoggedIn(true);
      }, 500);
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-up">
        <div className="auth-header">
          <ShieldAlert size={40} className="brand-icon" style={{ color: '#ef4444' }} />
          <h2>Admin Portal</h2>
          <p>Secure login for platform administrators.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem', border: '1px solid #f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              placeholder="admin@hiretrack.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Master Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-brand w-full auth-btn" style={{ background: '#ef4444', borderColor: '#ef4444' }}>
            <LogIn size={18} /> Admin Login
          </button>
        </form>
        
        <div className="auth-footer" style={{ marginTop: '30px' }}>
          <a href="/" className="btn-text" style={{ textDecoration: 'none' }}>
            &larr; Return to Main App
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
