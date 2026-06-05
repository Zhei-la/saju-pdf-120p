const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('id="location"')) {
  s = s.replace(
    `<label>성별</label>`,
    `<label>출생지역</label>
<input id="location" placeholder="예: 강원도, 서울특별시">

<label>성별</label>`
  );
}

s = s.replace(
  `const gender=document.getElementById('gender').value;`,
  `const gender=document.getElementById('gender').value;
  const location=document.getElementById('location') ? document.getElementById('location').value.trim() : '';`
);

s = s.replace(
  `body:JSON.stringify({name,birth,gender,calendar,birthTime,leapMonth})`,
  `body:JSON.stringify({name,birth,gender,calendar,birthTime,leapMonth,location})`
);

s = s.replace(
  /profileText\.innerHTML=`양 \$\{data\.profile\.solarDate\}<br>음 \$\{data\.profile\.lunarDate\}<br>\$\{birthTime\}`;/,
  `if(data.profileTop){
    profileText.innerHTML =
      '<b>' + data.profileTop.profileGanji.display + ' ⓘ</b><br>' +
      data.profileTop.birthInfo.solar.display + '<br>' +
      data.profileTop.birthInfo.lunar.display +
      (data.profileTop.birthInfo.corrected.enabled ? '<br>' + data.profileTop.birthInfo.corrected.display : '');
  } else {
    profileText.innerHTML=\`양 \${data.profile.solarDate}<br>음 \${data.profile.lunarDate}<br>\${birthTime}\`;
  }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('profileTop connected to u.html');
