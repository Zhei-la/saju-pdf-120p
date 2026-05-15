const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* =========================
   1. 브랜드명 크기 키우기
========================= */

s = s.replace(
`font-size:12px;color:#b8891a;letter-spacing:4px;margin-bottom:30px;`,
`font-size:22px;
 color:#b8891a;
 letter-spacing:8px;
 margin-bottom:40px;
 font-weight:700;
 text-transform:uppercase;`
);

/* =========================
   2. 표지 타이틀 더 고급스럽게
========================= */

s = s.replace(
`font-size:56px;`,
`font-size:68px;
 letter-spacing:12px;
 line-height:1.25;`
);

s = s.replace(
`font-size:18px;letter-spacing:6px;`,
`font-size:22px;
 letter-spacing:10px;
 font-weight:500;`
);

/* =========================
   3. 이름 영역 더 강조
========================= */

s = s.replace(
`font-size:34px;`,
`font-size:42px;
 letter-spacing:-1px;
 line-height:1.4;`
);

/* =========================
   4. 표지 하단 문구 정리
========================= */

s = s.replace(
`${reportLabel} · ${totalChapters}챕터 · ${pageLabel}`,
`${reportLabel} · 총 ${totalChapters}챕터 · ${pageLabel}`
);

/* =========================
   5. 반복되는 사주설명 줄이기
========================= */

const aiFile = 'services/aiGenerator.js';
let ai = fs.readFileSync(aiFile, 'utf8');

const oldRule = `- 위 사주 원국의 구체적인 정보(일간, 월지, 오행, 십성, 용신 등)를 반드시 언급하며 해석`;

const newRule = `- 사주 원국 설명은 필요한 경우에만 자연스럽게 언급
- 갑목, 신약, 수기운 부족 같은 표현 반복 금지
- 이미 설명한 사주 구조를 매 챕터마다 반복하지 말 것
- 실제 연애 상황과 행동 패턴 중심으로 작성
- 사람의 심리 변화와 관계 흐름 위주로 설명
- 사주 용어 남발 금지`;

ai = ai.replace(oldRule, newRule);

/* =========================
   6. AI 느낌 표현 제거 강화
========================= */

if (!ai.includes('상담사가 실제 사람에게')) {
  ai = ai.replace(
    '상담사가 직접 써준 것처럼 자연스럽고 현실적인 한국어로 작성하세요.',
    `상담사가 실제 사람에게 직접 설명하듯 작성하세요.
인터넷 사주풀이처럼 보이면 안 됩니다.
추상적인 해석보다 현실적인 상황 묘사를 우선하세요.
같은 문장 패턴 반복 금지.
매 챕터 분위기와 말투가 조금씩 달라야 합니다.`
  );
}

fs.writeFileSync(file, s, 'utf8');
fs.writeFileSync(aiFile, ai, 'utf8');

console.log('premium cover + anti repetition patch complete');
