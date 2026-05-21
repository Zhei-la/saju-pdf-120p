const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// PDF 기본 브랜드명 통일
s = s.replace(
  /if \(!brandName\) brandName = userName \? `\$\{userName\} 사주` : '제일라 사주';/,
  "if (!brandName) brandName = userName ? `${userName} 사주` : '운명사주';"
);

// reportType별 테마 클래스
s = s.replace(
  /<div class="pdf-page pdf-cover">/,
  `<div class="pdf-page pdf-cover report-theme-\${currentUserInfo.reportType || 'deep'}">`
);

s = s.replace(
  /<div class="pdf-page" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">/g,
  `<div class="pdf-page part-page report-theme-\${currentUserInfo.reportType || 'deep'}" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">`
);

// 컨셉별 CSS 추가
if (!s.includes('/* Report type visual themes */')) {
  s = s.replace(
    '</style>',
`/* Report type visual themes */
.report-theme-deep.pdf-cover,
.report-theme-full.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(184,134,11,0.18), transparent 28%),
    linear-gradient(135deg, #fffaf0 0%, #efe2c7 100%) !important;
}
.report-theme-yearly.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(120,150,255,0.22), transparent 30%),
    linear-gradient(135deg, #f5f7ff 0%, #dfe7ff 100%) !important;
}
.report-theme-love.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(214,120,140,0.22), transparent 30%),
    linear-gradient(135deg, #fff4f6 0%, #f4d8df 100%) !important;
}
.report-theme-money.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(80,140,100,0.20), transparent 30%),
    linear-gradient(135deg, #f4fff7 0%, #dcefe3 100%) !important;
}
.report-theme-marriage.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(184,134,11,0.24), transparent 30%),
    linear-gradient(135deg, #fff7ed 0%, #ead6ba 100%) !important;
}
.report-theme-compatibility.pdf-cover {
  background:
    radial-gradient(circle at 50% 18%, rgba(120,80,150,0.22), transparent 30%),
    linear-gradient(135deg, #faf5ff 0%, #e5d8f0 100%) !important;
}

.part-page.report-theme-yearly { background: linear-gradient(135deg, #f8faff, #e8eeff) !important; }
.part-page.report-theme-love { background: linear-gradient(135deg, #fff7f8, #f7e0e5) !important; }
.part-page.report-theme-money { background: linear-gradient(135deg, #f7fff8, #e3f1e6) !important; }
.part-page.report-theme-marriage { background: linear-gradient(135deg, #fff8ef, #ead9c2) !important; }
.part-page.report-theme-compatibility { background: linear-gradient(135deg, #fbf7ff, #e9def2) !important; }
.part-page.report-theme-deep,
.part-page.report-theme-full { background: linear-gradient(135deg, #fffaf0, #efe5cf) !important; }

.pdf-cover::before,
.part-page::before {
  content: "";
  position: absolute;
  inset: 34px;
  border: 1px solid rgba(184,134,11,0.32);
  pointer-events: none;
}

.pdf-cover,
.part-page {
  position: relative;
}
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');

console.log('fixed default brand and added report themes');
