import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import './PracticeArena.css';
import './PracticeArenaExtras.css';

const PracticeArena = ({ exp, setExp, stats, setStats, setActiveTab, activeCompany, userProfile }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testStatus, setTestStatus] = useState('intro'); // intro, running, finished
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/questions')
      .then(res => res.json())
      .then(allQuestions => {
        const filtered = allQuestions.filter(q => q.company === activeCompany);
        // Shuffle and pick top 20 to ensure variety and no repeats
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        const finalQuestions = shuffled.slice(0, 20);
        
        setQuestions(finalQuestions);
        setTimeLeft(finalQuestions.length * 60); // 1 minute per question
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, [activeCompany]);

  useEffect(() => {
    let timer;
    if (testStatus === 'running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStatus === 'running') {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [testStatus, timeLeft]);

  const handleStart = () => {
    setTestStatus('running');
  };

  const handleSelectAnswer = (idx) => {
    setAnswers({ ...answers, [currentQ]: idx });
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  };

  const finishTest = () => {
    setTestStatus('finished');
    
    // Evaluate
    let earnedExp = 0;
    let correctCount = 0;
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        earnedExp += q.expReward;
        correctCount += 1;
      }
    });

    setExp(prev => prev + earnedExp);
    
    const newAccuracy = Math.round((correctCount / questions.length) * 100);
    
    const newHistoryEntry = {
      id: Date.now(),
      company: activeCompany || 'General',
      score: `${correctCount}/${questions.length}`,
      accuracy: newAccuracy,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };

    const updatedStats = {
      questionsAnswered: stats.questionsAnswered + questions.length,
      streak: correctCount === questions.length ? stats.streak + 1 : 0,
      accuracy: Math.round((stats.accuracy + newAccuracy) / 2),
      history: [...(userProfile.history || []), newHistoryEntry]
    };

    setStats(prev => ({
      ...prev,
      ...updatedStats
    }));

    // Persist to backend
    if (userProfile && userProfile.email) {
       fetch(`/api/users/${encodeURIComponent(userProfile.email)}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           exp: exp + earnedExp,
           ...updatedStats
         })
       }).catch(err => console.error('Error syncing stats:', err));
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h3>Loading {activeCompany} Assessment...</h3></div>;
  }

  if (testStatus === 'intro') {
    return (
      <div className="container">
        <div className="arena-header fade-up">
          <h2 className="section-title">{activeCompany ? `${activeCompany} Assessment` : 'General Practice'}</h2>
          <p className="section-subtitle">You are about to start a timed pre-placement test.</p>
        </div>
        <div className="question-card fade-up delay-100" style={{ textAlign: 'center', padding: '40px' }}>
          <AlertCircle size={48} color="var(--brand-blue)" style={{ margin: '0 auto 20px' }} />
          <h3>Instructions</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            This test contains {questions.length} questions. You will have {questions.length} minutes to complete it.
            You can navigate between questions and change your answers before submitting.
          </p>
          <button className="btn btn-brand btn-large" onClick={handleStart}>Start Assessment</button>
        </div>
      </div>
    );
  }

  if (testStatus === 'finished') {
    let correctCount = 0;
    let earnedExp = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
        earnedExp += q.expReward;
      }
    });

    return (
      <div className="container">
        <div className="arena-header fade-up">
          <h2 className="section-title">Assessment Complete</h2>
        </div>
        <div className="question-card fade-up delay-100" style={{ textAlign: 'center', padding: '40px' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Score: {correctCount}/{questions.length}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.2rem' }}>
            You earned <strong style={{ color: '#f59e0b' }}>+{earnedExp} EXP</strong>
          </p>
          <button className="btn btn-brand" onClick={() => setActiveTab('dashboard')}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ] || { text: 'Loading...', options: [], type: '', expReward: 0 };

  return (
    <div className="container">
      <div className="arena-header fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>{activeCompany || 'Practice'} Test</h2>
          <p className="section-subtitle" style={{ margin: 0 }}>Question {currentQ + 1} of {questions.length}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="timer-badge">
            <Clock size={18} />
            <span className={timeLeft < 60 ? 'text-danger' : ''}>{formatTime(timeLeft)}</span>
          </div>
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px 16px', fontSize: '0.875rem' }} 
            onClick={() => { if(window.confirm('Quit assessment? Progress will be lost.')) setActiveTab('dashboard'); }}
          >
            Exit Test
          </button>
        </div>
      </div>

      <div className="arena-layout fade-up delay-100">
        <div className="question-card">
          <div className="question-header">
            <span className="q-type">{q.type}</span>
            <span className="q-reward"><Zap size={14}/> +{q.expReward} EXP</span>
          </div>
          
          <h3 className="question-text">{q.text}</h3>

          <div className="options-grid">
            {q.options.map((opt, idx) => {
              const isSelected = answers[currentQ] === idx;
              return (
                <button 
                  key={idx}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(idx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button className="btn btn-outline" onClick={prevQuestion} disabled={currentQ === 0}>Previous</button>
            {currentQ === questions.length - 1 ? (
              <button className="btn btn-brand" onClick={finishTest}>Submit Test</button>
            ) : (
              <button className="btn btn-primary" onClick={nextQuestion}>Next Question</button>
            )}
          </div>
        </div>

        <div className="arena-sidebar">
          <div className="sidebar-card">
            <h4>Question Palette</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '15px' }}>
              {questions.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentQ(idx)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: answers[idx] !== undefined ? 'var(--brand-blue)' : (currentQ === idx ? '#e2e8f0' : 'white'),
                    color: answers[idx] !== undefined ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeArena;
