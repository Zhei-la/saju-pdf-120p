const fs = require('fs');

const file = 'services/saju/analysis/hiddenStems.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
"子: ['癸']",
"子: ['壬', '癸']"
);

fs.writeFileSync(file, s, 'utf8');

console.log('子 hidden stems updated');
