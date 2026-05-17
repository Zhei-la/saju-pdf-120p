const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 시각 요소 CSS 추가
if (!s.includes('.yearly-visual-card')) {
  s = s.replace(
    '</style>',
`
.yearly-visual-page {
  font-family: 'Noto Sans KR', sans-serif;
}
.yearly-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 34px;
}
.yearly-visual-card {
  border: 1.5px solid #d8c2a3;
  background: rgba(184,134,11,0.06);
  border-radius: 20px;
  padding: 22px 24px;
  min-height: 120px;
}
.yearly-visual-card .label {
  color: #b8860b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
  margin-bottom: 10px;
}
.yearly-visual-card .title {
  color: #2c1810;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
}
.yearly-visual-card .desc {
  color: #5f4b3b;
  font-size: 13px;
  line-height: 1.75;
}
.yearly-compare-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 34px;
  font-family: 'Noto Sans KR', sans-serif;
}
.yearly-compare-table th {
  background: rgba(184,134,11,0.12);
  color: #2c1810;
  border: 1px solid #d8c2a3;
  padding: 16px;
  font-size: 15px;
}
.yearly-compare-table td {
  border: 1px solid #d8c2a3;
  padding: 16px;
  font-size: 13px;
  line-height: 1.75;
  color: #4b392c;
  vertical-align: top;
}
.yearly-bar-wrap {
  margin-top: 42px;
  display: grid;
  gap: 22px;
}
.yearly-bar-row {
  display: grid;
  grid-template-columns: 110px 1fr 48px;
  align-items: center;
  gap: 14px;
  font-family: 'Noto Sans KR', sans-serif;
}
.yearly-bar-name {
  font-size: 14px;
  color: #2c1810;
  font-weight: 800;
}
.yearly-bar-bg {
  height: 18px;
  background: #eadcc7;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #d8c2a3;
}
.yearly-bar-fill {
  height: 100%;
  background: #b8860b;
  border-radius: 999px;
}
.yearly-bar-score {
  font-size: 14px;
  color: #b8860b;
  font-weight: 800;
  text-align: right;
}
</style>`
  );
}

// 중복 제거
s = s.replace(/\n\s*\/\/ === YEARLY_VISUAL_SUMMARY_START ===[\s\S]*?\/\/ === YEARLY_VISUAL_SUMMARY_END ===\s*/g, '\n');

const insertBlock = `
    // === YEARLY_VISUAL_SUMMARY_START ===
    if (currentUserInfo.reportType === 'yearly' && partIdx === 0) {
      const cleanText = (txt) => (txt || '').replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();
      const getDesc = (idx, fallback) => {
        const t = cleanText(currentChapters[idx]?.body || currentChapters[idx]?.content || '');
        return t ? (t.length > 72 ? t.slice(0, 72) + '...' : t) : fallback;
      };

      html += \`
        <div class="pdf-page yearly-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">올해 핵심 키워드</div>
          <div class="pdf-toc-sub">YEARLY KEYWORD CARDS</div>
          <div class="pdf-toc-divider"></div>

          <div class="yearly-card-grid">
            <div class="yearly-visual-card">
              <div class="label">KEYWORD 01</div>
              <div class="title">변화</div>
              <div class="desc">\${escapeHtml(getDesc(0, '올해는 생활과 관계의 흐름이 이전과 다르게 움직일 수 있습니다.'))}</div>
            </div>
            <div class="yearly-visual-card">
              <div class="label">KEYWORD 02</div>
              <div class="title">정리</div>
              <div class="desc">\${escapeHtml(getDesc(3, '오래 끌던 문제나 애매한 관계를 정리해야 흐름이 가벼워집니다.'))}</div>
            </div>
            <div class="yearly-visual-card">
              <div class="label">KEYWORD 03</div>
              <div class="title">기회</div>
              <div class="desc">\${escapeHtml(getDesc(18, '놓치지 말아야 할 제안과 사람의 흐름이 들어올 수 있습니다.'))}</div>
            </div>
            <div class="yearly-visual-card">
              <div class="label">KEYWORD 04</div>
              <div class="title">주의</div>
              <div class="desc">\${escapeHtml(getDesc(17, '반복되는 선택이나 감정 소모가 손해로 이어지지 않게 조심해야 합니다.'))}</div>
            </div>
          </div>
        </div>

        <div class="pdf-page yearly-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">상반기 · 하반기 흐름</div>
          <div class="pdf-toc-sub">FIRST HALF VS SECOND HALF</div>
          <div class="pdf-toc-divider"></div>

          <table class="yearly-compare-table">
            <tr>
              <th>상반기 흐름</th>
              <th>하반기 흐름</th>
            </tr>
            <tr>
              <td>
                <b style="color:#b8860b;">정리와 준비</b><br>
                초반에는 관계와 생활 리듬을 정리하는 흐름이 강합니다. 무리하게 확장하기보다, 애매하게 끌고 온 문제를 정리하는 쪽이 유리합니다.
              </td>
              <td>
                <b style="color:#b8860b;">확장과 결과</b><br>
                하반기에는 실제 결과가 드러나기 시작합니다. 일, 돈, 관계에서 선택의 결과가 보이고 다음 단계로 넘어갈 준비가 필요합니다.
              </td>
            </tr>
            <tr>
              <td>
                \${escapeHtml(getDesc(0, '올해 초반은 방향을 다시 잡고 불필요한 부담을 덜어내는 시기입니다.'))}
              </td>
              <td>
                \${escapeHtml(getDesc(4, '올해 후반은 흐름의 결과가 드러나고 중요한 선택이 현실화되는 시기입니다.'))}
              </td>
            </tr>
          </table>
        </div>
      \`;
    }

    if (currentUserInfo.reportType === 'yearly' && partIdx === 2) {
      const scoreSeed = (currentUserInfo.name || '').length;
      const scores = [
        ['연애운', 68 + (scoreSeed % 10)],
        ['재물운', 64 + (scoreSeed % 12)],
        ['직업운', 72 + (scoreSeed % 9)],
        ['인간관계', 66 + (scoreSeed % 11)],
        ['건강운', 58 + (scoreSeed % 13)]
      ];

      html += \`
        <div class="pdf-page yearly-visual-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">올해 운세 강도</div>
          <div class="pdf-toc-sub">FORTUNE INTENSITY GRAPH</div>
          <div class="pdf-toc-divider"></div>

          <div class="yearly-bar-wrap">
            \${scores.map(([name, score]) => \`
              <div class="yearly-bar-row">
                <div class="yearly-bar-name">\${name}</div>
                <div class="yearly-bar-bg">
                  <div class="yearly-bar-fill" style="width:\${Math.min(score, 95)}%;"></div>
                </div>
                <div class="yearly-bar-score">\${score}점</div>
              </div>
            \`).join('')}
          </div>

          <div class="visual-note-box" style="margin-top:40px;">
            이 그래프는 올해 전체 리포트 흐름을 기준으로 주요 운의 강도를 한눈에 정리한 시각 자료입니다.
          </div>
        </div>
      \`;
    }
    // === YEARLY_VISUAL_SUMMARY_END ===
`;

if (!s.includes('YEARLY KEYWORD CARDS')) {
  s = s.replace(
    '    // PART 내 챕터들',
    insertBlock + '\n    // PART 내 챕터들'
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('added yearly keyword cards, half-year table, and fortune graph');
