const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* ===== SYSTEM 프롬프트 강화 ===== */

const old1 = `- 실제 연애 상황 예시 포함
- 연락, 읽씹, 썸, 질투, 거리두기, 재회, 소비습관, 직장갈등처럼 현실 장면 중심으로 작성`;

const new1 = `- 실제 연애 상황 예시 포함
- 연락, 읽씹, 썸, 질투, 거리두기, 재회, 소비습관, 직장갈등처럼 현실 장면 중심으로 작성
- 명리학 설명보다 실제 행동 묘사를 우선
- "사주를 보면", "오행상", "갑목이라서", "수 기운이 부족해서" 같은 설명 반복 금지
- 각 챕터는 실제 연애 상담 후기처럼 읽혀야 함
- 독자가 "맞아 나 이랬어"라고 느끼는 현실 묘사를 많이 포함
- 챕터마다 반드시 새로운 상황과 새로운 관계 패턴 제시
- 사주 용어는 꼭 필요할 때만 짧게 사용
- 이론 설명서처럼 쓰지 말 것
- 연애 행동 분석 리포트처럼 작성`;

s = s.replace(old1, new1);

/* ===== 작성지침 교체 ===== */

const old2 = `- 사주 원국 정보는 초반 요약에서만 충분히 설명하고, 각 챕터에서는 필요한 경우에만 짧게 언급`;

const new2 = `- 사주 원국 설명은 PART 1 초반에만 사용
- 이후 챕터에서는 행동/심리/관계 흐름 중심으로 작성
- 같은 오행 설명 반복 금지
- 갑목/수기운/신약/식신/편재 반복 금지
- 이론보다 실제 연애 상황을 우선 작성`;

s = s.replace(old2, new2);

/* ===== 후처리 강화 ===== */

const old3 = `.replace(/갑목\\\\(甲木\\\\)/g, '타고난 성장 기질')
        .replace(/갑목/g, '성장 기질')
        .replace(/신약한 사주/g, '예민하게 반응하는 흐름')
        .replace(/신약한/g, '예민한')
        .replace(/수 기운이 부족/g, '감정 정리가 늦어질 수 있음')
        .replace(/수 기운의 부족/g, '감정 정리가 늦어지는 흐름')
        .replace(/오행 분포/g, '전체 흐름')
        .replace(/사주 원국/g, '기본 흐름')`;

const new3 = `.replace(/갑목\\\\(甲木\\\\)/g, '갑목')
        .replace(/신약한 사주/g, '예민한 성향')
        .replace(/신약한/g, '예민한')
        .replace(/수 기운이 부족/g, '감정 기복이 커질 수 있음')
        .replace(/수 기운의 부족/g, '감정 기복')
        .replace(/오행 분포/g, '전체 성향')
        .replace(/사주 원국/g, '타고난 흐름')

        // 이상한 자동 치환 제거
        .replace(/성장 기질/g, '갑목')
        .replace(/흐름 잡힌/g, '안정적인')
        .replace(/호흡로운/g, '자연스러운')
        .replace(/불흐름/g, '불안정함')
        .replace(/실질적이고 실질적인/g, '현실적인')
        .replace(/감정 정리가 늦어질 수 있음/g, '감정 기복')
        .replace(/감정의 깊이가 얕/g, '감정을 표현하는 방식이 서툴')
        .replace(/예민하게 반응하는 흐름/g, '예민한 성향')`;

s = s.replace(old3, new3);

/* ===== 반복 제거 추가 ===== */

const injectPoint = `.replace(/\\\\n{3,}/g, '\\\\n\\\\n')`;

const injectCode = `

        // 챕터 시작 반복 제거
        .replace(/^김가영님의 사주를 보면[^\\\\n]*\\\\n/gm, '')
        .replace(/^김가영 님의 사주를 보면[^\\\\n]*\\\\n/gm, '')
        .replace(/^일간이 갑[^\\\\n]*\\\\n/gm, '')
        .replace(/^갑목 일간인[^\\\\n]*\\\\n/gm, '')
        .replace(/^사주에서[^\\\\n]*기운[^\\\\n]*\\\\n/gm, '')

        // 반복 단어 완화
        .replace(/중요합니다/g, '필요합니다')
        .replace(/필요합니다 필요합니다/g, '필요합니다')
        .replace(/가능성이 큽니다/g, '가능성이 있습니다')
`;

s = s.replace(injectPoint, injectCode + injectPoint);

fs.writeFileSync(file, s, 'utf8');

console.log('real consultation style upgraded');
