const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

const routeStart = s.indexOf("app.post('/api/generate'");
const start = s.indexOf('let chapters;', routeStart);

if (start !== -1) {
  const end = s.indexOf('\n\n    try {', start);
  if (end !== -1) {
    s = s.slice(0, start) +
`const chapters = await generateAllChapters(apiKey, userInfo, validType);` +
    s.slice(end);
  }
}

fs.writeFileSync(file, s, 'utf8');

console.log('restored OpenAI generation for all report types');
