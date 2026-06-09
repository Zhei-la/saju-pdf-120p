const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

// 1) birthTime select 전체를 직접입력 UI로 교체
s = s.replace(
/<select id="birthTime"[\s\S]*?<\/select>/,
`<input id="birthTime" type="time" value="09:30" step="60">

<label style="display:flex;gap:8px;align-items:center;margin-top:8px;">
  <input id="unknownTime" type="checkbox">
  시간 모름
</label>

<div class="time-help">
  간지에 맞춰 시간을 입력하실 때는 시스템 자동 보정값을 고려해
  1시간 이상 늦은 시간을 쓰시는 것을 추천드립니다.<br>
  예: 자시라면 01:20, 축시라면 03:20으로 입력하시는 게 좋습니다.
</div>`
);

// 2) birthTime JS를 시간모름 체크박스 대응으로 교체
s = s.replace(
/const birthTime\s*=\s*document\.getElementById\('birthTime'\)\.value;/,
`const birthTime =
    document.getElementById('unknownTime') && document.getElementById('unknownTime').checked
      ? '시간모름'
      : document.getElementById('birthTime').value;`
);

// 3) 안내문 CSS 추가
if (!s.includes('.time-help{')) {
  s = s.replace(
    '</style>',
`.time-help{
  margin-top:8px;
  padding:10px 12px;
  border-radius:10px;
  background:#f7f1e9;
  color:#6b5a4e;
  font-size:12px;
  line-height:1.55;
}
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('birth time changed to direct HH:mm input');
