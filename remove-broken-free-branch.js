const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

const pattern = /let chapters;[\s\S]*?else \{\s*chapters = await generateAllChapters\(apiKey, userInfo, validType\);\s*\}/;

s = s.replace(
  pattern,
  `const chapters = await generateAllChapters(apiKey, userInfo, validType);`
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed broken free override branch');
