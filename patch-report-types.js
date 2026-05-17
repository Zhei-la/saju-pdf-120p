const fs = require('fs');

const aiPath = 'services/aiGenerator.js';
let ai = fs.readFileSync(aiPath, 'utf8');

const reportSections = `
const DEEP_SECTIONS = [
  ['타고난 기질과 본성', '연애 중심 금지. 일간, 월령, 오행, 십성, 신강신약을 근거로 성격과 본성을 분석하세요.'],
  ['오행 구조와 균형', '목화토금수 분포, 과다/부족, 지장간, 계절성을 바탕으로 현실 성향을 분석하세요.'],
  ['십성 구조 분석', '비견, 겁재, 식신, 상관, 재성, 관성, 인성의 작용을 일간 기준으로 분석하세요.'],
  ['신강·신약과 용신', '일간 강약, 월령, 생조와 극설 구조를 바탕으로 용신과 기신을 설명하세요.'],
  ['인간관계 패턴', '연애가 아니라 사회적 관계, 협업, 갈등 방식, 신뢰 형성 방식을 분석하세요.'],
  ['직업 적성과 재능', '직업, 업무 스타일, 재능, 강점이 드러나는 환경을 분석하세요.'],
  ['재물 구조와 돈 흐름', '정재·편재, 소비, 저축, 투자, 돈을 버는 방식을 분석하세요.'],
  ['건강과 생활 리듬', '오행 불균형과 스트레스 패턴을 바탕으로 건강 주의점을 분석하세요.'],
  ['대운 흐름', '대운의 방향과 인생 변화 포인트를 분석하세요.'],
  ['세운 활용법', '올해와 가까운 해의 흐름을 원국과 연결해 분석하세요.'],
  ['인생 전환점', '변화가 커지는 시기와 준비해야 할 선택을 분석하세요.'],
  ['종합 조언', '사주 전체 구조를 바탕으로 현실적인 인생 조언을 정리하세요.']
];

const LOVE_SECTIONS = [
  ['타고난 연애 성향', '연애 성향, 감정 표현, 끌리는 방식만 분석하세요.'],
  ['좋아할 때 보이는 행동', '연애 상황에서 실제 행동 변화를 분석하세요.'],
  ['감정 표현 스타일', '말투, 연락, 거리감, 표현 방식을 분석하세요.'],
  ['연애에서 반복되는 패턴', '관계에서 반복되는 감정 습관과 주의점을 분석하세요.'],
  ['잘 맞는 연애 상대', '오행과 십성 기준으로 잘 맞는 상대 유형을 분석하세요.'],
  ['연애운 종합 조언', '연애에서 필요한 태도와 관계 조율법을 정리하세요.']
];

const MARRIAGE_SECTIONS = [
  ['타고난 결혼관', '결혼을 바라보는 방식과 안정 욕구를 분석하세요.'],
  ['배우자운', '배우자 성향과 인연의 특징을 분석하세요.'],
  ['결혼 가능 시기', '대운과 세운을 바탕으로 결혼 가능성이 커지는 시기를 분석하세요.'],
  ['결혼 전 갈등 포인트', '결혼 전 조율해야 할 현실 문제를 분석하세요.'],
  ['결혼 후 생활 흐름', '가정, 돈, 생활 방식, 책임의 흐름을 분석하세요.'],
  ['결혼 종합 조언', '결혼 유지법과 배우자 선택 기준을 정리하세요.']
];

const MONEY_SECTIONS = [
  ['타고난 재물 구조', '정재, 편재, 식상, 관성 구조를 바탕으로 재물운을 분석하세요. 연애 내용 금지.'],
  ['돈이 들어오는 방식', '수입 구조, 직업 수익, 사업 수익, 부수입 가능성을 분석하세요.'],
  ['직업운과 커리어', '직장, 이직, 승진, 조직 적응을 분석하세요.'],
  ['사업운과 독립 가능성', '사업 적성, 독립 가능성, 동업 주의점을 분석하세요.'],
  ['투자 성향과 재테크', '투자 성향, 손실 위험, 재테크 방향을 분석하세요.'],
  ['재물운 종합 조언', '돈 관리와 장기 재물 전략을 정리하세요.']
];

const COUPLE_SECTIONS = [
  ['두 사람의 기본 궁합', '두 사람의 일간, 오행, 십성 관계를 바탕으로 궁합을 분석하세요.'],
  ['감정 궁합', '감정 표현과 대화 방식의 맞물림을 분석하세요.'],
  ['현실 궁합', '돈, 생활 방식, 책임감, 결혼 현실성을 분석하세요.'],
  ['갈등 포인트', '충돌 가능성과 조율 방법을 분석하세요.'],
  ['결혼 궁합', '장기 관계와 결혼 가능성을 분석하세요.'],
  ['궁합 종합 조언', '두 사람이 오래 가기 위한 현실 조언을 정리하세요.']
];

const REPORT_SECTIONS = {
  yearly: REPORT_SECTIONS?.yearly || [],
  deep: DEEP_SECTIONS,
  full: DEEP_SECTIONS,
  half: DEEP_SECTIONS.slice(0, 8),
  love: LOVE_SECTIONS,
  marriage: MARRIAGE_SECTIONS,
  money: MONEY_SECTIONS,
  couple: COUPLE_SECTIONS
};
`;

ai = ai.replace(/const REPORT_SECTIONS = \{[\s\S]*?\n\};\s*\n\nasync function generateChapter/, reportSections + '\n\nasync function generateChapter');

ai = ai.replace(
  "const [title, prompt] = SECTIONS[index];",
  "const sections = REPORT_SECTIONS[userInfo?.reportType || 'deep'] || REPORT_SECTIONS.deep;\n  const [title, prompt] = sections[index] || SECTIONS[index];"
);

fs.writeFileSync(aiPath, ai, 'utf8');

const htmlPath = 'public/report.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const metaBlock = `
  const REPORT_META = {
    yearly: { title: '신년운세 분석서', sub: 'YEARLY FORTUNE REPORT', label: '신년운세 분석서' },
    deep: { title: '사주 심층 분석서', sub: 'DEEP SAJU REPORT', label: '사주 심층 분석서' },
    full: { title: '사주 심층 분석서', sub: 'DEEP SAJU REPORT', label: '사주 심층 분석서' },
    half: { title: '사주 분석서', sub: 'SAJU REPORT', label: '사주 분석서' },
    love: { title: '연애운 분석서', sub: 'LOVE FORTUNE REPORT', label: '연애운 분석서' },
    marriage: { title: '결혼운 분석서', sub: 'MARRIAGE FORTUNE REPORT', label: '결혼운 분석서' },
    money: { title: '사업·직장·재물·금전운 분석서', sub: 'MONEY CAREER REPORT', label: '사업·직장·재물·금전운 분석서' },
    couple: { title: '연인 궁합 분석서', sub: 'COUPLE MATCH REPORT', label: '연인 궁합 분석서' }
  };
`;

html = html.replace(/  const REPORT_META = \{[\s\S]*?\n  \};/, metaBlock);

html = html.replace(
  /<h1>\$\{currentUserInfo\.reportType === 'yearly'[\s\S]*?<\/h1>/,
  "<h1>${escapeHtml(reportMeta.title)}</h1>"
);

html = html.replace(
  /<div class="sub">\$\{currentUserInfo\.reportType === 'yearly'[\s\S]*?<\/div>/,
  '<div class="sub">${escapeHtml(reportMeta.sub)}</div>'
);

html = html.replace(
  /const reportLabel = reportMeta\.title;/,
  "const reportLabel = reportMeta.label || reportMeta.title;"
);

fs.writeFileSync(htmlPath, html, 'utf8');

console.log('patched report type separation');