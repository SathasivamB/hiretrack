const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize Firebase safely
let serviceAccount;
const fs = require('fs');

if (process.env.FB_PRIVATE_KEY) {
  serviceAccount = {
    projectId: process.env.FB_PROJECT_ID,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
  console.log("✅ Firebase loaded from granular ENV (Project: " + serviceAccount.projectId + ")");
} else if (fs.existsSync("./serviceAccountKey.json")) {
  serviceAccount = require("./serviceAccountKey.json");
  console.log("✅ Firebase loaded from local file.");
} else {
  console.warn("⚠️ WARNING: No Firebase credentials found.");
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve Static Files from React Build
app.use(express.static(path.join(__dirname, "build")));

// --- UTILS ---
const addLog = async (action, details) => {
  try {
    await db.collection('logs').add({
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (e) { console.error('Logging failed', e); }
};

// --- API ROUTES ---

app.post('/api/register', async (req, res) => {
  const { email, password, name, studentId, department } = req.body;
  try {
    const userRef = db.collection('users').doc(email.toLowerCase());
    const doc = await userRef.get();
    
    if (doc.exists) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    // Generate initials
    const cleanName = name.trim();
    const initials = (cleanName.charAt(0) + cleanName.charAt(cleanName.length - 1)).toUpperCase();

    const newUser = {
      email: email.toLowerCase(),
      password,
      name,
      studentId: studentId || '',
      department: department || '',
      initials,
      exp: 0,
      unlockedCompanies: ['StartupInc'],
      questionsAnswered: 0,
      accuracy: 0,
      streak: 0,
      history: [],
      editPermission: 'none'
    };

    await userRef.set(newUser);
    console.log(`New user registered: ${email}`);
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await db.collection('users').doc(email.toLowerCase()).get();
    if (userDoc.exists && userDoc.data().password === password) {
      res.json({ success: true, user: userDoc.data() });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/profile', async (req, res) => {
  const { email } = req.body;
  try {
    const userDoc = await db.collection('users').doc(email.toLowerCase()).get();
    if (userDoc.exists) res.json(userDoc.data());
    else res.status(404).json({ message: 'User not found' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/users/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email).toLowerCase();
  const updates = req.body;
  try {
    await db.collection('users').doc(email).update(updates);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/companies', async (req, res) => {
  const snapshot = await db.collection('companies').get();
  const companies = [];
  snapshot.forEach(doc => companies.push(doc.data()));
  res.json(companies);
});

app.post('/api/companies', async (req, res) => {
  const company = req.body;
  await db.collection('companies').doc(company.id).set(company);
  res.json(company);
});

app.delete('/api/companies/:id', async (req, res) => {
  await db.collection('companies').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

app.get('/api/questions', async (req, res) => {
  const snapshot = await db.collection('questions').get();
  const questions = [];
  snapshot.forEach(doc => questions.push(doc.data()));
  res.json(questions);
});

app.post('/api/questions', async (req, res) => {
  const question = req.body;
  await db.collection('questions').doc(String(question.id)).set(question);
  res.json(question);
});

app.delete('/api/questions/:id', async (req, res) => {
  await db.collection('questions').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

app.get('/api/requests', async (req, res) => {
  const snapshot = await db.collection('requests').get();
  const requests = [];
  snapshot.forEach(doc => requests.push({ ...doc.data(), id: doc.id }));
  res.json(requests);
});

app.post('/api/requests', async (req, res) => {
  const docRef = await db.collection('requests').add(req.body);
  res.json({ ...req.body, id: docRef.id });
});

app.delete('/api/requests/:id', async (req, res) => {
  await db.collection('requests').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

app.get('/api/logs', async (req, res) => {
  const snapshot = await db.collection('logs').orderBy('timestamp', 'desc').limit(50).get();
  const logs = [];
  snapshot.forEach(doc => logs.push(doc.data()));
  res.json(logs);
});

app.get('/api/users', async (req, res) => {
  const snapshot = await db.collection('users').get();
  const users = [];
  snapshot.forEach(doc => users.push(doc.data()));
  res.json(users);
});

app.post('/api/admin/wipe', async (req, res) => {
  const snapshot = await db.collection('users').get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  await addLog('System Wipe', 'All user data wiped.');
  res.json({ message: 'Wiped' });
});

// Fallback to React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
