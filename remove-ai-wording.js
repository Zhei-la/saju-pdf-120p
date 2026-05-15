const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/AI 종합 분석 · /g, '');
s = s.replace(/전통 명리학 \+ AI 기술로 제작된 프리미엄 사주 리포트/g, '정통 명리 해석 기반 프리미엄 사주 리포트');

fs.writeFileSync(file, s, 'utf8');

console.log('AI wording removed');
