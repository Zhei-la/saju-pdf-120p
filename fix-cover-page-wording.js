const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/20챕터 · 약 60페이지/g, '연애운 집중 분석 · 20챕터 · 50페이지 내외');
s = s.replace(/약 60페이지/g, '50페이지 내외');
s = s.replace(/20챕터 ·/g, '연애운 집중 분석 · 20챕터 ·');

fs.writeFileSync(file, s, 'utf8');
console.log('cover page count wording fixed');
