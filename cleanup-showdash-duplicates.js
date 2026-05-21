const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /document\.getElementById\('dashPage'\)\.classList\.remove\('hidden'\);\s*document\.querySelectorAll\('#loginPage,#signupPage,#adminPage'\)\.forEach\(e => e\.classList\.add\('hidden'\)\);\s*document\.getElementById\('dashPage'\)\.classList\.remove\('hidden'\);/,
  "document.getElementById('dashPage').classList.remove('hidden');"
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed duplicate showDash lines');
