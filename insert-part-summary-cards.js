const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

/* PART 끝나는 지점에 카드 삽입 */
const target = `    // PART 내 챕터들
    for (let i = part.range[0]; i < part.range[1]; i++) {`;

const insert = `    // PART 내 챕터들
    for (let i = part.range[0]; i < part.range[1]; i++) {`;

s = s.replace(target, insert);

/* PART 루프 끝 직전에 카드 페이지 추가 */
const loopEnd = `    }
  });`;

const cards = `    }

    // === PART 요약 카드 ===
    if (currentUserInfo.reportType === 'love') {

      // PART 1 끝
      if (partIdx === 0) {
        html += \`
        <div class="pdf-page">
          <div class="pdf-toc-title">연애 성향 핵심 지표</div>
          <div class="pdf-toc-sub">LOVE STYLE SUMMARY</div>
          <div class="pdf-toc-divider"></div>

          <div style="margin-top:50px;font-family:'Noto Sans KR',sans-serif;line-height:2.5;font-size:16px;color:#1a1209;">
            감정 표현력&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;72점<br>
            연애 지속력&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;81점<br>
            연락 · 소통운&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;68점<br>
            재회 가능성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;55점<br>
            결혼 연결 가능성&nbsp;&nbsp;63점
          </div>
        </div>\`;
      }

      // PART 2 끝
      if (partIdx === 1) {
        html += \`
        <div class="pdf-page">
          <div class="pdf-toc-title">연애 스타일 궁합 분석</div>
          <div class="pdf-toc-sub">RELATIONSHIP MATCH STYLE</div>
          <div class="pdf-toc-divider"></div>

          <div style="margin-top:40px;font-family:'Noto Sans KR',sans-serif;">

            <div style="font-size:22px;font-weight:700;color:#2c1810;margin-bottom:24px;">
              잘 맞는 연애 스타일
            </div>

            <div style="line-height:2.2;font-size:15px;color:#1a1209;margin-bottom:40px;">
              • 현실적이고 책임감 있는 타입<br>
              • 감정을 안정적으로 표현하는 타입<br>
              • 장기 관계를 중요하게 생각하는 타입
            </div>

            <div style="height:1px;background:#d8c2a3;margin:40px 0;"></div>

            <div style="font-size:22px;font-weight:700;color:#2c1810;margin-bottom:24px;">
              갈등이 생기기 쉬운 스타일
            </div>

            <div style="line-height:2.2;font-size:15px;color:#1a1209;">
              • 감정 기복이 큰 타입<br>
              • 밀고 당기기를 즐기는 타입<br>
              • 즉흥적이고 자유를 우선하는 타입
            </div>

          </div>
        </div>\`;
      }

      // PART 4 직전 느낌
      if (partIdx === 2) {
        html += \`
        <div class="pdf-page">
          <div class="pdf-toc-title">궁합 스타일 매칭</div>
          <div class="pdf-toc-sub">MATCHING SCORE</div>
          <div class="pdf-toc-divider"></div>

          <div style="margin-top:55px;font-family:'Noto Sans KR',sans-serif;line-height:2.6;font-size:16px;color:#1a1209;">
            안정형 연애 타입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;88점<br>
            배려형 연애 타입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;84점<br>
            열정형 연애 타입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;72점<br>
            자유추구형 타입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;58점<br>
            밀당형 타입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;41점
          </div>
        </div>\`;
      }

    }
  });`;

s = s.replace(loopEnd, cards);

fs.writeFileSync(file, s, 'utf8');

console.log('inserted part summary cards');
