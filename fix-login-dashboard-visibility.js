const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// 로그인 화면에서는 대시보드/카드 영역 강제 숨김
if (!s.includes('/* login dashboard visibility fix */')) {
  s = s.replace(
    '</style>',
`/* login dashboard visibility fix */
#loginPage:not(.hidden) ~ #dashPage,
#loginPage:not(.hidden) ~ .card,
#loginPage:not(.hidden) ~ .stats {
  display: none !important;
}
</style>`
  );
}

// 혹시 브랜드/API 카드가 dashPage 밖으로 빠져있으면 dashPage 안으로 넣는 대신,
// 로그인 상태 아닐 때 숨김 처리용 클래스 부여
s = s.replace(/<div class="card">\s*<div class="card-t">사주 브랜드 이름<\/div>/, '<div class="card dashboard-only"><div class="card-t">사주 브랜드 이름</div>');
s = s.replace(/<div class="card">\s*<div class="card-t">OpenAI API 키/, '<div class="card dashboard-only"><div class="card-t">OpenAI API 키');

if (!s.includes('.dashboard-only')) {
  s = s.replace(
    '</style>',
`.dashboard-only { display: block; }
#loginPage:not(.hidden) ~ .dashboard-only { display: none !important; }
</style>`
  );
} else if (!s.includes('#loginPage:not(.hidden) ~ .dashboard-only')) {
  s = s.replace(
    '</style>',
`#loginPage:not(.hidden) ~ .dashboard-only { display: none !important; }
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');

console.log('fixed dashboard cards showing on login page');
