const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* 브랜드명 스타일 수정 */

s = s.replace(
`font-size:12px;color:#c59a1b;letter-spacing:6px;`,
`font-size:22px;
 color:#c59a1b;
 letter-spacing:10px;
 font-weight:700;
 margin-bottom:28px;
 text-transform:uppercase;`
);

/* 너무 위에 붙은 여백 살짝 조정 */

s = s.replace(
`padding:90px 70px 70px;`,
`padding:70px 70px 70px;`
);

fs.writeFileSync(file, s, 'utf8');

console.log('brand title enlarged');
