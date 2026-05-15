const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* 이름 추출 규칙 추가 */
const marker = `const clientName = userInfo.name || '내담자';`;

const insert = `const clientName = userInfo.name || '내담자';
      const shortName = clientName.replace(/^(.)(.+)$/, '$2');`;

if (!s.includes('const shortName')) {
  s = s.replace(marker, insert);
}

/* 본인 → 가영님 스타일 */
const target = `.replace(/결론적으로,?/g, '')`;

const replacement = `.replace(/본인은/g, shortName + '님은')
        .replace(/본인의/g, shortName + '님의')
        .replace(/본인에게/g, shortName + '님에게')
        .replace(/본인을/g, shortName + '님을')
        .replace(/본인과/g, shortName + '님과')
        .replace(/결론적으로,?/g, '')`;

if (s.includes(target)) {
  s = s.replace(target, replacement);
}

/* 프롬프트 규칙 수정 */
s = s.replace(
`- 내담자를 부를 때는 입력된 이름 + "님"을 사용하세요.`,
`- 첫 문단 첫 문장에서는 전체 이름 + "님" 사용 가능
- 이후에는 성을 제외한 이름 + "님"(예: 가영님) 형태를 자연스럽게 사용하세요.`
);

fs.writeFileSync(file, s, 'utf8');

console.log('applied short name style');
