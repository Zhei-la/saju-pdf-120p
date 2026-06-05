const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  `const calendar = String(input.calendar || '양력').trim();`,
  `const calendar = String(input.calendar || '양력').trim();
  const leapMonth = input.leapMonth === true || input.leapMonth === 'true';`
);

s = s.replace(
  /Lunar\.fromYmd\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
  `Lunar.fromYmd($1, $2, $3, leapMonth)`
);

s = s.replace(
  /leapMonth: false/g,
  `leapMonth`
);

fs.writeFileSync(file, s, 'utf8');
console.log('index.js leapMonth connected');
