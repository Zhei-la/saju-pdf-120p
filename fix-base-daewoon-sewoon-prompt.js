const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /\["대운과 세운의 흐름",\s*`현재 대운과 \$\{CURR_YEAR\}~\$\{NEXT_YEAR\}년 세운\(연운\)의\s*흐름을 대운\/연운 데이터를 근거로 1500자 이상 분석해주세요\.`\]/,
  '["대운과 세운의 흐름", `현재 대운은 10년 단위 인생 방향으로 설명하고, ${CURR_YEAR}~${NEXT_YEAR}년 세운은 해당 연도의 사건 흐름으로 분리해 1500자 이상 분석해주세요. 현재 연도를 임의로 대운 시작 시점처럼 쓰지 마세요.`]'
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed base daewoon sewoon prompt');
