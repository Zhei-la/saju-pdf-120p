const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

//
// 1. 생성할 때 select 값을 무조건 다시 읽기
//
s = s.replace(
  /const data = \{/,
  `selectedReportType = document.getElementById('reportMenuSelect')?.value || selectedReportType;

  const data = {`
);

//
// 2. 서버 응답 후 reportType을 selectedReportType으로 강제
//
s = s.replace(
  /currentUserInfo\.reportType = json\.reportType \|\| selectedReportType;/g,
  `currentUserInfo.reportType = selectedReportType;`
);

//
// 3. 챕터 수/시간 free 보정
//
s = s.replace(
  /const chapCount = selectedReportType === 'half' \? 20 : 40;/,
  `const chapCount = selectedReportType === 'free' ? 5 : (selectedReportType === 'half' ? 20 : 40);`
);

s = s.replace(
  /const timeEst = selectedReportType === 'half' \? '약 2~3분' : '약 3~5분';/,
  `const timeEst = selectedReportType === 'free' ? '약 1분' : (selectedReportType === 'half' ? '약 2~3분' : '약 3~5분');`
);

//
// 4. renderPreview 시작 시 free면 무조건 무료 PDF 미리보기
//
s = s.replace(
  /function renderPreview\(\) \{/,
  `function renderPreview() {
  if (currentUserInfo?.reportType === 'free') {
    const render = document.getElementById('pdfRender');
    render.innerHTML = renderFreeBasicReport();
    render.classList.remove('hidden');
    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.remove('hidden');
    return;
  }`
);

//
// 5. PDF 생성 직전에도 free면 html을 무료 PDF로 강제 덮어쓰기
//
s = s.replace(
  /render\.innerHTML = normalizeReportHtmlByType\(html\);/,
  `if (currentUserInfo?.reportType === 'free') {
      html = renderFreeBasicReport();
    }
    render.innerHTML = normalizeReportHtmlByType(html);`
);

s = s.replace(
  /render\.innerHTML = html;/,
  `if (currentUserInfo?.reportType === 'free') {
      html = renderFreeBasicReport();
    }
    render.innerHTML = html;`
);

fs.writeFileSync(file, s, 'utf8');

console.log('forced free report preview and pdf rendering');
