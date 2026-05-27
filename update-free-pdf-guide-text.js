const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const newGuide = `사람은 누구나 태어난 순간의 기운을 품고 살아갑니다. 어떤 사람은 강하게 밀고 나가는 힘이 있고, 어떤 사람은 조용하지만 오래 버티는 힘이 있습니다. 또 어떤 사람은 사람을 끌어당기는 매력이 강하고, 어떤 사람은 혼자 있을 때 더 깊은 판단력을 발휘합니다.<br><br>
이 차이는 단순한 성격 차이만은 아닙니다. 태어난 연월일시 안에는 그 사람이 어떤 기운을 많이 가지고 태어났는지, 어떤 기운이 부족한지, 어떤 흐름에서 강해지고 약해지는지가 함께 담겨 있습니다. 그 구조를 읽어보는 도구가 바로 만세력입니다.<br><br>
만세력은 미래를 단정하는 점술이 아니라, 나를 이해하기 위한 지도에 가깝습니다. 내가 왜 어떤 관계에서 지치기 쉬운지, 돈을 벌 때 어떤 방식이 맞는지, 어떤 시기에 무리하면 손해가 커지는지를 살펴볼 수 있습니다.<br><br>
운은 정해진 답이 아니라 흐름입니다. 그 흐름을 알고 움직이면 피해야 할 것은 피하고, 잡아야 할 기회는 더 분명하게 잡을 수 있습니다. 이 리포트는 그 첫걸음으로, 나의 사주 구조를 쉽고 현실적으로 이해할 수 있도록 만든 기본 안내서입니다.`;

s = s.replace(
/html \+= page\('BASIC GUIDE', '만세력 이해하기',[\s\S]*?\);\s*html \+= page\('PERSONALITY'/,
`html += page('BASIC GUIDE', '만세력 이해하기',
    '<div class="free-card-v2 free-body-v2">${newGuide}</div>'
  );

  html += page('PERSONALITY'`
);

fs.writeFileSync(file, s, 'utf8');
console.log('updated free PDF guide text');
