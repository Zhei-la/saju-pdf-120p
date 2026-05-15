const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/\.replace\(\/그녀는\/g, '본인은'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀의\/g, '본인의'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀가\/g, '본인이'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀를\/g, '본인을'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀와\/g, '본인과'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀에게\/g, '본인에게'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀\/g, '본인'\)\s*/g, '');

s = s.replace(/\.replace\(\/본인은\/g, shortName \+ '님은'\)\s*/g, '');
s = s.replace(/\.replace\(\/본인의\/g, shortName \+ '님의'\)\s*/g, '');
s = s.replace(/\.replace\(\/본인에게\/g, shortName \+ '님에게'\)\s*/g, '');
s = s.replace(/\.replace\(\/본인을\/g, shortName \+ '님을'\)\s*/g, '');
s = s.replace(/\.replace\(\/본인과\/g, shortName \+ '님과'\)\s*/g, '');

s = s.replace(/\.replace\(\/ 의 \/g, ' 본인의 '\)\s*/g, '');
s = s.replace(/\.replace\(\/ 에게는\/g, ' 본인에게는'\)\s*/g, '');
s = s.replace(/\.replace\(\/ 에게 \/g, ' 본인에게 '\)\s*/g, '');

fs.writeFileSync(file, s, 'utf8');
console.log('cleaned risky postprocess replacements');
