const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('const leapMonth =')) {
  const target = "  const calendar =";
  const idx = s.indexOf(target);

  if (idx === -1) {
    console.error('calendar start not found');
    process.exit(1);
  }

  const after = s.indexOf(";", idx);

  if (after === -1) {
    console.error('calendar semicolon not found');
    process.exit(1);
  }

  s =
    s.slice(0, after + 1) +
    "\n\n  const leapMonth = input.leapMonth === true || input.leapMonth === 'true';" +
    s.slice(after + 1);
}

fs.writeFileSync(file, s, 'utf8');
console.log('leapMonth force inserted');
