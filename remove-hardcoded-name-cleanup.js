const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/\.replace\(\/의 연애 흐름을 보면\/g, '김가영 님의 연애 흐름을 보면'\)\s*/g, '');
s = s.replace(/\.replace\(\/이는 의 감정이\/g, '이는 김가영 님의 감정이'\)\s*/g, '');
s = s.replace(/\.replace\(\/의 진심\/g, '김가영 님의 진심'\)\s*/g, '');
s = s.replace(/\.replace\(\/의 마음\/g, '김가영 님의 마음'\)\s*/g, '');
s = s.replace(/\.replace\(\/의 감정\/g, '김가영 님의 감정'\)\s*/g, '');
s = s.replace(/\.replace\(\/의 연애\/g, '김가영 님의 연애'\)\s*/g, '');
s = s.replace(/\.replace\(\/에게 이는\/g, '김가영 님에게는'\)\s*/g, '');

fs.writeFileSync(file, s, 'utf8');
console.log('removed hardcoded name cleanup');
