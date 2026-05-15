const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* 1) 그녀 치환 후처리 전부 삭제 */
s = s.replace(/\s*\.replace\(\/그녀에게는\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀는\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀의\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀가\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀를\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀와\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀에게\/g,[^\n]*\)\n/g, '\n');
s = s.replace(/\s*\.replace\(\/그녀\/g,[^\n]*\)\n/g, '\n');

/* 2) 기존 '그녀 금지'류 문구를 자연스러운 이름 사용 규칙으로 교체 */
s = s.replace(
/- 절대 "그녀"라는 표현을 사용하지 마세요\.[\s\S]*?- 이름은 꼭 필요한 곳에서만 사용하고, 한 문단 안에서 반복하지 마세요\./,
`- 소설처럼 제3자를 서술하는 문체를 쓰지 마세요.
- 내담자를 부를 때는 입력된 이름 + "님"을 사용하세요.
- 이름은 챕터 첫 문단이나 꼭 필요한 문장에서만 자연스럽게 사용하세요.
- 같은 문단 안에서 이름을 2번 이상 반복하지 마세요.
- 이후 문장은 주어를 자연스럽게 생략하거나 "본인"으로 이어가세요.
- 상대를 말할 때만 "상대"라는 표현을 사용하세요.`
);

/* 3) 혹시 남은 표현도 정리 */
s = s.replace(/여성이라도\s*"그녀"[^\\n]*\n/g, '');
s = s.replace(/"그녀",\s*"그녀는",\s*"그녀의"[^\\n]*\n/g, '');

fs.writeFileSync(file, s, 'utf8');
console.log('removed pronoun postprocess and fixed prompt rules');
