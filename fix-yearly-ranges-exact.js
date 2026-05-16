const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/currentUserInfo\.reportType === 'yearly'\s*\?\s*\[[\s\S]*?\]\s*: isHalf/,
`currentUserInfo.reportType === 'yearly'
    ? [
        { title: 'PART 1. 올해 전체 흐름', sub: 'Yearly Flow', range: [0, 5] },
        { title: 'PART 2. 관계와 인연 흐름', sub: 'Relationship Flow', range: [5, 10] },
        { title: 'PART 3. 재물·직업·건강운', sub: 'Money Career Health', range: [10, 15] },
        { title: 'PART 4. 선택과 주의할 흐름', sub: 'Caution & Choice', range: [15, 19] },
        { title: 'PART 5. 인생 굴곡과 운명', sub: 'Life Turning Point', range: [19, 24] },
        { title: 'PART 6. 월별 핵심 운세', sub: 'Monthly Summary', range: [24, 36] }
      ]
    : isHalf`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed yearly part ranges exactly');
