const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`    { title: 'PART 5. 인생 굴곡과 운명', sub: 'Destiny & Trials', range: [22, 28] },
    { title: \`PART 6. \${currYear}년 월별 상세 운세\`, sub: 'Monthly Fortune', range: [28, 40] }`,
`    { title: 'PART 5. 인생 굴곡과 운명', sub: 'Life Turning Point', range: [22, 28] },
    { title: \`PART 6. \${currYear}년 월별 핵심 운세\`, sub: 'Monthly Summary', range: [28, 40] }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('renamed old yearly labels safely');
