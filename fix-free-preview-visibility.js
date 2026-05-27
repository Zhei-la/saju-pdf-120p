const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('function revealPdfPreview()')) {
  s = s.replace(
    /function renderPreview\(\) \{/,
`function revealPdfPreview() {
  const render = document.getElementById('pdfRender');

  document.getElementById('step1')?.classList.add('hidden');
  document.getElementById('step2')?.classList.remove('hidden');

  if (render) {
    render.classList.remove('hidden');
    render.style.display = 'block';

    let p = render.parentElement;
    while (p && p !== document.body) {
      p.classList?.remove('hidden');
      if (p.style && p.style.display === 'none') p.style.display = 'block';
      p = p.parentElement;
    }

    setTimeout(() => {
      render.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

function renderPreview() {`
  );
}

s = s.replace(
  /render\.innerHTML = renderFreeBasicReport\(\);\s*render\.classList\.remove\('hidden'\);\s*document\.getElementById\('step1'\)\?\.classList\.add\('hidden'\);\s*document\.getElementById\('step2'\)\?\.classList\.remove\('hidden'\);\s*return;/g,
`render.innerHTML = renderFreeBasicReport();
    revealPdfPreview();
    return;`
);

s = s.replace(
  /render\.innerHTML = renderFreeBasicReport\(\);\s*render\.classList\.remove\('hidden'\);\s*return render\.innerHTML;/g,
`render.innerHTML = renderFreeBasicReport();
    revealPdfPreview();
    return render.innerHTML;`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed free PDF preview visibility');
