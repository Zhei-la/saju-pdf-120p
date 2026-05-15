const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`- 내담자를 설명할 때는 이름 또는 "본인" 사용`,
`- 내담자를 설명할 때는 자연스럽게 이름 + 님 형태를 사용하세요.
- 주어가 반복될 경우 자연스럽게 생략하세요.
- "본인", "그녀", "그", "내담자" 표현은 사용하지 마세요.`
);

fs.writeFileSync(file, s, 'utf8');

console.log('removed bonin prompt instruction');
