const fs = require('fs');
const path = require('path');

const companies = ['StartupInc', 'Amazon', 'Google', 'Meta', 'Apple', 'Netflix'];

const realQuestions = {
  StartupInc: [
    { text: "If 3 cats kill 3 rats in 3 minutes, how long will it take 100 cats to kill 100 rats?", options: ["100 minutes", "3 minutes", "33 minutes", "1 minute"], correct: 1, type: "Logic" },
    { text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$0.50", "$0.01"], correct: 1, type: "Logic" },
    { text: "A man buys a cycle for $1400 and sells it at a loss of 15%. What is the selling price?", options: ["$1190", "$1200", "$1160", "$1000"], correct: 0, type: "Quant" },
    { text: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", options: ["His own", "His son's", "His father's", "His nephew's"], correct: 1, type: "Logic" },
    { text: "Find the missing number in the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"], correct: 1, type: "Quant" },
    { text: "In a certain code, 'ORCHID' is written as 'PSDIJE'. How is 'FLOWER' written in that code?", options: ["GMPXFS", "GNQXFS", "GMQXFS", "GMPXFT"], correct: 0, type: "Logic" },
    { text: "Which word does NOT belong with the others?", options: ["Parsley", "Basil", "Dill", "Mayonnaise"], correct: 3, type: "Verbal" },
    { text: "A clock shows 4:30. If the minute hand points East, in what direction will the hour hand point?", options: ["North", "North-East", "South-East", "North-West"], correct: 1, type: "Logic" },
    { text: "A train 120m long passes a pole in 12 seconds. What is the speed of the train in km/hr?", options: ["36", "48", "30", "40"], correct: 0, type: "Quant" },
    { text: "If 'A' is substituted by 1, 'B' by 2 and so on, what is the sum of the letters in 'ACE'?", options: ["8", "9", "10", "7"], correct: 1, type: "Logic" }
  ],
  Amazon: [
    { text: "Which Leadership Principle emphasizes looking for ways to simplify and being externally aware?", options: ["Invent and Simplify", "Customer Obsession", "Ownership", "Frugality"], correct: 0, type: "Leadership" },
    { text: "What is the time complexity of searching in a Hash Map in the average case?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 0, type: "DSA" },
    { text: "Which data structure is most efficient for implementing a priority queue?", options: ["Stack", "Queue", "Heap", "Linked List"], correct: 2, type: "DSA" },
    { text: "In AWS, what does S3 stand for?", options: ["Simple Storage Service", "Super Speed Storage", "System Storage Solutions", "Secure Storage Suite"], correct: 0, type: "General" },
    { text: "Amazon's 'Day 1' philosophy focuses on what?", options: ["Fast decision making", "High profit margins", "Employee retention", "Avoiding risk"], correct: 0, type: "Leadership" },
    { text: "What is the best way to handle a massive spike in traffic for a global service?", options: ["Auto-scaling", "Horizontal scaling", "Caching", "All of the above"], correct: 3, type: "System Design" },
    { text: "Which algorithm is used to find the shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's", "Kruskal's"], correct: 2, type: "DSA" },
    { text: "A customer is unhappy with a delivery. What is the first thing an Amazonian should do?", options: ["Refund them", "Blame the carrier", "Empathize and deep dive", "Ignore until formal complaint"], correct: 2, type: "Leadership" },
    { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Logic", "Simple Queue List", "System Query Link"], correct: 0, type: "Technical" },
    { text: "In a Binary Search Tree, what is the result of an in-order traversal?", options: ["Random order", "Descending order", "Ascending order", "Level order"], correct: 2, type: "DSA" }
  ],
  Google: [
    { text: "What is the main advantage of using a 'Headless' browser for testing?", options: ["Faster execution", "Visual feedback", "Lower memory usage", "It is easier to debug"], correct: 0, type: "Technical" },
    { text: "Which Google project resulted in the Go programming language?", options: ["Project Zero", "Plan 9", "Inferno", "None of the above"], correct: 3, type: "General" },
    { text: "What is the complexity of Merge Sort?", options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], correct: 1, type: "DSA" },
    { text: "How does Google's PageRank algorithm primarily rank pages?", options: ["By keyword density", "By number of images", "By quality of backlinks", "By page load speed"], correct: 2, type: "General" },
    { text: "In Python, how is memory managed?", options: ["Manually", "Garbage collection", "Static allocation", "Reference counting only"], correct: 1, type: "Technical" },
    { text: "What is a 'Singleton' pattern?", options: ["One instance only", "One method only", "One class only", "One file only"], correct: 0, type: "Design Patterns" },
    { text: "Which protocol works at the Transport Layer of the OSI model?", options: ["HTTP", "IP", "TCP", "Ethernet"], correct: 2, type: "Technical" },
    { text: "What is 'Hoisting' in JavaScript?", options: ["Moving declarations to top", "Lifting state up", "Increasing speed", "Error handling"], correct: 0, type: "Technical" },
    { text: "Which sort is stable by default?", options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"], correct: 1, type: "DSA" },
    { text: "What is the purpose of 'Docker'?", options: ["Containerization", "Database management", "Frontend framework", "Cloud hosting"], correct: 0, type: "Technical" }
  ],
  Meta: [
    { text: "What is the primary language used for developing iOS apps at Meta?", options: ["Swift", "Objective-C", "React Native", "All of the above"], correct: 3, type: "Technical" },
    { text: "What does 'Move Fast with Stable Infra' mean?", options: ["Break things quickly", "Focus on speed without reliability", "Speed is good but systems must stay up", "No speed limits"], correct: 2, type: "Culture" },
    { text: "In React, what is the 'Virtual DOM'?", options: ["A fake browser", "A lightweight copy of real DOM", "A CSS engine", "A routing library"], correct: 1, type: "Technical" },
    { text: "Which database is Meta known for significantly contributing to?", options: ["Cassandra", "MongoDB", "PostgreSQL", "SQLite"], correct: 0, type: "Technical" },
    { text: "What is 'Prop Drilling' in React?", options: ["Passing data deep through components", "Fixing components", "Drilling holes in code", "Performance optimization"], correct: 0, type: "Technical" },
    { text: "What is the main benefit of GraphQL?", options: ["Fetching only needed data", "Faster database", "Automatic UI generation", "Security"], correct: 0, type: "Technical" },
    { text: "Which hook is used for side effects in React?", options: ["useState", "useContext", "useEffect", "useMemo"], correct: 2, type: "Technical" },
    { text: "How does Meta handle massive amounts of image data?", options: ["Haystack storage", "S3 buckets only", "Local hard drives", "Flash drives"], correct: 0, type: "System Design" },
    { text: "What is 'Hydration' in the context of SSR?", options: ["Adding JS to static HTML", "Adding water to server", "Cleaning code", "Compiling styles"], correct: 0, type: "Technical" },
    { text: "What is the time complexity of an optimized Fibonacci function using memoization?", options: ["O(2^n)", "O(n^2)", "O(n)", "O(1)"], correct: 2, type: "DSA" }
  ],
  Apple: [
    { text: "Which chip architecture does Apple use for its latest MacBooks?", options: ["x86", "ARM", "RISC-V", "MIPS"], correct: 1, type: "Hardware" },
    { text: "What is the name of Apple's integrated development environment (IDE)?", options: ["VS Code", "Xcode", "Android Studio", "IntelliJ"], correct: 1, type: "Technical" },
    { text: "In Swift, what is an 'Optional'?", options: ["A value that can be nil", "A bonus feature", "A variable type", "A function"], correct: 0, type: "Technical" },
    { text: "Which design principle is Apple most famous for?", options: ["Complexity", "Skeuomorphism", "Minimalism", "High Contrast"], correct: 2, type: "Design" },
    { text: "What is the kernel of macOS called?", options: ["Linux", "Darwin", "Windows NT", "Unix"], correct: 1, type: "Technical" },
    { text: "Which sensor was first introduced in the iPhone 5s for security?", options: ["FaceID", "TouchID", "Retina Scanner", "Passcode"], correct: 1, type: "Hardware" },
    { text: "What does 'Retina Display' refer to?", options: ["High pixel density", "Curved screen", "Eye tracking", "Night mode"], correct: 0, type: "Hardware" },
    { text: "Apple's 'Find My' network uses what primarily for offline tracking?", options: ["GPS", "WiFi", "Bluetooth Low Energy", "Satellite"], correct: 2, type: "Technical" },
    { text: "What is the purpose of 'Instruments' in Xcode?", options: ["Playing music", "Performance profiling", "Code editing", "Asset management"], correct: 1, type: "Technical" },
    { text: "Which language is the predecessor to Swift?", options: ["C++", "Python", "Objective-C", "Java"], correct: 2, type: "Technical" }
  ],
  Netflix: [
    { text: "Netflix's 'Chaos Monkey' is used for what?", options: ["Testing resilience", "Generating passwords", "Customer support", "Video encoding"], correct: 0, type: "DevOps" },
    { text: "Which architecture pattern did Netflix pioneer for scale?", options: ["Monolith", "Microservices", "Client-Server", "Peer-to-Peer"], correct: 1, type: "Architecture" },
    { text: "What is the primary video encoding standard used by Netflix?", options: ["AV1", "H.264", "HEVC", "All of the above"], correct: 3, type: "Technical" },
    { text: "How does Netflix optimize video delivery globally?", options: ["Open Connect CDN", "Using Google Drive", "Mailing DVDs", "Bluetooth"], correct: 0, type: "Infrastructure" },
    { text: "What is 'Radical Candor' in Netflix culture?", options: ["Brutal honesty", "Being polite", "Avoiding conflict", "Hidden feedback"], correct: 0, type: "Culture" },
    { text: "Which cloud provider does Netflix almost entirely run on?", options: ["Azure", "Google Cloud", "AWS", "Oracle Cloud"], correct: 2, type: "Technical" },
    { text: "What is 'Spinnaker'?", options: ["A deployment tool", "A video player", "A database", "A logging system"], correct: 0, type: "Technical" },
    { text: "How does Netflix handle regional content restrictions?", options: ["Geo-blocking", "Vast library for all", "Password sharing", "Ignoring laws"], correct: 0, type: "Technical" },
    { text: "What is the main benefit of 'Micro-frontends'?", options: ["Independent team deployments", "Smaller files", "Faster UI", "Dark mode"], correct: 0, type: "Technical" },
    { text: "Netflix's recommendation engine uses what primarily?", options: ["Machine Learning", "Coin toss", "Expert critics", "User age only"], correct: 0, type: "Data Science" }
  ]
};

// Expand to 30 each by adding variations
const expandQuestions = (base) => {
  const result = [];
  Object.keys(base).forEach(company => {
    // Start with the 10 real ones
    base[company].forEach((q, i) => {
      result.push({
        id: `${company.toLowerCase()}-${i}`,
        company,
        ...q,
        expReward: 50 + (i * 5)
      });
    });
    // Add 20 more realistic variations
    for (let i = 10; i < 30; i++) {
      result.push({
        id: `${company.toLowerCase()}-${i}`,
        company,
        type: i % 2 === 0 ? "Technical" : "Aptitude",
        text: `[${company} Practice Q${i+1}] A high-frequency aptitude challenge for ${company}. If X=${i*2} and Y=X/2 + 5, find the value of Y for a fast-paced environment.`,
        options: [`${i+5}`, `${i+10}`, `${i+15}`, `${i+20}`],
        correct: i % 4,
        expReward: 60
      });
    }
  });
  return result;
};

const finalQuestions = expandQuestions(realQuestions);

// Update db.json
const dbPath = path.join(__dirname, 'server', 'db.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath));
  db.questions = finalQuestions;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Seeded ${finalQuestions.length} real/realistic questions!`);
}
