const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* 본인 반복 완화 + 잔여 특수문자 제거 */
const target = `.replace(/결론적으로,?/g, '')`;

const insert = `.replace(/\\*\\*/g, '')
        .replace(/본인은 본인의/g, '본인의')
        .replace(/본인은 본인을/g, '스스로를')
        .replace(/본인은 상대/g, '상대')
        .replace(/본인은 연애/g, '연애')
        .replace(/본인은 관계/g, '관계')
        .replace(/본인은/g, '')
        .replace(/\\s{2,}/g, ' ')
        .replace(/결론적으로,?/g, '')`;

if (s.includes(target)) {
  s = s.replace(target, insert);
}

/* 문체 반복 억제 강화 */
if (!s.includes('같은 문장 마무리 반복 금지')) {
  s = s.replace(
    '중요한 작성 원칙:',
    `중요한 작성 원칙:

- 같은 문장 마무리 반복 금지
- "~중요합니다", "~도움이 됩니다", "~가능성이 있습니다" 반복 금지
- 설명문처럼 쓰지 말고 실제 상담처럼 자연스럽게 작성
- 같은 표현을 연속 문단에서 반복하지 마세요
`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('reduced 본인 repetition and removed markdown leftovers');
