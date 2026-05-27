const fs = require('fs');

const file = 'public/home.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
/<div>\s*<div style="font-weight:700;margin-bottom:8px;">마지막 페이지 이미지 1<\/div>[\s\S]*?<div>\s*<div style="font-weight:700;margin-bottom:8px;">마지막 페이지 이미지 2<\/div>[\s\S]*?<\/div>/,
`<div>
  <div style="font-weight:700;margin-bottom:8px;">무료 PDF 추가 이미지 / 후기 이미지</div>
  <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">
    이미지는 최대 10장까지 넣을 수 있습니다. 등록한 이미지만 PDF 마지막에 추가됩니다.
  </div>
  ${Array.from({length:10},(_,i)=>`
    <div style="margin-bottom:8px;">
      <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:4px;">이미지 ${i+1}</label>
      <input id="freePdfImage${i+1}" type="file" accept="image/*">
    </div>`).join('')}
</div>`
);

s = s.replace(
/const img1 = document\.getElementById\('freePdfImage1'\)\.files\[0\];[\s\S]*?if \(base2\) localStorage\.setItem\('freePdfImage2', base2\);/,
`for (let i = 1; i <= 10; i++) {
    const file = document.getElementById('freePdfImage' + i)?.files?.[0];
    const base = await readFile(file);
    if (base) localStorage.setItem('freePdfImage' + i, base);
  }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('enabled up to 10 free PDF images');
