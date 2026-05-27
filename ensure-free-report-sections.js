const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('REPORT_SECTIONS.free')) {
  s = s.replace(
    /module\.exports = \{ generateAllChapters, regenerateChapter, SECTIONS \};/,
`REPORT_SECTIONS.free = [
  ['사주로 보는 나는 어떤 사람일까', '무료 기본사주 PDF용 핵심 성향 풀이입니다. 일간, 강한 오행, 약한 오행, 십성 구조를 바탕으로 어떤 사람인지 700자 내외로 쉽게 설명하세요.'],
  ['조심해야 할 기본 흐름', '무료 기본사주 PDF용 주의점입니다. 약한 오행, 과한 오행, 성격상 실수하기 쉬운 지점을 600자 내외로 설명하세요.'],
  ['금전운은 어떨까', '무료 기본사주 PDF용 금전운입니다. 돈이 들어오는 방식, 돈이 새는 방식, 재물 관리 팁을 600자 내외로 설명하세요.'],
  ['내 사주에 이성은 많을까', '무료 기본사주 PDF용 이성운입니다. 성별에 따라 남자운 또는 여자운을 중심으로 이성 인연과 관계 패턴을 600자 내외로 설명하세요.'],
  ['대운 십성풀이', '무료 기본사주 PDF용 대운 요약입니다. 현재 대운의 십성과 방향성을 중심으로 700자 내외로 설명하세요.']
];

module.exports = { generateAllChapters, regenerateChapter, SECTIONS };`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('ensured free report sections');
