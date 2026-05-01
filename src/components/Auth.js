import React, { useState } from 'react';
import { UserPlus, LogIn, Briefcase } from 'lucide-react';
import './Auth.css';

const Auth = ({ setIsLoggedIn, setUserProfile }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('B.Sc CS');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Domain validation
    if (!email.toLowerCase().endsWith('@skasc.ac.in')) {
      alert('Access Denied: Only @skasc.ac.in email addresses are permitted.');
      return;
    }

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin ? { email } : { name, email, studentId, department };

    fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }
        return data;
      })
      .then(userData => {
        // CRITICAL: Ensure all fields are captured in the state
        let finalStudentId = userData.studentId || studentId;
        if (!finalStudentId || finalStudentId === 'HT-2026') {
          const emailPrefix = userData.email.split('@')[0];
          const match = emailPrefix.match(/\d+[a-zA-Z]+\d+/);
          finalStudentId = match ? match[0].toUpperCase() : emailPrefix.substring(emailPrefix.length - 8).toUpperCase();
        }

        const finalDept = userData.department || department || 'B.Sc Computer Technology';

        // AUTO-GENERATE INITIALS: First Letter and Last Letter of name
        const cleanName = userData.name.trim();
        const initials = (cleanName.charAt(0) + cleanName.charAt(cleanName.length - 1)).toUpperCase();

        const completeProfile = {
          ...userData,
          initials,
          studentId: finalStudentId,
          department: finalDept
        };

        setUserProfile(completeProfile);
        localStorage.setItem('userProfile', JSON.stringify(completeProfile));
        setIsLoggedIn(true);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-up">
        <div className="auth-header">
          <Briefcase className="brand-icon" style={{ color: "white" }} />
          <h2>HireTrack</h2>
          <p style={{ fontWeight: 'bold', color: 'var(--brand-blue)', fontSize: '0.9rem', marginTop: '-10px', marginBottom: '20px' }}>College Placement Portal</p>
          <p>{isLogin ? 'Welcome back, student! Login to continue.' : 'Register for your college placement journey.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Roll No.</label>
                  <input type="text" placeholder="e.g. 21BCS001" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
            </>
          )}
          <div className="form-group">
            <label>College Email Address</label>
            <input type="email" placeholder="yourname@skasc.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn-brand w-full auth-btn">
            {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Register</>}
          </button>
        </form>

        <div className="auth-footer">
          <button className="btn-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
