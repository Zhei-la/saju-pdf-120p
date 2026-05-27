const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const marker = `pdf.save(\`${fileTitle}_\${currentUserInfo.name}.pdf\`);`;

const insert = `
if(currentUserInfo.reportType === 'free'){
  html += \`
  <div class="pdf-page" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:#fffaf2;">
    <div style="font-size:42px;margin-bottom:20px;">☯</div>

    <div style="font-size:30px;font-weight:700;color:#2c1810;margin-bottom:14px;">
      더 깊은 사주 상담이 필요하신가요?
    </div>

    <div style="font-size:15px;color:#666;line-height:1.9;margin-bottom:40px;">
      연애운 · 결혼운 · 재물운 · 평생 흐름까지<br>
      전문가급 프리미엄 사주 리포트를 받아보세요
    </div>

    <a href="https://open.kakao.com/"
      style="display:inline-block;
      padding:18px 34px;
      background:#b8860b;
      color:#fff;
      text-decoration:none;
      border-radius:12px;
      font-size:18px;
      font-weight:700;">
      프리미엄 상담 받기
    </a>

  </div>\`;
}
` + marker;

s = s.replace(marker, insert);

fs.writeFileSync(file, s, 'utf8');

console.log('added free report CTA page');
