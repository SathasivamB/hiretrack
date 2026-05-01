import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PracticeArena from './components/PracticeArena';
import CompanyVault from './components/CompanyVault';
import Dashboard from './components/Dashboard';
import PredictorForm from './components/PredictorForm';
import QuestionManager from './components/QuestionManager';

import Auth from './components/Auth';
import AdminAuth from './components/AdminAuth';
import UserProfile from './components/UserProfile';
import Leaderboard from './components/Leaderboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'User', initials: 'U' };
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalRank, setGlobalRank] = useState(0);
  const [companies, setCompanies] = useState([
    { id: 'StartupInc', name: 'StartupInc', type: 'Basic', cost: 0, logo: 'S', color: '#3b82f6' }
  ]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [exp, setExp] = useState(0);
  const [unlockedCompanies, setUnlockedCompanies] = useState(['StartupInc']);
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    accuracy: 0,
    streak: 0,
    history: []
  });

  const level = Math.floor(exp / 500) + 1;
  const expForNextLevel = level * 500;
  const expProgress = (exp % 500) / 500 * 100;

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch latest user data to ensure synchronization
      fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email })
      })
      .then(res => res.json())
      .then(latestProfile => {
        // MERGE: Keep local data if server is missing fields
        const mergedProfile = {
          ...userProfile,
          ...latestProfile,
          studentId: latestProfile.studentId || userProfile.studentId,
          department: latestProfile.department || userProfile.department,
          initials: latestProfile.initials || userProfile.initials
        };
        
        // AUTO-GENERATE INITIALS: First Letter and Last Letter of name
        const cleanName = mergedProfile.name.trim();
        mergedProfile.initials = (cleanName.charAt(0) + cleanName.charAt(cleanName.length - 1)).toUpperCase();
        
        setUserProfile(mergedProfile);
        localStorage.setItem('userProfile', JSON.stringify(mergedProfile));
        
        setExp(mergedProfile.exp || 0);
        setUnlockedCompanies(mergedProfile.unlockedCompanies || ['StartupInc']);
        setStats({
          questionsAnswered: mergedProfile.questionsAnswered || 0,
          accuracy: mergedProfile.accuracy || 0,
          streak: mergedProfile.streak || 0,
          history: mergedProfile.history || []
        });

        // Calculate Global Rank
        fetch('/api/users')
          .then(res => res.json())
          .then(users => {
            const sorted = users.sort((a, b) => (b.exp || 0) - (a.exp || 0));
            const rank = sorted.findIndex(u => (u.email || u.id) === (mergedProfile.email || mergedProfile.id)) + 1;
            setGlobalRank(rank);
          });
      });

      // Fetch Companies
      fetch('/api/companies')
        .then(res => res.json())
        .then(data => setCompanies(data));
      
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userProfile');
    }
  }, [isLoggedIn]); // Only run on login state change

  useEffect(() => {
    if (isAdminLoggedIn) {
      localStorage.setItem('isAdminLoggedIn', 'true');
    } else {
      localStorage.removeItem('isAdminLoggedIn');
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab === 'vault' || activeTab === 'practice') {
      fetch('/api/companies')
        .then(res => res.json())
        .then(data => setCompanies(data))
        .catch(err => console.error('Error fetching companies:', err));
    }
  }, [activeTab]);

  if (window.location.pathname === '/admin') {
    if (!isAdminLoggedIn) {
      return <AdminAuth setIsAdminLoggedIn={setIsAdminLoggedIn} />;
    }
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 0' }}>
        <QuestionManager />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Auth setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />;
  }

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        exp={exp} 
        level={level} 
        expProgress={expProgress} 
      />
      
      <main className="main-content" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '90px' }}>
        {activeTab === 'practice' && (
          <PracticeArena 
            exp={exp} 
            setExp={setExp} 
            stats={stats} 
            setStats={setStats} 
            setActiveTab={setActiveTab}
            activeCompany={activeCompany}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'vault' && (
          <CompanyVault 
            exp={exp} 
            setExp={setExp} 
            unlockedCompanies={unlockedCompanies} 
            setUnlockedCompanies={setUnlockedCompanies} 
            setActiveTab={setActiveTab}
            setActiveCompany={setActiveCompany}
            companies={companies}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            exp={exp} 
            level={level}
            stats={stats}
            unlockedCompanies={unlockedCompanies}
            setActiveTab={setActiveTab}
            userProfile={userProfile}
            globalRank={globalRank}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard userProfile={userProfile} />
        )}

        {activeTab === 'profile' && (
          <UserProfile 
            userProfile={userProfile} 
            exp={exp} 
            level={level} 
            setUserProfile={setUserProfile}
            globalRank={globalRank}
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorForm />
        )}
      </main>

      <footer style={{ padding: '40px 0', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HireTrack Aptitude Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
