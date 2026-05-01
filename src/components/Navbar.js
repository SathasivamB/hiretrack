import React, { useState, useEffect } from 'react';
import { Briefcase, Zap, Shield, Target, Activity, LogOut, Trophy, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, exp, level, expProgress }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div 
          className="nav-brand" 
          onClick={() => setActiveTab('dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <div className="brand-info">
            <span className="brand-text">HireTrack</span>
            <span className="brand-subtitle">Placement Portal</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={18} /> Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy size={18} /> Leaderboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            <Shield size={18} /> Vault
          </button>
          <button 
            className={`nav-btn ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictor')}
          >
            <Target size={18} /> Predictor
          </button>
          <button 
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile
          </button>
        </nav>

        <div className="nav-actions">
          <div className="user-stats-pill">
            <div className="level-badge">Lv. {level}</div>
            <div className="exp-info">
              <span className="exp-text">{exp} XP</span>
              <div className="exp-bar-bg">
                <div className="exp-bar-fill" style={{ width: `${expProgress}%` }}></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="logout-btn"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
