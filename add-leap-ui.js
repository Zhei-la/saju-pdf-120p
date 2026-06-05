const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('id="leapMonth"')) {
  s = s.replace(
    `<label>양력/음력</label>
<select id="calendar"><option>양력</option><option>음력</option></select>`,
    `<label>양력/음력</label>
<select id="calendar"><option>양력</option><option>음력</option></select>

<label>윤달 여부</label>
<select id="leapMonth">
  <option value="false">평달</option>
  <option value="true">윤달</option>
</select>`
  );
}

s = s.replace(
  `const calendar=document.getElementById('calendar').value;`,
  `const calendar=document.getElementById('calendar').value;
  const leapMonth=document.getElementById('leapMonth') ? document.getElementById('leapMonth').value === 'true' : false;`
);

s = s.replace(
  `body:JSON.stringify({name,birth,gender,calendar,birthTime})`,
  `body:JSON.stringify({name,birth,gender,calendar,birthTime,leapMonth})`
);

fs.writeFileSync(file, s, 'utf8');
console.log('u.html leapMonth input added');
