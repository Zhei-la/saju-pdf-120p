const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/<input id="birthTime" type="time"[^>]*>/,
`<input id="birthTime" type="text" inputmode="numeric" placeholder="예: 09:30" value="09:30">`
);

s = s.replace(
/<label style="display:flex;gap:8px;align-items:center;margin-top:8px;">[\s\S]*?<input id="unknownTime" type="checkbox">[\s\S]*?시간\s*모름[\s\S]*?<\/label>/,
`<label class="unknown-time-row">
  <input id="unknownTime" type="checkbox">
  <span>시간 모름</span>
</label>`
);

if (!s.includes('.unknown-time-row{')) {
  s = s.replace(
    '</style>',
`.unknown-time-row{
  display:flex;
  gap:8px;
  align-items:center;
  margin-top:8px;
  white-space:nowrap;
  font-size:14px;
}
.unknown-time-row input{
  width:auto;
}
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('birth time changed to plain text input');
