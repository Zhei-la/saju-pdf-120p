const fs = require('fs');

const aiPath = 'services/aiGenerator.js';
let ai = fs.readFileSync(aiPath, 'utf8');

const marriageSections = `const MARRIAGE_SECTIONS = [
  ['올해 결혼운 전체 흐름', '결혼운 리포트입니다. 연애운 확장판처럼 쓰지 말고, 올해 결혼 가능성, 안정 흐름, 변화 흐름, 결혼으로 이어질 수 있는 현실적 분위기를 대운·세운·일지·배우자궁·재성/관성 흐름 기준으로 분석하세요. 월별운세는 쓰지 마세요.'],
  ['결혼 가능성이 높은 배우자 타입', '나와 잘 맞는 배우자 성향, 끌리는 사람의 특징, 피해야 할 관계 스타일을 사주 구조 기준으로 분석하세요. 단순 이상형 설명 금지.'],
  ['결혼이 빨라지는 요소', '올해 들어오는 운, 인간관계 변화, 소개운, 직장 인연, 재회 가능성 등 결혼이 빨라질 수 있는 현실 요소를 분석하세요.'],
  ['올해 가장 강한 인연 시기', '몇 월식 월별 나열은 금지하고, 상반기/하반기 또는 특정 계절 흐름 중심으로 인연이 강해지는 상황을 설명하세요. 소개, 직장, 재회, 우연한 만남 가능성을 구분하세요.'],
  ['올해 가장 조심할 관계 흐름', '감정 기복, 애매한 관계, 썸 붕괴, 장거리, 집착, 책임 회피 등 결혼을 방해하는 관계 흐름을 분석하세요.'],

  ['현재 연애의 결혼 가능성', '현재 만나는 사람이 있을 때 결혼까지 이어질 수 있는 흐름, 오래갈 가능성, 현실 문제, 결혼 논의 가능성을 분석하세요. 특정 상대가 없으면 앞으로 만날 관계 기준으로 쓰세요.'],
  ['결혼까지 이어질 관계 패턴', '관계 발전 속도, 갈등 방식, 신뢰 형성 구조, 결혼으로 이어지는 관계의 조건을 분석하세요.'],
  ['결혼을 늦추는 요소', '성향 문제, 경제관, 가족 문제, 감정 습관, 독립성, 책임 회피 등 결혼을 늦출 수 있는 요소를 분석하세요.'],
  ['반드시 확인해야 할 상대 특징', '책임감, 생활 방식, 소비 습관, 감정 표현, 가족관, 직업 안정성 등 결혼 전 확인해야 할 상대 특징을 분석하세요.'],
  ['헤어짐·재회 가능성', '끊어진 인연의 재등장, 미련 흐름, 재회 성공 가능성, 다시 만나도 결혼으로 이어질 수 있는지 현실적으로 분석하세요.'],

  ['배우자 재물운', '배우자의 돈 관리, 경제 안정성, 소비 패턴, 결혼 후 재정 흐름을 분석하세요.'],
  ['결혼 후 생활 흐름', '결혼 후 안정형인지 변화형인지, 집·이사·지역 이동, 생활 스타일, 부부 역할 분담을 분석하세요.'],
  ['배우자 직업·사회성', '배우자의 책임감, 직업 안정성, 사회적 위치, 일과 가정의 균형을 분석하세요.'],
  ['시댁·처가 관계 흐름', '가족 간 거리감, 갈등 가능성, 도움 받는 구조, 결혼 후 가족관계 조율법을 분석하세요.'],
  ['자녀운 흐름', '자녀 인연 여부, 자녀 시기 흐름, 양육 스트레스 경향, 부모로서의 태도를 분석하세요.'],

  ['결혼운 강해지는 나이', '20대 후반, 30대 초반, 30대 후반 등 결혼운이 강해지는 나이대를 대운·세운 기준으로 분석하세요.'],
  ['결혼 성사 가능성 높은 해', '실제 결혼 성사 가능성이 높은 해와 운이 열리는 타이밍을 분석하세요. 단정하지 말고 흐름 중심으로 설명하세요.'],
  ['결혼하면 좋은 시기', '안정 흐름과 피해야 할 시기를 구분해 결혼 적기를 분석하세요.'],
  ['늦게 결혼할수록 좋은 타입인지', '조혼형인지 만혼형인지, 혼자 있을 때 강한 사주인지, 늦은 결혼이 유리한지 분석하세요.'],
  ['평생 배우자 복 총정리', '배우자 복, 정서 안정, 관계 유지력, 결혼 생활의 장기 흐름을 종합 정리하세요.']
];`;

ai = ai.replace(/const MARRIAGE_SECTIONS = \[[\s\S]*?\n\];/, marriageSections);
fs.writeFileSync(aiPath, ai, 'utf8');

const htmlPath = 'public/report.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(
  /const isHalf = currentUserInfo\.reportType === 'half' \|\| currentChapters\.length <= 20;/,
  "const isHalf = currentUserInfo.reportType === 'half';"
);

const partsByType = `  const PARTS_BY_TYPE = {
    deep: [
      { title: 'PART 1. 사주 원국 분석', sub: 'Core Saju Structure', range: [0, 4] },
      { title: 'PART 2. 오행과 십성 구조', sub: 'Elements & Ten Gods', range: [4, 8] },
      { title: 'PART 3. 인생 흐름과 대운', sub: 'Life Cycle', range: [8, 11] },
      { title: 'PART 4. 종합 조언과 방향성', sub: 'Life Guidance', range: [11, 12] }
    ],
    full: [
      { title: 'PART 1. 사주 원국 분석', sub: 'Core Saju Structure', range: [0, 4] },
      { title: 'PART 2. 오행과 십성 구조', sub: 'Elements & Ten Gods', range: [4, 8] },
      { title: 'PART 3. 인생 흐름과 대운', sub: 'Life Cycle', range: [8, 11] },
      { title: 'PART 4. 종합 조언과 방향성', sub: 'Life Guidance', range: [11, 12] }
    ],
    half: [
      { title: 'PART 1. 사주 핵심 분석', sub: 'Core Saju', range: [0, 4] },
      { title: 'PART 2. 현실 조언과 방향성', sub: 'Life Guidance', range: [4, 8] }
    ],
    love: [
      { title: 'PART 1. 타고난 연애 성향', sub: 'Love Nature', range: [0, 3] },
      { title: 'PART 2. 관계 속 감정 흐름', sub: 'Emotional Flow', range: [3, 5] },
      { title: 'PART 3. 연애운 종합 조언', sub: 'Love Summary', range: [5, 6] }
    ],
    marriage: [
      { title: 'PART 1. 결혼 흐름 총론', sub: 'Marriage Overview', range: [0, 5] },
      { title: 'PART 2. 연애에서 결혼으로', sub: 'Love to Marriage', range: [5, 10] },
      { title: 'PART 3. 현실 결혼운', sub: 'Marriage Reality', range: [10, 15] },
      { title: 'PART 4. 결혼 시기 분석', sub: 'Marriage Timing', range: [15, 20] }
    ],
    money: [
      { title: 'PART 1. 타고난 재물 구조', sub: 'Money Structure', range: [0, 2] },
      { title: 'PART 2. 직업과 커리어 흐름', sub: 'Career Flow', range: [2, 4] },
      { title: 'PART 3. 사업·투자·재테크', sub: 'Business & Investment', range: [4, 6] }
    ],
    couple: [
      { title: 'PART 1. 두 사람의 기본 궁합', sub: 'Basic Match', range: [0, 2] },
      { title: 'PART 2. 감정과 현실 궁합', sub: 'Emotion & Reality', range: [2, 4] },
      { title: 'PART 3. 결혼 가능성과 유지 전략', sub: 'Long-term Match', range: [4, 6] }
    ]
  };`;

html = html.replace(/  const PARTS_BY_TYPE = \{[\s\S]*?\n  \};/, partsByType);

const start = html.indexOf("  const PARTS = currentUserInfo.reportType === 'yearly'");
const end = html.indexOf("\n\n  const totalChapters", start);

if (start !== -1 && end !== -1) {
  const newParts = `  const PARTS = currentUserInfo.reportType === 'yearly'
    ? [
        { title: 'PART 1. 올해 전체 흐름', sub: 'Yearly Flow', range: [0, 5] },
        { title: 'PART 2. 관계와 인연 흐름', sub: 'Relationship Flow', range: [5, 10] },
        { title: 'PART 3. 재물·직업·건강운', sub: 'Money Career Health', range: [10, 15] },
        { title: 'PART 4. 선택과 주의의 흐름', sub: 'Caution & Choice', range: [15, 19] },
        { title: 'PART 5. 인생 구간과 운명', sub: 'Life Turning Point', range: [19, 24] },
        { title: 'PART 6. 월별 핵심 운세', sub: 'Monthly Summary', range: [24, 36] }
      ]
    : (PARTS_BY_TYPE[currentUserInfo.reportType] || PARTS_BY_TYPE.deep);`;

  html = html.slice(0, start) + newParts + html.slice(end);
}

fs.writeFileSync(htmlPath, html, 'utf8');

console.log('patched marriage report structure');