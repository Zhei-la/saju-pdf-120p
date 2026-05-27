const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('function renderFreeBasicReport()')) {
  const fn = `
function renderFreeBasicReport() {
  const s = currentUserInfo.saju;
  const name = currentUserInfo.name || '';
  const gender = currentUserInfo.gender || '';
  const link =
    localStorage.getItem('freePdfLink') ||
    localStorage.getItem('premiumLink') ||
    localStorage.getItem('kakaoLink') ||
    'https://open.kakao.com/';

  const promoText =
    localStorage.getItem('freePdfPromoText') ||
\`인생의 흐름을 풀어주는 100장 분량의 프리미엄 종합사주

무료 기본사주는 핵심만 짧게 보여드린 맛보기 리포트입니다.

프리미엄 종합사주는 연애운, 결혼운, 재물운, 직업운, 건강운, 대운과 세운 흐름까지 깊게 분석해드립니다.

정통 명리학 기반으로 좋은 흐름과 나쁜 흐름을 현실적으로 설명해드립니다.

좋은 말만 하지 않습니다.
나쁜 시기는 왜 조심해야 하는지도 함께 설명해드립니다.

이 글을 보고 신청하시면 할인쿠폰이 적용됩니다.\`;

  const parts = (s.fullKorean || '').trim().split(/\\s+/);
  const chapter = i => escapeHtml(String(currentChapters[i]?.body || currentChapters[i]?.content || '').replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').trim().slice(0, 850));

  let html = '';

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">BASIC SAJU CHART</div>
    <div class="free-title">\${escapeHtml(name)}님의 만세력</div>
    <div class="free-box free-text">
      \${escapeHtml(name)} \${escapeHtml(gender)}<br>
      양력 \${escapeHtml(s.solarDate || '')}<br>
      음력 \${escapeHtml(s.lunarDate || '')}<br>
      사주 \${escapeHtml(s.fullKorean || '')}<br>
      일간 \${escapeHtml(s.dayMaster?.korean || '')} · \${escapeHtml(s.dayMaster?.element || '')}
    </div>
    \${buildSajuTable(s)}
  </div>\`;

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">FIVE ELEMENTS & TEN GODS</div>
    <div class="free-title">오행과 십성 분석</div>
    <div class="free-box free-text">
      목 \${s.elements?.목 || 0} · 화 \${s.elements?.화 || 0} · 토 \${s.elements?.토 || 0} · 금 \${s.elements?.금 || 0} · 수 \${s.elements?.수 || 0}
    </div>
    <div class="free-box free-text">
      신강/신약: \${escapeHtml(s.strength?.label || '')}<br>
      일간: \${escapeHtml(s.dayMaster?.korean || '')}<br>
      십성 배치와 오행 비율을 기준으로 강한 기운과 약한 기운을 함께 봅니다
    </div>
  </div>\`;

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">USEFUL ELEMENT</div>
    <div class="free-title">오행과 용신</div>
    <div class="free-box free-text">
      용신: \${escapeHtml(s.yongShin?.element || s.usefulGods?.[0] || '균형')}<br><br>
      용신은 단순히 부족한 오행 하나가 아니라 월령, 조후, 신강신약, 전체 구조를 함께 보고 판단합니다
    </div>
  </div>\`;

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">DAEWOON YEAR MONTH</div>
    <div class="free-title">대운 · 연운 · 월운</div>
    <div class="free-box free-text">
      대운수: \${escapeHtml(String(s.daYun?.startAge || ''))}세<br>
      대운은 10년 단위 흐름, 세운은 해당 연도 흐름, 월운은 한 달의 체감 흐름입니다
    </div>
  </div>\`;

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">BASIC GUIDE</div>
    <div class="free-title">만세력 이해하기</div>
    <div class="free-box free-text">
      만세력은 태어난 연월일시를 기준으로 사주의 천간과 지지를 풀어보는 명리학의 기본 지도입니다<br><br>
      연주는 타고난 환경과 초년의 흐름, 월주는 사회성과 성장 배경, 일주는 나 자신과 배우자궁, 시주는 후반 흐름과 결과를 봅니다<br><br>
      오행은 목·화·토·금·수의 균형을 보고, 십성은 그 기운이 실제 삶에서 어떤 역할로 나타나는지 보여줍니다
    </div>
  </div>\`;

  html += \`<div class="pdf-page free-page"><div class="free-sub">PERSONALITY</div><div class="free-title">사주로 보는 나는 어떤 사람일까?</div><div class="free-box free-text">\${chapter(0)}</div></div>\`;
  html += \`<div class="pdf-page free-page"><div class="free-sub">MONEY</div><div class="free-title">금전운은 어떨까?</div><div class="free-box free-text">\${chapter(2)}</div></div>\`;
  html += \`<div class="pdf-page free-page"><div class="free-sub">LOVE</div><div class="free-title">내 사주에 \${gender === '남성' ? '여자' : '남자'}는 많을까?</div><div class="free-box free-text">\${chapter(3)}</div></div>\`;
  html += \`<div class="pdf-page free-page"><div class="free-sub">DAEWOON</div><div class="free-title">대운 십성풀이</div><div class="free-box free-text">\${chapter(4)}</div></div>\`;
  html += \`<div class="pdf-page free-page"><div class="free-sub">YEARLY</div><div class="free-title">올해 1년운 세운 십성풀이</div><div class="free-box free-text">올해 흐름은 원국의 기본 성향 위에 세운이 겹치며 실제 사건과 선택으로 나타납니다<br><br>무리하게 확장하기보다 내게 맞는 방향과 맞지 않는 관계를 구분하는 것이 중요합니다</div></div>\`;
  html += \`<div class="pdf-page free-page"><div class="free-sub">MONTHLY</div><div class="free-title">다음달 월운 십성풀이</div><div class="free-box free-text">다음달은 연락, 약속, 지출, 일의 속도처럼 일상에서 바로 느껴지는 흐름이 강하게 나타납니다<br><br>갑작스럽게 결정하기보다 한 번 더 확인하고 움직이는 편이 좋습니다</div></div>\`;

  html += \`
  <div class="pdf-page free-page">
    <div class="free-sub">PREMIUM SAJU REPORT</div>
    <div class="free-cta">
      <div class="free-cta-title">인생의 흐름을 풀어주는<br>100장 분량의 프리미엄 종합사주</div>
      <div class="free-text">\${escapeHtml(promoText).replace(/\\n/g,'<br>')}</div>
      <a class="free-cta-btn" href="\${escapeHtml(link)}">할인쿠폰 받고 상담 신청하기</a>
    </div>
  </div>\`;

  const img1 = localStorage.getItem('freePdfImage1');
  const img2 = localStorage.getItem('freePdfImage2');

  if (img1) html += \`<div class="pdf-page free-page"><div class="free-sub">SPECIAL PAGE 01</div><div class="free-title">추가 안내</div><img src="\${img1}" style="width:100%;max-height:880px;object-fit:contain;border-radius:18px;border:2px solid #d8c3a3;background:#fff;"></div>\`;
  if (img2) html += \`<div class="pdf-page free-page"><div class="free-sub">SPECIAL PAGE 02</div><div class="free-title">추가 안내</div><img src="\${img2}" style="width:100%;max-height:880px;object-fit:contain;border-radius:18px;border:2px solid #d8c3a3;background:#fff;"></div>\`;

  return html;
}

`;

  s = s.replace('function buildSajuTable(s)', fn + '\nfunction buildSajuTable(s)');
}

fs.writeFileSync(file, s, 'utf8');
console.log('added missing renderFreeBasicReport');
