const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('freePdfImage1')) {

s = s.replace(
`return html;
}`,
`
  const img1 = localStorage.getItem('freePdfImage1');
  const img2 = localStorage.getItem('freePdfImage2');

  if (img1) {
    html += \`
    <div class="pdf-page free-page">
      <div class="free-sub">SPECIAL PAGE</div>
      <div class="free-title">추가 안내</div>

      <img
        src="\${img1}"
        style="
          width:100%;
          height:auto;
          border-radius:18px;
          border:2px solid #d8c3a3;
        "
      >
    </div>\`;
  }

  if (img2) {
    html += \`
    <div class="pdf-page free-page">
      <div class="free-sub">SPECIAL PAGE</div>
      <div class="free-title">추가 안내</div>

      <img
        src="\${img2}"
        style="
          width:100%;
          height:auto;
          border-radius:18px;
          border:2px solid #d8c3a3;
        "
      >
    </div>\`;
  }

  return html;
}`
);

}

//
// CTA 문구 localStorage 연동
//
s = s.replace(
/무료 기본사주는 핵심만 짧게 보여드린 맛보기 리포트입니다[\s\S]*?현재 할인쿠폰이 적용됩니다/,
`\${escapeHtml(
  localStorage.getItem('freePdfPromoText') ||
  DEFAULT_FREE_PROMO
).replace(/\\n/g,'<br>')}`
);

//
// 링크 연동
//
s = s.replace(
/const link = getFreePremiumLink\(\);/,
`const link =
  localStorage.getItem('freePdfLink') ||
  getFreePremiumLink();`
);

fs.writeFileSync(file, s, 'utf8');

console.log('added free pdf images and editable promo');

