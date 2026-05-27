const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('FREE BASIC SAJU DESIGN V2')) {
  s = s.replace('</style>', `
/* FREE BASIC SAJU DESIGN V2 */
.free-page-v2{background:#fbf4e7!important;border:2px solid #c59535!important;padding:54px 58px!important;font-family:'Noto Sans KR',sans-serif!important;color:#2b211b;position:relative;overflow:hidden}
.free-page-v2:before{content:'';position:absolute;inset:22px;border:1px solid rgba(197,149,53,.45);pointer-events:none}
.free-top{font-size:12px;letter-spacing:4px;color:#b8860b;font-weight:800;margin-bottom:12px}
.free-title-v2{font-size:31px;font-weight:900;color:#2c1810;margin-bottom:24px;letter-spacing:-1px}
.free-card-v2{background:rgba(255,255,255,.78);border:1px solid #ddc497;border-radius:18px;padding:22px;margin-bottom:18px;box-shadow:0 12px 28px rgba(80,50,20,.06)}
.free-body-v2{font-size:15px;line-height:2.05;word-break:keep-all;color:#342923}
.free-grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.free-el-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:18px}
.free-el-card{border-radius:16px;background:#fff;border:1px solid #d8c3a3;padding:16px 8px;text-align:center;font-weight:800}
.free-el-card .big{font-size:28px;margin-bottom:8px}
.free-bar{height:12px;border-radius:999px;background:#e9dcc8;overflow:hidden;margin-top:10px}
.free-bar span{display:block;height:100%;border-radius:999px}
.free-circle-wrap{position:relative;width:430px;height:400px;margin:20px auto}
.free-node{position:absolute;width:125px;height:125px;border-radius:50%;background:#fff;border:2px solid #d0b98f;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:20px;line-height:1.35}
.free-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:15px}
.free-flow-card{background:#fff;border:1px solid #d8c3a3;border-radius:12px;padding:12px 8px;text-align:center;font-size:13px}
.free-cta-v2{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:850px;text-align:center}
.free-cta-title-v2{font-size:36px;font-weight:900;line-height:1.35;color:#2c1810;margin-bottom:24px}
.free-cta-btn-v2{display:inline-block;margin-top:28px;padding:18px 38px;background:#4b35d2;color:#fff!important;text-decoration:none;border-radius:12px;font-size:18px;font-weight:900}
.free-img-page{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.free-img-page img{max-width:100%;max-height:850px;object-fit:contain;border-radius:18px;border:2px solid #d8c3a3;background:#fff}
.free-placeholder{width:100%;height:780px;border:2px dashed #c9ad7d;border-radius:20px;display:flex;align-items:center;justify-content:center;color:#8a6a35;font-weight:800;background:rgba(255,255,255,.55)}
</style>`);
}

const start = s.indexOf('function renderFreeBasicReport()');
const end = s.indexOf('\n\nfunction buildSajuTable', start);
if (start === -1 || end === -1) throw new Error('renderFreeBasicReport 위치를 찾지 못했습니다');

const fn = String.raw`
function renderFreeBasicReport() {
  const s = currentUserInfo.saju || {};
  const name = currentUserInfo.name || '';
  const gender = currentUserInfo.gender || '';
  const h = escapeHtml;
  const elements = s.elements || {};
  const total = ['목','화','토','금','수'].reduce((a,k)=>a+Number(elements[k]||0),0) || 1;
  const pct = k => Math.round((Number(elements[k]||0) / total) * 100);
  const color = { 목:'#4a8fa3', 화:'#e86b6b', 토:'#d0a04d', 금:'#8b8b8b', 수:'#4c6690' };
  const promoText = localStorage.getItem('freePdfPromoText') || '인생의 흐름을 풀어주는 100장 분량의 프리미엄 종합사주\n\n무료 기본사주는 핵심만 짧게 보여드린 맛보기 리포트입니다.\n\n프리미엄 종합사주는 연애운, 결혼운, 재물운, 직업운, 건강운, 대운과 세운 흐름까지 깊게 분석해드립니다.\n\n좋은 말만 하지 않습니다. 나쁜 흐름은 나쁘다고 말하고, 조심해야 할 시기는 현실적으로 짚어드립니다.\n\n이 글을 보고 신청하시면 할인쿠폰이 적용됩니다.';
  const link = localStorage.getItem('freePdfLink') || localStorage.getItem('premiumLink') || localStorage.getItem('kakaoLink') || 'https://open.kakao.com/';
  const ch = i => h(String(currentChapters[i]?.content || currentChapters[i]?.body || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,900));
  const page = (en, title, body, extra='') => '<div class="pdf-page free-page-v2 '+extra+'"><div class="free-top">'+en+'</div><div class="free-title-v2">'+title+'</div>'+body+'</div>';

  const elementHtml = ['목','화','토','금','수'].map(k =>
    '<div class="free-el-card"><div class="big" style="color:'+color[k]+'">'+k+'</div><div>'+pct(k)+'%</div><div class="free-bar"><span style="width:'+pct(k)+'%;background:'+color[k]+'"></span></div></div>'
  ).join('');

  const tenHtml = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'].map((t,i) =>
    '<div class="free-flow-card"><b>'+t+'</b><br><span style="color:#8a6a35">'+(i%3===0?'강조':i%3===1?'보통':'확인')+'</span></div>'
  ).join('');

  const flowHtml = (s.daYun?.list || []).slice(0,10).map((d,i) =>
    '<div class="free-flow-card"><b>'+(d.age || d.startAge || (i*10+4))+'세</b><br>'+(d.ganZhiKor || d.ganZhi || d.name || '-')+'</div>'
  ).join('') || '<div class="free-card-v2 free-body-v2">대운 정보는 사주 계산값을 기준으로 확인합니다.</div>';

  let html = '';

  html += page('BASIC SAJU CHART', h(name)+'님의 만세력',
    '<div class="free-card-v2 free-body-v2"><b>'+h(name)+'</b> '+h(gender)+'<br>양력 '+h(s.solarDate||'')+' · 음력 '+h(s.lunarDate||'')+'<br>사주 '+h(s.fullKorean||'')+'<br>일간 <b>'+h(s.dayMaster?.korean||'')+'</b> · '+h(s.dayMaster?.element||'')+'</div><div class="free-card-v2">'+buildSajuTable(s)+'</div>'
  );

  html += page('FIVE ELEMENTS & TEN GODS', '오행과 십성 분석',
    '<div class="free-grid2"><div class="free-card-v2"><div class="free-body-v2"><b>오행 비율</b></div><div class="free-el-grid">'+elementHtml+'</div></div><div class="free-card-v2"><div class="free-body-v2"><b>십성 흐름</b></div><div class="free-flow">'+tenHtml+'</div></div></div>'
  );

  html += page('USEFUL ELEMENT', '오행과 용신',
    '<div class="free-circle-wrap"><div class="free-node" style="left:150px;top:0;color:'+color.목+'">목<br>'+pct('목')+'%</div><div class="free-node" style="right:0;top:115px;color:'+color.화+'">화<br>'+pct('화')+'%</div><div class="free-node" style="right:55px;bottom:0;color:'+color.토+'">토<br>'+pct('토')+'%</div><div class="free-node" style="left:55px;bottom:0;color:'+color.금+'">금<br>'+pct('금')+'%</div><div class="free-node" style="left:0;top:115px;color:'+color.수+'">수<br>'+pct('수')+'%</div></div><div class="free-card-v2 free-body-v2">용신 흐름은 <b>'+h(s.yongShin?.element || s.usefulGods?.[0] || '균형')+'</b> 중심으로 봅니다. 부족한 기운과 과한 기운을 함께 보며, 생활 속에서 어떤 방향을 보완해야 하는지 판단합니다.</div>'
  );

  html += page('DAEWOON · YEAR · MONTH', '대운 · 연운 · 월운',
    '<div class="free-card-v2 free-body-v2">대운은 10년 단위 흐름, 세운은 해당 연도 흐름, 월운은 한 달의 체감 흐름입니다.</div><div class="free-flow">'+flowHtml+'</div>'
  );

  html += page('BASIC GUIDE', '만세력 이해하기',
    '<div class="free-card-v2 free-body-v2">만세력은 태어난 연월일시를 기준으로 사주의 천간과 지지를 풀어보는 명리학의 기본 지도입니다.<br><br>연주는 초년과 환경, 월주는 사회성과 성장 배경, 일주는 나 자신과 배우자궁, 시주는 후반 흐름과 결과를 봅니다.<br><br>오행은 목·화·토·금·수의 균형을 보고, 십성은 그 기운이 실제 삶에서 어떤 역할로 나타나는지 보여줍니다.</div>'
  );

  html += page('PERSONALITY', '사주로 보는 나는 어떤 사람일까?', '<div class="free-card-v2 free-body-v2">'+ch(0)+'</div>');
  html += page('MONEY', '금전운은 어떨까?', '<div class="free-card-v2 free-body-v2">'+ch(2)+'</div>');
  html += page('LOVE', '내 사주에 '+(gender === '남성' ? '여자' : '남자')+'는 많을까?', '<div class="free-card-v2 free-body-v2">'+ch(3)+'</div>');
  html += page('DAEWOON TEN GODS', '대운 십성풀이', '<div class="free-card-v2 free-body-v2">'+ch(4)+'</div>');
  html += page('YEARLY FLOW', '올해 1년운 세운 십성풀이', '<div class="free-card-v2 free-body-v2">올해는 원국의 기본 성향 위에 세운이 겹치며 실제 사건과 선택으로 드러납니다.<br><br>무리하게 확장하기보다 내게 맞는 방향과 맞지 않는 관계를 구분하는 것이 중요합니다.</div>');
  html += page('MONTHLY FLOW', '다음달 월운 십성풀이', '<div class="free-card-v2 free-body-v2">다음달은 연락, 약속, 지출, 일의 속도처럼 일상에서 바로 느껴지는 흐름이 강하게 나타납니다.<br><br>갑작스럽게 결정하기보다 한 번 더 확인하고 움직이는 편이 좋습니다.</div>');

  html += '<div class="pdf-page free-page-v2 free-cta-v2"><div class="free-top">PREMIUM SAJU REPORT</div><div class="free-cta-title-v2">인생의 흐름을 풀어주는<br>100장 분량의 프리미엄 종합사주</div><div class="free-card-v2 free-body-v2" style="max-width:560px">'+h(promoText).replace(/\n/g,'<br>')+'</div><a class="free-cta-btn-v2" href="'+h(link)+'">할인쿠폰 받고 상담 신청하기</a></div>';

  const img1 = localStorage.getItem('freePdfImage1');
  const img2 = localStorage.getItem('freePdfImage2');
  html += '<div class="pdf-page free-page-v2 free-img-page"><div class="free-top">SPECIAL PAGE 01</div><div class="free-title-v2">추가 안내</div>'+(img1 ? '<img src="'+img1+'">' : '<div class="free-placeholder">홈에서 이미지 1을 등록하면 이 페이지에 표시됩니다</div>')+'</div>';
  html += '<div class="pdf-page free-page-v2 free-img-page"><div class="free-top">SPECIAL PAGE 02</div><div class="free-title-v2">추가 안내</div>'+(img2 ? '<img src="'+img2+'">' : '<div class="free-placeholder">홈에서 이미지 2를 등록하면 이 페이지에 표시됩니다</div>')+'</div>';

  return html;
}
`;

s = s.slice(0, start) + fn + s.slice(end);

fs.writeFileSync(file, s, 'utf8');
console.log('upgraded free PDF design renderer');
