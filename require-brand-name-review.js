const fs = require('fs');

const file = 'public/review.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /document\.getElementById\('pageTitle'\)\.textContent = \(d\.brandName \|\| '운명사주'\) \+ ' 후기 작성';/,
  `document.getElementById('pageTitle').textContent = d.brandName ? d.brandName + ' 후기 작성' : '브랜드 이름을 먼저 설정해주세요';`
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed default brand on review page');
