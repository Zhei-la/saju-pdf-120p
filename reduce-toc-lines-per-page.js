const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /const maxTocLines = currentUserInfo\.reportType === 'yearly' \? 28 : 34;/,
  "const maxTocLines = currentUserInfo.reportType === 'yearly' ? 22 : 20;"
);

s = s.replace(
  /const partLineCount = partItems\.length \+ 2;/,
  "const partLineCount = partItems.length + 4;"
);

fs.writeFileSync(file, s, 'utf8');

console.log('reduced toc lines per page');
