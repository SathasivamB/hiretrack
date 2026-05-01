const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize database
const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      logs: [],
      companies: [
        { id: 'StartupInc', name: 'Startup Inc', type: 'Basic', cost: 0, logo: 'S', color: '#10b981' },
        { id: 'FintechCore', name: 'Fintech Core', type: 'Intermediate', cost: 300, logo: 'F', color: '#3b82f6' }
      ],
      questions: [
        { id: '1', company: 'StartupInc', type: 'Logic', text: 'If 3 cats kill 3 rats in 3 minutes, how long will it take 100 cats to kill 100 rats?', options: ['100 minutes', '3 minutes', '33 minutes', '1 minute'], correct: 1, expReward: 50 }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  } else {
    // Migration: ensure logs and companies exist in existing DB
    const db = JSON.parse(fs.readFileSync(DB_FILE));
    let changed = false;
    if (!db.logs) { db.logs = []; changed = true; }
    if (!db.companies) { 
      db.companies = [
        { id: 'StartupInc', name: 'Startup Inc', type: 'Basic', cost: 0, logo: 'S', color: '#10b981' },
        { id: 'FintechCore', name: 'Fintech Core', type: 'Intermediate', cost: 300, logo: 'F', color: '#3b82f6' },
        { id: 'Amazon', name: 'Amazon', type: 'FAANG', cost: 800, logo: 'A', color: '#f59e0b' },
        { id: 'Microsoft', name: 'Microsoft', type: 'FAANG', cost: 1200, logo: 'M', color: '#0ea5e9' },
        { id: 'Google', name: 'Google', type: 'FAANG', cost: 2000, logo: 'G', color: '#ea4335' }
      ]; 
      changed = true; 
    }
    if (!db.companies || db.companies.length < 3) {
      db.companies = [
        { id: 'StartupInc', name: 'StartupInc', type: 'Basic', cost: 0, logo: 'S', color: '#3b82f6' },
        { id: 'Google', name: 'Google', type: 'FAANG', cost: 1000, logo: 'G', color: '#ea4335' },
        { id: 'Microsoft', name: 'Microsoft', type: 'FAANG', cost: 800, logo: 'M', color: '#00a4ef' },
        { id: 'TCS', name: 'TCS', type: 'Intermediate', cost: 500, logo: 'T', color: '#64748b' },
        { id: 'Amazon', name: 'Amazon', type: 'FAANG', cost: 900, logo: 'A', color: '#ff9900' }
      ];
      changed = true;
    }

    if (!db.questions || db.questions.length < 5) {
      db.questions = [
        { id: 'q1', company: 'StartupInc', type: 'Logic', text: 'If 3 cats kill 3 rats in 3 minutes, how long will it take 100 cats to kill 100 rats?', options: ['100 minutes', '3 minutes', '33 minutes', '1 minute'], correct: 1, expReward: 50 },
        { id: 'q2', company: 'StartupInc', type: 'Logic', text: 'A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$0.50', '$0.01'], correct: 1, expReward: 50 },
        { id: 'q3', company: 'Google', type: 'Technical', text: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correct: 2, expReward: 100 },
        { id: 'q4', company: 'Google', type: 'Technical', text: 'Which data structure is best for implementing a cache (LRU)?', options: ['Array', 'Stack', 'HashMap + Doubly Linked List', 'Queue'], correct: 2, expReward: 100 },
        { id: 'q5', company: 'Microsoft', type: 'Technical', text: 'In C#, what keyword is used to prevent a class from being inherited?', options: ['private', 'static', 'sealed', 'final'], correct: 2, expReward: 80 },
        { id: 'q6', company: 'TCS', type: 'Quant', text: 'What is 15% of 200?', options: ['20', '30', '40', '15'], correct: 1, expReward: 40 },
        { id: 'q7', company: 'Amazon', type: 'Technical', text: 'Which HTTP method is used for updating a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 2, expReward: 90 }
      ];
      changed = true;
    }
    
    if (changed) fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
};

const addLog = (action, details) => {
  const db = readDB();
  db.logs.unshift({
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    action,
    details
  });
  // Keep only last 100 logs
  if (db.logs.length > 100) db.logs.pop();
  writeDB(db);
};

const readDB = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

initDB();

// Request Routes
app.get('/api/requests', (req, res) => {
  const db = readDB();
  res.json(db.requests || []);
});

app.post('/api/requests', (req, res) => {
  const { userId, userName } = req.body;
  const db = readDB();
  
  // Create a permission request
  const newRequest = {
    id: Date.now(),
    userId,
    userName,
    type: 'edit_permission',
    status: 'pending',
    timestamp: new Date().toLocaleString()
  };
  
  db.requests = db.requests || [];
  db.requests.push(newRequest);
  
  // Mark user as pending
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex].editPermission = 'pending';
  }
  
  writeDB(db);
  addLog('Permission Requested', `${userName} requested edit access.`);
  res.json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
  const requestId = parseInt(req.params.id);
  const { status } = req.body; // 'approved' or 'rejected'
  const db = readDB();
  const requestIndex = db.requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    const request = db.requests[requestIndex];
    request.status = status;
    
    const userIndex = db.users.findIndex(u => u.id === request.userId);
    if (userIndex !== -1) {
      if (status === 'approved') {
        db.users[userIndex].editPermission = 'granted';
        addLog('Permission Granted', `Edit access granted to ${request.userName}.`);
      } else {
        db.users[userIndex].editPermission = 'none';
        addLog('Permission Rejected', `Edit access denied for ${request.userName}.`);
      }
    }
    
    writeDB(db);
    res.json(request);
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
});

// User Routes
app.get('/api/users', (req, res) => {
  const db = readDB();
  let changed = false;

  // Repair any users missing critical academic fields
  db.users = db.users.map(user => {
    let userUpdated = false;
    
    if (!user.editPermission) {
      user.editPermission = 'none';
      userUpdated = true;
    }
    
    if (!user.department) {
      user.department = 'B.Sc Computer Technology';
      userUpdated = true;
    }
    
    if (!user.studentId) {
      user.studentId = '24BCT157'; // Default for repair
      userUpdated = true;
    }

    if (!user.initials || user.initials.includes('-')) {
      const cleanName = user.name.trim();
      user.initials = (cleanName.charAt(0) + cleanName.charAt(cleanName.length - 1)).toUpperCase();
      userUpdated = true;
    }

    if (userUpdated) changed = true;
    return user;
  });

  if (changed) writeDB(db);
  res.json(db.users);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  const db = readDB();
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    // Revoke permission after update
    db.users[index] = { ...db.users[index], ...updatedData, editPermission: 'none' };
    
    // Refresh initials in case name changed
    const cleanName = db.users[index].name.trim();
    db.users[index].initials = (cleanName.charAt(0) + cleanName.charAt(cleanName.length - 1)).toUpperCase();
    
    writeDB(db);
    addLog('Profile Updated', `${db.users[index].name} updated their profile.`);
    res.json(db.users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex !== -1) {
    let user = db.users[userIndex];
    let updated = false;

    // Aggressive Repair for specific student IDs or missing fields
    if (!user.studentId || user.studentId === 'HT-2026') {
      const emailPrefix = email.split('@')[0];
      // Regex to find roll no patterns like 24BCT157
      const match = emailPrefix.match(/\d+[a-zA-Z]+\d+/);
      if (match) {
        user.studentId = match[0].toUpperCase();
      } else {
        // Fallback to a part of the email if no digits found
        user.studentId = emailPrefix.substring(emailPrefix.length - 8).toUpperCase();
      }
      updated = true;
    }
    
    if (!user.department || user.department === 'Not Set') {
      user.department = 'B.Sc Computer Technology'; // Reasonable default for this specific user's pattern
      updated = true;
    }

    if (updated) {
      db.users[userIndex] = user;
      writeDB(db);
    }

    res.json(user);
  } else {
    res.status(401).json({ message: 'User not found. Please register first.' });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, studentId, department } = req.body;
  const db = readDB();
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    studentId: studentId,
    department: department,
    exp: 0,
    level: 1,
    accuracy: 0,
    streak: 0,
    questionsAnswered: 0,
    unlockedCompanies: ['StartupInc'],
    history: []
  };
  
  db.users.push(newUser);
  writeDB(db);
  addLog('User Registered', `${name} (${email}) from ${department} joined.`);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  const db = readDB();
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updatedData };
    writeDB(db);
    res.json(db.users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const user = db.users.find(u => u.id === id);
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    db.users.splice(index, 1);
    writeDB(db);
    addLog('User Deleted', `User ${user.name} (${user.email}) was removed by admin.`);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Logs Route
app.get('/api/logs', (req, res) => {
  const db = readDB();
  res.json(db.logs);
});

// Company Management
app.get('/api/companies', (req, res) => {
  const db = readDB();
  res.json(db.companies || []);
});

app.post('/api/companies', (req, res) => {
  const newCompany = req.body;
  const db = readDB();
  if (!db.companies) db.companies = [];
  db.companies.push(newCompany);
  writeDB(db);
  addLog('Company Added', `New company ${newCompany.name} added to vault.`);
  res.json(newCompany);
});

app.put('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const updatedCompany = req.body;
  const db = readDB();
  const index = db.companies.findIndex(c => String(c.id) === String(id));
  if (index !== -1) {
    db.companies[index] = { ...db.companies[index], ...updatedCompany };
    writeDB(db);
    addLog('Company Updated', `Admin modified company: ${updatedCompany.name}.`);
    res.json(db.companies[index]);
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

app.delete('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  // Match by case-insensitive name or ID to be extra safe
  const index = db.companies.findIndex(c => 
    String(c.id).toLowerCase() === String(id).toLowerCase() || 
    String(c.name).toLowerCase() === String(id).toLowerCase()
  );
  
  if (index !== -1) {
    const company = db.companies[index];
    db.companies.splice(index, 1);
    writeDB(db);
    addLog('Company Deleted', `Admin removed company: ${company.name} from vault.`);
    res.json({ message: 'Company deleted' });
  } else {
    res.status(404).json({ message: 'Company not found' });
  }
});

app.get('/api/questions', (req, res) => {
  const db = readDB();
  res.json(db.questions);
});

app.post('/api/questions', (req, res) => {
  const newQuestion = req.body;
  const db = readDB();
  newQuestion.id = Date.now().toString();
  db.questions.push(newQuestion);
  writeDB(db);
  addLog('Question Added', `A new question for ${newQuestion.company} was added.`);
  res.json(newQuestion);
});

app.put('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const updatedQuestion = req.body;
  const db = readDB();
  const index = db.questions.findIndex(q => q.id === id);
  if (index !== -1) {
    db.questions[index] = { ...db.questions[index], ...updatedQuestion };
    writeDB(db);
    addLog('Question Updated', `Question ID ${id} was modified.`);
    res.json(db.questions[index]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

app.delete('/api/questions/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.questions.findIndex(q => q.id === id);
  if (index !== -1) {
    const q = db.questions[index];
    db.questions.splice(index, 1);
    writeDB(db);
    addLog('Question Deleted', `A question from ${q.company} was removed.`);
    res.json({ message: 'Question deleted' });
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

app.post('/api/admin/wipe', (req, res) => {
  const db = readDB();
  const count = db.users.length;
  db.users = [];
  writeDB(db);
  addLog('System Wipe', `DANGER: Admin wiped all ${count} user profiles.`);
  res.json({ message: 'All user data has been permanently wiped.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
