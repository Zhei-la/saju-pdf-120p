const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('freePdfPromoText')) {

s = s.replace(
`<div class="card">
    <div class="card-t">최근 리포트</div>`,
`<div class="card">
    <div class="card-t">무료 PDF 설정</div>

    <div style="display:grid;gap:16px;">

      <div>
        <div style="font-weight:700;margin-bottom:8px;">프리미엄 유도 문구</div>

        <textarea
          id="freePdfPromoText"
          style="width:100%;height:220px;padding:14px;border:1px solid #d8c3a3;background:#fff;"
        ></textarea>

        <div style="display:flex;gap:10px;margin-top:10px;">
          <button class="btn-gold btn-sm" onclick="saveFreePdfSettings()">저장</button>
          <button class="btn-ghost btn-sm" onclick="resetFreePdfPromo()">초기화</button>
        </div>
      </div>

      <div>
        <div style="font-weight:700;margin-bottom:8px;">카카오 / 오픈채팅 링크</div>

        <input
          id="freePdfLink"
          type="text"
          placeholder="https://open.kakao.com/..."
        >
      </div>

      <div>
        <div style="font-weight:700;margin-bottom:8px;">마지막 페이지 이미지 1</div>
        <input id="freePdfImage1" type="file" accept="image/*">
      </div>

      <div>
        <div style="font-weight:700;margin-bottom:8px;">마지막 페이지 이미지 2</div>
        <input id="freePdfImage2" type="file" accept="image/*">
      </div>

    </div>
  </div>

  <div class="card">
    <div class="card-t">최근 리포트</div>`
);

}

//
// 기본 문구 함수
//
if (!s.includes('DEFAULT_FREE_PROMO')) {

s = s.replace(
'let currentUser = null;',
`let currentUser = null;

const DEFAULT_FREE_PROMO =
\`인생의 흐름을 풀어주는 100장 분량의 프리미엄 종합사주

무료 기본사주는 핵심만 짧게 보여드린 맛보기 리포트입니다.

프리미엄 종합사주는 연애운, 결혼운, 재물운, 직업운, 건강운, 대운과 세운 흐름까지 깊게 분석해드립니다.

정통 명리학 기반으로 좋은 흐름과 나쁜 흐름을 현실적으로 설명해드립니다.

좋은 말만 하지 않습니다.
나쁜 시기는 왜 조심해야 하는지도 함께 설명해드립니다.

현재 할인쿠폰 적용이 가능합니다.\`;
`
);

}

//
// 저장 함수 추가
//
if (!s.includes('function saveFreePdfSettings()')) {

s = s.replace(
'async function delReport(id) {',
`
function resetFreePdfPromo() {
  document.getElementById('freePdfPromoText').value = DEFAULT_FREE_PROMO;
}

async function saveFreePdfSettings() {

  localStorage.setItem(
    'freePdfPromoText',
    document.getElementById('freePdfPromoText').value
  );

  localStorage.setItem(
    'freePdfLink',
    document.getElementById('freePdfLink').value
  );

  const img1 = document.getElementById('freePdfImage1').files[0];
  const img2 = document.getElementById('freePdfImage2').files[0];

  function readFile(file) {
    return new Promise(resolve => {
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const base1 = await readFile(img1);
  const base2 = await readFile(img2);

  if (base1) localStorage.setItem('freePdfImage1', base1);
  if (base2) localStorage.setItem('freePdfImage2', base2);

  alert('무료 PDF 설정 저장 완료');
}

async function delReport(id) {
`
);

}

//
// showDash 로딩
//
if (!s.includes("freePdfPromoText').value")) {

s = s.replace(
"// 리포트 목록",
`document.getElementById('freePdfPromoText').value =
  localStorage.getItem('freePdfPromoText') || DEFAULT_FREE_PROMO;

document.getElementById('freePdfLink').value =
  localStorage.getItem('freePdfLink') || '';


// 리포트 목록`
);

}

fs.writeFileSync(file, s, 'utf8');

console.log('added free pdf settings ui');

