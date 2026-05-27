const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf('async function generateReport()');
const end = s.indexOf('function renderPreview()', start);

if (start === -1 || end === -1) {
  throw new Error('generateReport 함수 위치를 찾지 못했습니다');
}

const fixed = `
async function generateReport() {
  selectedReportType = document.getElementById('reportMenuSelect')?.value || selectedReportType;

  const apiKey = getApiKey();
  if (!apiKey) {
    showStatus('genStatus', 'OpenAI API 키를 먼저 저장해주세요.', 'err');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  const day = document.getElementById('day').value;
  const isTimeUnknown = document.getElementById('timeUnknown').checked;
  const cityKey = document.getElementById('city').value;

  if (!name) return showStatus('genStatus', '이름을 입력해주세요.', 'err');
  if (!year || !month || !day) return showStatus('genStatus', '생년월일을 모두 입력해주세요.', 'err');

  let hourVal, minuteVal;
  if (isTimeUnknown) {
    hourVal = null;
    minuteVal = null;
  } else {
    const hv = document.getElementById('hour').value;
    if (hv === '') return showStatus('genStatus', '태어난 시간을 선택하거나 시간을 모름을 체크해주세요.', 'err');
    hourVal = parseInt(hv);
    minuteVal = parseInt(document.getElementById('minute').value) || 0;
  }

  let yearN = parseInt(year), monthN = parseInt(month), dayN = parseInt(day);

  if (!isTimeUnknown) {
    const adjusted = applyCityOffset(hourVal, minuteVal, cityKey);
    hourVal = adjusted.hour;
    minuteVal = adjusted.minute;

    if (adjusted.dayShift !== 0) {
      const d = new Date(yearN, monthN - 1, dayN);
      d.setDate(d.getDate() + adjusted.dayShift);
      yearN = d.getFullYear();
      monthN = d.getMonth() + 1;
      dayN = d.getDate();
    }
  }

  const data = {
    apiKey,
    name,
    gender: selectedGender,
    year: yearN,
    month: monthN,
    day: dayN,
    hour: hourVal,
    minute: minuteVal,
    timeUnknown: isTimeUnknown,
    city: cityKey,
    isLunar: selectedCalendar === 'lunar',
    reportType: selectedReportType
  };

  const btn = document.getElementById('genBtn');
  btn.disabled = true;
  btn.textContent = '생성 중...';

  const chapCount = selectedReportType === 'free' ? 5 : (selectedReportType === 'half' ? 20 : 40);
  const timeEst = selectedReportType === 'free' ? '약 1분' : (selectedReportType === 'half' ? '약 2~3분' : '약 3~5분');

  showStatus('genStatus', \`<span class="loader"></span>\${chapCount}챕터 분석 중... \${timeEst} 소요됩니다. 잠시만 기다려주세요.\`, 'loading');

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('auth_token') || ''
      },
      body: JSON.stringify(data)
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error('서버 응답이 JSON이 아닙니다: ' + text.slice(0, 120));
    }

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || '리포트 생성 실패');

    currentUserInfo = json.userInfo;
    currentUserInfo.cityName = document.getElementById('city').selectedOptions[0].textContent;
    currentUserInfo.reportType = json.reportType || selectedReportType;
    currentChapters = json.chapters;

    renderPreview();
    showStatus('genStatus', '리포트 미리보기 생성 완료', 'ok');
  } catch (e) {
    console.error(e);
    showStatus('genStatus', e.message, 'err');
  } finally {
    btn.disabled = false;
    btn.textContent = '리포트 생성 시작';
  }
}

`;

s = s.slice(0, start) + fixed + s.slice(end);

// 다운로드 중 free에서 조기 return 하는 잘못된 분기 제거
s = s.replace(
/\s*\/\/ FREE_BASIC_REPORT_RENDER_BRANCH\s*if \(currentUserInfo\.reportType === 'free'\) \{\s*render\.innerHTML = renderFreeBasicReport\(\);\s*render\.classList\.remove\('hidden'\);\s*return render\.innerHTML;\s*\}/g,
''
);

fs.writeFileSync(file, s, 'utf8');

console.log('restored normal report generation flow');
