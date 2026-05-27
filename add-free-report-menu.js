const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`<option value="couple">연인 궁합 PDF</option>`,
`<option value="couple">연인 궁합 PDF</option>
          <option value="free">무료 기본사주 PDF</option>`
);

fs.writeFileSync(file, s, 'utf8');

console.log('added free report menu');
