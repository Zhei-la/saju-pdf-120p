const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 기존 잘못된 yearly 파트 제거
s = s.replace(
`    { title: 'PART 1. 올해 전체 흐름', sub: 'Overall Fortune', range: [0, 6] },
    { title: 'PART 2. 인간관계와 애정운', sub: 'Relationship Flow', range: [6, 11] },
    { title: 'PART 3. 재물과 커리어 흐름', sub: 'Money & Career', range: [11, 17] },
    { title: 'PART 4. 건강과 인생', sub: 'Health & Life', range: [17, 22] },
    { title: 'PART 5. 인생 굴곡과 운명', sub: 'Life Turning Point', range: [22, 28] },
    { title: \`PART 6. \${currYear}년 월별 핵심 운세\`, sub: 'Monthly Summary', range: [28, 40] }`,
''
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed duplicated old yearly ranges');
