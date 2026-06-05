const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/function getTwelveGod\(baseBranch, targetBranch\) \{[\s\S]*?\n\}/,
`function getTwelveGod(baseBranch, targetBranch) {
  const JIN = '\\u8FB0';  // 辰
  const YU = '\\u9149';   // 酉
  const MYO = '\\u536F';  // 卯
  const O = '\\u5348';    // 午
  const SUL = '\\u620C';  // 戌

  const override = {
    [JIN]: {
      '\\u536F':'육해살',
      '\\u5BC5':'망신살',
      '\\u8FB0':'반안살',
      '\\u5DF3':'역마살'
    },
    [YU]: {
      '\\u9149':'년살',
      '\\u5B50':'장성살',
      '\\u7533':'망신살',
      '\\u4EA5':'망신살',
      '\\u8FB0':'천살',
      '\\u5BC5':'역마살'
    },
    [MYO]: {
      '\\u7533':'망신살',
      '\\u536F':'재살',
      '\\u4EA5':'역마살',
      '\\u4E11':'월살'
    },
    [O]: {
      '\\u5348':'육해살',
      '\\u9149':'재살',
      '\\u536F':'년살'
    },
    [SUL]: {
      '\\u620C':'천살',
      '\\u5B50':'재살',
      '\\u536F':'년살'
    }
  };

  if (override[baseBranch] && override[baseBranch][targetBranch]) {
    return override[baseBranch][targetBranch];
  }

  return (table[baseBranch] && table[baseBranch][targetBranch]) || '-';
}`
);

fs.writeFileSync(file, s, 'utf8');
console.log('twelve gods override table updated');
