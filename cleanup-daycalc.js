const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

// 잘못 들어간 dayCalcDate 블록 제거
s = s.replace(
/const dayCalcDate\s*=[\s\S]*?\{ year: solarYear, month: solarMonth, day: solarDay \};\s*/g,
''
);

// 혹시 남은 solarYear/solarMonth/solarDay 참조를 제거 확인용으로 표시
fs.writeFileSync(file, s, 'utf8');

console.log('removed old dayCalcDate block');
