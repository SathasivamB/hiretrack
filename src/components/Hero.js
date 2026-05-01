import React from 'react';
import { ArrowRight, Trophy, Zap, ShieldCheck } from 'lucide-react';
import './Hero.css';

const Hero = ({ setActiveTab }) => {
  return (
    <div className="container">
      <div className="hero-grid" style={{ paddingTop: '40px' }}>
        <div className="hero-content fade-up">
          <span className="badge">Gamified Aptitude Prep</span>
          <h1 className="hero-title">
            Level up your skills. <br/>Unlock top tier companies.
          </h1>
          <p className="hero-description">
            Prepare for aptitude tests through gamified micro-challenges. Earn EXP, level up your profile, and use your points to unlock actual assessment formats from companies like Google, Microsoft, and Amazon.
          </p>
          
          <div className="hero-actions">
            <button 
              onClick={() => setActiveTab('practice')} 
              className="btn btn-brand btn-large"
            >
              Start Earning EXP <ArrowRight size={18} style={{marginLeft: '8px'}} />
            </button>
            <button 
              onClick={() => setActiveTab('vault')} 
              className="btn btn-outline btn-large"
            >
              View Company Vault
            </button>
          </div>

          <div className="hero-features" style={{ marginTop: '40px' }}>
            <div className="feature-item">
              <Zap size={20} className="feature-icon" />
              <div>
                <strong>Earn EXP</strong>
                <p className="feature-desc">Solve daily logic & quant problems.</p>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} className="feature-icon" />
              <div>
                <strong>Unlock Vaults</strong>
                <p className="feature-desc">Access premium company specific tests.</p>
              </div>
            </div>
            <div className="feature-item">
              <Trophy size={20} className="feature-icon" />
              <div>
                <strong>Get Placed</strong>
                <p className="feature-desc">Track your readiness for Day 1.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual fade-up delay-200">
          <div className="hero-illustration">
            <div className="level-up-card">
              <div className="level-up-header">
                <Trophy size={24} color="#f59e0b" />
                <span>Level Up!</span>
              </div>
              <div className="level-text">You reached Level 5</div>
              <div className="reward-text">+500 EXP</div>
            </div>
            
            <div className="unlock-card delay-300">
              <div className="company-logo">G</div>
              <div className="unlock-info">
                <strong>Google Vault Unlocked</strong>
                <span>New aptitude set available</span>
              </div>
            </div>

            <div className="bg-shape-1"></div>
            <div className="bg-shape-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
