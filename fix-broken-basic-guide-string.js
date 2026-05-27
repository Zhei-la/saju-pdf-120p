const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf("  html += page('BASIC GUIDE', '만세력 이해하기',");
const end = s.indexOf("  html += page('PERSONALITY'", start);

if (start === -1 || end === -1) {
  throw new Error('BASIC GUIDE block not found');
}

const guide = `
  html += page('BASIC GUIDE', '만세력 이해하기',
    '<div class="free-card-v2 free-body-v2">' +
    '사람은 누구나 태어난 순간의 기운을 품고 살아갑니다. 어떤 사람은 강하게 밀고 나가는 힘이 있고, 어떤 사람은 조용하지만 오래 버티는 힘이 있습니다.<br><br>' +
    '태어난 연월일시 안에는 각자의 흐름과 기운이 담겨 있으며, 그 구조를 읽어보는 도구가 바로 만세력입니다.<br><br>' +
    '만세력은 단순한 점술이 아니라 나를 이해하기 위한 흐름의 지도에 가깝습니다. 인간관계, 돈, 일, 선택의 흐름을 읽고 삶의 방향을 정리하는 데 도움을 줍니다.<br><br>' +
    '운은 정해진 답이 아니라 흐름입니다. 이 리포트는 자신의 사주 구조를 쉽고 현실적으로 이해할 수 있도록 정리한 기본 안내서입니다.' +
    '</div>'
  );

`;

s = s.slice(0, start) + guide + s.slice(end);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed broken BASIC GUIDE string');
