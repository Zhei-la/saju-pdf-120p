const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `[필수 작성 규칙]`;

const add = `[필수 작성 규칙]

한자 간지를 임의로 생성하지 마세요.

갑진, 을사, 병오, 정미처럼 한글 간지만 써도 충분합니다.

한자를 병기해야 할 때는 제공된 사주 원국 데이터에 있는 한자만 사용하세요.

절대 이상한 한자나 깨진 문자로 보이는 표기를 만들지 마세요.

잘못된 예:
계해(文)
갑진(甲族)
을사(ZE)
병오(丙平)

올바른 예:
계해 대운
갑진년
을사년
병오년
정미년

[필수 작성 규칙]`;

s = s.replace(marker, add);

fs.writeFileSync(file, s, 'utf8');

console.log('added safe ganji notation rules');
