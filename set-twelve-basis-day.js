const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  "const twelveGods = calcTwelveGods(pillars, { basis: 'yearBranch' });",
  "const twelveGods = calcTwelveGods(pillars, { basis: 'dayBranch' });"
);

fs.writeFileSync(file, s, 'utf8');
console.log('twelveGods basis set to dayBranch');
