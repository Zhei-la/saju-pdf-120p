const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/function parseHour\(birthTime\) \{[\s\S]*?\n\}/,
`function parseHour(birthTime) {
  const text = String(birthTime || '').trim();

  if (
    !text ||
    text.includes('시간 모름') ||
    text.includes('시간모름') ||
    text.includes('미상')
  ) {
    return null;
  }

  if (text.includes('23:30-01:30') || text.includes('자시')) return { hour: 1, minute: 0 };
  if (text.includes('01:30-03:30') || text.includes('축시')) return { hour: 2, minute: 0 };
  if (text.includes('03:30-05:30') || text.includes('인시')) return { hour: 4, minute: 0 };
  if (text.includes('05:30-07:30') || text.includes('묘시')) return { hour: 6, minute: 0 };
  if (text.includes('07:30-09:30') || text.includes('진시')) return { hour: 8, minute: 0 };
  if (text.includes('09:30-11:30') || text.includes('사시')) return { hour: 10, minute: 0 };
  if (text.includes('11:30-13:30') || text.includes('오시')) return { hour: 12, minute: 0 };
  if (text.includes('13:30-15:30') || text.includes('미시')) return { hour: 14, minute: 0 };
  if (text.includes('15:30-17:30') || text.includes('신시')) return { hour: 16, minute: 0 };
  if (text.includes('17:30-19:30') || text.includes('유시')) return { hour: 18, minute: 0 };
  if (text.includes('19:30-21:30') || text.includes('술시')) return { hour: 20, minute: 0 };
  if (text.includes('21:30-23:30') || text.includes('해시')) return { hour: 22, minute: 0 };

  const m = text.match(/(\\d{1,2}):(\\d{2})/);
  if (!m) return null;

  return {
    hour: Number(m[1]),
    minute: Number(m[2])
  };
}`
);

fs.writeFileSync(file, s, 'utf8');
console.log('parseHour rewritten cleanly');
