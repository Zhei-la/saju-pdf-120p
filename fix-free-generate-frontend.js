const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// generateReport 시작에서 선택값 먼저 읽기
s = s.replace(
  /async function generateReport\(\) \{\s*const apiKey = getApiKey\(\);\s*if \(!apiKey\) \{ showStatus\('genStatus', 'OpenAI API 키를 먼저 저장해주세요\.', 'err'\); return; \}/,
`async function generateReport() {
  selectedReportType = document.getElementById('reportMenuSelect')?.value || selectedReportType;

  const apiKey = getApiKey();
  if (selectedReportType !== 'free' && !apiKey) {
    showStatus('genStatus', 'OpenAI API 키를 먼저 저장해주세요.', 'err');
    return;
  }`
);

// free 전송 시 apiKey 비워도 되게
s = s.replace(
  /apiKey,/,
  `apiKey: selectedReportType === 'free' ? '' : apiKey,`
);

fs.writeFileSync(file, s, 'utf8');
console.log('made free report skip OpenAI key on frontend');
