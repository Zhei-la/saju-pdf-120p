const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// radial-gradient 제거
s = s.replace(/radial-gradient\([^)]+\),\s*/g, '');

// before overlay 제거
s = s.replace(
/\.pdf-cover::before,[\s\S]*?pointer-events: none;\s*\}/g,
''
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed heavy pdf gradients and overlays');
