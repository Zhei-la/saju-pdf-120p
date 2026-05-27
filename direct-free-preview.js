const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

// generateReport 안에서 버튼 누르자마자 free면 바로 미리보기 생성
s = s.replace(
  /const btn = document\.getElementById\('genBtn'\);\s*btn\.disabled = true; btn\.textContent = '생성 중\.\.\.';/,
`const btn = document.getElementById('genBtn');
  btn.disabled = true; btn.textContent = '생성 중...';

  if (selectedReportType === 'free') {
    currentUserInfo = {
      name,
      gender,
      year: yearN,
      month: monthN,
      day: dayN,
      hour: timeUnknown ? null : hour,
      minute,
      city: cityKey,
      isLunar: selectedCalendar === 'lunar',
      timeUnknown,
      reportType: 'free',
      saju: null
    };

    const res = await fetch('/api/generate-free-saju-only', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('auth_token') || ''
      },
      body: JSON.stringify({ name, gender, year: yearN, month: monthN, day: dayN, hour, minute, isLunar: selectedCalendar === 'lunar', timeUnknown, city: cityKey })
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || '무료 사주 계산 실패');

    currentUserInfo.saju = json.saju;
    currentChapters = json.chapters;
    renderPreview();

    btn.disabled = false;
    btn.textContent = '리포트 생성 시작';
    showStatus('genStatus', '무료 기본사주 PDF 미리보기 생성 완료', 'ok');
    return;
  }`
);

fs.writeFileSync(file, s, 'utf8');
console.log('made free PDF preview generate directly');
