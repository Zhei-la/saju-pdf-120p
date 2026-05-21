const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /localStorage\.getItem\('shopName'\) \|\|\s*'\$\{escapeHtml\(getBrandName\(\)\)\}'/,
  "localStorage.getItem('shopName') || '운명사주'"
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed getBrandName fallback');
