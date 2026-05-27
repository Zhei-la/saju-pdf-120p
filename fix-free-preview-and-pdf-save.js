const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 1. downloadPDF 안의 free 조기 return 제거
s = s.replace(
/\s*\/\/ FREE_BASIC_REPORT_RENDER_BRANCH\s*if \(currentUserInfo\.reportType === 'free'\) \{\s*render\.innerHTML = renderFreeBasicReport\(\);\s*revealPdfPreview\(\);\s*return render\.innerHTML;\s*\}/g,
''
);

// 2. free 미리보기는 pdfRender를 화면 안에 보이게 강제
s = s.replace(
/if \(currentUserInfo\?\.reportType === 'free'\) \{[\s\S]*?return;\s*\}/,
`if (currentUserInfo?.reportType === 'free') {
    const render = document.getElementById('pdfRender');
    render.innerHTML = renderFreeBasicReport();

    document.getElementById('inputScreen')?.classList.add('hidden');
    document.getElementById('previewScreen')?.classList.remove('hidden');
    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.remove('hidden');

    render.classList.remove('hidden');
    render.style.position = 'static';
    render.style.left = 'auto';
    render.style.top = 'auto';
    render.style.display = 'block';
    render.style.visibility = 'visible';
    render.style.opacity = '1';
    render.style.width = '794px';
    render.style.margin = '30px auto';
    render.style.minHeight = '400px';

    clearStatus('genStatus');

    setTimeout(() => {
      render.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    return;
  }`
);

// 3. PDF 저장 직전 free는 무료 HTML로 확실히 교체
s = s.replace(
/html = normalizeReportHtmlByType\(html\);[\s\S]*?render\.innerHTML = html;/,
`html = normalizeReportHtmlByType(html);

  if (currentUserInfo?.reportType === 'free') {
    html = renderFreeBasicReport();
  }

  render.innerHTML = html;`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed free preview display and PDF save flow');
