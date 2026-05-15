const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/\s*\/\/ === PART 요약 카드 ===[\s\S]*?\/\/ === LOVE_VISUAL_CARD_END ===\s*/g,
'\n'
);

fs.writeFileSync(file, s, 'utf8');
console.log('removed temporary love visual cards');
