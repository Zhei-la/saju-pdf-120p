const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/localStorage\.getItem\('shopName'\) \|\| '운명사주'/g, "localStorage.getItem('shopName') || ''");

s = s.replace(
  /if \(!brandName\) brandName = userName \? `\$\{userName\} 사주` : '운명사주';/,
  "if (!brandName) { alert('사주 브랜드 이름을 먼저 입력해주세요. 홈 화면에서 브랜드명을 저장한 뒤 다시 생성해주세요.'); throw new Error('브랜드명이 설정되지 않았습니다.'); }"
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed default brand and required brand name');
