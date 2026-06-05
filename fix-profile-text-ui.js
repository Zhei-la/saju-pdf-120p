const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

// 빈 아바타/프로필 이미지 영역 숨김 CSS 추가
if (!s.includes('.profile-avatar{display:none!important}')) {
  s = s.replace(
    '</style>',
`.profile-avatar,
.avatar,
.profile-img,
.profile-image,
.result-avatar{
  display:none!important;
}

.profileTextOnly{
  text-align:left;
  line-height:1.65;
  font-size:14px;
  color:#3b3029;
}

.profileTextOnly .profile-name{
  font-size:22px;
  font-weight:900;
  margin-bottom:2px;
}

.profileTextOnly .profile-ganji{
  font-size:15px;
  font-weight:800;
  color:#6b4a22;
  margin-bottom:6px;
}
</style>`
  );
}

// profileText 렌더링 교체
s = s.replace(
/if\(data\.profileTop\)\{[\s\S]*?\} else \{\s*profileText\.innerHTML=`양 \$\{data\.profile\.solarDate\}<br>음 \$\{data\.profile\.lunarDate\}<br>\$\{birthTime\}`;\s*\}/,
`if(data.profileTop){
    const p = data.profileTop;
    profileText.innerHTML =
      '<div class="profileTextOnly">' +
        '<div class="profile-name">' + p.name + '</div>' +
        '<div class="profile-ganji">' + p.profileGanji.display + ' ⓘ</div>' +
        '<div>' + p.birthInfo.solar.display + '</div>' +
        '<div>' + p.birthInfo.lunar.display + '</div>' +
        (p.birthInfo.corrected.enabled ? '<div>' + p.birthInfo.corrected.display + '</div>' : '') +
      '</div>';
  } else {
    profileText.innerHTML=\`양 \${data.profile.solarDate}<br>음 \${data.profile.lunarDate}<br>\${birthTime}\`;
  }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('profile top UI text-only applied');
