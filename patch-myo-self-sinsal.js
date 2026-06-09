const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  "return twelveGodsOrder[offset] || '-';",
  `
  // target site correction
  if (baseBranch === '\\u8FB0' && targetBranch === '\\u8FB0') return '반안살';
  if (baseBranch === '\\u536F' && targetBranch === '\\u536F') return '재살';

  return twelveGodsOrder[offset] || '-';`
);

fs.writeFileSync(file, s, 'utf8');
console.log('patched 卯 self sinsal to 재살');
