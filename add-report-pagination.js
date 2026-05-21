const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

// 전역 페이지 상태 추가
if (!s.includes('let reportPage = 1;')) {
  s = s.replace(
    /let currentUser = null;/,
    `let currentUser = null;
let reportPage = 1;
const REPORTS_PER_PAGE = 15;`
  );
}

// 기존 reports slice 렌더링 교체
s = s.replace(
/box\.innerHTML = r\.reports\.slice\(0, 10\)\.map\(rep => \{[\s\S]*?\}\)\.join\(''\);/,
`const totalReports = r.reports.length;
    const totalPages = Math.max(1, Math.ceil(totalReports / REPORTS_PER_PAGE));
    if (reportPage > totalPages) reportPage = totalPages;

    const start = (reportPage - 1) * REPORTS_PER_PAGE;
    const pageReports = r.reports.slice(start, start + REPORTS_PER_PAGE);

    const listHtml = pageReports.map(rep => {
      const d = new Date(rep.created_at).toLocaleDateString('ko-KR');
      return \`<div class="rep-item">
        <div>
          <div class="nm">\${escapeHtml(rep.client_name)} (\${escapeHtml(rep.client_gender || '')})</div>
          <div class="mt">\${escapeHtml(rep.client_birth || '')} · 생성 \${d} · 상담 \${rep.session_count}회</div>
        </div>
        <button class="btn-gold btn-sm" onclick="goChatNew(\${rep.id})">상담 시작</button>
        <button class="btn-ghost btn-sm" onclick="delReport(\${rep.id})">삭제</button>
      </div>\`;
    }).join('');

    const pagerHtml = totalPages > 1
      ? \`<div class="pager">
          <button class="btn-ghost btn-sm" onclick="changeReportPage(\${reportPage - 1})" \${reportPage <= 1 ? 'disabled' : ''}>이전</button>
          <span class="pager-info">\${reportPage} / \${totalPages}</span>
          <button class="btn-ghost btn-sm" onclick="changeReportPage(\${reportPage + 1})" \${reportPage >= totalPages ? 'disabled' : ''}>다음</button>
        </div>\`
      : '';

    box.innerHTML = listHtml + pagerHtml;`
);

// 페이지 변경 함수 추가
if (!s.includes('function changeReportPage(')) {
  s = s.replace(
    /async function delReport\(id\)/,
`function changeReportPage(page) {
  reportPage = page;
  showDash();
}

async function delReport(id)`
  );
}

// pager CSS 추가
if (!s.includes('/* report pager */')) {
  s = s.replace(
    '</style>',
`/* report pager */
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}
.pager-info {
  font-size: 13px;
  color: var(--muted);
  min-width: 60px;
  text-align: center;
}
.pager button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');

console.log('added report pagination');
