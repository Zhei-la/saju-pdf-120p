const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/const birthTime\s*=\s*[\s\S]*?document\.getElementById\('birthTime'\)\.value;/,
"const birthTime=document.getElementById('birthTime').value;"
);

fs.writeFileSync(file, s, 'utf8');
console.log('birthTime JS restored to select value');
