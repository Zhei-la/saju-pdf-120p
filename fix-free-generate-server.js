const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

// apiKey 검사를 free 타입 뒤로 보냄
s = s.replace(
  /const \{ apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType \} = req\.body;\s*if \(!apiKey \|\| !apiKey\.startsWith\('sk-'\)\) return res\.status\(400\)\.json\(\{ error: '올바른 OpenAI API키를 입력해주세요' \}\);/,
`const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;
    const requestedType = reportType || 'deep';
    if (requestedType !== 'free' && (!apiKey || !apiKey.startsWith('sk-'))) {
      return res.status(400).json({ error: '올바른 OpenAI API키를 입력해주세요' });
    }`
);

// allowedReportTypes 중복 방지
s = s.replace(
  /const allowedReportTypes = \['yearly','deep','love','marriage','money','couple','full','half'\];/g,
  `const allowedReportTypes = ['yearly','deep','love','marriage','money','couple','full','half','free'];`
);

// free는 OpenAI 호출 안 하게 강제
s = s.replace(
  /const chapters = await generateAllChapters\(apiKey, userInfo, validType\);/,
`let chapters;

    if (validType === 'free') {
      chapters = [
        { title: '사주로 보는 나는 어떤 사람일까', body: '기본 성향은 사주 원국의 일간과 오행 균형을 중심으로 봅니다. 이 무료 리포트에서는 타고난 기질, 강한 기운, 약한 기운을 간단히 확인할 수 있습니다.' },
        { title: '조심해야 할 기본 흐름', body: '강한 기운은 장점이 되지만 과해질 때는 고집이나 무리한 선택으로 나타날 수 있습니다. 약한 기운은 생활 습관과 선택 방식으로 보완하는 것이 좋습니다.' },
        { title: '금전운은 어떨까', body: '금전운은 돈이 들어오는 방식과 새는 방식을 함께 봅니다. 충동적인 지출보다 계획적인 관리가 중요하며, 사람 관계로 인한 지출을 주의하는 것이 좋습니다.' },
        { title: '내 사주에 이성은 많을까', body: '이성운은 단순히 많고 적음보다 어떤 관계가 들어오고 유지되는지를 봅니다. 현실 조건과 감정 온도가 맞을 때 관계가 더 깊어질 수 있습니다.' },
        { title: '대운 십성풀이', body: '대운은 10년 단위로 바뀌는 큰 흐름입니다. 현재 대운에 따라 일, 돈, 관계, 환경 변화의 방향이 달라질 수 있습니다.' }
      ];
    } else {
      chapters = await generateAllChapters(apiKey, userInfo, validType);
    }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('made free report skip OpenAI and API key validation');
