const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[필수 작성 규칙]`;

const add = `[필수 작성 규칙]

부족한 오행을 단순히 용신으로 단정하지 마세요.

용신은 부족한 오행 하나만으로 판단하지 않고,
월령, 조후, 신강/신약, 통근 여부, 전체 구조를 함께 고려해서 설명하세요.

예:
"수 부족 = 무조건 수 용신"
처럼 단순 연결하지 마세요.

목왕한 구조인지,
조후상 필요한 기운인지,
전체 균형에서 어떤 역할을 하는지를 함께 반영하세요.

대운과 세운을 혼동하지 마세요.

대운은 인생 전체 방향 변화,
세운은 해당 연도의 사건 흐름 중심으로 구분해서 설명하세요.

현재 연도를 임의로 대운 시작 시점처럼 설명하지 마세요.

세운 해석 시 실제 오행 흐름을 반영하세요.

예:
을사 = 목화
병오 = 강한 화
정미 = 화토

같은 실제 오행 흐름과 다르게 설명하지 마세요.

신강/신약은 퍼센트보다
중화, 약신강, 약신약 같은 흐름 중심 표현을 우선 사용하세요.

[필수 작성 규칙]`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');

console.log('added advanced saju logic rules');
