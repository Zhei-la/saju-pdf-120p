const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* =========================
   1. SYSTEM 프롬프트 강화
========================= */

const oldSystem = `- 연애 행동 분석 리포트처럼 작성`;

const newSystem = `- 연애 행동 분석 리포트처럼 작성
- 이름 반복 금지
- 같은 문단 안에서 이름을 두 번 이상 쓰지 말 것
- 챕터 시작 제외하고 이름 사용 최소화
- "김가영 님은", "김가영 씨는" 반복 금지
- 주어 없이 자연스럽게 이어지는 한국어 문장 사용
- 설명체보다 실제 상담사가 말해주듯 작성
- "경향이 있습니다", "가능성이 있습니다" 반복 금지
- 실제 사람들이 겪는 연애 상황처럼 묘사
- 같은 조언 반복 금지
- 모든 챕터가 서로 다른 분위기로 느껴져야 함`;

s = s.replace(oldSystem, newSystem);

/* =========================
   2. 후처리 강력 보정
========================= */

const anchor = `.replace(/\\n{3,}/g, '\\n\\n')`;

const inject = `

        // 이름 반복 제거
        .replace(/김가영 님은 김가영 님은/g, '김가영 님은')
        .replace(/김가영 씨는 김가영 씨는/g, '김가영 씨는')

        // 문단 시작 이름 제거
        .replace(/^김가영 님은\\s/gm, '')
        .replace(/^김가영님은\\s/gm, '')
        .replace(/^김가영 씨는\\s/gm, '')
        .replace(/^가영 님은\\s/gm, '')
        .replace(/^가영 씨는\\s/gm, '')

        // 이름 과다 반복 축소
        .replace(/김가영 님/g, '')
        .replace(/김가영님/g, '')
        .replace(/김가영 씨/g, '')
        .replace(/가영 님/g, '')
        .replace(/가영 씨/g, '')

        // 어색한 표현 제거
        .replace(/성장 기질/g, '갑목')
        .replace(/흐름 있는/g, '안정적인')
        .replace(/흐름잡힌/g, '안정된')
        .replace(/호흡를/g, '조화를')
        .replace(/호흡로운/g, '자연스러운')
        .replace(/불흐름/g, '불안정함')
        .replace(/실질적이고 실질적인/g, '현실적인')
        .replace(/감정의 깊이/g, '감정선')
        .replace(/감정적으로 편안함/g, '심리적 안정감')

        // AI 말투 제거
        .replace(/경향이 있습니다/g, '편입니다')
        .replace(/가능성이 있습니다/g, '수도 있습니다')
        .replace(/필요합니다/g, '중요합니다')
        .replace(/중요합니다 중요합니다/g, '중요합니다')

        // 반복 제거
        .replace(/상대방/gg, '상대')
`;

s = s.replace(anchor, inject + '\n' + anchor);

/* =========================
   3. 챕터 시작 반복 제거
========================= */

const oldGuide = `- 이론보다 실제 연애 상황을 우선 작성`;

const newGuide = `- 이론보다 실제 연애 상황을 우선 작성
- 챕터 시작마다 사주 설명 반복 금지
- 이미 설명한 성향 반복 금지
- 각 챕터는 새로운 이야기처럼 구성
- "사주를 보면", "일간이", "오행상" 같은 시작 금지`;

s = s.replace(oldGuide, newGuide);

fs.writeFileSync(file, s, 'utf8');

console.log('removed repetitive naming and ai tone');
