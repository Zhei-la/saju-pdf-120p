const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

// 시간 모름 체크박스 블록 제거
s = s.replace(
/<label class="unknown-time-row">[\s\S]*?<\/label>/,
''
);

// 혹시 inline style 버전도 제거
s = s.replace(
/<label style="display:flex;gap:8px;align-items:center;margin-top:8px;">[\s\S]*?<\/label>/,
''
);

// birthTime JS 원복
s = s.replace(
/const birthTime\s*=\s*document\.getElementById\('unknownTime'\)[\s\S]*?document\.getElementById\('birthTime'\)\.value;/,
"const birthTime=document.getElementById('birthTime').value;"
);

// unknown-time CSS 제거
s = s.replace(/\.unknown-time-row\{[\s\S]*?\.unknown-time-row input\{[\s\S]*?\}/, '');

fs.writeFileSync(file, s, 'utf8');
console.log('removed unknownTime and restored select-only birthTime');
