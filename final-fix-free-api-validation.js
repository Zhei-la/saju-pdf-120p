const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: '?щ컮瑜?OpenAI API ?ㅻ? ?낅젰?댁＜?몄슂' });`,
`const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;

    const requestedType = reportType || 'deep';

    if (
      requestedType !== 'free' &&
      (!apiKey || !apiKey.startsWith('sk-'))
    ) {
      return res.status(400).json({
        error: '올바른 OpenAI API 키를 입력해주세요'
      });
    }`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed server api key validation for free report');
