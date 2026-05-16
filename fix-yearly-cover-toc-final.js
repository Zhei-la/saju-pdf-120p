const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 표지 제목/영문명 동적 처리
s = s.replace(
`      <h1>연애운 분석서</h1>
      <div class="sub">LOVE FORTUNE REPORT</div>`,
`      <h1>\${currentUserInfo.reportType === 'yearly' ? '신년운세 분석서' : '연애운 분석서'}</h1>
      <div class="sub">\${currentUserInfo.reportType === 'yearly' ? 'YEARLY FORTUNE REPORT' : 'LOVE FORTUNE REPORT'}</div>`
);

// 목차 한 페이지 강제 출력 → 여러 페이지 자동 분할
s = s.replace(
/  \/\/ === 목차 페이지 ===[\s\S]*?  html \+= tocHtml;/,
`  // === 목차 페이지 ===
  const tocPages = [];
  let tocPage = \`
    <div class="pdf-page">
      <div class="pdf-toc-title">목 차</div>
      <div class="pdf-toc-sub">CONTENTS</div>
      <div class="pdf-toc-divider"></div>\`;

  let tocLineCount = 0;
  const maxTocLines = currentUserInfo.reportType === 'yearly' ? 28 : 34;

  function pushTocPage() {
    tocPage += \`</div>\`;
    tocPages.push(tocPage);
    tocPage = \`
    <div class="pdf-page">
      <div class="pdf-toc-title">목 차</div>
      <div class="pdf-toc-sub">CONTENTS</div>
      <div class="pdf-toc-divider"></div>\`;
    tocLineCount = 0;
  }

  PARTS.forEach(part => {
    const partItems = [];
    for (let i = part.range[0]; i < part.range[1]; i++) {
      if (currentChapters[i]) {
        partItems.push(\`<div class="pdf-toc-item"><span class="num">\${String(i+1).padStart(2,'0')}</span><span class="title">\${escapeHtml(currentChapters[i].title)}</span></div>\`);
      }
    }

    const needLines = 2 + partItems.length;
    if (tocLineCount > 0 && tocLineCount + needLines > maxTocLines) {
      pushTocPage();
    }

    tocPage += \`<div class="pdf-toc-part">\${part.title}</div>\`;
    partItems.forEach(item => tocPage += item);
    tocLineCount += needLines;
  });

  pushTocPage();
  html += tocPages.join('');`
);

// 렌더 직전 타입별 문자열 정리 적용
s = s.replace(
`  render.innerHTML = html;`,
`  html = normalizeReportHtmlByType(html);
  render.innerHTML = html;`
);

// 신년운세 기준 연도 2026 고정
s = s.replace(
/const y = currentUserInfo\?\.year \|\| currentUserInfo\?\.targetYear \|\| new Date\(\)\.getFullYear\(\);/,
`const y = currentUserInfo?.year || currentUserInfo?.targetYear || 2026;`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed yearly cover, year text, and toc pagination');
