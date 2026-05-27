const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
`currentUserInfo = {
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
    };`,
`currentUserInfo = {
      name,
      gender: selectedGender,
      year: yearN,
      month: monthN,
      day: dayN,
      hour: isTimeUnknown ? null : hourVal,
      minute: minuteVal,
      city: cityKey,
      isLunar: selectedCalendar === 'lunar',
      timeUnknown: isTimeUnknown,
      reportType: 'free',
      saju: null
    };`
);

s = s.replace(
`body: JSON.stringify({ name, gender, year: yearN, month: monthN, day: dayN, hour, minute, isLunar: selectedCalendar === 'lunar', timeUnknown, city: cityKey })`,
`body: JSON.stringify({
        name,
        gender: selectedGender,
        year: yearN,
        month: monthN,
        day: dayN,
        hour: hourVal,
        minute: minuteVal,
        isLunar: selectedCalendar === 'lunar',
        timeUnknown: isTimeUnknown,
        city: cityKey
      })`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed free preview variable crash');
