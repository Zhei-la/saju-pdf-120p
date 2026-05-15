const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/\/상대방\/gg/g, '/상대방/g');

fs.writeFileSync(file, s, 'utf8');
console.log('fixed invalid regex flag gg');
