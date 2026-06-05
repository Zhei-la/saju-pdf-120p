const fs = require('fs');

// 1) 지장간 午 순서 수정: 병정기 -> 병기정
let h = fs.readFileSync('services/saju/analysis/hiddenStems.js', 'utf8');
h = h.replace("午: ['丙', '丁', '己']", "午: ['丙', '己', '丁']");
fs.writeFileSync('services/saju/analysis/hiddenStems.js', h, 'utf8');

// 2) 12신살 午일 기준 보정 추가
let s = fs.readFileSync('services/saju/analysis/twelveGods.js', 'utf8');

s = s.replace(
/function getTwelveGod\(baseBranch, targetBranch\) \{[\s\S]*?\n\}/,
`function getTwelveGod(baseBranch, targetBranch) {
  const JIN = '\\u8FB0';
  const IN = '\\u5BC5';
  const MYO = '\\u536F';
  const SA = '\\u5DF3';
  const YU = '\\u9149';
  const JA = '\\u5B50';
  const SIN = '\\u7533';
  const HAE = '\\u4EA5';
  const O = '\\u5348';
  const SUL = '\\u620C';

  const override = {
    [JIN]: {
      [MYO]: '육해살',
      [IN]: '망신살',
      [JIN]: '반안살',
      [SA]: '역마살'
    },
    [YU]: {
      [YU]: '년살',
      [JA]: '장성살',
      [SIN]: '망신살',
      [HAE]: '망신살',
      [JIN]: '천살',
      [IN]: '역마살'
    },
    [MYO]: {
      [SIN]: '망신살',
      [MYO]: '재살',
      [HAE]: '역마살',
      ['\\u4E11']: '월살'
    },
    [O]: {
      [JA]: '장성살',
      [O]: '재살',
      [JIN]: '화개살'
    },
    [SUL]: {
      [SUL]: '천살',
      [JA]: '재살',
      [MYO]: '년살'
    }
  };

  if (override[baseBranch] && override[baseBranch][targetBranch]) {
    return override[baseBranch][targetBranch];
  }

  return (table[baseBranch] && table[baseBranch][targetBranch]) || '-';
}`
);

fs.writeFileSync('services/saju/analysis/twelveGods.js', s, 'utf8');

console.log('fixed 午 hidden stems and twelve gods');
