const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

// 깨진 올해 전체 운세 흐름 항목 복구
s = s.replace(
/\["올해 전체 운세 흐름",\s*"\[월별 운세 생성 강화 규칙\][\s\S]*?올해 세운을 중심으로 전체 흐름, 기회, 주의할 흐름을 깊게 설명해주세요\."\]/,
`["올해 전체 운세 흐름", "올해 세운을 중심으로 전체 흐름, 기회, 주의할 흐름을 깊게 설명해주세요. 신년운세는 좋은 상담문이 아니라 올해 실제로 일어날 흐름처럼 작성하세요. 모든 달을 비슷한 분위기로 쓰지 말고, 관계 변화·감정 흔들림·예상 못한 연락·갈등·선택 상황을 포함하세요."]`
);

fs.writeFileSync(file, s, 'utf8');
console.log('repaired broken yearly string');
