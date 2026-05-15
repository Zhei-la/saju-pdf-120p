const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* 1) 시간 모름이면 시주 숨김 */
s = s.replace(
`const partsKor = [s.yearPillar, s.monthPillar, s.dayPillar, s.hourPillar];`,
`const partsKor = [s.yearPillar, s.monthPillar, s.dayPillar, currentUserInfo.timeUnknown ? '없음' : s.hourPillar];`
);

s = s.replace(
`const partsHan = [s.yearHanja, s.monthHanja, s.dayHanja, s.hourHanja];`,
`const partsHan = [s.yearHanja, s.monthHanja, s.dayHanja, currentUserInfo.timeUnknown ? '없음' : s.hourHanja];`
);

/* 2) 기존 텍스트 카드 → 표/막대그래프 스타일로 교체 */
s = s.replace(
/감정 표현력[\s\S]*?결혼 연결 가능성&nbsp;&nbsp;63점/,
`<div style="display:grid;gap:16px;font-family:'Noto Sans KR',sans-serif;">
  ${[
    ['감정 표현력',72],
    ['연애 지속력',81],
    ['연락 · 소통운',68],
    ['재회 가능성',55],
    ['결혼 연결 가능성',63]
  ].map(([label,score]) => \`
    <div style="display:grid;grid-template-columns:150px 1fr 50px;gap:14px;align-items:center;font-size:14px;color:#1a1209;">
      <div style="font-weight:700;color:#2c1810;">\${label}</div>
      <div style="height:13px;background:#eadcc7;border:1px solid #d8c2a3;">
        <div style="height:100%;width:\${score}%;background:#b8860b;"></div>
      </div>
      <div style="text-align:right;font-weight:700;color:#b8860b;">\${score}점</div>
    </div>\`).join('')}
</div>`
);

s = s.replace(
/<div style="line-height:2\.2;font-size:15px;color:#1a1209;margin-bottom:40px;">[\s\S]*?즉흥적이고 자유를 우선하는 타입<br>\s*<\/div>/,
`<table style="width:100%;border-collapse:collapse;font-family:'Noto Sans KR',sans-serif;font-size:13px;color:#1a1209;margin-bottom:35px;">
  <tr style="background:rgba(184,134,11,0.12);">
    <th style="padding:10px;border:1px solid #d8c2a3;">구분</th>
    <th style="padding:10px;border:1px solid #d8c2a3;">연애 스타일</th>
    <th style="padding:10px;border:1px solid #d8c2a3;">점수</th>
  </tr>
  <tr>
    <td style="padding:10px;border:1px solid #d8c2a3;font-weight:700;color:#2c1810;">잘 맞음</td>
    <td style="padding:10px;border:1px solid #d8c2a3;">현실적이고 책임감 있는 타입</td>
    <td style="padding:10px;border:1px solid #d8c2a3;text-align:center;color:#b8860b;font-weight:700;">88점</td>
  </tr>
  <tr>
    <td style="padding:10px;border:1px solid #d8c2a3;font-weight:700;color:#2c1810;">잘 맞음</td>
    <td style="padding:10px;border:1px solid #d8c2a3;">감정을 안정적으로 표현하는 타입</td>
    <td style="padding:10px;border:1px solid #d8c2a3;text-align:center;color:#b8860b;font-weight:700;">84점</td>
  </tr>
  <tr>
    <td style="padding:10px;border:1px solid #d8c2a3;font-weight:700;color:#8b1a1a;">주의</td>
    <td style="padding:10px;border:1px solid #d8c2a3;">밀고 당기기를 즐기는 타입</td>
    <td style="padding:10px;border:1px solid #d8c2a3;text-align:center;color:#8b1a1a;font-weight:700;">41점</td>
  </tr>
</table>`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed unknown time hour pillar and upgraded summary tables');
