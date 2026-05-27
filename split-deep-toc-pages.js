const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const marker = `parts.forEach((part, partIdx) => {`;

if (!s.includes('const tocPageBreakAfterParts')) {
  s = s.replace(
    marker,
`const tocPageBreakAfterParts = currentUserInfo.reportType === 'deep' || currentUserInfo.reportType === 'full'
  ? [2, 5]
  : [];

parts.forEach((part, partIdx) => {`
  );
}

s = s.replace(
  /(\s*<\/div>\s*`;\s*\}\s*\}\s*\);\s*)/m,
  `$1`
);

s = s.replace(
  /(\s*<\/div>\s*`;\s*\n\s*\}\s*\n\s*\}\s*\n\s*\);\s*)/,
  `$1`
);

s = s.replace(
  /(html \+= `\s*<div class="toc-section">[\s\S]*?<\/div>\s*`;\s*\n\s*}\s*)/m,
  `$1
    if (tocPageBreakAfterParts.includes(partIdx)) {
      html += \`
        </div>
        <div class="pdf-page pdf-toc-page-break">
          <div class="pdf-toc-title">목 차</div>
          <div class="pdf-toc-sub">CONTENTS</div>
          <div class="pdf-toc-divider"></div>
      \`;
    }
`
);

s = s.replace(/\.toc-section:nth-of-type\(4\),\s*\.toc-section:nth-of-type\(7\)\s*\{[\s\S]*?\}/g, '');

fs.writeFileSync(file, s, 'utf8');

console.log('split deep toc into multiple pages by parts');
