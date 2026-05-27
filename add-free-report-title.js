const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`half: { title: '사주 분석서', sub: 'SAJU REPORT', label: '사주 분석서' },`,
`half: { title: '사주 분석서', sub: 'SAJU REPORT', label: '사주 분석서' },
    free: { title: '무료 사주 풀이', sub: 'FREE SAJU REPORT', label: '무료 사주 풀이' },`
);

s = s.replace(
`half: '사주분석서'`,
`half: '사주분석서',
      free: '무료사주풀이'`
);

fs.writeFileSync(file, s, 'utf8');

console.log('added free report title');
