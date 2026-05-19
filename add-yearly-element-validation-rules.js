const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[필수 작성 규칙]`;

const add = `[필수 작성 규칙]

세운을 해석할 때는 해당 연도의 천간과 지지 오행을 반드시 확인해서 설명하세요.

연도를 현재 흐름에 맞지 않게 잘못 해석하지 마세요.

예:
2024 갑진 = 목·토 흐름
2025 을사 = 목·화 흐름
2026 병오 = 강한 화 흐름
2027 정미 = 화·토 흐름
2028 무신 = 토·금 흐름
2029 기유 = 토·금 흐름
2030 경술 = 금·토 흐름
2031 신해 = 금·수 흐름
2032 임자 = 강한 수 흐름
2033 계축 = 수·토 흐름

세운이 수가 아닌데 수기운이 강해진다고 쓰지 마세요.

대운에서 수가 보완되는 경우와 세운에서 수가 들어오는 경우를 반드시 구분하세요.

예:
"대운에서는 수 기운이 보완되지만, 2026 병오년 세운은 화 기운이 강해 감정 피로와 활동량이 커질 수 있습니다"

[필수 작성 규칙]`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');

console.log('added yearly stem-branch element validation rules');
