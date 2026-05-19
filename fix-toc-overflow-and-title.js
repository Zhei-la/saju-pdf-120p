const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('/* TOC overflow fix */')) {
  s = s.replace(
    '</style>',
`/* TOC overflow fix */
.pdf-page.toc-page,
.pdf-page.pdf-toc-page,
.pdf-page.pdf-toc-page-break {
  min-height: 1122px !important;
  height: auto !important;
  overflow: visible !important;
  page-break-after: always;
  break-after: page;
}

.toc-section {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
  margin-bottom: 18px;
}

.toc-section:nth-of-type(4),
.toc-section:nth-of-type(7) {
  page-break-before: always;
  break-before: page;
}

.pdf-page {
  overflow: visible !important;
}
</style>`
  );
}

s = s.replace(/인생 종합 사주 분석세/g, '인생 종합 사주 분석서');
s = s.replace(/화기운/g, '화 기운');

fs.writeFileSync(file, s, 'utf8');

console.log('fixed toc overflow and title typos');
