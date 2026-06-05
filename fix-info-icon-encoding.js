const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

// 깨진 profile-ganji 줄 통째로 복구
s = s.replace(
/'<div class="profile-ganji">'[\s\S]*?'\s*\+\s*'[^']*div>' \+/,
`'<div class="profile-ganji">' +
        p.profileGanji.display +
        ' <span onclick="openAnimalModal()" style="cursor:pointer;font-size:12px">&#9432;</span>' +
      '</div>' +`
);

// 혹시 깨진 문자 남은 것 제거
s = s.replace(/\?\?\/span>/g, '</span>');
s = s.replace(/\?\?\/div>/g, '</div>');

fs.writeFileSync(file, s, 'utf8');
console.log('fixed broken info icon encoding');
