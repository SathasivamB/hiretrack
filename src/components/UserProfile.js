import React, { useState } from 'react';
import { Mail, Calendar, Shield, Award, Edit2 } from 'lucide-react';

const UserProfile = ({ userProfile, exp, level, setUserProfile, globalRank }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userProfile.name);
  const [newInitials, setNewInitials] = useState(userProfile.initials);
  const [newStudentId, setNewStudentId] = useState(userProfile.studentId || '');
  const [newDept, setNewDept] = useState(userProfile.department || 'B.Sc CS');

  const handleRequestAccess = () => {
    fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userProfile.email,
        userName: userProfile.name
      })
    })
    .then(res => res.json())
    .then(() => {
      alert('Access request sent. Please wait for Admin approval.');
      setUserProfile({ ...userProfile, editPermission: 'pending' });
    })
    .catch(err => console.error('Error requesting access:', err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = { 
      ...userProfile, 
      name: newName, 
      studentId: newStudentId, 
      department: newDept 
    };
    
    fetch(`/api/users/${encodeURIComponent(userProfile.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .then(res => res.json())
    .then(data => {
      // FORCE REVOKE IN STATE: Ensure permission is 'none' locally immediately
      const lockedProfile = { ...data, editPermission: 'none' };
      setUserProfile(lockedProfile);
      setIsEditing(false);
      localStorage.setItem('userProfile', JSON.stringify(lockedProfile));
      alert('Profile updated! Access has been revoked for security. Request again for further changes.');
    })
    .catch(err => console.error('Error updating profile:', err));
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="dash-card fade-up" style={{ padding: '40px' }}>
        {isEditing ? (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <h3>Edit Professional Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Display Name</label>
                <input type="text" className="input-field" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Roll No.</label>
                <input type="text" className="input-field" value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Department</label>
                <select className="input-field" value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                    <optgroup label="Computer Science & IT">
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                      <option value="BCA">BCA</option>
                      <option value="B.Sc IT">B.Sc IT</option>
                      <option value="B.Sc CT">B.Sc Computer Technology</option>
                      <option value="B.Sc AI&DS">B.Sc AI & Data Science</option>
                    </optgroup>
                    <optgroup label="Commerce & Management">
                      <option value="B.Com">B.Com (General)</option>
                      <option value="B.Com CA">B.Com (CA)</option>
                      <option value="B.Com PA">B.Com (PA)</option>
                      <option value="B.Com IT">B.Com (IT)</option>
                      <option value="BBA">BBA</option>
                      <option value="BBA CA">BBA (CA)</option>
                    </optgroup>
                    <optgroup label="Life Sciences & Others">
                      <option value="B.Sc Biotech">B.Sc Biotechnology</option>
                      <option value="B.Sc Microbiology">B.Sc Microbiology</option>
                      <option value="B.Sc Maths">B.Sc Mathematics</option>
                      <option value="B.Sc Physics">B.Sc Physics</option>
                      <option value="B.Sc Costume">B.Sc Costume Design</option>
                      <option value="BA English">BA English</option>
                    </optgroup>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-brand">Save Profile</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '30px', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '3rem', fontWeight: 'bold'
            }}>
              {userProfile.initials || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>{userProfile.name}</h2>
              <div style={{ display: 'flex', gap: '20px', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16}/> {userProfile.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16}/> Joined May 2026</div>
              </div>
            </div>

            {userProfile.editPermission === 'none' && (
              <button className="btn btn-brand" style={{ borderRadius: '12px' }} onClick={handleRequestAccess}>
                Request Edit Access
              </button>
            )}
            {userProfile.editPermission === 'pending' && (
              <button className="btn btn-outline" style={{ borderRadius: '12px', opacity: 0.7, cursor: 'not-allowed' }} disabled>
                Waiting for Admin...
              </button>
            )}
            {userProfile.editPermission === 'granted' && (
              <button className="btn btn-brand" style={{ borderRadius: '12px', background: '#10b981' }} onClick={() => setIsEditing(true)}>
                <Edit2 size={16} style={{ marginRight: '8px' }} /> Edit Profile
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginTop: '40px' }}>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} color="#3b82f6"/> Account Security</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Account Status</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>Verified student</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Login Method</span>
                <span style={{ fontWeight: '600' }}>Institutional SSO</span>
              </div>
            </div>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#f59e0b"/> Rankings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>College Rank</span>
                <span style={{ fontWeight: '900', color: '#3b82f6', fontSize: '1.1rem' }}>#{globalRank || '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Current Level</span>
                <span style={{ fontWeight: '700' }}>Lvl {level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
