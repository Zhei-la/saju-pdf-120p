const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// body에 login-mode 중복 없이 부여
s = s.replace(/<body([^>]*)>/, (m, attrs) => {
  if (m.includes('login-mode')) return m;
  if (m.includes('class="')) return m.replace(/class="([^"]*)"/, 'class="login-mode $1"');
  return `<body${attrs} class="login-mode">`;
});

// 로그인 박스 첫 card에 id 부여
if (!s.includes('id="loginCard"')) {
  const idx = s.indexOf('<div id="loginPage">');
  if (idx !== -1) {
    const before = s.slice(0, idx);
    let after = s.slice(idx);
    after = after.replace('<div class="card"', '<div id="loginCard" class="card"');
    s = before + after;
  }
}

// 로그인 전에는 loginCard만 보이게 강제
if (!s.includes('/* login only strict fix */')) {
  s = s.replace(
    '</style>',
`/* login only strict fix */
body.login-mode .card,
body.login-mode .stats,
body.login-mode .stat,
body.login-mode .menu-grid,
body.login-mode .menu-item,
body.login-mode .nav,
body.login-mode #dashPage {
  display: none !important;
}

body.login-mode #loginPage,
body.login-mode #loginPage .hdr,
body.login-mode #loginCard,
body.login-mode #loginCard * {
  display: block !important;
}
</style>`
  );
}

// 로그인 성공 시 login-mode 제거
s = s.replace(
  /async function showDash\(\) \{/,
  `async function showDash() {
  document.body.classList.remove('login-mode');`
);

// 로그아웃 시 login-mode 복구
s = s.replace(
  /localStorage\.removeItem\('auth_token'\);/g,
  `localStorage.removeItem('auth_token');
  document.body.classList.add('login-mode');`
);

fs.writeFileSync(file, s, 'utf8');

console.log('strictly showed only login card before auth');
