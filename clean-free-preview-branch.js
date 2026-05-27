const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/function renderPreview\(\) \{[\s\S]*?document\.getElementById\('inputScreen'\)\.classList\.add\('hidden'\);/,
`function renderPreview() {
  if (currentUserInfo?.reportType === 'free') {
    const render = document.getElementById('pdfRender');
    render.innerHTML = renderFreeBasicReport();

    document.getElementById('inputScreen')?.classList.add('hidden');
    document.getElementById('previewScreen')?.classList.remove('hidden');
    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.remove('hidden');

    render.classList.remove('hidden');
    render.style.display = 'block';
    render.style.visibility = 'visible';
    render.style.minHeight = '400px';

    clearStatus('genStatus');

    setTimeout(() => {
      render.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    return;
  }

  document.getElementById('inputScreen').classList.add('hidden');`
);

fs.writeFileSync(file, s, 'utf8');

console.log('cleaned duplicated free preview branch');
