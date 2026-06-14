const fs = require('fs');

const file = 'services/saju/index.js';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

lines = lines.map(line => {
  if (line.includes("return { hour: 0, minute: 0 };")) {
    return "  if (text.includes('?먯떆') || text.includes('23:30-01:30')) return { hour: 1, minute: 0 };";
  }
  return line;
});

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('zi hour line force replaced');
