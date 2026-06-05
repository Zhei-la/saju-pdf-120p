const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf('async function makeResult(){');

if(start === -1){
  console.log('makeResult not found');
  process.exit(1);
}

const after = s.substring(start);

const nextFunc =
  after.indexOf('function fakeMonths');

if(nextFunc === -1){
  console.log('fakeMonths not found');
  process.exit(1);
}

const head = s.substring(0, start);

const tail =
  after.substring(nextFunc);

const fixed = `
async function makeResult(){
  const name=nameInput();
  const birth=document.getElementById('birth').value.trim();
  const gender=document.getElementById('gender').value;
  const calendar=document.getElementById('calendar').value;
  const birthTime=document.getElementById('birthTime').value;

  if(!name){alert('이름을 입력해주세요');return}
  if(!birth){alert('생년월일을 입력해주세요');return}

  form.style.display='none';
  loading.style.display='block';

  const res=await fetch('/api/free-saju/calc',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      name,
      birth,
      gender,
      calendar,
      birthTime
    })
  });

  const data=await res.json();

  if(!res.ok){
    loading.style.display='none';
    form.style.display='block';
    alert(data.error||'사주 계산 실패');
    return;
  }

  loading.style.display='none';
  result.style.display='block';

  resultTitle.textContent=name+'님의 사주풀이';

  profileText.innerHTML=
    \`양 \${data.profile.solarDate}<br>
     음 \${data.profile.lunarDate}<br>
     \${birthTime}\`;

  const [yg,yj]=splitPillar(data.pillars.year);
  const [mg,mj]=splitPillar(data.pillars.month);
  const [dg,dj]=splitPillar(data.pillars.day);
  const [hg,hj]=splitPillar(data.pillars.hour);

  put('yGan',yg);
  put('yJi',yj);

  put('mGan',mg);
  put('mJi',mj);

  put('dGan',dg);
  put('dJi',dj);

  put('hGan',hg);
  put('hJi',hj);

  const tg = data.tenGods?.stem || {};
  const btg = data.tenGods?.branch || {};
  const hs = data.hiddenStems || {};
  const ts = data.twelveStates || {};
  const gods = data.twelveGods || {};

  put('hTen', tg.hour || '-');
  put('dTen', tg.day || '-');
  put('mTen', tg.month || '-');
  put('yTen', tg.year || '-');

  put('hJiSub', btg.hour || '-');
  put('dJiSub', btg.day || '-');
  put('mJiSub', btg.month || '-');
  put('yJiSub', btg.year || '-');

  put('hHidden', stemListToKorean(hs.hour));
  put('dHidden', stemListToKorean(hs.day));
  put('mHidden', stemListToKorean(hs.month));
  put('yHidden', stemListToKorean(hs.year));

  put('hUn', ts.hour || '-');
  put('dUn', ts.day || '-');
  put('mUn', ts.month || '-');
  put('yUn', ts.year || '-');

  put('hGod', gods.hour || '-');
  put('dGod', gods.day || '-');
  put('mGod', gods.month || '-');
  put('yGod', gods.year || '-');

  makeLuck('daeunRow',data.daeyun||[]);
  makeLuck('yearRow',data.yearly||[]);
  makeLuck('monthRow',data.months||[]);
}
`;

fs.writeFileSync(
  file,
  head + fixed + '\n' + tail,
  'utf8'
);

console.log('makeResult fully restored');
