const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const target = `half: [
      { title: 'PART 1. 사주 핵심 분석', sub: 'Core Saju', range: [0, 4] },
      { title: 'PART 2. 현실 조언과 방향성', sub: 'Destiny & Life Direction', range: [4, 8] }
    ],`;

const insert = `half: [
      { title: 'PART 1. 사주 핵심 분석', sub: 'Core Saju', range: [0, 4] },
      { title: 'PART 2. 현실 조언과 방향성', sub: 'Destiny & Life Direction', range: [4, 8] }
    ],

    free: [
      { title: 'PART 1. 타고난 성향', sub: 'Basic Personality', range: [0, 2] },
      { title: 'PART 2. 연애·금전 흐름', sub: 'Love & Money', range: [2, 4] },
      { title: 'PART 3. 인생 조언', sub: 'Life Advice', range: [4, 5] }
    ],`;

s = s.replace(target, insert);

fs.writeFileSync(file, s, 'utf8');

console.log('added free report parts');
