const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/const \{ apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType \} = req\.body;\s*if \(!apiKey \|\| !apiKey\.startsWith\('sk-'\)\) return res\.status\(400\)\.json\(\{ error: '[^']*' \}\);/,
`const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;

    const requestedType = reportType || 'deep';

    if (
      requestedType !== 'free' &&
      (!apiKey || !apiKey.startsWith('sk-'))
    ) {
      return res.status(400).json({ error: '올바른 OpenAI API 키를 입력해주세요' });
    }`
);

fs.writeFileSync(file, s, 'utf8');

console.log('force fixed free api validation');
