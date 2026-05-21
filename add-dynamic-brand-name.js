const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const inject = `
function getBrandName() {
  return (
    currentUserInfo?.brandName ||
    currentUserInfo?.shopName ||
    currentUserInfo?.storeName ||
    currentUserInfo?.companyName ||
    localStorage.getItem('brandName') ||
    localStorage.getItem('shopName') ||
    '운명사주'
  );
}
`;

if (!s.includes('function getBrandName()')) {
  s = s.replace(/function escapeHtml/, inject + '\nfunction escapeHtml');
}

s = s.replace(/운명사주/g, '${escapeHtml(getBrandName())}');
s = s.replace(/○○사주 후기 작성/g, '${escapeHtml(getBrandName())} 후기 작성');

fs.writeFileSync(file, s, 'utf8');
console.log('added dynamic brand name');
