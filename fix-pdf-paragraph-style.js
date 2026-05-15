const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* 1) 문장마다 줄바꿈되는 로직 제거 */
s = s.replace(
`.replace(/([.?!])\\s+/g, '$1\\n\\n')
        .replace(/\\n{3,}/g, '\\n\\n')`,
`.replace(/\\n{3,}/g, '\\n\\n')`
);

/* 2) SYSTEM 문체 지침 교체 */
s = s.replace(
`각 문단은 짧게 쓰고, 한 문단에 2~3문장을 넘기지 마세요.
마침표 뒤에는 자연스럽게 줄바꿈이 들어가도 어색하지 않도록 문장을 구성하세요.`,
`절대 한 문장마다 줄바꿈하지 마세요.
실제 책 원고처럼 3~5문장을 하나의 문단으로 자연스럽게 이어서 작성하세요.
문단 사이에만 줄바꿈을 넣고, 문장 사이에는 일반 띄어쓰기를 사용하세요.
실제 사람의 행동 패턴, 인간관계, 감정 변화, 소비 습관, 반복되는 문제를 현실적으로 묘사하세요.`
);

/* 3) 작성 지침 교체 */
s = s.replace(
`- 한 문단은 2~3문장으로 짧게 작성`,
`- 한 문장마다 줄바꿈하지 말고, 3~5문장을 하나의 자연스러운 문단으로 작성`
);

/* 4) 더 강한 문단형 지침 추가 */
const marker = `- 같은 용어 해설을 매 챕터 반복하지 말 것`;

if (s.includes(marker) && !s.includes('문장 하나마다 줄바꿈하는 시 형태의 출력 금지')) {
  s = s.replace(marker, marker + `
- 문장 하나마다 줄바꿈하는 시 형태의 출력 금지
- 예시처럼 하나의 문단 안에 여러 문장이 자연스럽게 이어져야 함
- 문단은 보통 3~5문장으로 구성
- 문단과 문단 사이만 한 줄 띄우기
- 실제 책 본문처럼 읽히게 작성
- 짧은 단문을 나열하지 말 것`);
}

fs.writeFileSync(file, s, 'utf8');
console.log('fixed paragraph style for PDF');
