const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/Elements & Ten Gods/g, 'Five Elements & Emotional Flow');
s = s.replace(/Life Guidance/g, 'Destiny & Life Direction');
s = s.replace(/Life Cycle/g, 'Life Cycle Flow');
s = s.replace(/Health & Lifestyle/g, 'Health & Emotional Balance');

fs.writeFileSync(file, s, 'utf8');

console.log('upgraded premium english subtitles');
