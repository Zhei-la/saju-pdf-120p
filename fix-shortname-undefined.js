const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/\.replace\(\/본인은\/g, shortName \+ '님은'\)\s*/g, '');
s = s.replace(/\.replace\(\/본인의\/g, shortName \+ '님의'\)\s*/g, '');

fs.writeFileSync(file, s, 'utf8');
console.log('removed broken shortName replacement');
