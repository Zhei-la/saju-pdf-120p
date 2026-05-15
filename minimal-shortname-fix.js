const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* shortName 없으면 추가 */
if (!s.includes('const shortName')) {
  s = s.replace(
    `const clientName = userInfo.name || '내담자';`,
    `const clientName = userInfo.name || '내담자';
      const shortName = clientName.length >= 2
        ? clientName.slice(1)
        : clientName;`
  );
}

/* 아주 최소한만 본인 → 이름 변환 */
const target = `.replace(/결론적으로,?/g, '')`;

const insert = `.replace(/본인은/g, shortName + '님은')
        .replace(/본인의/g, shortName + '님의')
        .replace(/결론적으로,?/g, '')`;

if (s.includes(target) && !s.includes(`.replace(/본인은/g, shortName + '님은')`)) {
  s = s.replace(target, insert);
}

fs.writeFileSync(file, s, 'utf8');
console.log('applied minimal shortName replacement');
