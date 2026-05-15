const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const oldText = `- 내담자를 설명할 때는 이름 또는 "본인" 사용`;

const newText = `- 내담자를 부를 때는 성을 제외한 이름 + "님" 형태를 사용하세요.
- 예: "김가영 님" 대신 "가영님"
- 주어가 반복될 경우 자연스럽게 생략하세요.
- "본인", "그녀", "그", "내담자" 표현은 사용하지 마세요.
- 이름은 꼭 필요한 문장에서만 자연스럽게 사용하세요.`;

if (s.includes(oldText)) {
  s = s.replace(oldText, newText);
} else {
  console.log('oldText not found');
}

fs.writeFileSync(file, s, 'utf8');

console.log('applied short-name narration prompt');
