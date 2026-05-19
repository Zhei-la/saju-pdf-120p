const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/\.toc-section:nth-of-type\(4\),\s*\.toc-section:nth-of-type\(7\)\s*\{[\s\S]*?\}/g, '');

fs.writeFileSync(file, s, 'utf8');

console.log('removed invalid toc nth-of-type page breaks');
