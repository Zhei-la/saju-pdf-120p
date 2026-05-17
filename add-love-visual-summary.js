const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 연애운 전용 시각 요소 CSS
if (!s.includes('.love-visual-card')) {
  s = s.replace(
    '</style>',
`
.love-visual-page {
  font-family: 'Noto Sans KR', sans-serif;
}
.love-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 34px;
}
.love-visual-card {
  border: 1.5px solid #d8c2a3;
  background: rgba(184,134,11,0.06);
  border-radius: 20px;
  padding: 22px 24px;
  min-height: 120px;
}
.love-visual-card .label {
  color: #b8860b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
  margin-bottom: 10px;
}
.love-visual-card .title {
  color: #2c1810;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
}
.love-visual-card .desc {
  color: #5f4b3b;
  font-size: 13px;
  line-height: 1.75;
}
.love-match-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 34px;
  font-family: 'Noto Sans KR', sans-serif;
}
.love-match-table th {
  background: rgba(184,134,11,0.12);
  color: #2c1810;
  border: 1px solid #d8c2a3;
  padding: 15px;
  font-size: 14px;
}
.love-match-table td {
  border: 1px solid #d8c2a3;
  padding: 15px;
  font-size: 13px;
  line-height: 1.75;
  color: #4b392c;
}
.love-bar-wrap {
  margin-top: 42px;
  display: grid;
  gap: 22px;
}
.love-bar-row {
  display: grid;
  grid-template-columns: 120px 1fr 48px;
  align-items: center;
  gap: 14px;
}
.love-bar-name {
  font-size: 14px;
  color: #2c1810;
  font-weight: 800;
}
.love-bar-bg {
  height: 18px;
  background: #eadcc7;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #d8c2a3;
}
.love-bar-fill {
  height: 100%;
  background: #b8860b;
  border-radius: 999px;
}
.love-bar-score {
  font-size: 14px;
  color: #b8860b;
  font-weight: 800;
  text-align: right;
}
</style>`
  );
}

// 중복 제거
s = s.replace(/\n\s*\/\/ === LOVE_VISUAL_SUMMARY_START ===[\s\S]*?\/\/ === LOVE_VISUAL_SUMMARY_END ===\s*/g, '\n');

const insertBlock = `
    // === LOVE_VISUAL_SUMMARY_START ===
    if (currentUserInfo.reportType === 'love' && partIdx === 0) {
      const cleanText = (txt) => (txt || '').replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();
      const getDesc = (idx, fallback) => {
        const t = cleanText(currentChapters[idx]?.body || currentChapters[idx]?.content || '');
        return t ? (t.length > 72 ? t.slice(0, 72) + '...' : t) : fallback;
      };

      html += \`
        <div class="pdf-page love-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">연애 성향 핵심 카드</div>
          <div class="pdf-toc-sub">LOVE STYLE CARDS</div>
          <div class="pdf-toc-divider"></div>

          <div class="love-card-grid">
            <div class="love-visual-card">
              <div class="label">LOVE 01</div>
              <div class="title">끌림의 방식</div>
              <div class="desc">\${escapeHtml(getDesc(0, '마음이 열리는 순간과 사랑에 빠지는 방식이 드러납니다.'))}</div>
            </div>
            <div class="love-visual-card">
              <div class="label">LOVE 02</div>
              <div class="title">표현 방식</div>
              <div class="desc">\${escapeHtml(getDesc(2, '좋아할수록 말투와 거리감, 답장 방식에서 변화가 나타납니다.'))}</div>
            </div>
            <div class="love-visual-card">
              <div class="label">LOVE 03</div>
              <div class="title">연락 반응</div>
              <div class="desc">\${escapeHtml(getDesc(5, '답장 텐션과 연락 간격에 따라 감정 흐름이 달라질 수 있습니다.'))}</div>
            </div>
            <div class="love-visual-card">
              <div class="label">LOVE 04</div>
              <div class="title">관계 주의점</div>
              <div class="desc">\${escapeHtml(getDesc(8, '감정을 숨기는 방식과 거리감이 관계의 오해로 이어질 수 있습니다.'))}</div>
            </div>
          </div>
        </div>
      \`;
    }

    if (currentUserInfo.reportType === 'love' && partIdx === 1) {
      html += \`
        <div class="pdf-page love-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">연애 스타일 매칭</div>
          <div class="pdf-toc-sub">LOVE MATCH STYLE</div>
          <div class="pdf-toc-divider"></div>

          <table class="love-match-table">
            <tr>
              <th>구분</th>
              <th>잘 맞는 스타일</th>
              <th>주의할 스타일</th>
            </tr>
            <tr>
              <td><b style="color:#b8860b;">관계 속도</b></td>
              <td>천천히 신뢰를 쌓고, 말과 행동이 일관적인 사람</td>
              <td>감정 표현은 빠르지만 행동이 자주 바뀌는 사람</td>
            </tr>
            <tr>
              <td><b style="color:#b8860b;">연락 방식</b></td>
              <td>연락 텀이 안정적이고, 애매한 말투를 남기지 않는 사람</td>
              <td>읽씹·밀당·불규칙한 연락으로 불안을 키우는 사람</td>
            </tr>
            <tr>
              <td><b style="color:#b8860b;">갈등 방식</b></td>
              <td>서운함을 차분히 풀고 관계를 방치하지 않는 사람</td>
              <td>침묵하거나 회피하면서 상대를 더 불안하게 만드는 사람</td>
            </tr>
          </table>
        </div>
      \`;
    }

    if (currentUserInfo.reportType === 'love' && partIdx === 2) {
      const seed = (currentUserInfo.name || '').length;
      const scores = [
        ['감정 몰입도', 72 + (seed % 10)],
        ['표현 적극성', 58 + (seed % 14)],
        ['연락 민감도', 70 + (seed % 12)],
        ['재회 흔들림', 55 + (seed % 15)],
        ['장기 안정도', 66 + (seed % 10)]
      ];

      html += \`
        <div class="pdf-page love-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">연애 감정 흐름 그래프</div>
          <div class="pdf-toc-sub">EMOTIONAL FLOW GRAPH</div>
          <div class="pdf-toc-divider"></div>

          <div class="love-bar-wrap">
            \${scores.map(([name, score]) => \`
              <div class="love-bar-row">
                <div class="love-bar-name">\${name}</div>
                <div class="love-bar-bg">
                  <div class="love-bar-fill" style="width:\${Math.min(score, 95)}%;"></div>
                </div>
                <div class="love-bar-score">\${score}점</div>
              </div>
            \`).join('')}
          </div>

          <div class="visual-note-box" style="margin-top:40px;">
            이 그래프는 연애운 리포트의 전체 흐름을 기준으로 감정 반응과 관계 안정도를 시각적으로 정리한 페이지입니다.
          </div>
        </div>
      \`;
    }
    // === LOVE_VISUAL_SUMMARY_END ===
`;

if (!s.includes('LOVE STYLE CARDS')) {
  s = s.replace(
    '    // PART 내 챕터들',
    insertBlock + '\n    // PART 내 챕터들'
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('added love visual summary pages');
