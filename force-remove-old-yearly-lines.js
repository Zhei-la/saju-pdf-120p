const fs = require('fs');

const file = 'public/report.html';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

lines = lines.filter(line =>
  !line.includes("range: [22, 28]") &&
  !line.includes("range: [28, 40]")
);

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('force removed old yearly range lines');
