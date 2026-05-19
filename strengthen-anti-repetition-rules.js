const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[필수 작성 규칙]`;

const add = `[필수 작성 규칙]

같은 표현을 반복하지 마세요.

특히 아래 표현은 한 챕터 안에서 반복 사용하지 마세요:
- 신중해야 합니다
- 중요합니다
- 도움이 됩니다
- 조심해야 합니다
- 거리감이 생길 수 있습니다
- 감정적으로 흔들릴 수 있습니다
- 소통이 필요합니다
- 균형이 중요합니다

대신 실제 장면처럼 바꿔 쓰세요.

예:
"신중해야 합니다"
→ "결정을 바로 내리기보다 하루 정도 시간을 두고 다시 확인하는 편이 안전합니다"

"거리감이 생길 수 있습니다"
→ "답장이 짧아지거나 약속이 미뤄지면서 관계 온도가 식는 느낌을 받을 수 있습니다"

"감정적으로 흔들릴 수 있습니다"
→ "사람 문제 하나가 일상 리듬까지 흔들 정도로 오래 남을 수 있습니다"

[필수 작성 규칙]`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');

console.log('strengthened anti-repetition writing rules');
