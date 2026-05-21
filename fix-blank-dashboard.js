const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

//
// showDash 내부에서 dashPage 숨기는 코드 제거
//
s = s.replace(
  /document\.querySelectorAll\('#loginPage,#signupPage,#dashPage,#adminPage'\)\.forEach\(e => e\.classList\.add\('hidden'\)\);/g,
  "document.querySelectorAll('#loginPage,#signupPage,#adminPage').forEach(e => e.classList.add('hidden'));"
);

//
// showDash 깔끔 정리
//
s = s.replace(
  /async function showDash\(\) \{[\s\S]*?document\.getElementById\('dashPage'\)\.classList\.remove\('hidden'\);/,
`async function showDash() {
  document.body.classList.remove('login-mode');

  document.querySelectorAll('#loginPage,#signupPage,#adminPage')
    .forEach(e => e.classList.add('hidden'));

  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashPage').classList.remove('hidden');`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed blank dashboard after login');
