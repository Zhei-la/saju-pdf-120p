const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const anchor = `  const estPages = isHalf ? 60 : 120;`;

const insert = `  const estPages = isHalf ? 60 : 120;

  const reportLabel = currentUserInfo.reportType === 'love'
    ? '연애운 집중 분석'
    : '프리미엄 사주 분석';

  const pageLabel = currentUserInfo.reportType === 'love'
    ? '50페이지 내외'
    : (isHalf ? '50페이지 내외' : '120페이지 내외');`;

s = s.replace(anchor, insert);

fs.writeFileSync(file, s, 'utf8');

console.log('inserted reportLabel and pageLabel');
