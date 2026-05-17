const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 기존 고정 월별 카드 삽입 블록 제거
s = s.replace(
/\s*if \(currentUserInfo\.reportType === 'yearly' && partIdx === 5\) \{[\s\S]*?MONTHLY FLOW CARDS[\s\S]*?\n\s*\}\s*/g,
'\n'
);

// PART 6 앞에 AI 생성 월별 본문 기반 동적 카드 삽입
const insertBlock = `
    if (currentUserInfo.reportType === 'yearly' && partIdx === 5) {
      const monthChapters = currentChapters.slice(24, 36);

      html += \`
        <div class="pdf-page visual-summary-page">
          <div class="pdf-toc-title" style="font-size:26px;letter-spacing:5px;">월별 흐름 한눈에 보기</div>
          <div class="pdf-toc-sub">MONTHLY FLOW CARDS</div>
          <div class="pdf-toc-divider"></div>
          <div class="visual-card-grid">
      \`;

      monthChapters.forEach((ch, idx) => {
        const month = String(idx + 1).padStart(2, '0') + '월';
        const rawTitle = (ch?.title || '').replace(/핵심 운세/g, '').trim();
        const bodyText = (ch?.body || ch?.content || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\\s+/g, ' ')
          .trim();

        let desc = bodyText
          .split(/[.!?。\\n]/)
          .map(v => v.trim())
          .filter(Boolean)[0] || '이 달의 흐름은 본문에서 자세히 확인할 수 있습니다.';

        if (desc.length > 62) desc = desc.slice(0, 62) + '...';

        html += \`
          <div class="visual-month-card">
            <div class="month">\${month}</div>
            <div class="theme">\${escapeHtml(rawTitle || month + ' 운세')}</div>
            <div class="desc">\${escapeHtml(desc)}</div>
          </div>
        \`;
      });

      html += \`
          </div>
          <div class="visual-note-box">
            이 페이지는 AI가 생성한 월별 운세 본문을 바탕으로 자동 정리된 요약 카드입니다. 자세한 해석은 이어지는 월별 핵심 운세에서 확인할 수 있습니다.
          </div>
        </div>
      \`;
    }
`;

if (!s.includes('AI가 생성한 월별 운세 본문을 바탕으로 자동 정리')) {
  s = s.replace(
    '    // PART 내 챕터들',
    insertBlock + '\n    // PART 내 챕터들'
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('replaced fixed monthly cards with dynamic AI-based cards');
