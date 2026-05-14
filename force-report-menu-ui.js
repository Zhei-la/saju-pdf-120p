const fs = require('fs');
let html = fs.readFileSync('public/report.html', 'utf8');

html = html.replace(
/      <div class="field">\s*<label>리포트 분량<\/label>\s*<div class="toggle-group">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
`      <div class="field">
        <label>PDF 상담 메뉴</label>
        <select id="reportMenuSelect" onchange="selectReportType(this.value)" style="width:100%;padding:14px;border:1px solid var(--parch-d);background:rgba(255,255,255,0.7);font-family:inherit;font-size:15px;color:var(--ink);outline:none;">
          <option value="yearly">올해 신년운세 PDF · 50P 이상</option>
          <option value="deep" selected>인생 사주 심층분석 PDF · 120P 이상</option>
          <option value="love">연애운 PDF · 50P 이상</option>
          <option value="marriage">결혼운 PDF · 50P 이상</option>
          <option value="money">사업·직장·재물·금전운 PDF · 50P 이상</option>
          <option value="couple">연인 궁합 PDF · 50P 이상</option>
        </select>
        <div style="font-size:11px;color:var(--muted);margin-top:6px;font-family:'Noto Sans KR',sans-serif;line-height:1.7;">
          · 선택한 메뉴에 맞춰 PDF 주제와 챕터가 달라집니다.<br>
          · 표기 페이지는 최소 기준이며, 내용에 따라 초과 생성될 수 있습니다.
        </div>
      </div>
    </div>`
);

fs.writeFileSync('public/report.html', html, 'utf8');
console.log('force report menu replace done');
