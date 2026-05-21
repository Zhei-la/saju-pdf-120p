const fs = require('fs');

const file = 'public/review.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /if \(d\.brandName\) document\.getElementById\('pageTitle'\)\.textContent = d\.brandName \+ ' 후기 작성';/,
  `document.getElementById('pageTitle').textContent = (d.brandName || '운명사주') + ' 후기 작성';`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed review default brand title');
