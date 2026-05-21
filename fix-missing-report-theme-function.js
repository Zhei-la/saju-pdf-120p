const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const fn = `
function getReportVisualTheme() {
  const type = currentUserInfo?.reportType || 'deep';
  const themes = {
    deep: { label: 'LIFE SAJU', symbol: '☯' },
    full: { label: 'PREMIUM', symbol: '✦' },
    yearly: { label: 'YEARLY FLOW', symbol: '◈' },
    love: { label: 'LOVE', symbol: '♥' },
    money: { label: 'MONEY', symbol: '◆' },
    marriage: { label: 'MARRIAGE', symbol: '❀' },
    compatibility: { label: 'COMPATIBILITY', symbol: '☾' }
  };
  return themes[type] || themes.deep;
}
`;

if (!s.includes('function getReportVisualTheme()')) {
  s = s.replace(/function getBrandName\(\)/, fn + '\nfunction getBrandName()');
}

fs.writeFileSync(file, s, 'utf8');
console.log('added missing getReportVisualTheme');
