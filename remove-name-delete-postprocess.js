const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

// 이름을 삭제하는 모든 후처리 제거
s = s.replace(/\.replace\(\/\^김가영 님은\\s\/gm, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/\^김가영님은\\s\/gm, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/\^김가영 씨는\\s\/gm, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/\^가영 님은\\s\/gm, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/\^가영 씨는\\s\/gm, ''\)\s*/g, '');

s = s.replace(/\.replace\(\/김가영 님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영 씨\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/가영 님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/가영 씨\/g, ''\)\s*/g, '');

// 이미 깨진 문장 보정
s = s.replace(
`.replace(/에게 이는/g, '에게는')`,
`.replace(/의 연애 흐름을 보면/g, '김가영 님의 연애 흐름을 보면')
        .replace(/이는 의 감정이/g, '이는 김가영 님의 감정이')
        .replace(/의 진심/g, '김가영 님의 진심')
        .replace(/의 마음/g, '김가영 님의 마음')
        .replace(/의 감정/g, '김가영 님의 감정')
        .replace(/의 연애/g, '김가영 님의 연애')
        .replace(/에게 이는/g, '김가영 님에게는')`
);

fs.writeFileSync(file, s, 'utf8');
console.log('removed name deletion postprocess');
