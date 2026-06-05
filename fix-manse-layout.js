const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const newTable = `
<table class="manse-table">
  <thead>
    <tr>
      <th></th>
      <th>생시</th>
      <th>생일</th>
      <th>생월</th>
      <th>생년</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>천간</th>
      <td><div class="big-kanji" id="hGan"></div><div class="sub" id="hTen"></div></td>
      <td><div class="big-kanji" id="dGan"></div><div class="sub" id="dTen"></div></td>
      <td><div class="big-kanji" id="mGan"></div><div class="sub" id="mTen"></div></td>
      <td><div class="big-kanji" id="yGan"></div><div class="sub" id="yTen"></div></td>
    </tr>
    <tr>
      <th>지지</th>
      <td><div class="big-kanji" id="hJi"></div><div class="sub" id="hJiSub"></div></td>
      <td><div class="big-kanji" id="dJi"></div><div class="sub" id="dJiSub"></div></td>
      <td><div class="big-kanji" id="mJi"></div><div class="sub" id="mJiSub"></div></td>
      <td><div class="big-kanji" id="yJi"></div><div class="sub" id="yJiSub"></div></td>
    </tr>
    <tr>
      <th>지장간</th>
      <td id="hHidden"></td>
      <td id="dHidden"></td>
      <td id="mHidden"></td>
      <td id="yHidden"></td>
    </tr>
    <tr>
      <th>12운성</th>
      <td id="hUn"></td>
      <td id="dUn"></td>
      <td id="mUn"></td>
      <td id="yUn"></td>
    </tr>
    <tr>
      <th>12신살</th>
      <td id="hGod"></td>
      <td id="dGod"></td>
      <td id="mGod"></td>
      <td id="yGod"></td>
    </tr>
  </tbody>
</table>`;

s = s.replace(
  /<table class="manse-table">[\s\S]*?<\/table>/,
  newTable
);

fs.writeFileSync(file, s, 'utf8');
console.log('manse table layout fixed');
