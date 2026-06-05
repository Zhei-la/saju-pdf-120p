const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/function getTwelveGod\(baseBranch, targetBranch\) \{[\s\S]*?\n\}/,
`function getTwelveGod(baseBranch, targetBranch) {
  const JIN = '\\u8FB0';
  const IN = '\\u5BC5';
  const MYO = '\\u536F';
  const SA = '\\u5DF3';

  if (baseBranch === JIN) {
    if (targetBranch === MYO) return '육해살';
    if (targetBranch === IN) return '망신살';
    if (targetBranch === JIN) return '반안살';
    if (targetBranch === SA) return '역마살';
  }

  return (table[baseBranch] && table[baseBranch][targetBranch]) || '-';
}`
);

fs.writeFileSync(file, s, 'utf8');
console.log('forced jin twelve gods mapping');
