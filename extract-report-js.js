const fs = require('fs');

const html = fs.readFileSync('public/report.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);

if (!m) throw new Error('inline script not found');

fs.writeFileSync('check-report-inline.js', m[1], 'utf8');
console.log('created check-report-inline.js');
