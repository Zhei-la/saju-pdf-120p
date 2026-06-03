const fs = require('fs');
const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const css = `
.manse-table{
  width:100%;
  border-collapse:collapse;
  margin-top:18px;
  text-align:center;
  table-layout:fixed;
}

.manse-table th{
  font-size:13px;
  padding:7px;
  color:#3f352d;
  font-weight:900;
}

.manse-table td{
  border:1px solid #bdb6af;
  padding:4px 3px;
  background:#fff;
  position:relative;
  height:42px;
}

.big-kanji{
  display:inline-block;
  font-size:31px;
  font-weight:900;
  color:#222;
  line-height:1;
}

.big-kanji .han{
  display:inline-block;
  background:#cfcfcf;
  padding:2px 5px;
  line-height:1;
}

.big-kanji .kor{
  font-size:18px;
  margin-left:2px;
  color:#222;
}

.sub{
  display:inline-block;
  font-size:12px;
  color:#3a3028;
  margin-top:2px;
}

.element-tag{
  position:absolute;
  right:2px;
  bottom:2px;
  font-size:12px;
  background:#cfcfcf;
  color:#222;
  padding:1px 3px;
  font-weight:800;
}

.manse-label{
  background:#cfcfcf;
  padding:1px 3px;
  display:inline-block;
}
`;

s = s.replace(
  /\.manse-table\{[\s\S]*?\.sub\{[\s\S]*?\}/,
  css
);

const script = `
function renderGanjiCell(id, value){
  const el = document.getElementById(id);
  if(!el) return;

  const map = {
    甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',
    己:'기',庚:'경',辛:'신',壬:'임',癸:'계',
    子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',
    巳:'사',午:'오',未:'미',申:'신',酉:'유',
    戌:'술',亥:'해'
  };

  const elem = {
    甲:'+목',乙:'-목',丙:'+화',丁:'-화',戊:'+토',
    己:'-토',庚:'+금',辛:'-금',壬:'+수',癸:'-수',
    子:'+수',丑:'-토',寅:'+목',卯:'-목',辰:'+토',
    巳:'-화',午:'+화',未:'-토',申:'+금',酉:'-금',
    戌:'+토',亥:'-수'
  };

  if(!value || value === '-'){
    el.innerHTML = '-';
    return;
  }

  el.innerHTML =
    '<span class="han">' + value + '</span>' +
    '<span class="kor">' + (map[value] || '') + '</span>' +
    '<span class="element-tag">' + (elem[value] || '') + '</span>';
}
`;

if(!s.includes('function renderGanjiCell')){
  s = s.replace('function splitPillar', script + '\nfunction splitPillar');
}

s = s.replace(
  /put\('yGan',yg\); put\('yJi',yj\); put\('mGan',mg\); put\('mJi',mj\); put\('dGan',dg\); put\('dJi',dj\); put\('hGan',hg\); put\('hJi',hj\);/,
  `renderGanjiCell('yGan', yg);
  renderGanjiCell('yJi', yj);
  renderGanjiCell('mGan', mg);
  renderGanjiCell('mJi', mj);
  renderGanjiCell('dGan', dg);
  renderGanjiCell('dJi', dj);
  renderGanjiCell('hGan', hg);
  renderGanjiCell('hJi', hj);`
);

fs.writeFileSync(file, s, 'utf8');
console.log('manse table style updated');
