const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const newCss = `
.luck-row{
  display:flex;
  gap:10px;
  overflow-x:auto;
  padding:8px 0 14px;
}

.luck-card{
  min-width:62px;
  flex:0 0 auto;
  text-align:center;
}

.luck-top{
  font-size:11px;
  color:#5c4d43;
  margin-bottom:2px;
}

.luck-ten{
  font-size:10px;
  color:#7a6757;
  margin-bottom:3px;
  min-height:14px;
}

.luck-box{
  border:1px solid #cb9839;
  border-radius:7px;
  overflow:hidden;
  background:#f0bf63;
  box-shadow:0 2px 0 rgba(0,0,0,.08);
}

.luck-gan,
.luck-ji{
  height:34px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:26px;
  font-weight:900;
  color:#3b2b18;
}

.luck-gan{
  border-bottom:1px solid rgba(80,50,10,.15);
}

.luck-kor{
  margin-top:4px;
  font-size:10px;
  color:#5f5347;
}

.luck-bottom{
  margin-top:2px;
  font-size:10px;
  color:#7c6b5b;
}
`;

s = s.replace(
  /\.luck-row\{[\s\S]*?\.luck-sub\{[\s\S]*?\}/,
  newCss
);

const newMakeLuck = `
const ganKor = {
  甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',
  己:'기',庚:'경',辛:'신',壬:'임',癸:'계',
  子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',
  巳:'사',午:'오',未:'미',申:'신',酉:'유',
  戌:'술',亥:'해'
};

function makeLuck(rowId, items){
  const row = document.getElementById(rowId);
  row.innerHTML = '';

  if(!items || !items.length){
    row.innerHTML = '<div class="muted">표시할 데이터 없음</div>';
    return;
  }

  const displayItems = [...items].reverse();

  displayItems.forEach(x => {
    const p = x.pillar || '--';
    const gan = p[0] || '-';
    const ji = p[1] || '-';
    const kor = (ganKor[gan] || '') + (ganKor[ji] || '');

    const top = x.age
      ? x.age + '세'
      : (x.year || x.month || '');

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
`;

s = s.replace(
  /function makeLuck\(rowId,[\s\S]*?\n\}/,
  newMakeLuck
);

fs.writeFileSync(file, s, 'utf8');
console.log('u.html luck UI updated');
