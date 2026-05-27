const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const replacements = [
  {
    from: /"월령과 계절 기운을 설명해주세요\."/g,
    to: `"태어난 계절과 월령 중심으로 타고난 기질, 감정 구조, 인간관계 방식, 체질 흐름을 설명해주세요. 이 항목에서는 특정 연도(2024, 2025 등), 세운, 대운 흐름을 설명하지 마세요."`
  },
  {
    from: /"사주 원국 전체 구조를 설명해주세요\."/g,
    to: `"사주 원국의 전체 구조와 타고난 흐름을 설명해주세요. 원국 파트에서는 현재 연도 운세나 세운 흐름보다 타고난 성향과 반복 패턴 중심으로 설명하세요."`
  },
  {
    from: /"오행의 균형과 흐름을 설명해주세요\."/g,
    to: `"오행의 균형과 흐름을 설명해주세요. 오행 설명에서는 특정 연도 운세보다 성향, 행동 방식, 감정 구조, 체질 흐름 중심으로 설명하세요."`
  }
];

replacements.forEach(r => {
  s = s.replace(r.from, r.to);
});

fs.writeFileSync(file, s, 'utf8');

console.log('blocked year-flow intrusion into base saju sections');
