const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// body 기본 로그인 모드
s = s.replace(/<body([^>]*)>/, '<body$1 class="login-mode">');

// 로그인 전 직속 대시보드 요소 숨김
if (!s.includes('/* login mode hard hide */')) {
  s = s.replace(
    '</style>',
`/* login mode hard hide */
body.login-mode > .card,
body.login-mode > .stats,
body.login-mode > .menu-grid,
body.login-mode > .menu-item,
body.login-mode > .nav,
body.login-mode #dashPage {
  display: none !important;
}
body.login-mode #loginPage {
  display: block !important;
}
</style>`
  );
}

// showDash 시작 시 로그인 모드 해제
s = s.replace(
  /async function showDash\(\) \{/,
  `async function showDash() {
  document.body.classList.remove('login-mode');`
);

// 로그아웃 시 로그인 모드 복구
s = s.replace(
  /localStorage\.removeItem\('auth_token'\);/g,
  `localStorage.removeItem('auth_token');
  document.body.classList.add('login-mode');`
);

fs.writeFileSync(file, s, 'utf8');

console.log('hide leaked dashboard cards on login');
