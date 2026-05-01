import React, { useState, useEffect } from 'react';
import { PlusCircle, Database, Check, Users, Shield, Target, Award, Trash, Trash2, AlertTriangle, BarChart3, TrendingUp, Search, Edit } from 'lucide-react';

const CompanyLogo = ({ company, size = '40px', fontSize = '1.2rem' }) => {
  const [error, setError] = useState(false);
  if (error || !company.logo || company.logo.length < 5) {
    return (
      <div style={{ width: size, height: size, background: company.color || 'var(--brand-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize }}>
        {company.name[0]}
      </div>
    );
  }
  return (
    <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setError(true)} />
  );
};

const QuestionManager = () => {
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState('requests'); // requests, questions, users, analytics, vault, logs
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWipeModal, setShowWipeModal] = useState(false);
  
  const [formData, setFormData] = useState({
    company: 'StartupInc',
    type: 'Logic',
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct: 0,
    expReward: 50
  });

  const [companyForm, setCompanyForm] = useState({ id: '', name: '', type: 'Basic', cost: 0, logo: '', color: '#3b82f6' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));

    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error('Error fetching questions:', err));

    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Error fetching logs:', err));

    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error('Error fetching companies:', err));

    fetch('/api/requests')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Error fetching requests:', err));
  };

  const fetchQuestions = () => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error('Error fetching questions:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      company: formData.company,
      type: formData.type,
      text: formData.text,
      options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
      correct: formData.correct,
      expReward: formData.expReward
    };

    const url = editingQuestion 
      ? `/api/questions/${editingQuestion.id}`
      : '/api/questions';
    
    const method = editingQuestion ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData)
    })
    .then(res => res.json())
    .then(() => {
      setNotification(editingQuestion ? 'Question updated successfully!' : 'Question added successfully!');
      setFormData({
        company: 'StartupInc',
        type: 'Logic',
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct: 0,
        expReward: 50
      });
      setEditingQuestion(null);
      fetchData();
      setTimeout(() => setNotification(null), 3000);
    })
    .catch(err => console.error('Error saving question:', err));
  };

  const handleEditQuestion = (q) => {
    setEditingQuestion(q);
    setFormData({
      company: q.company,
      type: q.type,
      text: q.text,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correct: q.correct,
      expReward: q.expReward
    });
    setActiveAdminTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Delete this question permanently?')) {
      fetch(`/api/questions/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchData();
          setNotification('Question deleted');
          setTimeout(() => setNotification(null), 3000);
        });
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        fetchData();
        setNotification('User deleted successfully');
        setTimeout(() => setNotification(null), 3000);
      })
      .catch(err => console.error('Error deleting user:', err));
    }
  };



  const handleWipeData = () => {
    fetch('/api/admin/wipe', {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      setShowWipeModal(false);
      window.location.reload();
    })
    .catch(err => console.error('Error wiping data:', err));
  };

  const renderAnalytics = () => {
    const totalUsers = users.length;
    const avgExp = users.reduce((acc, u) => acc + (u.exp || 0), 0) / (totalUsers || 1);
    const avgAccuracy = users.reduce((acc, u) => acc + (u.accuracy || 0), 0) / (totalUsers || 1);
    const totalAnswered = users.reduce((acc, u) => acc + (u.questionsAnswered || 0), 0);
    
    return (
      <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="dash-card" style={{ textAlign: 'center', borderTop: '4px solid var(--brand-blue)' }}>
          <TrendingUp size={24} color="var(--brand-blue)" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Avg. EXP</h4>
          <h2 style={{ fontSize: '2rem', margin: '5px 0' }}>{Math.round(avgExp)}</h2>
        </div>
        <div className="dash-card" style={{ textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <Target size={24} color="#10b981" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Global Accuracy</h4>
          <h2 style={{ fontSize: '2rem', margin: '5px 0' }}>{Math.round(avgAccuracy)}%</h2>
        </div>
        <div className="dash-card" style={{ textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
          <Database size={24} color="#f59e0b" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Questions Bank</h4>
          <h2 style={{ fontSize: '2rem', margin: '5px 0' }}>{questions.length}</h2>
        </div>
        <div className="dash-card" style={{ textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
          <Users size={24} color="#8b5cf6" style={{ marginBottom: '10px' }} />
          <h4 style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Total Attempts</h4>
          <h2 style={{ fontSize: '2rem', margin: '5px 0' }}>{totalAnswered}</h2>
        </div>
        
        <div className="dash-card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="var(--brand-blue)" /> Leaderboard Analysis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.sort((a,b) => b.exp - a.exp).slice(0, 5).map((u, idx) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: idx === 0 ? '#fef3c7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: idx === 0 ? '#d97706' : '#64748b' }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{u.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--brand-blue)' }}>{u.exp} EXP</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{u.accuracy}% Acc.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRequests = () => (
    <div className="fade-up dash-card">
      <h3 style={{ marginBottom: '24px' }}>Profile Edit Access Requests</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {requests.filter(r => r.status === 'pending').map(req => (
          <div key={req.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{req.userName}</h4>
              <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b' }}>Requesting permission to update profile • {req.timestamp}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleProcessRequest(req.id, 'approved')} className="btn btn-brand" style={{ padding: '8px 20px', background: '#10b981' }}>Grant Access</button>
              <button onClick={() => handleProcessRequest(req.id, 'rejected')} className="btn btn-outline" style={{ padding: '8px 20px', color: '#ef4444', borderColor: '#ef4444' }}>Deny</button>
            </div>
          </div>
        ))}
        {requests.filter(r => r.status === 'pending').length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No pending access requests.
          </div>
        )}
      </div>
    </div>
  );

  const handleProcessRequest = (id, status) => {
    fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(() => {
      setNotification(`Request ${status} successfully!`);
      fetchData();
      setTimeout(() => setNotification(null), 3000);
    })
    .catch(err => console.error('Error processing request:', err));
  };

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {showWipeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="fade-up" style={{ background: 'white', maxWidth: '500px', width: '100%', borderRadius: '24px', padding: '40px', textAlign: 'center', border: '2px solid #ef4444' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pulse-red 1.5s infinite' }}><AlertTriangle size={40} color="#ef4444" /></div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '16px' }}>🚨 DANGER ALARM! 🚨</h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Permanently wipe all users? This will reset all EXP to 0.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setShowWipeModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleWipeData} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer' }}>WIPE EVERYTHING</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header-clean fade-up">
        <h2 className="section-title">Placement Cell Dashboard</h2>
        <p className="section-subtitle">Official portal for managing aptitude assessments and tracking student placement readiness.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        <button onClick={() => setActiveAdminTab('requests')} className={`btn ${activeAdminTab === 'requests' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>
          Profile Requests {requests.filter(r => r.status === 'pending').length > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', marginLeft: '6px' }}>{requests.filter(r => r.status === 'pending').length}</span>}
        </button>
        <button onClick={() => setActiveAdminTab('questions')} className={`btn ${activeAdminTab === 'questions' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>Question Bank</button>
        <button onClick={() => setActiveAdminTab('users')} className={`btn ${activeAdminTab === 'users' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>Student Database</button>
        <button onClick={() => setActiveAdminTab('vault')} className={`btn ${activeAdminTab === 'vault' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>Vault Management</button>
        <button onClick={() => setActiveAdminTab('analytics')} className={`btn ${activeAdminTab === 'analytics' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>Reports</button>
        <button onClick={() => setActiveAdminTab('logs')} className={`btn ${activeAdminTab === 'logs' ? 'btn-brand' : 'btn-outline'}`} style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>System Logs</button>
      </div>

      {notification && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }} className="fade-up">
          <Check size={20} /> {notification}
        </div>
      )}

      {activeAdminTab === 'requests' && renderRequests()}

      {activeAdminTab === 'questions' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="dash-card" style={{ border: editingQuestion ? '2px solid var(--brand-blue)' : 'none' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={20} color="var(--brand-blue)" /> {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Company</label>
                  <select value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    {['Logic', 'Quant', 'Verbal', 'DSA', 'System Design', 'Technical'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <textarea required rows="2" placeholder="Question content..." value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)', outline: 'none' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['optionA', 'optionB', 'optionC', 'optionD'].map((opt, i) => (
                  <input key={opt} required placeholder={`Option ${String.fromCharCode(65+i)}`} value={formData[opt]} onChange={(e) => setFormData({...formData, [opt]: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Correct Answer</label><select value={formData.correct} onChange={(e) => setFormData({...formData, correct: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)' }}><option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option></select></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: '0.875rem', fontWeight: 600 }}>EXP Reward</label><input type="number" value={formData.expReward} onChange={(e) => setFormData({...formData, expReward: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-brand" style={{ flex: 2 }}>{editingQuestion ? 'Update Question' : 'Add to Bank'}</button>
                {editingQuestion && <button type="button" onClick={() => { setEditingQuestion(null); setFormData({ company: 'StartupInc', type: 'Logic', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 0, expReward: 50 }); }} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Question Inventory ({questions.length})</h3>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="text" placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.875rem' }} />
              </div>
            </div>
            <div style={{ maxHeight: '600px', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '16px' }}>Company</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Question</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.slice().reverse().map(q => (
                    <tr key={q.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px' }}><span style={{ fontWeight: 'bold', color: 'var(--brand-blue)' }}>{q.company}</span></td>
                      <td style={{ padding: '16px' }}><span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '4px 8px', borderRadius: '6px' }}>{q.type}</span></td>
                      <td style={{ padding: '16px', maxWidth: '400px' }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</div></td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleEditQuestion(q)} style={{ background: '#f1f5f9', color: 'var(--brand-blue)', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                          <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'users' && (
        <div className="fade-up dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Registered Students</h3>
            <button onClick={() => setShowWipeModal(true)} className="btn" style={{ background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Trash2 size={16} /> Wipe All Data</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '12px' }}>STUDENT</th>
                  <th style={{ padding: '12px' }}>ROLL NO / DEPT</th>
                  <th style={{ padding: '12px' }}>EXP POINTS</th>
                  <th style={{ padding: '12px' }}>LEVEL</th>
                  <th style={{ padding: '12px' }}>ACCURACY</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '16px' }}><div><strong>{u.name}</strong><br/><small style={{ color: 'var(--text-tertiary)' }}>{u.email}</small></div></td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{u.studentId || 'N/A'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-blue)' }}>{u.department || 'CSE'}</div>
                    </td>
                    <td style={{ padding: '16px' }}><strong style={{ color: 'var(--brand-blue)' }}>{u.exp}</strong></td>
                    <td style={{ padding: '16px' }}><span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>Lvl {u.level || 1}</span></td>
                    <td style={{ padding: '16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>{u.accuracy}%</span><div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: `${u.accuracy}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div></div></div></td>
                    <td style={{ padding: '16px', textAlign: 'center' }}><button onClick={() => handleDeleteUser(u.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Trash size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'analytics' && renderAnalytics()}
      {activeAdminTab === 'logs' && (
        <div className="fade-up">
          <div className="dash-card">
             <h3 style={{ marginBottom: '20px' }}>System Activity Logs</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <span style={{ color: '#94a3b8', width: '160px' }}>{log.timestamp}</span>
                    <strong style={{ width: '150px', color: 'var(--brand-blue)' }}>{log.action}</strong>
                    <span style={{ color: '#475569' }}>{log.details}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'vault' && (
        <div className="fade-up">
           <div className="dash-card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px' }}>{editingCompany ? 'Edit Company' : 'Add New Company to Vault'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                 <input className="input-field" placeholder="Company Name (e.g. Google)" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value, id: e.target.value.replace(/\s+/g, '')})} />
                 <input className="input-field" placeholder="Logo Initial (e.g. G)" value={companyForm.logo} onChange={e => setCompanyForm({...companyForm, logo: e.target.value})} />
                 <select className="input-field" value={companyForm.type} onChange={e => setCompanyForm({...companyForm, type: e.target.value})}>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="FAANG">FAANG</option>
                    <option value="Unicorn">Unicorn</option>
                 </select>
                 <input className="input-field" type="number" placeholder="EXP Cost to Unlock" value={companyForm.cost} onChange={e => setCompanyForm({...companyForm, cost: parseInt(e.target.value)})} />
                 <input className="input-field" type="color" value={companyForm.color} onChange={e => setCompanyForm({...companyForm, color: e.target.value})} style={{ height: '45px' }} />
                 <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-brand" style={{ flex: 1 }} onClick={() => {
                      const method = editingCompany ? 'PUT' : 'POST';
                      const url = editingCompany ? `/api/companies/${editingCompany.id}` : '/api/companies';
                      
                      fetch(url, {
                        method: method,
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(companyForm)
                      }).then(() => {
                        fetchData();
                        setNotification(editingCompany ? 'Company updated!' : 'Company added!');
                        setCompanyForm({ id: '', name: '', type: 'Basic', cost: 0, logo: '', color: '#3b82f6' });
                        setEditingCompany(null);
                        setTimeout(() => setNotification(null), 3000);
                      })
                    }}>{editingCompany ? 'Update' : 'Add Company'}</button>
                    {editingCompany && <button className="btn btn-outline" onClick={() => { setEditingCompany(null); setCompanyForm({ id: '', name: '', type: 'Basic', cost: 0, logo: '', color: '#3b82f6' }); }}>Cancel</button>}
                 </div>
              </div>
           </div>

           <div className="dash-card">
              <h3 style={{ marginBottom: '20px' }}>Active Vault Companies</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                 {companies.map(c => (
                   <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CompanyLogo company={c} size="40px" fontSize="1.2rem" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{c.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.cost} EXP • {c.type}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <button onClick={() => { setEditingCompany(c); setCompanyForm(c); }} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}><Edit size={14}/></button>
                         <button onClick={() => {
                           if(window.confirm(`Delete ${c.name}?`)) {
                             fetch(`/api/companies/${encodeURIComponent(c.id)}`, { method: 'DELETE' })
                             .then(res => {
                               if (res.ok) {
                                 setNotification('Company removed successfully');
                                 fetchData();
                                 setTimeout(() => {
                                   setNotification(null);
                                 }, 1000);
                               } else {
                                 alert('Error: Could not find company on server.');
                               }
                             });
                           }
                         }} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}><Trash size={14}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
