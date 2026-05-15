const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `중요한 작성 원칙:`;

const insert = `
절대 모든 챕터를 같은 말투로 작성하지 마세요.

설명문만 길게 쓰지 말고,
실제 연애 상황과 감정 흐름을 묘사하세요.

독자가 읽으며
"맞아 나 진짜 이랬는데"
라는 느낌이 들게 작성하세요.

문장 끝을 반복하지 마세요.
특히 아래 표현 반복 금지:
- ~경향이 있습니다
- ~중요합니다
- ~가능성이 있습니다
- ~필요합니다

사주 용어는 꼭 필요할 때만 짧게 사용하세요.
정재, 편재, 식신, 수 기운 같은 용어를
모든 챕터 시작마다 반복하지 마세요.

챕터 시작부터 바로 현실 이야기로 들어가세요.

예시:
"좋아하는 사람이 생기면 먼저 다가가기보다 상대 반응부터 살피는 편입니다."
"연락이 늦어지면 괜히 혼자 의미를 해석하다 감정이 커질 수 있습니다."

이런 실제 행동 중심 문장으로 시작하세요.

설명보다 사람의 행동,
감정 변화,
연애 패턴,
반복되는 상황을 중심으로 작성하세요.
`;

if (!s.includes('절대 모든 챕터를 같은 말투로 작성하지 마세요.')) {
  s = s.replace(marker, marker + insert);
}

fs.writeFileSync(file, s, 'utf8');

console.log('human romance tone upgraded');
