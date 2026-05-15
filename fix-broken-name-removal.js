const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

// 이름을 전부 삭제하는 위험한 후처리 제거
s = s.replace(/\.replace\(\/김가영 님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영 씨\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/가영 님\/g, ''\)\s*/g, '');
s = s.replace(/\.replace\(\/가영 씨\/g, ''\)\s*/g, '');

// 깨진 조사 보정
s = s.replace(
`.replace(/\\n{3,}/g, '\\n\\n')`,
`.replace(/에게 이는/g, '에게는')
        .replace(/상대이/g, '상대가')
        .replace(/ 의 /g, ' 본인의 ')
        .replace(/ 에게는/g, ' 본인에게는')
        .replace(/ 에게 /g, ' 본인에게 ')
        .replace(/호흡를/g, '조화를')
        .replace(/흐름잡힌/g, '안정된')
        .replace(/\\n{3,}/g, '\\n\\n')`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed broken name removal');
