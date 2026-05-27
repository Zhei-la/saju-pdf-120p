const fs = require('fs');

let html = fs.readFileSync('public/report.html', 'utf8');

/* 기존 40챕터 설명 제거 */
html = html.replace(/· 120p[\s\S]*?비용 ↓\)/g, '');

/* 기존 분량 선택 UI 제거 */
html = html.replace(
`<div class="toggle-group">
          <button`,
`<div class="field">
        <label>PDF 상담 메뉴</label>

        <select id="reportMenuSelect" onchange="selectReportType(this.value)" style="width:100%;padding:14px;border:1px solid #d6c2a8;background:#fff7ed;font-size:15px;">
          <option value="yearly">올해 신년운세 PDF</option>
          <option value="deep" selected>인생 사주 심층분석 PDF</option>
          <option value="love">연애운 PDF</option>
          <option value="marriage">결혼운 PDF</option>
          <option value="money">사업·직장·재물운 PDF</option>
          <option value="couple">연인 궁합 PDF</option>
        </select>

      </div>

      <div class="toggle-group">
          <button`
);

fs.writeFileSync('public/report.html', html, 'utf8');

console.log('report.html fixed');
