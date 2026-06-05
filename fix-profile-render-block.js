const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/resultTitle\.textContent=nnst p = data\.profileTop;[\s\S]*?profileText\.innerHTML=`[^`]*`;\s*\}/,
`resultTitle.style.display = 'none';

  if(data.profileTop){
    const p = data.profileTop;
    profileText.innerHTML =
      '<div class="profileTextOnly">' +
        '<div class="profile-name">' + p.name + '</div>' +
        '<div class="profile-ganji">' +
          p.profileGanji.display +
          ' <span onclick="openAnimalModal()" style="cursor:pointer;font-size:12px">&#9432;</span>' +
        '</div>' +
        '<div>' + p.birthInfo.solar.display + '</div>' +
        '<div>' + p.birthInfo.lunar.display + '</div>' +
        (p.birthInfo.corrected.enabled ? '<div>' + p.birthInfo.corrected.display + '</div>' : '') +
      '</div>';
  } else {
    profileText.innerHTML =
      '양 ' + data.profile.solarDate + '<br>' +
      '음 ' + data.profile.lunarDate + '<br>' +
      birthTime;
  }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('fixed broken profile render block');
