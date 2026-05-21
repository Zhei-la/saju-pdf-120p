const fs = require('fs');

const file = 'public/admin.html';
let s = fs.readFileSync(file, 'utf8');

// 수익 통계 카드 4개 제거
s = s.replace(/<div class="stat">\s*<div class="label">오늘 수익<\/div>[\s\S]*?<\/div>\s*<\/div>/g, '');
s = s.replace(/<div class="stat">\s*<div class="label">이번 주 수익<\/div>[\s\S]*?<\/div>\s*<\/div>/g, '');
s = s.replace(/<div class="stat">\s*<div class="label">총 누적 수익<\/div>[\s\S]*?<\/div>\s*<\/div>/g, '');
s = s.replace(/<div class="stat">\s*<div class="label">리포트 가격<\/div>[\s\S]*?<\/div>\s*<\/div>/g, '');

// 가격 설정 카드 제거
s = s.replace(/<div class="card">\s*<div class="card-t">사주 리포트 가격 \(원\)<\/div>[\s\S]*?수익 통계 계산에 사용됩니다\.[\s\S]*?<\/div>\s*<\/div>/g, '');

// 혹시 h3 구조로 되어있는 경우도 제거
s = s.replace(/<div class="card">[\s\S]*?사주 리포트 가격 \(원\)[\s\S]*?전체 저장[\s\S]*?수익 통계 계산에 사용됩니다\.[\s\S]*?<\/div>/g, '');

fs.writeFileSync(file, s, 'utf8');

console.log('force removed revenue cards and price settings');
