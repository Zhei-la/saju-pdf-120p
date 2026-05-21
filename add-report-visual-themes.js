const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const themeBlock = `
function getReportVisualTheme() {
  const type = currentUserInfo?.reportType || 'deep';

  const themes = {
    deep: {
      symbol: '☯',
      label: 'LIFE SAJU ANALYSIS',
      tone: '인생의 큰 흐름과 방향을 읽는 종합 분석'
    },
    yearly: {
      symbol: '✦',
      label: 'YEARLY FORTUNE',
      tone: '한 해의 기회와 주의 흐름을 살피는 신년 운세'
    },
    love: {
      symbol: '♡',
      label: 'LOVE FORTUNE',
      tone: '마음의 온도와 관계의 흐름을 읽는 연애 운세'
    },
    money: {
      symbol: '◇',
      label: 'MONEY & CAREER',
      tone: '재물, 직업, 사업의 현실 흐름을 읽는 분석'
    },
    marriage: {
      symbol: '∞',
      label: 'MARRIAGE FORTUNE',
      tone: '인연, 결혼, 가정의 흐름을 읽는 분석'
    },
    compatibility: {
      symbol: '☽',
      label: 'COMPATIBILITY',
      tone: '두 사람의 기운과 관계 흐름을 비교하는 궁합 분석'
    }
  };

  return themes[type] || themes.deep;
}
`;

if (!s.includes('function getReportVisualTheme()')) {
  s = s.replace(/function getBrandName\(\)[\s\S]*?\n\}/, match => match + '\n' + themeBlock);
}

s = s.replace(
  /<div style="font-size:80px;color:#b8860b;margin-bottom:30px;line-height:1;">☯<\/div>/g,
  `<div style="font-size:80px;color:#b8860b;margin-bottom:30px;line-height:1;">\${getReportVisualTheme().symbol}</div>`
);

s = s.replace(
  /<div style="font-size:18px;color:#b8860b;letter-spacing:8px;font-family:'Noto Sans KR',sans-serif;margin-bottom:20px;">PART/g,
  `<div style="font-size:18px;color:#b8860b;letter-spacing:8px;font-family:'Noto Sans KR',sans-serif;margin-bottom:20px;">\${getReportVisualTheme().label} · PART`
);

fs.writeFileSync(file, s, 'utf8');
console.log('added report type visual themes');
