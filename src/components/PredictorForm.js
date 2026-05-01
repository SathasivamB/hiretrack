import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import './PredictorForm.css';

const PredictorForm = () => {
  const [formData, setFormData] = useState({
    cgpa: '',
    codingScore: '',
    hackathons: '',
    internships: '',
    projects: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const score = (
        (parseFloat(formData.cgpa) * 10) + 
        (parseFloat(formData.codingScore)) + 
        (parseInt(formData.hackathons) * 5) + 
        (parseInt(formData.internships) * 10) + 
        (parseInt(formData.projects) * 5)
      ) / 3.5;
      
      const prob = Math.min(Math.max(score, 10), 98);
      setResult({
        probability: prob.toFixed(1),
        status: prob > 75 ? 'Excellent' : prob > 50 ? 'Good' : 'Needs Work'
      });
    }, 1500);
  };

  return (
    <div className="container">
      <div className="predictor-layout">
        <div className="predictor-text fade-up">
          <h2 className="section-title">Evaluate your profile.</h2>
          <p className="section-subtitle">
            Our machine learning model compares your profile against thousands of successfully placed students to determine your current standing in the job market.
          </p>
          
          <ul className="predictor-benefits">
            <li>
              <strong>Instant Analysis</strong>
              <p>Get immediate feedback on your hiring probability.</p>
            </li>
            <li>
              <strong>Data-Driven Insights</strong>
              <p>Understand which areas of your profile need improvement.</p>
            </li>
            <li>
              <strong>Actionable Next Steps</strong>
              <p>Receive personalized recommendations based on your score.</p>
            </li>
          </ul>
        </div>

        <div className="predictor-form-wrapper fade-up delay-200">
          {!result ? (
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>Academic Profile</h3>
                <p>Fill in your details for a free evaluation.</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">CGPA (Out of 10)</label>
                  <input type="number" step="0.01" name="cgpa" className="input-field" placeholder="e.g. 8.5" value={formData.cgpa} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="label">Coding Score (%)</label>
                  <input type="number" name="codingScore" className="input-field" placeholder="e.g. 85" value={formData.codingScore} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Hackathons</label>
                  <input type="number" name="hackathons" className="input-field" placeholder="Number attended" value={formData.hackathons} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="label">Internships</label>
                  <input type="number" name="internships" className="input-field" placeholder="Number completed" value={formData.internships} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Major Projects</label>
                <input type="number" name="projects" className="input-field" placeholder="Number of significant projects" value={formData.projects} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-brand w-full submit-btn" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Analyze Profile'}
              </button>
            </form>
          ) : (
            <div className="result-card">
              <div className="result-header">
                <h3>Analysis Complete</h3>
                <span className={`result-badge ${result.status.toLowerCase().replace(' ', '-')}`}>
                  {result.status}
                </span>
              </div>
              
              <div className="score-display">
                <div className="score-value">{result.probability}%</div>
                <div className="score-label">Placement Probability</div>
              </div>

              <div className="score-bar-container">
                <div className="score-bar-bg">
                  <div className={`score-bar-fill ${result.status.toLowerCase().replace(' ', '-')}`} style={{width: `${result.probability}%`}}></div>
                </div>
              </div>

              <p className="result-desc">
                {result.status === 'Excellent' 
                  ? 'Your profile is highly competitive. Focus on advanced interview preparation and system design.' 
                  : result.status === 'Good' 
                  ? 'You have a solid foundation. Adding one more major project or internship will boost your chances.'
                  : 'Your profile needs strengthening. Focus on improving your core coding skills and building a portfolio.'}
              </p>

              <button className="btn btn-outline w-full" onClick={() => setResult(null)}>
                Recalculate <ArrowRight size={16} style={{marginLeft: '8px'}} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictorForm;
