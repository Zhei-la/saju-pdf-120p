const fs = require('fs');

const file = 'services/saju/analysis/hiddenStems.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace("卯: ['乙']", "卯: ['甲', '乙']");

fs.writeFileSync(file, s, 'utf8');
console.log('卯 hidden stems changed to 甲乙');
