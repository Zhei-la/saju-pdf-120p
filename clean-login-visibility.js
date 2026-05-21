const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

//
// 1. 기존 login-mode 관련 CSS 전부 제거
//
s = s.replace(/\/\* login mode hard hide \*\/[\s\S]*?body\.login-mode #loginPage \{\s*display: block !important;\s*\}\s*/g, '');

s = s.replace(/\/\* login only strict fix \*\/[\s\S]*?body\.login-mode #loginCard \* \{\s*display: block !important;\s*\}\s*/g, '');

//
// 2. 로그인 페이지 wrapper 만들기
//
if (!s.includes('<div id="loginPage">')) {
  s = s.replace(
    /(<div class="hdr"><div class="em">☯<\/div><h1>제일라 사주 AI 플랫폼<\/h1><div class="sub">LOGIN<\/div><\/div>\s*<div id="loginCard")/,
    '<div id="loginPage">$1'
  );

  s = s.replace(
    /(<\/div>\s*<!-- dashboard start -->)/,
    '</div>$1'
  );
}

//
// 3. 로그인 전에는 loginPage만 보이게
//
s = s.replace(
  '</style>',
`/* clean login visibility */
body.login-mode .wrap > * {
  display: none !important;
}

body.login-mode #loginPage,
body.login-mode #loginPage * {
  display: block !important;
}

body.login-mode #loginCard input,
body.login-mode #loginCard button {
  display: block !important;
}
</style>`
);

//
// 4. 중복 제거
//
s = s.replace(
  /document\.body\.classList\.add\('login-mode'\);\s*document\.body\.classList\.add\('login-mode'\);/g,
  "document.body.classList.add('login-mode');"
);

s = s.replace(
  /document\.body\.classList\.remove\('login-mode'\);\s*document\.body\.classList\.remove\('login-mode'\);/g,
  "document.body.classList.remove('login-mode');"
);

//
// 5. showDash 정리
//
s = s.replace(
  /async function showDash\(\) \{[\s\S]*?document\.getElementById\('loginPage'\)\.classList\.add\('hidden'\);/,
`async function showDash() {
  document.body.classList.remove('login-mode');
  document.getElementById('loginPage').style.display = 'none';`
);

fs.writeFileSync(file, s, 'utf8');

console.log('cleaned login visibility system');
