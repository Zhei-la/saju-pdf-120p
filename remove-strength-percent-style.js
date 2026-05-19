const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /\$\{s\.strength\.label\} \(\$\{s\.strength\.ratio\}%\) - \$\{s\.strength\.description\}/g,
  '${s.strength.label} - ${s.strength.description}'
);

s = s.replace(
  /"신강\/신약": "일간의 기운이 강한지\(신강\) 약한지\(신약\)\. 신강하면 독립적, 신약하면 협력이 필요합니다\."/g,
  `"신강/신약": "일간의 기운 균형 상태를 의미합니다. 중화, 약신강, 약신약 등 전체 구조와 균형 흐름으로 함께 판단합니다."`
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed percentage-style strength expressions');
