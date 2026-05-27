const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf('function renderFreeBasicReport()');
if (start === -1) throw new Error('renderFreeBasicReport 함수를 찾지 못했습니다');

const ret = s.indexOf('return html;', start);
if (ret === -1) throw new Error('renderFreeBasicReport 안의 return html을 찾지 못했습니다');

const add = `
  const customPromoText =
    localStorage.getItem('freePdfPromoText') ||
    '인생의 흐름을 풀어주는 100장 분량의 프리미엄 종합사주\\n\\n무료 기본사주는 핵심만 짧게 보여드린 맛보기 리포트입니다\\n\\n프리미엄 종합사주는 연애운, 결혼운, 재물운, 직업운, 건강운, 대운과 세운 흐름까지 깊게 분석해드립니다\\n\\n정통 명리학 기반으로 좋은 흐름과 나쁜 흐름을 현실적으로 설명해드립니다\\n\\n좋은 말만 하지 않습니다\\n나쁜 시기는 왜 조심해야 하는지도 함께 설명해드립니다\\n\\n현재 할인쿠폰 적용이 가능합니다';

  const customLink =
    localStorage.getItem('freePdfLink') ||
    localStorage.getItem('premiumLink') ||
    localStorage.getItem('kakaoLink') ||
    localStorage.getItem('consultLink') ||
    'https://open.kakao.com/';

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">PREMIUM SAJU REPORT</div>
    <div class="free-cta">
      <div class="free-cta-title">인생의 흐름을 풀어주는<br>100장 분량의 프리미엄 종합사주</div>
      <div class="free-text">\${escapeHtml(customPromoText).replace(/\\\\n/g, '<br>')}</div>
      <a class="free-cta-btn" href="\${escapeHtml(customLink)}">할인쿠폰 받고 상담 신청하기</a>
    </div>
  </div>\`;

  const img1 = localStorage.getItem('freePdfImage1');
  const img2 = localStorage.getItem('freePdfImage2');

  if (img1) {
    html += \`
    <div class="pdf-page free-page">
      <div class="free-sub">SPECIAL PAGE 01</div>
      <div class="free-title">추가 안내</div>
      <img src="\${img1}" style="width:100%;max-height:880px;object-fit:contain;border-radius:18px;border:2px solid #d8c3a3;background:#fff;">
    </div>\`;
  }

  if (img2) {
    html += \`
    <div class="pdf-page free-page">
      <div class="free-sub">SPECIAL PAGE 02</div>
      <div class="free-title">추가 안내</div>
      <img src="\${img2}" style="width:100%;max-height:880px;object-fit:contain;border-radius:18px;border:2px solid #d8c3a3;background:#fff;">
    </div>\`;
  }

`;

s = s.slice(0, ret) + add + s.slice(ret);

fs.writeFileSync(file, s, 'utf8');

console.log('inserted editable promo and image pages into free PDF renderer');
