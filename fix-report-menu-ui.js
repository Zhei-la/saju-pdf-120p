const fs = require('fs');
let html = fs.readFileSync('public/report.html', 'utf8');

const oldBlock = `      <div class="field">
        <label>리포트 분량</label>
        <div class="toggle-group">
          <button type="button" class="toggle-btn active" data-rtype="full" onclick="selectReportType('full')">120p 풀버전 (40챕터)</button>
          <button type="button" class="toggle-btn" data-rtype="half" onclick="selectReportType('half')">60p 라이트 (20챕터)</button>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:6px;font-family:'Noto Sans KR',sans-serif;line-height:1.7;">
          · <b>120p 풀</b>: 본성·커리어·관계·건강·인생·12개월 운세 (약 3~5분, 비용 ↑)<br>
          · <b>60p 라이트</b>: 본성·커리어·관계 핵심 20챕터 (약 2~3분, 비용 ↓)
        </div>
      </div>`;

const newBlock = `      <div class="field">
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
      </div>`;

if (!html.includes('id="reportMenuSelect"')) {
  html = html.replace(oldBlock, newBlock);
}

html = html.replace(
`function selectReportType(t) {
  selectedReportType = t;
  document.querySelectorAll('[data-rtype]').forEach(b =>
    b.classList.toggle('active', b.dataset.rtype === t));
}`,
`function selectReportType(t) {
  selectedReportType = t;
  const sel = document.getElementById('reportMenuSelect');
  if (sel && sel.value !== t) sel.value = t;
  document.querySelectorAll('[data-rtype]').forEach(b =>
    b.classList.toggle('active', b.dataset.rtype === t));
}`);

html = html.replace(
`  const chapCount = selectedReportType === 'half' ? 20 : 40;
  const timeEst = selectedReportType === 'half' ? '약 2~3분' : '약 3~5분';
  showStatus('genStatus', \`<span class="loader"></span>\${chapCount}챕터 분석 중... \${timeEst} 소요됩니다. 잠시만 기다려주세요.\`, 'loading');`,
`  const reportMeta = {
    yearly: { label: '올해 신년운세 PDF', chapters: 20, time: '약 2~4분' },
    deep: { label: '인생 사주 심층분석 PDF', chapters: 40, time: '약 3~5분' },
    love: { label: '연애운 PDF', chapters: 19, time: '약 2~4분' },
    marriage: { label: '결혼운 PDF', chapters: 18, time: '약 2~4분' },
    money: { label: '사업·직장·재물·금전운 PDF', chapters: 18, time: '약 2~4분' },
    couple: { label: '연인 궁합 PDF', chapters: 19, time: '약 2~4분' },
    full: { label: '인생 사주 심층분석 PDF', chapters: 40, time: '약 3~5분' },
    half: { label: '올해 신년운세 PDF', chapters: 20, time: '약 2~4분' }
  };
  const meta = reportMeta[selectedReportType] || reportMeta.deep;
  showStatus('genStatus', \`<span class="loader"></span>\${meta.label} 생성 중... \${meta.chapters}개 항목 분석, \${meta.time} 소요됩니다.\`, 'loading');`);

fs.writeFileSync('public/report.html', html, 'utf8');
console.log('report UI menu fixed');
