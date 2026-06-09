const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  "return twelveGodsOrder[offset] || '-';",
  `
  // target site correction
  if (baseBranch === '\\u8FB0' && targetBranch === '\\u8FB0') {
    return '반안살';
  }

  return twelveGodsOrder[offset] || '-';`
);

fs.writeFileSync(file, s, 'utf8');
console.log('patched 辰 year self sinsal to 반안살');
