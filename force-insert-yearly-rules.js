const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const insertText = `
[월별 운세 생성 강화 규칙]
- 모든 달을 비슷한 상담문처럼 쓰지 마세요.
- 월마다 사건감과 감정 온도를 다르게 만드세요.
- 좋은 말 반복보다 실제 흐름처럼 작성하세요.
- 관계 변화, 감정 흔들림, 예상 못한 연락, 갈등, 선택 상황을 포함하세요.
`;

s = s.replace(
  'yearly: [',
  insertText + '\n\nyearly: ['
);

fs.writeFileSync(file, s, 'utf8');

console.log('inserted yearly rules correctly');
