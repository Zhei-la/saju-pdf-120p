const fs = require('fs');
const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

const helper = `
function stemListToKorean(arr){
  const map = {
    甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',
    己:'기',庚:'경',辛:'신',壬:'임',癸:'계'
  };

  return (arr || []).map(x => (map[x] || x) + x).join(' ');
}
`;

if(!s.includes('function stemListToKorean')){
  s = s.replace('function makeResult', helper + '\nfunction makeResult');
}

s = s.replace(
  /put\('hHidden', \(hs\.hour \|\| \[\]\)\.join\(''\)\);/,
  "put('hHidden', stemListToKorean(hs.hour));"
);

s = s.replace(
  /put\('dHidden', \(hs\.day \|\| \[\]\)\.join\(''\)\);/,
  "put('dHidden', stemListToKorean(hs.day));"
);

s = s.replace(
  /put\('mHidden', \(hs\.month \|\| \[\]\)\.join\(''\)\);/,
  "put('mHidden', stemListToKorean(hs.month));"
);

s = s.replace(
  /put\('yHidden', \(hs\.year \|\| \[\]\)\.join\(''\)\);/,
  "put('yHidden', stemListToKorean(hs.year));"
);

fs.writeFileSync(file, s, 'utf8');
console.log('hidden stems korean labels added');
