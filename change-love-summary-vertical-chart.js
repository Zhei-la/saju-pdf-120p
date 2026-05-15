const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* 기존 연애 성향 핵심 지표 페이지 안쪽을 세로 막대그래프로 강제 교체 */
s = s.replace(
/<div style="margin-top:50px;font-family:'Noto Sans KR',sans-serif;line-height:2\.5;font-size:16px;color:#1a1209;">[\s\S]*?결혼 연결 가능성[\s\S]*?<\/div>\s*<\/div>`;/,
`<div style="margin-top:45px;font-family:'Noto Sans KR',sans-serif;">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;height:360px;border-left:2px solid #b8860b;border-bottom:2px solid #b8860b;padding:0 22px 0 22px;margin-bottom:24px;">
    ${[
      ['표현',72],
      ['지속',81],
      ['소통',68],
      ['재회',55],
      ['결혼',63]
    ].map(([label,score]) => \`
      <div style="width:88px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
        <div style="font-size:15px;color:#b8860b;font-weight:700;margin-bottom:8px;">\${score}점</div>
        <div style="width:42px;height:\${score * 3}px;background:#b8860b;border-radius:8px 8px 0 0;"></div>
        <div style="font-size:13px;color:#2c1810;font-weight:700;margin-top:10px;">\${label}</div>
      </div>\`).join('')}
  </div>

  <div style="font-size:13px;line-height:1.9;color:#7a6652;text-align:center;">
    연애 성향을 다섯 가지 기준으로 정리한 핵심 지표입니다.<br>
    점수가 높을수록 해당 영역의 기운과 활용도가 강하게 나타납니다.
  </div>
</div>
</div>\`;`
);

fs.writeFileSync(file, s, 'utf8');

console.log('changed love summary to vertical chart');
