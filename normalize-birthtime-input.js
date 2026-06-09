const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('function normalizeBirthTimeInput')) {
  s = s.replace(
    'function calculateSajuEngine(input) {',
`function normalizeBirthTimeInput(v) {
  const t = String(v || '').trim();

  if (!t || t === '시간모름' || t === '시간 모름') return '시간 모름';

  const m = t.match(/^(\\d{1,2}):(\\d{2})$/);
  if (!m) return t;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const total = hh * 60 + mm;

  if (total >= 23 * 60 + 30 || total < 1 * 60 + 30) return '자시 23:30-01:30';
  if (total < 3 * 60 + 30) return '축시 01:30-03:30';
  if (total < 5 * 60 + 30) return '인시 03:30-05:30';
  if (total < 7 * 60 + 30) return '묘시 05:30-07:30';
  if (total < 9 * 60 + 30) return '진시 07:30-09:30';
  if (total < 11 * 60 + 30) return '사시 09:30-11:30';
  if (total < 13 * 60 + 30) return '오시 11:30-13:30';
  if (total < 15 * 60 + 30) return '미시 13:30-15:30';
  if (total < 17 * 60 + 30) return '신시 15:30-17:30';
  if (total < 19 * 60 + 30) return '유시 17:30-19:30';
  if (total < 21 * 60 + 30) return '술시 19:30-21:30';
  return '해시 21:30-23:30';
}

function calculateSajuEngine(input) {`
  );
}

s = s.replace(
  "const birthTime =\n    String(input.birthTime || '시간 모름').trim();",
  "const rawBirthTime = String(input.birthTime || '시간 모름').trim();\n  const birthTime = normalizeBirthTimeInput(rawBirthTime);"
);

fs.writeFileSync(file, s, 'utf8');
console.log('birth time text input normalized to ganji time range');
