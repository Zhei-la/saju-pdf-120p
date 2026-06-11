const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`baseBranch =
        key === 'year'
          ? pillars.day && pillars.day.branch
          : pillars.year && pillars.year.branch;`,
`baseBranch =
        (key === 'year' || key === 'month')
          ? pillars.day && pillars.day.branch
          : pillars.year && pillars.year.branch;`
);

fs.writeFileSync(file, s, 'utf8');
console.log('posteller sinsal month basis set to day branch');
