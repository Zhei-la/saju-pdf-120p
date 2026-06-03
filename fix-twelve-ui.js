const fs = require('fs');
const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('const ts = data.twelveStates')) {
  s = s.replace(
    "const hs = data.hiddenStems || {};",
    "const hs = data.hiddenStems || {};\nconst ts = data.twelveStates || {};"
  );
}

if (!s.includes("put('hUn', ts.hour")) {
  s = s.replace(
    "put('yHidden', stemListToKorean(hs.year));",
    "put('yHidden', stemListToKorean(hs.year));\n\nput('hUn', ts.hour || '-');\nput('dUn', ts.day || '-');\nput('mUn', ts.month || '-');\nput('yUn', ts.year || '-');"
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('twelve states UI fixed');
