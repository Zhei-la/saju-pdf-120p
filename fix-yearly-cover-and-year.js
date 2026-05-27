const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const inject = `
function normalizeReportHtmlByType(html) {
  const type = currentUserInfo?.reportType || '';
  const y = currentUserInfo?.year || currentUserInfo?.targetYear || new Date().getFullYear();

  if (type === 'yearly') {
    html = html
      .replace(/연\\s*애\\s*운\\s*분\\s*석\\s*서/g, '신 년 운 세 분 석 서')
      .replace(/LOVE FORTUNE REPORT/g, 'YEARLY FORTUNE REPORT')
      .replace(/2024년/g, y + '년')
      .replace(/2025년/g, y + '년');
  }

  return html;
}
`;

if (!s.includes('function normalizeReportHtmlByType')) {
  s = s.replace(/async function downloadPDF|function downloadPDF/, inject + '\n$&');
}

s = s.replace(
  /(report(?:El)?\.innerHTML\s*=\s*)html(\s*;)/g,
  `$1normalizeReportHtmlByType(html)$2`
);

s = s.replace(
  /(document\.getElementById\(['"]report['"]\)\.innerHTML\s*=\s*)html(\s*;)/g,
  `$1normalizeReportHtmlByType(html)$2`
);

fs.writeFileSync(file, s, 'utf8');
console.log('patched yearly cover title and wrong year replacement');
