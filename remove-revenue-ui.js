const fs = require('fs');

const file = 'public/admin.html';
let s = fs.readFileSync(file, 'utf8');

//
// 1. 수익 카드 제거
//
s = s.replace(
/[\s\S]*?오늘 수익[\s\S]*?리포트 가격[\s\S]*?<\/div>\s*<\/div>/,
''
);

//
// 2. 가격 설정 섹션 제거
//
s = s.replace(
/<h3[^>]*>\s*사주 리포트 가격[\s\S]*?각 리포트 1개당 가격입니다\. 수익 통계 계산에 사용됩니다\.<\/div>\s*<\/div>/,
''
);

//
// 3. 가격 관련 JS 제거
//
s = s.replace(/const reportPrice[\s\S]*?;/g, '');
s = s.replace(/const lightReportPrice[\s\S]*?;/g, '');

fs.writeFileSync(file, s, 'utf8');

console.log('removed revenue and report price ui');
