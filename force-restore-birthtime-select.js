const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/<input id="birthTime"[\s\S]*?>/,
`<select id="birthTime">
  <option value="자시 23:30-01:30">자시 23:30-01:30</option>
  <option value="축시 01:30-03:30">축시 01:30-03:30</option>
  <option value="인시 03:30-05:30">인시 03:30-05:30</option>
  <option value="묘시 05:30-07:30">묘시 05:30-07:30</option>
  <option value="진시 07:30-09:30">진시 07:30-09:30</option>
  <option value="사시 09:30-11:30" selected>사시 09:30-11:30</option>
  <option value="오시 11:30-13:30">오시 11:30-13:30</option>
  <option value="미시 13:30-15:30">미시 13:30-15:30</option>
  <option value="신시 15:30-17:30">신시 15:30-17:30</option>
  <option value="유시 17:30-19:30">유시 17:30-19:30</option>
  <option value="술시 19:30-21:30">술시 19:30-21:30</option>
  <option value="해시 21:30-23:30">해시 21:30-23:30</option>
  <option value="시간 모름">시간 모름</option>
</select>`
);

s = s.replace(/<label class="unknown-time-row">[\s\S]*?<\/label>/g, '');

s = s.replace(
/const birthTime\s*=[\s\S]*?document\.getElementById\('birthTime'\)\.value;/,
"const birthTime=document.getElementById('birthTime').value;"
);

fs.writeFileSync(file, s, 'utf8');
console.log('birthTime restored to select dropdown');
