const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `올해 전체 흐름을 좋은 조언이 아니라 실제 사건 흐름처럼 설명해주세요.`;

const add = `올해 전체 흐름을 좋은 조언이 아니라 실제 사건 흐름처럼 설명해주세요.
"신중하세요", "소통이 중요합니다", "무리하지 마세요", "건강 관리가 필요합니다", "균형이 중요합니다" 같은 안전한 조언형 문장을 반복하지 마세요.
각 항목마다 실제로 벌어질 법한 사건을 넣으세요. 예: 가까운 사람과 거리감이 생김, 예상 못한 연락이 옴, 오래 끌던 문제가 결론 남, 갑작스러운 지출이 생김, 말 한마디로 서운함이 길어짐, 선택을 미루던 일이 압박으로 돌아옴.
좋은 말만 하지 말고 현실적인 리스크와 감정 흔들림을 포함하세요.
월마다 감정 온도와 사건 분위기를 다르게 만드세요.`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');
console.log('strengthened yearly event-style prompt');
