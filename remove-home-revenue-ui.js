const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// 수익 카드 4개 묶음 제거
s = s.replace(
  /<div class="stats">\s*<div class="stat"><div class="label">오늘 수익<\/div>[\s\S]*?<div class="label">리포트 가격<\/div>[\s\S]*?<\/div>\s*<\/div>/,
  ''
);

// 가격 설정 카드 제거
s = s.replace(
  /<div class="card">\s*<div class="card-t">사주 리포트 가격 \(원\)<\/div>[\s\S]*?각 리포트 1개당 가격입니다\. 수익 통계 계산에 사용됩니다\.[\s\S]*?<\/div>\s*<\/div>/,
  ''
);

// 가격 입력 세팅 JS 제거
s = s.replace(/\/\/ 리포트 가격\s*document\.getElementById\('reportPrice'\)[\s\S]*?document\.getElementById\('reportPriceHalf'\)\.value = currentUser\.reportPriceHalf \|\| '';\s*/g, '');

// savePrice 함수 제거
s = s.replace(/async function savePrice\(\) \{[\s\S]*?\n\}/g, '');

fs.writeFileSync(file, s, 'utf8');

console.log('removed revenue and price UI from home');
