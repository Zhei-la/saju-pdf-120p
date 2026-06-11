const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/function calcTwelveGods\(pillars, options = \{\}\) \{[\s\S]*?\n\}/,
`function calcTwelveGods(pillars, options = {}) {
  const basis = options.basis || 'posteller';

  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = '-';
      return;
    }

    let baseBranch;

    if (basis === 'posteller') {
      // 포스텔러 원국 기준:
      // 생시/생일/생월은 년지 기준, 생년은 일지 기준
      baseBranch =
        key === 'year'
          ? pillars.day && pillars.day.branch
          : pillars.year && pillars.year.branch;
    } else if (basis === 'dayBranch') {
      baseBranch = pillars.day && pillars.day.branch;
    } else if (basis === 'monthBranch') {
      baseBranch = pillars.month && pillars.month.branch;
    } else {
      baseBranch = pillars.year && pillars.year.branch;
    }

    if (!baseBranch) {
      result[key] = '-';
      return;
    }

    result[key] = getTwelveGod(baseBranch.hanja, pillar.branch.hanja);
  });

  return result;
}`
);

fs.writeFileSync(file, s, 'utf8');
console.log('twelve gods set to posteller column basis');
