const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// 1) auth-locked 강제 숨김 CSS 제거
s = s.replace(/\/\* auth locked hard hide \*\/[\s\S]*?<\/style>/, '</style>');
s = s.replace(/\/\* force hide dashboard before login \*\/[\s\S]*?<\/style>/, '</style>');
s = s.replace(/\/\* login dashboard visibility fix \*\/[\s\S]*?<\/style>/, '</style>');

// 2) body class auth-locked 제거
s = s.replace(/<body([^>]*) class="auth-locked">/, '<body$1>');
s = s.replace(/<body([^>]*) class="([^"]*)auth-locked([^"]*)">/, '<body$1 class="$2$3">');

// 3) dashPage는 기본 hidden 유지
s = s.replace(/<div id="dashPage"(?![^>]*class=)/, '<div id="dashPage" class="hidden"');
s = s.replace(/<div id="dashPage" class="(?![^"]*hidden)([^"]*)"/, '<div id="dashPage" class="hidden $1"');

// 4) 로그인 성공 후 화면 전환 확실히
s = s.replace(
  /document\.body\.classList\.remove\('auth-locked'\);\s*document\.body\.classList\.add\('logged-in'\);\s*/g,
  ''
);

s = s.replace(
  /document\.getElementById\('loginPage'\)\.classList\.add\('hidden'\);\s*document\.getElementById\('dashPage'\)\.classList\.remove\('hidden'\);/g,
  `document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashPage').classList.remove('hidden');`
);

// 5) showDash 안에 dashPage 표시 코드가 없으면 추가
s = s.replace(
  /async function showDash\(\) \{/,
  `async function showDash() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashPage').classList.remove('hidden');`
);

fs.writeFileSync(file, s, 'utf8');

console.log('restored normal login dashboard toggle');
