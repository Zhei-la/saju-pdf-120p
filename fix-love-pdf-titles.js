const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* 연애운 PDF에 남아있는 잘못된 PART 제목 교체 */
s = s.replace(/본성과 성격/g, '타고난 연애 성향');
s = s.replace(/Nature & Personality/g, 'Love Nature');

s = s.replace(/커리어와 재물/g, '관계 속 감정 흐름');
s = s.replace(/Career & Wealth/g, 'Emotional Flow');

s = s.replace(/인간관계와 인연/g, '인연과 현실 연애운');
s = s.replace(/Relationships/g, 'Love Timing');

s = s.replace(/건강의 시작/g, '연애 흐름 총정리');
s = s.replace(/Health Basics/g, 'Love Summary');

/* 표지 제목도 연애운 PDF용으로 교체 */
s = s.replace(/<h1>사주팔자<\/h1>/g, '<h1>연애운 분석서</h1>');
s = s.replace(/SAJU PALGWAE REPORT/g, 'LOVE FORTUNE REPORT');

/* 표지 하단 문구 정리 */
s = s.replace(/20챕터 · 약 60페이지/g, '연애운 집중 분석 · 50페이지 이상');

fs.writeFileSync(file, s, 'utf8');
console.log('love PDF titles fixed');
