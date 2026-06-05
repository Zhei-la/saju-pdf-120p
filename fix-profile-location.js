const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes("const location = String(input.location")) {
  s = s.replace(
    "const birthTime =\n    String(input.birthTime || '시간 모름').trim();",
    "const birthTime =\n    String(input.birthTime || '시간 모름').trim();\n\n  const location = String(input.location || '').trim();"
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('location variable fixed');
