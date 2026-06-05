const fs = require('fs');

const file = 'services/saju/index.js';
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('function makeProfileTop')) {
  s = s.replace(
    'function calculateSajuEngine(input) {',
`function pad2(n) {
  return String(n).padStart(2, '0');
}

function extractTimeText(birthTime) {
  const m = String(birthTime || '').match(/(\\d{1,2}:\\d{2})/);
  return m ? m[1] : '';
}

function makeProfileTop({ name, gender, location, calendar, leapMonth, birthTime, solar, lunar, yearPillar, dayPillar }) {
  const zodiacAnimals = {
    子:'쥐', 丑:'소', 寅:'호랑이', 卯:'토끼', 辰:'용', 巳:'뱀',
    午:'말', 未:'양', 申:'원숭이', 酉:'닭', 戌:'개', 亥:'돼지'
  };

  const elementColorLabel = {
    목:'푸른',
    화:'붉은',
    토:'황금',
    금:'하얀',
    수:'검은'
  };

  const profileGanji = yearPillar;
  const animal = zodiacAnimals[profileGanji.branch.hanja] || '';
  const colorLabel = elementColorLabel[profileGanji.stem.element] || '';

  const time = extractTimeText(birthTime);

  const solarDate =
    solar.getYear() + '/' +
    pad2(solar.getMonth()) + '/' +
    pad2(solar.getDay());

  const lunarDate =
    lunar.getYear() + '/' +
    pad2(lunar.getMonth()) + '/' +
    pad2(lunar.getDay());

  const lunarLabel = leapMonth ? '음(윤)' : '음(평)';

  const baseLine =
    (gender || '') +
    (location ? ' ' + location : '');

  return {
    name,
    gender,
    location,
    profileGanji: {
      hanja: profileGanji.hanja,
      korean: profileGanji.korean,
      stem: profileGanji.stem.hanja,
      branch: profileGanji.branch.hanja,
      animal,
      colorLabel,
      display: profileGanji.korean + ' [' + colorLabel + ' ' + animal + ']'
    },
    birthInfo: {
      solar: {
        label: '양',
        date: solarDate,
        time,
        display: '양 ' + solarDate + (time ? ' ' + time : '') + ' ' + baseLine
      },
      lunar: {
        label: lunarLabel,
        date: lunarDate,
        time,
        isLeapMonth: !!leapMonth,
        display: lunarLabel + ' ' + lunarDate + (time ? ' ' + time : '') + ' ' + baseLine
      },
      corrected: {
        enabled: false,
        display: ''
      }
    },
    ageDisplayMode: '세는나이',
    daewoonAgeBasis: '세는나이'
  };
}

function calculateSajuEngine(input) {`
  );
}

if (!s.includes("const location = String(input.location")) {
  s = s.replace(
    "const birthTime =\n    String(input.birthTime || '시간 모름').trim();",
    "const birthTime =\n    String(input.birthTime || '시간 모름').trim();\n\n  const location = String(input.location || '').trim();"
  );
}

if (!s.includes('const profileTop = makeProfileTop')) {
  s = s.replace(
    "const element = calcElements(pillars);",
    `const profileTop = makeProfileTop({
    name,
    gender,
    location,
    calendar,
    leapMonth,
    birthTime,
    solar,
    lunar,
    yearPillar,
    dayPillar
  });

  const element = calcElements(pillars);`
  );
}

if (!s.includes('profileTop,')) {
  s = s.replace(
    "return {\n    debug,",
    "return {\n    debug,\n\n    profileTop,"
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('profileTop added to engine');
