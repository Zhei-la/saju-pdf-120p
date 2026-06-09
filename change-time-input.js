const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/<label>출생시간<\/label>[\s\S]*?<select id="birthTime"[\s\S]*?<\/select>/,
`<label>출생시간</label>
<input id="birthTime" type="time" value="09:30">

<label style="display:flex;gap:8px;align-items:center;margin-top:8px;">
  <input id="unknownTime" type="checkbox">
  시간 모름
</label>`
);

s = s.replace(
  `const birthTime=document.getElementById('birthTime').value;`,
  `const birthTime =
    document.getElementById('unknownTime')?.checked
      ? '시간 모름'
      : document.getElementById('birthTime').value;`
);

fs.writeFileSync(file, s, 'utf8');
console.log('birth time changed to direct input');
