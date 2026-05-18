const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const oldText = `[필수 작성 규칙]`;

const newText = `[필수 작성 규칙]

사주 이론만 나열하지 말고 실제 삶과 연결해서 설명하세요.

좋은 말만 반복하지 말고 현실적인 흐름과 감정 변화를 포함하세요.

"조심하세요"
"소통이 중요합니다"
"건강 관리가 필요합니다"
같은 안전한 표현 반복 금지.

반드시 실제 상황처럼 느껴지게 작성하세요.

예:
- 가까웠던 사람과 거리감이 길어질 수 있음
- 오래 끌던 문제가 결론나는 흐름
- 감정적으로 크게 흔들리는 시기
- 현실적인 선택 압박이 강해지는 흐름
- 예상하지 못한 연락이나 제안이 들어오는 시기

모든 사람에게 적용 가능한 일반론보다
사주의 구조와 운 흐름에 따라 사람마다 다르게 작성하세요.

월별 운세는 매달 분위기와 사건 흐름이 완전히 다르게 느껴져야 합니다.

[필수 작성 규칙]`;

s = s.replace(oldText, newText);

fs.writeFileSync(file, s, 'utf8');

console.log('strengthened life saju writing rules');
