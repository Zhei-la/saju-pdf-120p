const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('FREE_BASIC_REPORT_RENDER_BRANCH')) {
  s = s.replace(
    /const reportLabel = reportMeta\.label \|\| reportMeta\.title;/,
`const reportLabel = reportMeta.label || reportMeta.title;

  // FREE_BASIC_REPORT_RENDER_BRANCH
  if (currentUserInfo.reportType === 'free') {
    render.innerHTML = renderFreeBasicReport();
    render.classList.remove('hidden');
    return render.innerHTML;
  }`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('connected free renderer to downloadPDF');
