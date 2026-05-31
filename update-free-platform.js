const fs = require('fs');

const path = 'public/free-platform.html';

let s = fs.readFileSync(path, 'utf8');

const oldHtml = `
<div class="result" id="resultBox">
      <h2>생성 완료</h2>
      <p><a id="siteLink" href="#" target="_blank"></a></p>
      <button id="copyBtn">링크 복사하기</button>
    </div>
`;

const newHtml = `
<div class="result" id="resultBox">

  <h2>무료사주 사이트 생성 완료</h2>

  <p style="margin-top:15px;">
    아래 링크를 고객에게 보내면<br>
    무료 사주풀이 랜딩페이지로 연결됩니다.
  </p>

  <div style="
    margin-top:20px;
    padding:18px;
    background:#fff;
    border:1px solid #d9bc84;
    border-radius:14px;
    word-break:break-all;
    font-size:18px;
    line-height:1.6;
  ">
    <a id="siteLink" href="#" target="_blank"></a>
  </div>

  <button
    type="button"
    onclick="window.open(document.getElementById('siteLink').href)"
    style="
      margin-top:20px;
      background:#0d5fb8;
      color:#fff;
    "
  >
    내 무료사주 페이지 바로가기
  </button>

  <button
    type="button"
    id="copyBtn"
    style="
      margin-top:14px;
      background:#1f0d07;
      color:#d6a642;
    "
  >
    링크 복사하기
  </button>

</div>
`;

s = s.replace(oldHtml, newHtml);

s = s.replace(
`siteLink.href = url;
  siteLink.textContent = url;
  document.getElementById('resultBox').style.display = 'block';`,
`siteLink.href = url;
  siteLink.innerText = url;

  document.getElementById('resultBox').style.display = 'block';

  document.getElementById('resultBox')
    .scrollIntoView({ behavior:'smooth' });`
);

fs.writeFileSync(path, s, 'utf8');

console.log('free-platform updated');
