const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(`.replace(/본인은 본인의/g, '본인의')
        .replace(/본인은 본인을/g, '스스로를')
        .replace(/본인은 상대/g, '상대')
        .replace(/본인은 연애/g, '연애')
        .replace(/본인은 관계/g, '관계')
        .replace(/본인은/g, '')
        .replace(/\\s{2,}/g, ' ')`, '');

fs.writeFileSync(file, s, 'utf8');

console.log('rolled back broken bonin cleanup');
