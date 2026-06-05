const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const scriptStart = s.indexOf('<script>');
const scriptEnd = s.lastIndexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
  console.error('script tag not found');
  process.exit(1);
}

const newScript = `<script>
let siteData={brandName:'무료 사주풀이',kakaoLink:'#',introText:''};

async function loadBrand(){
  const slug=location.pathname.split('/').pop();
  try{
    const res=await fetch('/api/free-site/'+slug);
    if(res.ok){ siteData=(await res.json()).site; }
  }catch(e){}
  brandTop.textContent=siteData.brandName || '무료 사주풀이';
  if(siteData.introText) intro.textContent=siteData.introText;
}

function startForm(){hero.style.display='none';form.style.display='block'}
function backHero(){form.style.display='none';hero.style.display='block'}
function editAgain(){result.style.display='none';form.style.display='block'}
function nameInput(){return document.getElementById('name').value.trim()}
function put(id,v){const el=document.getElementById(id); if(el) el.innerHTML=v}

function splitPillar(p){
  if(!p || p==='미상') return ['-','-'];
  return [p[0],p[1]];
}

function stemListToKorean(arr){
  const map={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계'};
  return (arr || []).map(x => map[x] || x).join('');
}

function makeLuck(rowId, items){
  const row=document.getElementById(rowId);
  row.innerHTML='';
  if(!items || !items.length){
    row.innerHTML='<div class="muted">표시할 데이터 없음</div>';
    return;
  }

  const ganKor={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계',子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해'};
  const displayItems=[...items].reverse();

  displayItems.forEach(x=>{
    const p=x.pillar || '--';
    const gan=p[0] || '-';
    const ji=p[1] || '-';
    const kor=(ganKor[gan]||'')+(ganKor[ji]||'');
    const top=x.age ? x.age+'세' : (x.year || x.month || '');

    row.innerHTML += \`
      <div class="luck-card">
        <div class="luck-top">\${top}</div>
        <div class="luck-ten">\${x.tenGod || ''}</div>
        <div class="luck-box">
          <div class="luck-gan">\${gan}</div>
          <div class="luck-ji">\${ji}</div>
        </div>
        <div class="luck-kor">\${kor}</div>
        <div class="luck-bottom">\${x.twelveState || x.label || ''}</div>
      </div>
    \`;
  });
}

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
    body:JSON.stringify({name,birth,gender,calendar,birthTime})
  });

  const data=await res.json();

  if(!res.ok){
    loading.style.display='none';
    form.style.display='block';
    alert(data.error || '사주 계산 실패');
    return;
  }

  loading.style.display='none';
  result.style.display='block';

  resultTitle.textContent=name+'님의 사주풀이';
  profileText.innerHTML=\`양 \${data.profile.solarDate}<br>음 \${data.profile.lunarDate}<br>\${birthTime}\`;

  const [yg,yj]=splitPillar(data.pillars.year);
  const [mg,mj]=splitPillar(data.pillars.month);
  const [dg,dj]=splitPillar(data.pillars.day);
  const [hg,hj]=splitPillar(data.pillars.hour);

  put('yGan',yg); put('yJi',yj);
  put('mGan',mg); put('mJi',mj);
  put('dGan',dg); put('dJi',dj);
  put('hGan',hg); put('hJi',hj);

  const tg=data.tenGods?.stem || {};
  const btg=data.tenGods?.branch || {};
  const hs=data.hiddenStems || {};
  const ts=data.twelveStates || {};
  const gods=data.twelveGods || {};

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

  const e=data.elementPercent || {};
  const wood=e.목||0, fire=e.화||0, earth=e.토||0, metal=e.금||0, water=e.수||0;

  if(typeof woodP!=='undefined') woodP.textContent=wood+'%';
  if(typeof fireP!=='undefined') fireP.textContent=fire+'%';
  if(typeof earthP!=='undefined') earthP.textContent=earth+'%';
  if(typeof metalP!=='undefined') metalP.textContent=metal+'%';
  if(typeof waterP!=='undefined') waterP.textContent=water+'%';

  if(typeof relWood!=='undefined') relWood.innerHTML='목<br>'+wood+'%';
  if(typeof relFire!=='undefined') relFire.innerHTML='화<br>'+fire+'%';
  if(typeof relEarth!=='undefined') relEarth.innerHTML='토<br>'+earth+'%';
  if(typeof relMetal!=='undefined') relMetal.innerHTML='금<br>'+metal+'%';
  if(typeof relWater!=='undefined') relWater.innerHTML='수<br>'+water+'%';

  if(typeof mainElement!=='undefined'){
    const maxName=Object.entries(e).sort((a,b)=>b[1]-a[1])[0]?.[0] || '목';
    mainElement.textContent=maxName;
  }

  makeLuck('daeunRow',data.daeyun || []);
  makeLuck('yearRow',data.yearly || []);
  makeLuck('monthRow',data.months || []);

  if(typeof summary!=='undefined') summary.textContent=data.summary || '';
}

function goKakao(){
  if(!siteData.kakaoLink || siteData.kakaoLink==='#'){
    alert('상담 링크가 설정되지 않았습니다.');
    return;
  }
  location.href=siteData.kakaoLink;
}

loadBrand();
</script>`;

s = s.slice(0, scriptStart) + newScript + s.slice(scriptEnd + '</script>'.length);

fs.writeFileSync(file, s, 'utf8');

console.log('u.html script fully restored');
