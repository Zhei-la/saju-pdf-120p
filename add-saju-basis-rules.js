const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[현실 행동 디테일 강화]`;

const add = `
[명리학 근거 유지]
- 아무리 감성적으로 작성해도 반드시 사주 원국에 근거해 해석하세요.
- 일간, 월지, 일지, 오행 균형, 십성, 배우자궁, 대운/세운 흐름 중 최소 2개 이상을 근거로 삼으세요.
- 현실 연애 장면은 사주 구조에서 파생된 행동 예시로만 작성하세요.
- 사주에 없는 성향을 임의로 만들어내지 마세요.
- 연애운, 재회운, 결혼운, 인연운은 반드시 일지/배우자궁/관성·재성/대운·세운 흐름을 기준으로 설명하세요.
- 명리학 용어는 남발하지 말고, 중요한 근거가 필요할 때만 자연스럽게 사용하세요.
- 사주 근거 없이 단순 심리테스트처럼 보이는 문장은 피하세요.
`;

if (!s.includes('[명리학 근거 유지]')) {
  s = s.replace(marker, add + '\n' + marker);
}

fs.writeFileSync(file, s, 'utf8');
console.log('added astrology basis rules');
