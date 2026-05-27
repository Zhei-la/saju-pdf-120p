const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/const img1 = localStorage\.getItem\('freePdfImage1'\);[\s\S]*?return html;\s*\}/,
`for (let i = 1; i <= 10; i++) {
    const img = localStorage.getItem('freePdfImage' + i);
    if (img) {
      html += '<div class="pdf-page free-page-v2 free-img-page">' +
        '<div class="free-top">SPECIAL REVIEW PAGE ' + String(i).padStart(2, '0') + '</div>' +
        '<div class="free-title-v2">후기 및 안내</div>' +
        '<img src="' + img + '">' +
      '</div>';
    }
  }

  return html;
}`
);

fs.writeFileSync(file, s, 'utf8');
console.log('free PDF now adds only uploaded images');
