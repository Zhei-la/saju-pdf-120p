const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

// profileGanji 기본을 일주(dayPillar)로 변경
s = s.replace(
  "const profileGanji = yearPillar;",
  "const profileGanji = dayPillar;"
);

// profileGanji mode 추가
s = s.replace(
  "profileGanji: {",
  "profileGanji: {\n      mode: 'dayPillar',"
);

fs.writeFileSync(file, s, 'utf8');
console.log('profile ganji mode set to dayPillar');
