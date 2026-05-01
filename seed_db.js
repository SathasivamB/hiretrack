const fs = require('fs');
const path = require('path');

const companies = ['StartupInc', 'Amazon', 'Google', 'Meta', 'Apple', 'Netflix'];
const types = ['Logic', 'Quant', 'Verbal', 'DSA', 'System Design'];

const generateQuestions = () => {
  const allQuestions = [];
  
  companies.forEach(company => {
    for (let i = 1; i <= 30; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      allQuestions.push({
        id: `${company.toLowerCase()}-${i}`,
        company: company,
        type: type,
        text: `[${company} ${type} Q${i}] A specialized aptitude question for ${company} aspirants. This covers high-frequency topics in ${type}.`,
        options: [
          `Correct Option for Q${i}`,
          `Distractor B for Q${i}`,
          `Distractor C for Q${i}`,
          `Distractor D for Q${i}`
        ],
        correct: 0,
        expReward: 50
      });
    }
  });

  return allQuestions;
};

// Seed real sample questions for variety
const realSamples = [
  {
    company: 'Amazon',
    type: 'Leadership',
    text: 'A customer is upset about a delayed package. According to Amazon Leadership Principles, what is the most important first step?',
    options: ['Offer a full refund immediately', 'Deep dive to find the root cause', 'Customer Obsession: Listen and empathize', 'Deliver Results: Expedite the next shipping'],
    correct: 2,
    expReward: 60
  },
  {
    company: 'Google',
    type: 'DSA',
    text: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
    expReward: 70
  },
  {
    company: 'Meta',
    type: 'System Design',
    text: 'Which database consistency model is typically preferred for a global social media feed with billions of users?',
    options: ['Strong Consistency', 'Eventual Consistency', 'Strict Serializability', 'No Consistency'],
    correct: 1,
    expReward: 80
  }
];

// Update the db.json
const dbPath = path.join(__dirname, 'server', 'db.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.questions = generateQuestions();
  // Insert some real ones at the start for better demo
  realSamples.forEach((q, index) => {
    db.questions[index] = { ...db.questions[index], ...q };
  });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Database seeded with 180 professional questions!');
}
