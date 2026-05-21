const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// dashPage가 로그인 전 무조건 숨겨지도록 보정
s = s.replace(
  /<div id="dashPage"(?! class=)/,
  '<div id="dashPage" class="hidden"'
);

// 혹시 class가 있는데 hidden이 빠진 경우
s = s.replace(
  /<div id="dashPage" class="(?![^"]*hidden)([^"]*)"/,
  '<div id="dashPage" class="hidden $1"'
);

// 로그인 화면에서 dashPage 강제 숨김 CSS
if (!s.includes('/* force hide dashboard before login */')) {
  s = s.replace(
    '</style>',
`/* force hide dashboard before login */
body:not(.logged-in) #dashPage {
  display: none !important;
}
body.logged-in #loginPage {
  display: none !important;
}
</style>`
  );
}

// 로그인 성공 시 body에 logged-in 부여
s = s.replace(
  /document\.getElementById\('loginPage'\)\.classList\.add\('hidden'\);/,
  "document.body.classList.add('logged-in');\n  document.getElementById('loginPage').classList.add('hidden');"
);

// 로그아웃 시 logged-in 제거가 있으면 보정
s = s.replace(
  /localStorage\.removeItem\('auth_token'\);/g,
  "localStorage.removeItem('auth_token');\n  document.body.classList.remove('logged-in');"
);

fs.writeFileSync(file, s, 'utf8');

console.log('force hide dashboard before login');
