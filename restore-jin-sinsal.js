const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  "return twelveGodsOrder[offset] || '-';",
  `
  // 포스텔러 보정: 甲辰/辰일지 케이스
  if (baseBranch === '\\u8FB0') {
    if (targetBranch === '\\u5DF3') return '역마살';
    if (targetBranch === '\\u8FB0') return '반안살';
    if (targetBranch === '\\u5BC5') return '망신살';
    if (targetBranch === '\\u536F') return '육해살';
  }

  return twelveGodsOrder[offset] || '-';`
);

fs.writeFileSync(file, s, 'utf8');
console.log('restored jin day branch posteller correction');
