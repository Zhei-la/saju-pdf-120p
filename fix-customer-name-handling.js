const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

// 남은 김가영 하드코딩 제거
s = s.replace(/\.replace\(\/그녀에게는\/g, '김가영 님에게는'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀는\/g, '김가영 님은'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀의\/g, '김가영 님의'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀가\/g, '김가영 님이'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀를\/g, '김가영 님을'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀와\/g, '김가영 님과'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀에게\/g, '김가영 님에게'\)\s*/g, '');
s = s.replace(/\.replace\(\/그녀\/g, '김가영 님'\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영 님은 김가영 님은\/g, '김가영 님은'\)\s*/g, '');
s = s.replace(/\.replace\(\/김가영 씨는 김가영 씨는\/g, '김가영 씨는'\)\s*/g, '');

// 프롬프트에 내담자 이름 사용 규칙 추가
const marker = `- 이름 반복 금지`;
const insert = `- 내담자 이름은 입력된 이름을 사용하세요. 절대 특정 이름을 고정해서 쓰지 마세요.
- 내담자 이름은 챕터 첫 문단이나 꼭 필요한 곳에서만 1회 정도 사용하세요.
- 이후 문장에서는 이름을 반복하지 말고 자연스럽게 주어를 생략하세요.
- 여성이라도 "그녀"라고 쓰지 말고, 필요하면 "내담자", "본인", 또는 입력된 이름을 사용하세요.`;

if (!s.includes('내담자 이름은 입력된 이름을 사용하세요')) {
  s = s.replace(marker, insert + '\n' + marker);
}

fs.writeFileSync(file, s, 'utf8');
console.log('fixed customer name handling');
