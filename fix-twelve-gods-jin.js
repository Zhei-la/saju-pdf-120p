const fs = require('fs');

const file = 'services/saju/analysis/twelveGods.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace("[B.JIN]:B.JA", "[B.JIN]:B.MYO");

s = s.replace(
"[B.MYO]:'장성살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살'",
"[B.MYO]:'육해살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살'"
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed twelve gods for jin day branch');
