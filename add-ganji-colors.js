const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const helper = `
function elementColorOf(ch){
  const map = {
    甲:'#4B7D9B', 乙:'#4B7D9B', 寅:'#4B7D9B', 卯:'#4B7D9B',
    丙:'#E46B6B', 丁:'#E46B6B', 巳:'#E46B6B', 午:'#E46B6B',
    戊:'#D1A05A', 己:'#D1A05A', 辰:'#D1A05A', 戌:'#D1A05A', 丑:'#D1A05A', 未:'#D1A05A',
    庚:'#8A8A8A', 辛:'#8A8A8A', 申:'#8A8A8A', 酉:'#8A8A8A',
    壬:'#2F4F6F', 癸:'#2F4F6F', 子:'#2F4F6F', 亥:'#2F4F6F'
  };
  return map[ch] || '#b58220';
}

function colorGanjiCells(){
  ['hGan','dGan','mGan','yGan','hJi','dJi','mJi','yJi'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el) return;
    const ch=(el.textContent||'').trim()[0];
    el.style.color=elementColorOf(ch);
  });
}
`;

if(!s.includes('function elementColorOf')){
  s = s.replace('function stemListToKorean', helper + '\nfunction stemListToKorean');
}

if(!s.includes('colorGanjiCells();')){
  s = s.replace(
    "put('hJi',hj);",
    "put('hJi',hj);\n\n  colorGanjiCells();"
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('ganji element colors added');
