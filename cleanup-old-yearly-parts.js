const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 기존 YEARLY_PARTS 제거
s = s.replace(
/const YEARLY_PARTS = \[[\s\S]*?\];\n\n\/\/ half는 챕터/,
'// half는 챕터'
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed old yearly parts block');
