const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /const needLines = 2 \+ partItems\.length;/,
  'const needLines = 5 + partItems.length;'
);

fs.writeFileSync(file, s, 'utf8');

console.log('increased toc spacing calculation');
