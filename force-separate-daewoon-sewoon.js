const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /  \['대운 총론', '.*?'\],/,
  "  ['대운 총론', '대운은 10년 단위 인생 흐름으로 설명하세요. 현재 연도를 임의로 대운 시작 시점처럼 쓰지 말고, 실제 대운 시작 나이와 현재 대운의 방향성을 구분해 1800자 이상 분석하세요. 세운과 섞어 쓰지 마세요.'],"
);

s = s.replace(
  /  \['세운 활용법', '.*?'\],/,
  "  ['세운 활용법', '세운은 해당 연도에 들어오는 사건과 변화 흐름으로 설명하세요. 대운과 혼동하지 말고, 해당 연도의 천간·지지 오행을 실제 흐름에 맞게 반영해 1500자 이상 분석하세요.'],"
);

fs.writeFileSync(file, s, 'utf8');

console.log('force separated daewoon and sewoon prompts');
