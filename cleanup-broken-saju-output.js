const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

//
// 1. 깨진 표현 제거
//

s = s.replace(/감정 정리가 늦어질 수 있음한/g, '감정 정리가 늦어질 수 있는');
s = s.replace(/호흡로운/g, '조화로운');

//
// 2. 깨진 한자 제거
//

s = s.replace(/\(丙平\)/g, '(병오)');
s = s.replace(/\(全 ?\)/g, '');
s = s.replace(/\(甲族\)/g, '(갑진)');
s = s.replace(/\(ZE\)/g, '(을사)');

//
// 3. 신강 퍼센트 표현 제거
//

s = s.replace(
  /신강\/신약:\s*신약\s*\(\d+%?\)/g,
  '신강/신약: 약신약 경향'
);

s = s.replace(
  /신강\/신약:\s*신강\s*\(\d+%?\)/g,
  '신강/신약: 신강 경향'
);

s = s.replace(
  /\$\{s\.strength\.label\}\s*\(\$\{s\.strength\.ratio\}%\)/g,
  '${s.strength.label}'
);

//
// 4. 원국/오행 챕터에서 연도 침투 차단
//

s = s.replace(
  /2024년|2025년|2026년|2027년|2028년|2029년|2030년|2031년|2032년|2033년/g,
  ''
);

//
// 5. 연애 과몰입 표현 약화
//

s = s.replace(/연애에서/g, '관계 흐름에서');
s = s.replace(/상대방/g, '주변 사람');
s = s.replace(/연인/g, '가까운 사람');

//
// 6. 표지 오타 수정
//

s = s.replace(/인생 종합 사주 분석세/g, '인생 종합 사주 분석서');

fs.writeFileSync(file, s, 'utf8');

console.log('cleaned broken wording and intrusive yearly expressions');
