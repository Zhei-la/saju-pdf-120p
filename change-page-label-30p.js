const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/50페이지 내외/g, '30페이지 내외');
s = s.replace(/60페이지 내외/g, '30페이지 내외');
s = s.replace(/약 60페이지/g, '30페이지 내외');
s = s.replace(/약 50페이지/g, '30페이지 내외');

fs.writeFileSync(file, s, 'utf8');
console.log('page label changed to 30 pages');
