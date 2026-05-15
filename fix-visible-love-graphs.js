const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* 1) 시간모름이면 시주 없음 처리 */
s = s.replace(
  /const partsKor = \[s\.yearPillar, s\.monthPillar, s\.dayPillar, s\.hourPillar\];/g,
  `const partsKor = [s.yearPillar, s.monthPillar, s.dayPillar, currentUserInfo.timeUnknown ? '없음' : s.hourPillar];`
);

s = s.replace(
  /const partsHan = \[s\.yearHanja, s\.monthHanja, s\.dayHanja, s\.hourHanja\];/g,
  `const partsHan = [s.yearHanja, s.monthHanja, s.dayHanja, currentUserInfo.timeUnknown ? '없음' : s.hourHanja];`
);

/* 2) 기존 요약 카드 제거 */
s = s.replace(/\n\s*\/\/ === PART 요약 카드 ===[\s\S]*?\n\s*\/\/ === LOVE_VISUAL_CARD_END ===/g, '');

/* 3) PART 루프 끝에 보이는 세로 그래프/표 카드 삽입 */
const sectionStart = s.indexOf('// === 챕터들 (PART 간지 + 자동 페이지 분할) ===');
const endingStart = s.indexOf('// === 엔딩 페이지 ===', sectionStart);
let block = s.slice(sectionStart, endingStart);

const insertPoint = block.lastIndexOf('\n  });');

const cards = `
    // === PART 요약 카드 ===
    if (currentUserInfo.reportType === 'love' || reportLabel.includes('연애')) {

      if (partIdx === 0) {
        html += [
          '<div class="pdf-page">',
          '<div class="pdf-toc-title">연애 성향 핵심 지표</div>',
          '<div class="pdf-toc-sub">LOVE STYLE SUMMARY</div>',
          '<div class="pdf-toc-divider"></div>',
          '<div style="position:relative;margin-top:50px;height:390px;border-left:2px solid #b8860b;border-bottom:2px solid #b8860b;padding:0 28px;font-family:\\'Noto Sans KR\\',sans-serif;">',
          '<div style="position:absolute;left:0;right:0;top:0;height:1px;background:#d8c2a3;"></div>',
          '<div style="position:absolute;left:0;right:0;top:78px;height:1px;background:#d8c2a3;"></div>',
          '<div style="position:absolute;left:0;right:0;top:156px;height:1px;background:#d8c2a3;"></div>',
          '<div style="position:absolute;left:0;right:0;top:234px;height:1px;background:#d8c2a3;"></div>',
          '<div style="position:absolute;left:0;right:0;top:312px;height:1px;background:#d8c2a3;"></div>',
          '<div style="position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;height:100%;">',
          '<div style="width:90px;text-align:center;"><div style="font-weight:700;color:#b8860b;margin-bottom:8px;">72점</div><div style="height:260px;width:44px;background:#b8860b;margin:0 auto;border-radius:8px 8px 0 0;"></div><div style="margin-top:10px;font-weight:700;">표현</div></div>',
          '<div style="width:90px;text-align:center;"><div style="font-weight:700;color:#b8860b;margin-bottom:8px;">81점</div><div style="height:292px;width:44px;background:#b8860b;margin:0 auto;border-radius:8px 8px 0 0;"></div><div style="margin-top:10px;font-weight:700;">지속</div></div>',
          '<div style="width:90px;text-align:center;"><div style="font-weight:700;color:#b8860b;margin-bottom:8px;">68점</div><div style="height:245px;width:44px;background:#b8860b;margin:0 auto;border-radius:8px 8px 0 0;"></div><div style="margin-top:10px;font-weight:700;">소통</div></div>',
          '<div style="width:90px;text-align:center;"><div style="font-weight:700;color:#b8860b;margin-bottom:8px;">55점</div><div style="height:198px;width:44px;background:#b8860b;margin:0 auto;border-radius:8px 8px 0 0;"></div><div style="margin-top:10px;font-weight:700;">재회</div></div>',
          '<div style="width:90px;text-align:center;"><div style="font-weight:700;color:#b8860b;margin-bottom:8px;">63점</div><div style="height:227px;width:44px;background:#b8860b;margin:0 auto;border-radius:8px 8px 0 0;"></div><div style="margin-top:10px;font-weight:700;">결혼</div></div>',
          '</div>',
          '</div>',
          '<div style="font-family:\\'Noto Sans KR\\',sans-serif;font-size:13px;color:#7a6652;line-height:1.9;text-align:center;margin-top:32px;">연애 성향을 다섯 가지 기준으로 정리한 핵심 지표입니다.</div>',
          '</div>'
        ].join('');
      }

      if (partIdx === 1) {
        html += [
          '<div class="pdf-page">',
          '<div class="pdf-toc-title">연애 스타일 궁합 분석</div>',
          '<div class="pdf-toc-sub">RELATIONSHIP MATCH STYLE</div>',
          '<div class="pdf-toc-divider"></div>',
          '<table style="width:100%;border-collapse:collapse;font-family:\\'Noto Sans KR\\',sans-serif;font-size:14px;color:#1a1209;margin-top:55px;">',
          '<tr style="background:rgba(184,134,11,0.13);"><th style="padding:14px;border:1px solid #d8c2a3;">구분</th><th style="padding:14px;border:1px solid #d8c2a3;">연애 스타일</th><th style="padding:14px;border:1px solid #d8c2a3;">점수</th></tr>',
          '<tr><td style="padding:14px;border:1px solid #d8c2a3;font-weight:700;">잘 맞음</td><td style="padding:14px;border:1px solid #d8c2a3;">현실적이고 책임감 있는 타입</td><td style="padding:14px;border:1px solid #d8c2a3;text-align:center;color:#b8860b;font-weight:700;">88점</td></tr>',
          '<tr><td style="padding:14px;border:1px solid #d8c2a3;font-weight:700;">잘 맞음</td><td style="padding:14px;border:1px solid #d8c2a3;">감정을 안정적으로 표현하는 타입</td><td style="padding:14px;border:1px solid #d8c2a3;text-align:center;color:#b8860b;font-weight:700;">84점</td></tr>',
          '<tr><td style="padding:14px;border:1px solid #d8c2a3;font-weight:700;color:#8b1a1a;">주의</td><td style="padding:14px;border:1px solid #d8c2a3;">밀고 당기기를 즐기는 타입</td><td style="padding:14px;border:1px solid #d8c2a3;text-align:center;color:#8b1a1a;font-weight:700;">41점</td></tr>',
          '</table>',
          '</div>'
        ].join('');
      }

    }
    // === LOVE_VISUAL_CARD_END ===
`;

if (insertPoint !== -1 && !block.includes('LOVE_VISUAL_CARD_END')) {
  block = block.slice(0, insertPoint) + cards + block.slice(insertPoint);
  s = s.slice(0, sectionStart) + block + s.slice(endingStart);
}

fs.writeFileSync(file, s, 'utf8');
console.log('fixed visible love graph cards and unknown time');
