<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>개인 상담</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root { --ink:#1a1209; --gold:#b8860b; --gold-l:#d4a843; --parchment:#f5ede0;
    --parch-d:#e0ceb4; --deep:#2c1810; --muted:#7a6652; --accent:#8b1a1a; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans KR', sans-serif; background: var(--parchment); color: var(--ink); min-height: 100vh; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 24px 18px 60px; }
  .nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px;
    background: rgba(255,253,248,0.9); border: 1px solid var(--parch-d); margin-bottom: 18px; }
  .nav .left { font-weight: 700; color: var(--deep); letter-spacing: 2px; }
  .nav button { background: transparent; border: 1px solid var(--parch-d); color: var(--muted);
    padding: 8px 14px; font-size: 12px; font-family: inherit; cursor: pointer; }

  .card { background: rgba(255,253,248,0.88); border: 1px solid var(--parch-d); padding: 24px 26px; margin-bottom: 16px; }
  .card-t { font-size: 11px; font-weight: 600; letter-spacing: 3px; color: var(--gold); margin-bottom: 14px; }
  label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px; }
  input, select { width: 100%; border: 1px solid var(--parch-d); padding: 11px 14px;
    background: rgba(255,255,255,0.7); font-family: inherit; font-size: 14px; outline: none; color: var(--ink); }
  select { cursor: pointer; }
  select:disabled { opacity: 0.5; cursor: not-allowed; }
  input:focus, select:focus { border-color: var(--gold); }
  input[type="checkbox"] { width: auto; margin-right: 6px; }
  .row { display: grid; gap: 10px; margin-bottom: 12px; }
  .row-2 { grid-template-columns: 1fr 1fr; }
  .row-3 { grid-template-columns: 1fr 1fr 1fr; }
  .row-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

  .toggle { display: flex; gap: 6px; }
  .toggle button { flex: 1; padding: 10px; border: 1px solid var(--parch-d); background: transparent;
    color: var(--muted); cursor: pointer; font-family: inherit; font-size: 13px; transition: all 0.15s; }
  .toggle button.active { background: var(--deep); color: var(--gold-l); border-color: var(--deep); }

  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .cat-item { padding: 14px 8px; border: 2px solid var(--parch-d); background: rgba(255,253,248,0.5);
    cursor: pointer; text-align: center; transition: all 0.15s; }
  .cat-item:hover { border-color: var(--gold); }
  .cat-item.active { border-color: var(--gold); background: rgba(184,134,11,0.12); }
  .cat-item .ic { font-size: 24px; margin-bottom: 4px; }
  .cat-item .tt { font-size: 12px; font-weight: 600; color: var(--deep); }
  @media(max-width:560px) {
    .wrap { padding: 14px 10px; }
    .nav { padding: 10px 14px; flex-wrap: wrap; gap: 8px; }
    .nav .left { font-size: 13px; flex: 1 1 100%; text-align: center; }
    .nav .right { flex: 1 1 100%; justify-content: center; }
    .card { padding: 16px 14px; }
    .card-t { font-size: 10px; letter-spacing: 2px; }
    .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .cat-item { padding: 12px 4px; }
    .cat-item .ic { font-size: 22px; }
    .cat-item .tt { font-size: 11px; }
    .row-3 { grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .row-2 { grid-template-columns: 1fr 1fr; gap: 6px; }
    input, select { padding: 10px 12px; font-size: 14px; }
    .result { padding: 22px 18px; }
    .result h2 { font-size: 18px; }
    .result .content { font-size: 13px; line-height: 2; }
    .chat-msg { max-width: 92%; }
  }

  .btn-main { width: 100%; padding: 16px; background: linear-gradient(135deg, var(--gold), #a07000);
    color: var(--deep); border: none; font-weight: 700; font-size: 15px; letter-spacing: 3px; cursor: pointer;
    font-family: 'Noto Serif KR', serif; }
  .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }

  .result { background: rgba(255,253,248,0.95); border: 2px solid var(--gold); padding: 32px 30px; }
  .result h2 { font-family: 'Noto Serif KR', serif; font-size: 22px; color: var(--deep); margin-bottom: 8px; letter-spacing: 2px; }
  .result .meta { font-size: 12px; color: var(--muted); margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--parch-d); }
  .result .content { font-size: 14px; line-height: 2.1; color: var(--ink); white-space: pre-wrap; }
  .result-actions { margin-top: 24px; display: flex; gap: 8px; }
  .result-actions button { flex: 1; padding: 12px; background: var(--deep); color: var(--gold-l);
    border: none; font-family: inherit; cursor: pointer; font-size: 13px; letter-spacing: 1px; }

  .loading { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 14px; }
  .loading .spin { font-size: 36px; margin-bottom: 14px; animation: spin 2s linear infinite; }
  @keyframes spin { 0%{transform:rotate(0);} 100%{transform:rotate(360deg);} }
  .hidden { display: none !important; }
  .err { color: var(--accent); font-size: 13px; text-align: center; padding: 10px; }

  .chat-msg { margin-bottom: 14px; max-width: 85%; }
  .chat-msg.user { margin-left: auto; }
  .chat-msg .bub { padding: 12px 16px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
  .chat-msg.user .bub { background: var(--deep); color: var(--gold-l); border-radius: 14px 14px 2px 14px; }
  .chat-msg.ai .bub { background: rgba(184,134,11,0.08); color: var(--ink); border: 1px solid var(--parch-d); border-radius: 2px 14px 14px 14px; }
  .chat-msg .time { font-size: 10px; color: var(--muted); margin-top: 4px; }
  .chat-msg.user .time { text-align: right; }
  .chat-msg .cp-btn { background: transparent; border: 1px solid var(--parch-d); color: var(--muted); padding: 3px 8px; font-size: 10px; font-family: inherit; cursor: pointer; float: right; margin-left: 8px; }
  .chat-msg .cp-btn:hover { border-color: var(--gold); color: var(--deep); }
  .loading-dots::after { content: '...'; animation: dots 1.5s infinite; }
  @keyframes dots { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
</style>
</head>
<body>
<script>
if (!localStorage.getItem('auth_token')) location.href = '/';
</script>
<div class="wrap">
  <div class="nav">
    <div class="left">📜 개인 상담</div>
    <button onclick="location.href='/'">← 대시보드</button>
  </div>

  <!-- 안내 문구 -->
  <div class="card" style="background:rgba(184,134,11,0.08);border-color:var(--gold);">
    <div class="card-t" style="color:var(--accent);">⚠️ 토큰 절약 필독 안내</div>
    <div style="font-size:13px;line-height:2;color:var(--ink);">
      <b>상담 1회당 AI 사용료가 실시간으로 발생합니다.</b><br>
      반드시 아래 팁을 참고해서 비용을 아껴 쓰세요.<br><br>

      <b>📌 상담 스타일 2가지 추천</b><br>
      ● <b>간단 상담</b>: 1000~2000자 선택 + 추가 질문 1~2번 (약 300~600원)<br>
      ● <b>자세한 상담</b>: 3000~4000자 선택 + 추가 질문 4~5번 (약 1000~2000원)<br><br>

      <b>💡 토큰 절약 팁</b><br>
      ● 같은 사람 상담은 <b>하단 "이전 상담 목록"에서 이어가기</b>로 재사용 (생년월일 재입력 없음)<br>
      ● 추가 질문은 <b>꼭 필요한 것만 모아서 한 번에</b> 질문하세요<br>
      ● 테스트할 땐 <b>1000자</b>로 해서 비용 최소화<br>
      ● <b>너무 많은 추가 질문은 비용이 금방 늘어납니다</b> (스스로 제한 두세요)<br>
      ● 이전 상담은 <b>90일간 자동 보관</b>되니 급하게 다시 질문 안 해도 됩니다
    </div>
  </div>

  <!-- 입력 폼 -->
  <div id="formScreen">
    <div class="card">
      <div class="card-t">상담자 정보</div>
      <div class="row">
        <label>이름</label>
        <input id="name" placeholder="홍길동">
      </div>
      <div class="row">
        <label>성별</label>
        <div class="toggle">
          <button data-g="남성" class="active" onclick="setG('남성')">남성</button>
          <button data-g="여성" onclick="setG('여성')">여성</button>
        </div>
      </div>
      <div class="row">
        <label>양력/음력</label>
        <div class="toggle">
          <button data-c="solar" class="active" onclick="setC('solar')">양력</button>
          <button data-c="lunar" onclick="setC('lunar')">음력</button>
        </div>
      </div>
      <div class="row row-3">
        <div><label>년</label><select id="year"></select></div>
        <div><label>월</label><select id="month"></select></div>
        <div><label>일</label><select id="day"></select></div>
      </div>
      <div class="row">
        <label><input type="checkbox" id="timeUnknown" onchange="toggleTimeUnknown()"> 시간을 모름 (정오 12시로 자동 설정)</label>
      </div>
      <div class="row">
        <label>태어난 시 (12지지)</label>
        <select id="hourSelect" onchange="setHourFromZodiac()">
          <option value="">선택하세요</option>
          <option value="0">자시 (子) · 23시~01시</option>
          <option value="2">축시 (丑) · 01시~03시</option>
          <option value="4">인시 (寅) · 03시~05시</option>
          <option value="6">묘시 (卯) · 05시~07시</option>
          <option value="8">진시 (辰) · 07시~09시</option>
          <option value="10">사시 (巳) · 09시~11시</option>
          <option value="12">오시 (午) · 11시~13시</option>
          <option value="14">미시 (未) · 13시~15시</option>
          <option value="16">신시 (申) · 15시~17시</option>
          <option value="18">유시 (酉) · 17시~19시</option>
          <option value="20">술시 (戌) · 19시~21시</option>
          <option value="22">해시 (亥) · 21시~23시</option>
        </select>
      </div>
      <input type="hidden" id="hour" value="">
      <input type="hidden" id="minute" value="0">
    </div>

    <div class="card">
      <div class="card-t">상담 분야 선택</div>
      <div class="cat-grid" id="catGrid"></div>
    </div>

    <div class="card">
      <div class="card-t">상담 글자 수 (길수록 비용 ↑)</div>
      <select id="lengthSelect">
        <option value="1000">1000자 (약 250원 · 짧고 가볍게)</option>
        <option value="1500">1500자 (약 350원 · 간단 상담)</option>
        <option value="2000">2000자 (약 500원)</option>
        <option value="2500">2500자 (약 600원)</option>
        <option value="3000" selected>3000자 (약 750원 · 추천)</option>
        <option value="3500">3500자 (약 900원)</option>
        <option value="4000">4000자 (약 1100원 · 가장 상세)</option>
      </select>
    </div>

    <button class="btn-main" id="submitBtn" onclick="submitConsult()">AI 상담 받기</button>
    <div id="errMsg" class="err"></div>

    <!-- 이전 상담 목록 -->
    <div class="card" style="margin-top:24px;">
      <div class="card-t">📂 이전 상담 목록 (생년월일 재입력 없이 다시 상담)</div>
      <div id="prevList" style="font-size:13px;"></div>
    </div>
  </div>

  <!-- 로딩 -->
  <div id="loadingScreen" class="hidden">
    <div class="card loading">
      <div class="spin">☯</div>
      <div>사주를 분석하고 있습니다...</div>
      <div style="font-size:12px;margin-top:10px;">약 20~30초 소요</div>
    </div>
  </div>

  <!-- 결과 -->
  <div id="resultScreen" class="hidden">
    <div class="result" id="resultBox"></div>
    <div class="result-actions">
      <button onclick="copyResult()">결과 복사</button>
      <button onclick="newConsult()">새 상담</button>
    </div>

    <!-- 추가 질문 채팅 -->
    <div class="card" id="chatBox" style="margin-top:24px;">
      <div class="card-t">💬 추가 질문하기</div>
      <div id="chatMsgs" style="margin-bottom:16px;max-height:500px;overflow-y:auto;"></div>
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <textarea id="chatInput" placeholder="궁금한 점을 물어보세요..." style="flex:1;min-height:60px;resize:vertical;" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendFollowup();}"></textarea>
        <button class="btn-main" id="chatSendBtn" onclick="sendFollowup()" style="min-width:80px;padding:14px;">전송</button>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px;">
        Enter로 전송 · Shift+Enter로 줄바꿈 · 대화는 자동 저장됩니다
      </div>
    </div>
  </div>
</div>

<script>
const CATEGORIES = [
  { key: 'general', ic: '🔮', title: '종합 운세' },
  { key: 'love', ic: '💕', title: '연애/결혼' },
  { key: 'career', ic: '💼', title: '직업/커리어' },
  { key: 'money', ic: '💰', title: '재물/돈' },
  { key: 'health', ic: '🌿', title: '건강' },
  { key: 'business', ic: '🏪', title: '사업운' },
  { key: 'study', ic: '🎓', title: '학업/시험' },
  { key: 'move', ic: '🏠', title: '이사/방향' },
  { key: 'children', ic: '👶', title: '자녀운' },
  { key: 'helper', ic: '🤝', title: '귀인운' },
  { key: 'year', ic: '📅', title: '올해 운세' },
  { key: 'month', ic: '🗓️', title: '이번 달' },
];

let selectedGender = '남성';
let selectedCal = 'solar';
let selectedCat = null;
let currentResult = null;
let currentConsultId = parseInt(localStorage.getItem('last_consult_id')) || null;
let timeUnknownFlag = false;

// 년/월/일 select 초기화
(function initDateSelects() {
  const yearSel = document.getElementById('year');
  const now = new Date().getFullYear();
  yearSel.innerHTML = '<option value="">년도</option>';
  for (let y = now; y >= 1930; y--) {
    yearSel.innerHTML += `<option value="${y}">${y}년</option>`;
  }
  const monthSel = document.getElementById('month');
  monthSel.innerHTML = '<option value="">월</option>';
  for (let m = 1; m <= 12; m++) {
    monthSel.innerHTML += `<option value="${m}">${m}월</option>`;
  }
  const daySel = document.getElementById('day');
  daySel.innerHTML = '<option value="">일</option>';
  for (let d = 1; d <= 31; d++) {
    daySel.innerHTML += `<option value="${d}">${d}일</option>`;
  }
})();

function toggleTimeUnknown() {
  timeUnknownFlag = document.getElementById('timeUnknown').checked;
  const hs = document.getElementById('hourSelect');
  hs.disabled = timeUnknownFlag;
  if (timeUnknownFlag) {
    hs.value = '';
    document.getElementById('hour').value = '12';
  } else {
    document.getElementById('hour').value = '';
  }
}
function setHourFromZodiac() {
  const h = document.getElementById('hourSelect').value;
  document.getElementById('hour').value = h;
}

function setG(g) { selectedGender = g; document.querySelectorAll('[data-g]').forEach(b => b.classList.toggle('active', b.dataset.g === g)); }
function setC(c) { selectedCal = c; document.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('active', b.dataset.c === c)); }

function renderCats() {
  document.getElementById('catGrid').innerHTML = CATEGORIES.map(c =>
    `<div class="cat-item" data-k="${c.key}" onclick="selectCat('${c.key}')"><div class="ic">${c.ic}</div><div class="tt">${c.title}</div></div>`
  ).join('');
}
function selectCat(k) { selectedCat = k; document.querySelectorAll('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.k === k)); }
renderCats();

// 이전 상담 목록
async function loadPrevList() {
  try {
    const res = await fetch('/api/personal-consults', {
      headers: { 'x-auth-token': localStorage.getItem('auth_token') }
    });
    const { consults } = await res.json();
    const box = document.getElementById('prevList');
    if (!consults || !consults.length) {
      box.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">아직 이전 상담이 없습니다</div>';
      return;
    }
    const catMap = {general:'🔮 종합',love:'💕 연애',career:'💼 직업',money:'💰 재물',health:'🌿 건강',business:'🏪 사업',study:'🎓 학업',move:'🏠 이사',children:'👶 자녀',helper:'🤝 귀인',year:'📅 올해',month:'🗓️ 이번달'};
    box.innerHTML = consults.map(c => {
      const d = new Date(c.updated_at).toLocaleDateString('ko-KR');
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:1px solid var(--parch-d);margin-bottom:6px;background:rgba(255,253,248,0.6);">
        <div>
          <div style="font-weight:600;color:var(--deep);">${escapeHtml(c.client_name)} (${escapeHtml(c.client_gender || '')}) · ${catMap[c.category] || c.category}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px;">${d} · 추가질문 ${Math.max(0, (c.msg_count || 1) - 1)}회</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button onclick="reopenConsult(${c.id})" style="padding:6px 12px;font-size:11px;background:var(--deep);color:var(--gold-l);border:none;cursor:pointer;">이어가기</button>
          <button onclick="delPrev(${c.id})" style="padding:6px 12px;font-size:11px;background:transparent;border:1px solid var(--parch-d);color:var(--muted);cursor:pointer;">삭제</button>
        </div>
      </div>`;
    }).join('');
  } catch (e) { console.error(e); }
}

async function reopenConsult(id) {
  try {
    const res = await fetch('/api/personal-consults/' + id, {
      headers: { 'x-auth-token': localStorage.getItem('auth_token') }
    });
    const { consult, messages } = await res.json();
    currentConsultId = consult.id;
    currentResult = { title: '', content: consult.initial_result };

    document.getElementById('resultBox').innerHTML = `
      <h2>${escapeHtml(consult.client_name)} 님 · 이전 상담 이어가기</h2>
      <div class="meta">${consult.saju_data.fullKorean} · 일간 ${consult.saju_data.dayMaster.korean}(${consult.saju_data.dayMaster.element})</div>
      <div class="content">${escapeHtml(consult.initial_result)}</div>
    `;

    const chatBox = document.getElementById('chatMsgs');
    chatBox.innerHTML = '';
    for (let i = 1; i < messages.length; i++) {
      const m = messages[i];
      const t = new Date(m.created_at).toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'});
      if (m.role === 'user') {
        chatBox.insertAdjacentHTML('beforeend',
          `<div class="chat-msg user"><div class="bub">${escapeHtml(m.content)}</div><div class="time">${t}</div></div>`);
      } else {
        const esc = m.content.replace(/`/g,'\\`').replace(/\$/g,'\\$');
        chatBox.insertAdjacentHTML('beforeend',
          `<div class="chat-msg ai"><div class="bub">${escapeHtml(m.content)}</div><div class="time">${t}<button class="cp-btn" onclick="navigator.clipboard.writeText(\`${esc}\`);alert('복사됨')">복사</button></div></div>`);
      }
    }

    document.getElementById('formScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
    window.scrollTo(0, 0);
  } catch (e) { alert('불러오기 실패: ' + e.message); }
}

async function delPrev(id) {
  if (!confirm('이 상담을 삭제할까요? 복구할 수 없습니다')) return;
  await fetch('/api/personal-consults/' + id, {
    method: 'DELETE',
    headers: { 'x-auth-token': localStorage.getItem('auth_token') }
  });
  loadPrevList();
}

loadPrevList();

async function submitConsult() {
  const name = document.getElementById('name').value.trim();
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  const day = document.getElementById('day').value;
  const hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value || 0;
  const err = document.getElementById('errMsg');
  err.textContent = '';

  if (!name) { err.textContent = '이름을 입력해주세요'; return; }
  if (!year || !month || !day) { err.textContent = '생년월일을 모두 선택해주세요'; return; }
  if (!timeUnknownFlag && hour === '') { err.textContent = '태어난 시를 선택하거나 "시간을 모름"을 체크해주세요'; return; }
  if (!selectedCat) { err.textContent = '상담 분야를 선택해주세요'; return; }

  const userName = localStorage.getItem('current_user_name') || '';
  const apiKey = localStorage.getItem('openai_api_key_' + userName);
  if (!apiKey) { err.textContent = 'OpenAI API 키가 없습니다. 대시보드에서 먼저 저장해주세요'; return; }

  const length = parseInt(document.getElementById('lengthSelect').value) || 3000;

  document.getElementById('formScreen').classList.add('hidden');
  document.getElementById('loadingScreen').classList.remove('hidden');

  try {
    const res = await fetch('/api/personal-consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('auth_token') },
      body: JSON.stringify({
        apiKey, name, gender: selectedGender,
        year, month, day, hour, minute,
        isLunar: selectedCal === 'lunar',
        category: selectedCat,
        length
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || '오류');

    currentResult = json.result;
    currentConsultId = json.consultId;
    localStorage.setItem('last_consult_id', String(json.consultId));
    const saju = json.saju;
    document.getElementById('resultBox').innerHTML = `
      <h2>${escapeHtml(name)} 님 · ${escapeHtml(json.result.title)}</h2>
      <div class="meta">${saju.fullKorean} · 일간 ${saju.dayMaster.korean}(${saju.dayMaster.element}) · ${saju.strength.label}</div>
      <div class="content">${escapeHtml(json.result.content)}</div>
    `;
    // 채팅창 초기화
    document.getElementById('chatMsgs').innerHTML = '';
    document.getElementById('chatInput').value = '';
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
  } catch (e) {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('formScreen').classList.remove('hidden');
    err.textContent = '오류: ' + e.message;
  }
}

function copyResult() {
  if (!currentResult) return;
  navigator.clipboard.writeText(currentResult.content);
  alert('결과가 복사되었습니다');
}

function newConsult() {
  currentResult = null;
  currentConsultId = null;
  localStorage.removeItem('last_consult_id');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('formScreen').classList.remove('hidden');
  document.getElementById('chatMsgs').innerHTML = '';
  loadPrevList();
  window.scrollTo(0, 0);
}

async function sendFollowup() {
  const input = document.getElementById('chatInput');
  if (!input) { alert('입력란을 찾을 수 없어요'); return; }
  const question = input.value.trim();
  if (!question) { alert('질문을 입력해주세요'); return; }
  
  if (!currentConsultId) {
    alert('상담을 먼저 완료해주세요\n(currentConsultId가 없어요)');
    return;
  }

  const userName = localStorage.getItem('current_user_name') || '';
  const apiKey = localStorage.getItem('openai_api_key_' + userName);
  if (!apiKey) { alert('OpenAI API 키가 없습니다'); return; }

  const btn = document.getElementById('chatSendBtn');
  btn.disabled = true; btn.textContent = '...';
  input.value = '';

  const box = document.getElementById('chatMsgs');
  const now = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'});

  // 유저 메시지 즉시 표시
  box.insertAdjacentHTML('beforeend',
    `<div class="chat-msg user"><div class="bub">${escapeHtml(question)}</div><div class="time">${now}</div></div>`);
  box.insertAdjacentHTML('beforeend',
    `<div class="chat-msg ai" id="loadMsg"><div class="bub"><span class="loading-dots">답변 생성 중</span></div></div>`);
  box.scrollTop = box.scrollHeight;

  try {
    const res = await fetch('/api/personal-consults/' + currentConsultId + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('auth_token') },
      body: JSON.stringify({ question, apiKey })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || '오류');

    document.getElementById('loadMsg')?.remove();
    const t = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit'});
    const escaped = json.answer.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    box.insertAdjacentHTML('beforeend',
      `<div class="chat-msg ai"><div class="bub">${escapeHtml(json.answer)}</div><div class="time">${t}<button class="cp-btn" onclick="navigator.clipboard.writeText(\`${escaped}\`);alert('복사됨')">복사</button></div></div>`);
    box.scrollTop = box.scrollHeight;
  } catch (e) {
    document.getElementById('loadMsg')?.remove();
    alert('오류: ' + e.message);
  } finally {
    btn.disabled = false; btn.textContent = '전송';
  }
}

function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
</script>
</body>
</html>

