const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[필수 작성 규칙]`;

const add = `[필수 작성 규칙]

인생 종합 사주 분석서에서는 모든 챕터를 연애나 인간관계 중심으로 쓰지 마세요.

챕터 주제에 맞는 비중을 지키세요.

원국·월령·오행 파트:
타고난 구조, 성향, 체질, 행동 방식 중심

십성 파트:
재능, 돈, 일, 관계 패턴 중심

직업·재물 파트:
업종, 수입 방식, 투자, 사업, 현실 선택 중심

건강 파트:
생활 리듬, 스트레스 반응, 컨디션 관리 중심

대운·세운 파트:
시기 변화, 환경 변화, 기회와 리스크 중심

연애·결혼 파트에서만 연애, 배우자, 결혼 이야기를 깊게 다루세요.

다른 챕터에서 연애 이야기가 필요할 경우에는 전체 문단의 일부로만 짧게 언급하세요.

[필수 작성 규칙]`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');

console.log('reduced love-topic overuse in general report');
