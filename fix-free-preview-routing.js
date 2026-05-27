const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 생성 직전에 select 값을 강제로 selectedReportType에 반영
s = s.replace(
  /const data = \{/,
  `selectedReportType = document.getElementById('reportMenuSelect')?.value || selectedReportType;

  const data = {`
);

// 무료 PDF 생성 상태 문구 보정
s = s.replace(
  /const chapCount = selectedReportType === 'half' \? 20 : 40;/,
  `const chapCount = selectedReportType === 'free' ? 5 : (selectedReportType === 'half' ? 20 : 40);`
);

s = s.replace(
  /const timeEst = selectedReportType === 'half' \? '약 2~3분' : '약 3~5분';/,
  `const timeEst = selectedReportType === 'free' ? '약 1분' : (selectedReportType === 'half' ? '약 2~3분' : '약 3~5분');`
);

// 미리보기에서 free 타입은 무료 PDF 전용 화면으로 렌더
s = s.replace(
  /function renderPreview\(\) \{/,
  `function renderPreview() {
  if (currentUserInfo?.reportType === 'free') {
    const render = document.getElementById('pdfRender');
    render.innerHTML = renderFreeBasicReport();
    render.classList.remove('hidden');

    document.getElementById('step2')?.classList.remove('hidden');
    document.getElementById('step1')?.classList.add('hidden');
    return;
  }`
);

// PDF 다운로드에서도 free 타입은 무료 PDF 전용 렌더 유지
s = s.replace(
  /const reportMeta = REPORT_META\[currentUserInfo\.reportType\] \|\| \{ title: '사주 분석서' \};/,
  `const reportMeta = REPORT_META[currentUserInfo.reportType] || { title: '사주 분석서' };`
);

// 무료 리포트 파일명 보정
s = s.replace(
  /free: '무료사주풀이'/g,
  `free: '무료사주풀이'`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed free report preview routing');
