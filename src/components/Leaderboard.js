import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Search, User, Zap } from 'lucide-react';

const Leaderboard = ({ userProfile }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        // Sort by EXP descending
        const sorted = data.sort((a, b) => (b.exp || 0) - (a.exp || 0));
        setUsers(sorted);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="vault-header fade-up">
        <h2 className="section-title">Institutional Leaderboard</h2>
        <p className="section-subtitle">Real-time rankings of students across all departments based on total EXP.</p>
      </div>

      <div className="dash-card fade-up" style={{ padding: '24px', marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search by name or Roll No..." 
            className="input-field" 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="leaderboard-list fade-up delay-100">
        <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <th style={{ padding: '16px' }}>RANK</th>
                <th style={{ padding: '16px' }}>STUDENT</th>
                <th style={{ padding: '16px' }}>DEPARTMENT</th>
                <th style={{ padding: '16px' }}>TOTAL EXP</th>
                <th style={{ padding: '16px' }}>LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => {
                const isCurrentUser = (u.email || u.id) === (userProfile.email || userProfile.id);
                const rank = index + 1;
                
                return (
                  <tr key={u.email || u.id} style={{ 
                    borderBottom: '1px solid #f1f5f9',
                    background: isCurrentUser ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                  }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {rank === 1 && <Crown size={18} color="#f59e0b" fill="#f59e0b" />}
                        {rank === 2 && <Medal size={18} color="#94a3b8" fill="#94a3b8" />}
                        {rank === 3 && <Medal size={18} color="#b45309" fill="#b45309" />}
                        <span style={{ fontWeight: rank <= 3 ? '900' : '700', fontSize: rank <= 3 ? '1.1rem' : '0.9rem' }}>
                           #{rank}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.65rem', 
                          fontWeight: '900',
                          textAlign: 'center',
                          padding: '2px'
                        }}>
                          {u.initials || u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{u.name} {isCurrentUser && <span style={{ color: '#3b82f6', fontSize: '0.7rem' }}>(You)</span>}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                       <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>
                         {u.department || 'General'}
                       </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                       <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', color: '#1e293b' }}>
                         <Zap size={14} fill="#f59e0b" color="#f59e0b" /> {u.exp || 0}
                       </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <TrendingUp size={14} color="#10b981" />
                         <span style={{ fontWeight: '700' }}>Lvl {u.level || 1}</span>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No students found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
