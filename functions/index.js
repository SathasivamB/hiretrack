const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- UTILS ---
const addLog = async (action, details) => {
  await db.collection('logs').add({
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

// --- AUTH ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await db.collection('users').doc(email.toLowerCase()).get();
    if (userDoc.exists && userDoc.data().password === password) {
      res.json({ success: true, user: userDoc.data() });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile', async (req, res) => {
  const { email } = req.body;
  try {
    const userDoc = await db.collection('users').doc(email.toLowerCase()).get();
    if (userDoc.exists) {
      res.json(userDoc.data());
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile (Student/Admin)
app.put('/api/users/:email', async (req, res) => {
  const email = req.params.email.toLowerCase();
  const updates = req.body;
  try {
    await db.collection('users').doc(email).update(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- COMPANIES ---
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
  const id = req.params.id;
  await db.collection('companies').doc(id).delete();
  res.json({ message: 'Deleted' });
});

// --- QUESTIONS ---
app.get('/api/questions', async (req, res) => {
  const snapshot = await db.collection('questions').get();
  const questions = [];
  snapshot.forEach(doc => questions.push(doc.data()));
  res.json(questions);
});

app.post('/api/questions', async (req, res) => {
  const question = req.body;
  const ref = db.collection('questions').doc(question.id);
  await ref.set(question);
  res.json(question);
});

app.delete('/api/questions/:id', async (req, res) => {
  await db.collection('questions').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
});

// --- ADMIN REQUESTS & LOGS ---
app.get('/api/requests', async (req, res) => {
  const snapshot = await db.collection('requests').get();
  const requests = [];
  snapshot.forEach(doc => requests.push({ ...doc.data(), id: doc.id }));
  res.json(requests);
});

app.post('/api/requests', async (req, res) => {
  const request = req.body;
  const docRef = await db.collection('requests').add(request);
  res.json({ ...request, id: docRef.id });
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

// --- WIPE ---
app.post('/api/admin/wipe', async (req, res) => {
  // Wipe users only
  const snapshot = await db.collection('users').get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  await addLog('System Wipe', 'All user data wiped.');
  res.json({ message: 'Wiped' });
});

exports.api = onRequest({ region: "us-central1" }, app);
