const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /const twelveGods = calcTwelveGods\(pillars, \{ basis: '[^']+' \}\);/,
  "const twelveGods = calcTwelveGods(pillars, { basis: 'posteller' });"
);

fs.writeFileSync(file, s, 'utf8');
console.log('index twelve gods basis set to posteller');
