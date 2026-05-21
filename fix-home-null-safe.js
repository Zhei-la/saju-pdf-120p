const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// null-safe helper 추가
if (!s.includes('function setTextSafe(')) {
  s = s.replace(
    /async function showDash\(\) \{/,
`function setTextSafe(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setValueSafe(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

async function showDash() {`
  );
}

// showDash 내부 직접 할당 안전화
s = s.replace(/document\.getElementById\('([^']+)'\)\.textContent = ([^;]+);/g, "setTextSafe('$1', $2);");
s = s.replace(/document\.getElementById\('([^']+)'\)\.value = ([^;]+);/g, "setValueSafe('$1', $2);");

// classList 쓰는 건 제거하면 안 되므로 원복 보정
s = s.replace(/setTextSafe\('loginPage', ([^)]+)\)\.classList/g, "document.getElementById('loginPage').classList");
s = s.replace(/setTextSafe\('dashPage', ([^)]+)\)\.classList/g, "document.getElementById('dashPage').classList");

fs.writeFileSync(file, s, 'utf8');

console.log('made dashboard DOM updates null safe');
