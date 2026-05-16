const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf('    ["올해 전체 운세 흐름",');
const end = s.indexOf('    ["올해 핵심 키워드"', start);

if (start === -1 || end === -1) {
  throw new Error('yearly first item not found');
}

const fixed = `    ["올해 전체 운세 흐름", "올해 전체 흐름을 좋은 조언이 아니라 실제 사건 흐름처럼 설명해주세요. 신중하세요, 소통이 중요합니다, 무리하지 마세요, 건강 관리가 필요합니다, 균형이 중요합니다 같은 안전한 조언형 문장을 반복하지 마세요. 각 항목마다 가까운 사람과 거리감이 생김, 예상 못한 연락, 오래 끌던 문제의 결론, 갑작스러운 지출, 말 한마디로 생기는 서운함, 선택 압박 같은 실제 사건감을 넣으세요. 좋은 말만 하지 말고 현실적인 리스크와 감정 흔들림을 포함하고, 월마다 감정 온도와 사건 분위기를 다르게 만드세요."],
`;

s = s.slice(0, start) + fixed + s.slice(end);

fs.writeFileSync(file, s, 'utf8');
console.log('force repaired yearly first item');
