const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 목차 페이지 강제 축소 방지용 CSS 추가
if (!s.includes('.pdf-toc-page-break')) {
  s = s.replace(
    '</style>',
`.pdf-toc-page-break {
  page-break-before: always;
  break-before: page;
}
.toc-section {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>`
  );
}

// 목차 렌더링 구간에서 PART 4 이후 자동 분리
s = s.replace(
/(PART 4[^]*?<\/div>)(\s*<div class="toc-section"[^]*?PART 5)/,
`$1
</div>
<div class="pdf-page pdf-toc-page-break">
  <div class="pdf-toc-title">목 차</div>
  <div class="pdf-toc-sub">CONTENTS</div>
  <div class="pdf-toc-divider"></div>
$2`
);

fs.writeFileSync(file, s, 'utf8');
console.log('added toc page break support');
