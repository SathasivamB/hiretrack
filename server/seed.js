const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

const companies = [
  { id: 'StartupInc', name: 'StartupInc', type: 'Basic', cost: 0, logo: 'https://logo.clearbit.com/startup.com', color: '#3b82f6' },
  { id: 'Google', name: 'Google', type: 'FAANG', cost: 1000, logo: 'https://logo.clearbit.com/google.com', color: '#ea4335' },
  { id: 'Microsoft', name: 'Microsoft', type: 'FAANG', cost: 800, logo: 'https://logo.clearbit.com/microsoft.com', color: '#00a4ef' },
  { id: 'Amazon', name: 'Amazon', type: 'FAANG', cost: 900, logo: 'https://logo.clearbit.com/amazon.com', color: '#ff9900' },
  { id: 'TCS', name: 'TCS', type: 'Intermediate', cost: 500, logo: 'https://logo.clearbit.com/tcs.com', color: '#64748b' },
  { id: 'Zoho', name: 'Zoho', type: 'Intermediate', cost: 600, logo: 'https://logo.clearbit.com/zoho.com', color: '#facc15' },
  { id: 'Accenture', name: 'Accenture', type: 'Global', cost: 700, logo: 'https://logo.clearbit.com/accenture.com', color: '#a855f7' },
  { id: 'Meta', name: 'Meta', type: 'FAANG', cost: 1200, logo: 'https://logo.clearbit.com/meta.com', color: '#0668E1' }
];

const questionPool = {
  'Logic': [
    { text: 'A man is looking at a photograph of someone. His friend asks who it is. The man replies, "Brothers and sisters, I have none. But that man\'s father is my father\'s son." Who is in the photograph?', options: ['His Son', 'His Father', 'Himself', 'His Grandfather'], correct: 0 },
    { text: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correct: 1 },
    { text: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?', options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'EOJDJFEM'], correct: 0 },
    { text: 'Pointing to a lady, a man said, "The son of her only brother is the brother of my wife." How is the lady related to the man?', options: ['Mother\'s sister', 'Grandmother', 'Mother-in-law', 'Sister of father-in-law'], correct: 3 },
    { text: 'If 1st January 2001 was a Monday, what day was 1st January 2002?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], correct: 0 }
  ],
  'Quant': [
    { text: 'A train 120m long passes a telegraph post in 6 seconds. Find its speed in km/hr.', options: ['60 km/hr', '72 km/hr', '80 km/hr', '90 km/hr'], correct: 1 },
    { text: 'If 20% of a = b, then b% of 20 is the same as:', options: ['4% of a', '5% of a', '20% of a', 'None'], correct: 0 },
    { text: 'A sum of money at compound interest amounts to thrice itself in 3 years. In how many years will it be 9 times itself?', options: ['6 years', '9 years', '12 years', '15 years'], correct: 0 },
    { text: 'The average of 7 consecutive numbers is 20. The largest of these numbers is:', options: ['20', '22', '23', '24'], correct: 2 },
    { text: 'A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?', options: ['3', '4', '5', '6'], correct: 2 }
  ],
  'Technical': [
    { text: 'Which of the following is not a pillar of OOP?', options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Compilation'], correct: 3 },
    { text: 'What is the size of int in Java?', options: ['16-bit', '32-bit', '64-bit', 'Depends on OS'], correct: 1 },
    { text: 'Which data structure follows LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1 },
    { text: 'Which of the following is used for managing state in React?', options: ['useEffect', 'useState', 'useContext', 'All of the above'], correct: 3 },
    { text: 'In SQL, which command is used to remove all records from a table but keep the structure?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correct: 2 }
  ],
  'Programming': [
    { text: 'What is the output of 2 + "2" in JavaScript?', options: ['4', '22', 'Error', 'undefined'], correct: 1 },
    { text: 'Which header file is used for input/output in C++?', options: ['stdio.h', 'conio.h', 'iostream', 'math.h'], correct: 2 },
    { text: 'In Python, how do you start a block of code?', options: ['Braces {}', 'Parentheses ()', 'Indentation', 'Semicolon ;'], correct: 2 },
    { text: 'Which keyword is used to create a subclass in Java?', options: ['implements', 'extends', 'inherits', 'subclass'], correct: 1 },
    { text: 'What does the \'typeof\' operator return for an array in JS?', options: ['array', 'list', 'object', 'undefined'], correct: 2 }
  ]
};

const questions = [];
let qId = 1;

companies.forEach(company => {
  const types = Object.keys(questionPool);
  for (let i = 0; i < 25; i++) {
    const type = types[i % types.length];
    const pool = questionPool[type];
    const template = pool[i % pool.length];
    
    questions.push({
      id: `q-${qId++}`,
      company: company.name,
      type: type,
      text: `[${company.name}] ${template.text}`,
      options: template.options,
      correct: template.correct,
      expReward: 10
    });
  }
});

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
db.companies = companies;
db.questions = questions;

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
console.log(`Database seeded with 8 companies and ${questions.length} unique questions!`);
