const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/sub:\s*'Destiny & Trials'/g, "sub: 'Life Turning Point'");
s = s.replace(/sub:\s*'Monthly Fortune'/g, "sub: 'Monthly Summary'");
s = s.replace(/월별 상세 운세/g, "월별 핵심 운세");

fs.writeFileSync(file, s, 'utf8');
console.log('force renamed yearly labels');
