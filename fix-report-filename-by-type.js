const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/pdf\.save\(`사주분석_\$\{currentUserInfo\.name\}_\$\{isHalf \? '60p' : '120p'\}\.pdf`\);/g,
`const fileTitleMap = {
      love: '연애운분석서',
      yearly: '신년운세분석서',
      marriage: '결혼운분석서',
      money: '재물운분석서',
      couple: '궁합분석서',
      deep: '사주심층분석서',
      full: '사주심층분석서',
      half: '사주분석서'
    };
    const fileTitle = fileTitleMap[currentUserInfo.reportType] || '사주분석서';
    pdf.save(\`\${fileTitle}_\${currentUserInfo.name}.pdf\`);`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed PDF filename by report type');
