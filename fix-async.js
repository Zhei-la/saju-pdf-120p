const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/async\s*\n/,
'async function makeResult(){\n'
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed async function declaration');
