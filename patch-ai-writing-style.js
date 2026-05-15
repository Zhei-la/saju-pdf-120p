const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* 1) SYSTEM 프롬프트 강화 */
const addSystem = `
절대 AI가 작성한 것처럼 보이면 안 됩니다.
"AI", "자동 생성", "분석해보겠습니다", "결론적으로", "가능성이 있습니다" 같은 표현을 반복하지 마세요.
같은 문장 구조와 같은 결론을 반복하지 마세요.
각 챕터는 반드시 서로 다른 관점으로 작성해야 합니다.
"소통", "균형", "안정감", "중요합니다" 같은 추상어를 반복하지 말고 실제 상황과 행동 패턴으로 풀어주세요.
상담사가 직접 써준 것처럼 자연스럽고 현실적인 한국어로 작성하세요.
좋은 말만 하지 말고 단점, 조심할 흐름, 실제로 반복될 수 있는 문제도 함께 적어주세요.
각 문단은 짧게 쓰고, 한 문단에 2~3문장을 넘기지 마세요.
마침표 뒤에는 자연스럽게 줄바꿈이 들어가도 어색하지 않도록 문장을 구성하세요.
`;

if (!s.includes('절대 AI가 작성한 것처럼 보이면 안 됩니다.')) {
  s = s.replace(
    '이 리포트는 한 권당 정가 10만원 이상에 판매되는 프리미엄 상품입니다. 그에 걸맞는 깊이와 통찰을 보여주세요. 인터넷에 떠도는 일반론이 아닌, 이 사주만의 고유한 특징을 짚어내는 정밀한 해석이 필요합니다.',
    '이 리포트는 한 권당 정가 10만원 이상에 판매되는 프리미엄 상품입니다. 그에 걸맞는 깊이와 통찰을 보여주세요. 인터넷에 떠도는 일반론이 아닌, 이 사주만의 고유한 특징을 짚어내는 정밀한 해석이 필요합니다.\\n\\n' + addSystem
  );
}

/* 2) 작성 지침 강화 */
const oldGuide = `작성 지침:
- 위 사주 원국의 구체적인 정보(일간, 월지, 오행, 십성, 용신 등)를 반드시 언급하며 해석`;

const newGuide = `작성 지침:
- 위 사주 원국의 구체적인 정보(일간, 월지, 오행, 십성, 용신 등)를 반드시 언급하며 해석
- 이전 챕터와 같은 말 반복 금지
- 추상적인 위로보다 실제 생활 장면 중심으로 작성
- "~할 수 있습니다", "~중요합니다", "~필요합니다" 반복 금지
- 한 문단은 2~3문장으로 짧게 작성
- 각 챕터 끝에는 [핵심 요약]을 넣고 3줄 이내로 정리
- [용어 해설]은 이번 챕터에서 실제로 사용한 용어만 2~3개 설명
- 같은 용어 해설을 매 챕터 반복하지 말 것`;

if (!s.includes('이전 챕터와 같은 말 반복 금지')) {
  s = s.replace(oldGuide, newGuide);
}

/* 3) 결과 줄바꿈 자동 적용 */
const oldReturn = `return { title, content: res.choices[0].message.content };`;

const newReturn = `let content = res.choices[0].message.content || '';
      content = content
        .replace(/결론적으로,?/g, '')
        .replace(/AI/g, '')
        .replace(/자동 생성/g, '')
        .replace(/([.?!])\\s+/g, '$1\\n\\n')
        .replace(/\\n{3,}/g, '\\n\\n')
        .trim();
      return { title, content };`;

if (s.includes(oldReturn)) {
  s = s.replace(oldReturn, newReturn);
}

fs.writeFileSync(file, s, 'utf8');
console.log('aiGenerator prompt and formatting patched');
