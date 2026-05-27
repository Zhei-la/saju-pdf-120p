const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/const PARTS = isHalf[\s\S]*?: ALL_PARTS;/,
`const PARTS = currentUserInfo.reportType === 'yearly'
    ? [
        { title: 'PART 1. 올해 전체 흐름', sub: 'Yearly Flow', range: [0, 5] },
        { title: 'PART 2. 관계와 인연 흐름', sub: 'Relationship Flow', range: [5, 10] },
        { title: 'PART 3. 재물·직업·건강운', sub: 'Money Career Health', range: [10, 15] },
        { title: 'PART 4. 선택과 주의할 흐름', sub: 'Caution & Choice', range: [15, 19] },
        { title: 'PART 5. 인생 굴곡과 운명', sub: 'Life Turning Point', range: [19, 24] },
        { title: 'PART 6. 월별 핵심 운세', sub: 'Monthly Summary', range: [24, 36] }
      ]
    : isHalf
    ? [
        { title: 'PART 1. 타고난 연애 성향', sub: 'Love Nature', range: [0, 5] },
        { title: 'PART 2. 관계 속 감정 흐름', sub: 'Emotional Flow', range: [5, 11] },
        { title: 'PART 3. 인연과 현실 연애운', sub: 'Love Timing', range: [11, 17] },
        { title: 'PART 4. 연애 흐름 총정리', sub: 'Love Summary', range: [17, 20] }
      ]
    : ALL_PARTS;`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed yearly pdf part ranges');
