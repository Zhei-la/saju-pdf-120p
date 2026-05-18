const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// 메뉴명 변경
s = s.replace(
  /<option value="deep" selected>인생 사주 심층분석 PDF<\/option>/g,
  '<option value="deep" selected>인생 종합 사주 분석서 PDF</option>'
);

// REPORT_META 변경
s = s.replace(
  /deep: \{ title: '사주 심층 분석서', sub: 'DEEP SAJU REPORT', label: '사주 심층 분석서' \}/g,
  "deep: { title: '인생 종합 사주 분석서', sub: 'LIFE SAJU ANALYSIS REPORT', label: '인생 종합 사주 분석서' }"
);

s = s.replace(
  /full: \{ title: '사주 심층 분석서', sub: 'DEEP SAJU REPORT', label: '사주 심층 분석서' \}/g,
  "full: { title: '인생 종합 사주 분석서', sub: 'LIFE SAJU ANALYSIS REPORT', label: '인생 종합 사주 분석서' }"
);

// 다운로드 파일명 변경
s = s.replace(
  /deep: '사주심층분석서'/g,
  "deep: '인생종합사주분석서'"
);

s = s.replace(
  /full: '사주심층분석서'/g,
  "full: '인생종합사주분석서'"
);

// PART 제목 강화
s = s.replace(
  /PART 1\. 사주 원국 핵심/g,
  'PART 1. 사주 원국과 타고난 기질'
);

s = s.replace(
  /PART 2\. 오행과 십성 심화/g,
  'PART 2. 오행과 감정 구조'
);

s = s.replace(
  /PART 3\. 연애·결혼 흐름/g,
  'PART 3. 연애·결혼·인간관계 흐름'
);

s = s.replace(
  /PART 4\. 재물·직업 흐름/g,
  'PART 4. 재물·직업·사업운 흐름'
);

s = s.replace(
  /PART 5\. 인생 굴곡과 운명/g,
  'PART 5. 대운과 인생 흐름'
);

s = s.replace(
  /PART 8\. 종합 조언·개운법/g,
  'PART 8. 용신과 인생 방향성'
);

fs.writeFileSync(file, s, 'utf8');

console.log('upgraded life saju branding');
