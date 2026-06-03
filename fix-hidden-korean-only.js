const fs = require('fs');

const file = 'public/u.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`function stemListToKorean(arr){
  const map = {
    甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',
    己:'기',庚:'경',辛:'신',壬:'임',癸:'계'
  };

  return (arr || []).map(x => (map[x] || x) + x).join(' ');
}`,
`function stemListToKorean(arr){
  const map = {
    甲:'갑',
    乙:'을',
    丙:'병',
    丁:'정',
    戊:'무',
    己:'기',
    庚:'경',
    辛:'신',
    壬:'임',
    癸:'계'
  };

  return (arr || []).map(x => map[x] || x).join(' ');
}`
);

fs.writeFileSync(file, s, 'utf8');

console.log('hidden stems korean-only updated');
