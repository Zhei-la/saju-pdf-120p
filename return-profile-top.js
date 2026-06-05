const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('profileTop,')) {
  s = s.replace(
    'profile:',
    'profileTop,\n\n    profile:'
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('profileTop added to return');
