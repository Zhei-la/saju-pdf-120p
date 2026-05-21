const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// body 기본 상태를 로그인 잠금 상태로 시작
s = s.replace(/<body([^>]*)>/, '<body$1 class="auth-locked">');

// 로그인 전 메뉴/대시보드 강제 숨김 CSS
if (!s.includes('/* auth locked hard hide */')) {
  s = s.replace(
    '</style>',
`/* auth locked hard hide */
body.auth-locked #dashPage,
body.auth-locked .nav,
body.auth-locked .stats,
body.auth-locked .stat,
body.auth-locked .menu-grid,
body.auth-locked .menu-item,
body.auth-locked .dashboard-only,
body.auth-locked #dashPage *,
body.auth-locked #dashPage ~ * {
  display: none !important;
}

body.auth-locked #loginPage,
body.auth-locked #loginPage * {
  display: block;
}
body.auth-locked #loginPage input,
body.auth-locked #loginPage button {
  display: block;
}
</style>`
  );
}

// 로그인 성공 시 잠금 해제
s = s.replace(
  /document\.getElementById\('loginPage'\)\.classList\.add\('hidden'\);/g,
  "document.body.classList.remove('auth-locked');\n  document.body.classList.add('logged-in');\n  document.getElementById('loginPage').classList.add('hidden');"
);

// 이미 logged-in만 넣은 코드가 있으면 auth-locked 제거 보강
s = s.replace(
  /document\.body\.classList\.add\('logged-in'\);/g,
  "document.body.classList.remove('auth-locked');\n  document.body.classList.add('logged-in');"
);

// 로그아웃 시 다시 잠금
s = s.replace(
  /document\.body\.classList\.remove\('logged-in'\);/g,
  "document.body.classList.remove('logged-in');\n  document.body.classList.add('auth-locked');"
);

fs.writeFileSync(file, s, 'utf8');

console.log('hard fixed login-only visibility');
