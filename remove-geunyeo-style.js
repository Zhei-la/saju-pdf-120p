const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* content 후처리 부분 찾기 */
const target = `.replace(/결론적으로,?/g, '')`;

const insert = `.replace(/그녀는/g, '본인은')
        .replace(/그녀의/g, '본인의')
        .replace(/그녀가/g, '본인이')
        .replace(/그녀를/g, '본인을')
        .replace(/그녀와/g, '본인과')
        .replace(/그녀에게/g, '본인에게')
        .replace(/그녀/g, '본인')
        .replace(/결론적으로,?/g, '')`;

if (s.includes(target)) {
  s = s.replace(target, insert);
}

/* SYSTEM 프롬프트에도 강하게 추가 */
if (!s.includes('소설체 표현 금지')) {
  s = s.replace(
    '중요한 작성 원칙:',
    `중요한 작성 원칙:

- 소설체 표현 금지
- "그녀", "그는", "그 사람은" 같은 3인칭 표현 금지
- 상담사가 직접 설명하는 말투로 작성
- 내담자를 설명할 때는 이름 또는 "본인" 사용
`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('removed 그녀 style');
