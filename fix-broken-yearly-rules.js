const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

// 잘못 삽입된 생짜 텍스트 제거
s = s.replace(/\n\[월별 운세 생성 강화 규칙\][\s\S]*?\n\nyearly: \[/, '\n  yearly: [');

// yearly 각 항목 prompt 앞에 붙일 공통 규칙
const yearlyRule = `[월별 운세 생성 강화 규칙]
- 모든 달을 비슷한 상담문처럼 쓰지 마세요.
- 월마다 사건감과 감정 온도를 다르게 만드세요.
- 좋은 말 반복보다 실제 흐름처럼 작성하세요.
- 관계 변화, 감정 흔들림, 예상 못한 연락, 갈등, 선택 상황을 포함하세요.

`;

if (!s.includes('좋은 말 반복보다 실제 흐름처럼 작성하세요')) {
  s = s.replace(
    /(\["올해 전체 운세 흐름",\s*")/,
    `$1${yearlyRule}`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('fixed broken yearly rule insertion');
