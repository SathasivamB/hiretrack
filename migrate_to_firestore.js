const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
  const data = JSON.parse(fs.readFileSync('./server/db.json', 'utf8'));

  console.log('--- Migrating Users ---');
  for (const user of data.users) {
    // Ensure email is string and document ID is clean
    await db.collection('users').doc(user.email.toLowerCase()).set({
      ...user,
      email: user.email.toLowerCase()
    });
    console.log(`Migrated user: ${user.email}`);
  }

  console.log('--- Migrating Companies ---');
  for (const company of data.companies) {
    await db.collection('companies').doc(company.id).set(company);
    console.log(`Migrated company: ${company.id}`);
  }

  console.log('--- Migrating Questions ---');
  let batch = db.batch();
  let count = 0;
  for (const question of data.questions) {
    const ref = db.collection('questions').doc(String(question.id));
    batch.set(ref, question);
    count++;
    
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`Committing batch... (${count} questions)`);
    }
  }
  await batch.commit();
  console.log(`Finished migrating ${count} questions.`);

  console.log('--- Migrating Requests & Logs ---');
  for (const req of data.requests) {
    await db.collection('requests').add(req);
  }
  for (const log of (data.logs || [])) {
    await db.collection('logs').add(log);
  }

  console.log('🎉 MIGRATION COMPLETE!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
