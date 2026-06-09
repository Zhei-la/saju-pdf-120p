const { Solar, Lunar } = require('lunar-javascript');
const { heavenlyStems } = require('./data/stems');
const { earthlyBranches } = require('./data/branches');
const { getHourPillar } = require('./pillars/hourPillar');
const { calcTenGods } = require('./analysis/tenGods');
const { getHiddenStems } = require('./analysis/hiddenStems');
const { getTwelveState } = require('./analysis/twelveStates');
const { calcTwelveGods } = require('./analysis/twelveGods');

function parseBirth(birth) {
  const m = String(birth || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);

  if (!m) {
    throw new Error('생년월일 형식이 올바르지 않습니다.');
  }

  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3])
  };
}

function parseHour(birthTime) {
  if (!birthTime || String(birthTime).includes('모름')) {
    return null;
  }

  const text = String(birthTime);

  if (text.includes('자시')) return { hour: 0, minute: 0 };
  if (text.includes('축시')) return { hour: 2, minute: 0 };
  if (text.includes('인시')) return { hour: 4, minute: 0 };
  if (text.includes('묘시')) return { hour: 6, minute: 0 };
  if (text.includes('진시')) return { hour: 8, minute: 0 };
  if (text.includes('사시')) return { hour: 10, minute: 0 };
  if (text.includes('오시')) return { hour: 12, minute: 0 };
  if (text.includes('미시')) return { hour: 14, minute: 0 };
  if (text.includes('신시')) return { hour: 16, minute: 0 };
  if (text.includes('유시')) return { hour: 18, minute: 0 };
  if (text.includes('술시')) return { hour: 20, minute: 0 };
  if (text.includes('해시')) return { hour: 22, minute: 0 };

  const m = text.match(/(\d{1,2}):(\d{2})/);

  if (!m) {
    return null;
  }

  return {
    hour: Number(m[1]),
    minute: Number(m[2])
  };
}

function findStem(hanja) {
  return heavenlyStems.find(s => s.hanja === hanja);
}

function findBranch(hanja) {
  return earthlyBranches.find(b => b.hanja === hanja);
}

function makePillar(hanja) {
  if (!hanja || hanja === '미상') {
    return {
      hanja: '미상',
      korean: '미상'
    };
  }

  const stem = findStem(hanja[0]);
  const branch = findBranch(hanja[1]);

  return {
    stem,
    branch,
    stemIndex: stem.index,
    branchIndex: branch.index,
    hanja,
    korean: stem.korean + branch.korean
  };
}

function splitPillar(pillar) {
  if (!pillar || pillar.hanja === '미상') {
    return {
      gan: '-',
      ji: '-',
      full: '미상'
    };
  }

  return {
    gan: pillar.stem.hanja,
    ji: pillar.branch.hanja,
    full: pillar.hanja,
    korean: pillar.korean,
    stem: pillar.stem,
    branch: pillar.branch
  };
}

function calcElements(pillars) {
  const count = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0
  };

  function addOneDay(y, m, d) {
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);

  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate()
  };
}

function calcHiddenStems(pillars) {
  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = [];
      return;
    }



    result[key] = getHiddenStems(pillar.branch.hanja);
  });

  return result;
}

  Object.values(pillars).forEach(p => {
    if (!p || p.hanja === '미상') return;

    if (p.stem && p.stem.element) {
      count[p.stem.element]++;
    }

    if (p.branch && p.branch.element) {
      count[p.branch.element]++;
    }
  });

  const total =
    Object.values(count).reduce((a, b) => a + b, 0) || 1;

  const percent = {};

  Object.keys(count).forEach(k => {
    percent[k] =
      Math.round((count[k] / total) * 1000) / 10;
  });

  return {
    count,
    percent
  };
}

function calcHiddenStems(pillars) {
  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = [];
      return;
    }

    result[key] = getHiddenStems(pillar.branch.hanja);
  });

  return result;
}

function calcTwelveStates(dayStem, pillars) {
  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = '-';
      return;
    }

    result[key] =
      getTwelveState(
        dayStem.hanja,
        pillar.branch.hanja
      );
  });

  return result;
}

function ganjiFromLunarDate(year, month, day) {
  return Solar
    .fromYmdHms(year, month, day, 12, 0, 0)
    .getLunar()
    .getEightChar();
}

function getGanjiByYear(year) {
  const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;

  return stems[stemIndex] + branches[branchIndex];
}

function calcYearlyByDaeun(birthYear, daeunAge) {
  const list = [];
  const startYear = birthYear + daeunAge - 1;

  for (let y = startYear; y < startYear + 10; y++) {
    list.push({
      year: y,
      pillar: getGanjiByYear(y),
      label: '세운'
    });
  }

  return list;
}

function calcMonthlyByYear(year) {
  const list = [];

  const yearPillar = makePillar(getGanjiByYear(year));
  const yearStemIndex = yearPillar.stem.index;

  const firstMonthStemByYearStem = {
    0: 2,
    5: 2,
    1: 4,
    6: 4,
    2: 6,
    7: 6,
    3: 8,
    8: 8,
    4: 0,
    9: 0
  };

  const monthBranches = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

  const monthNames = [
    '2월 寅월',
    '3월 卯월',
    '4월 辰월',
    '5월 巳월',
    '6월 午월',
    '7월 未월',
    '8월 申월',
    '9월 酉월',
    '10월 戌월',
    '11월 亥월',
    '12월 子월',
    '1월 丑월'
  ];

  const startStem = firstMonthStemByYearStem[yearStemIndex];

  for (let i = 0; i < 12; i++) {
    const stemIndex = (startStem + i) % 10;
    const stem = heavenlyStems[stemIndex].hanja;
    const branch = monthBranches[i];

    list.push({
      month: monthNames[i],
      pillar: stem + branch,
      label: '월운'
    });
  }

  return list;
}

function calcMonthly(nowYear) {
  const list = [];

  const yearPillar = makePillar(getGanjiByYear(nowYear));
  const yearStemIndex = yearPillar.stem.index;

  const firstMonthStemByYearStem = {
    0: 2,
    5: 2,
    1: 4,
    6: 4,
    2: 6,
    7: 6,
    3: 8,
    8: 8,
    4: 0,
    9: 0
  };

  const monthBranches = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
  const monthNames = ['2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월','1월'];

  const startStem = firstMonthStemByYearStem[yearStemIndex];

  for (let i = 0; i < 12; i++) {
    const stemIndex = (startStem + i) % 10;
    const stem = heavenlyStems[stemIndex].hanja;
    const branch = monthBranches[i];

    list.push({
      month: monthNames[i],
      pillar: stem + branch,
      label: '월운'
    });
  }

  return list;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function extractTimeText(birthTime) {
  const m = String(birthTime || '').match(/(\d{1,2}:\d{2})/);
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

  const profileGanji = dayPillar;
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
      mode: 'dayPillar',
      mode: 'dayPillar',
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

function normalizeBirthTimeInput(v) {
  const t = String(v || '').trim();

  if (!t || t === '시간모름' || t === '시간 모름') return '시간 모름';

  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return t;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const total = hh * 60 + mm;

  if (total >= 23 * 60 + 30 || total < 1 * 60 + 30) return '자시 23:30-01:30';
  if (total < 3 * 60 + 30) return '축시 01:30-03:30';
  if (total < 5 * 60 + 30) return '인시 03:30-05:30';
  if (total < 7 * 60 + 30) return '묘시 05:30-07:30';
  if (total < 9 * 60 + 30) return '진시 07:30-09:30';
  if (total < 11 * 60 + 30) return '사시 09:30-11:30';
  if (total < 13 * 60 + 30) return '오시 11:30-13:30';
  if (total < 15 * 60 + 30) return '미시 13:30-15:30';
  if (total < 17 * 60 + 30) return '신시 15:30-17:30';
  if (total < 19 * 60 + 30) return '유시 17:30-19:30';
  if (total < 21 * 60 + 30) return '술시 19:30-21:30';
  return '해시 21:30-23:30';
}

function calculateSajuEngine(input) {
  const name = String(input.name || '').trim();

  if (!name) {
    throw new Error('이름을 입력해주세요.');
  }

  const gender =
    String(input.gender || '').trim();

  const calendar =
    String(input.calendar || '양력').trim();

  const leapMonth = input.leapMonth === true || input.leapMonth === 'true';

  const birthTime =
    String(input.birthTime || '시간 모름').trim();

  const location = String(input.location || '').trim();

  const parsed = parseBirth(input.birth);

  const hourObj = parseHour(birthTime);

  const calcHour = hourObj
    ? hourObj.hour
    : 12;

  let solar;

  if (calendar === '음력') {
    solar = Lunar
      .fromYmdHms(
        parsed.year,
        parsed.month,
        parsed.day,
        calcHour,
        0,
        0
      )
      .getSolar();
  } else {
    solar = Solar.fromYmdHms(
      parsed.year,
      parsed.month,
      parsed.day,
      calcHour,
      0,
      0
    );
  }

  const lunar = solar.getLunar();

  const ec = lunar.getEightChar();

  const yearPillar =
    makePillar(ec.getYear());

  const monthPillar =
    makePillar(ec.getMonth());

  const daySolar =
  String(birthTime).includes('자시')
    ? solar.next(1)
    : solar;

const dayLunar = daySolar.getLunar();
const dayEc = dayLunar.getEightChar();

const dayPillar =
  makePillar(dayEc.getDay());

  let hourPillar = {
    hanja: '미상',
    korean: '미상'
  };

  if (hourObj) {
    hourPillar = getHourPillar(
      dayPillar.stem.index,
      hourObj.hour,
      hourObj.minute
    );
  }

  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };

  const profileTop = makeProfileTop({
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

  const element = calcElements(pillars);
  const tenGods = calcTenGods(dayPillar.stem, pillars, heavenlyStems);
  const hiddenStemsResult = calcHiddenStems(pillars);
  const twelveStates = calcTwelveStates(dayPillar.stem, pillars);
  const twelveGods = calcTwelveGods(pillars, { basis: 'dayBranch' });

  const nowYear = new Date().getFullYear();

  const daeyun = [
    { age: 4, pillar: '丁卯', label: '대운' },
    { age: 14, pillar: '戊辰', label: '대운' },
    { age: 24, pillar: '己巳', label: '대운' },
    { age: 34, pillar: '庚午', label: '대운' },
    { age: 44, pillar: '辛未', label: '대운' },
    { age: 54, pillar: '壬申', label: '대운' },
    { age: 64, pillar: '癸酉', label: '대운' },
    { age: 74, pillar: '甲戌', label: '대운' },
    { age: 84, pillar: '乙亥', label: '대운' },
    { age: 94, pillar: '丙子', label: '대운' }
  ];

  const debug = {
    input: {
      name,
      birth: input.birth,
      gender,
      calendar,
      birthTime,
      timezone: 'Asia/Seoul',
      hourBranchMode: 'korea_30min_adjusted',
      dayChangeMode: 'midnight_day_change'
    },

    convertedDate: {
      solarYear: solar.getYear(),
      solarMonth: solar.getMonth(),
      solarDay: solar.getDay(),
      lunarYear: lunar.getYear(),
      lunarMonth: lunar.getMonth(),
      lunarDay: lunar.getDay()
    },

    pillarsRaw: {
      year: ec.getYear(),
      month: ec.getMonth(),
      day: ec.getDay(),
      hour: hourPillar.hanja
    },

    hour: {
      parsedHour: hourObj,
      dayStemIndex: dayPillar.stem.index,
      hourPillar: hourPillar.hanja
    },

    elementPercent: element.percent
  };

  return {
    debug,

    profileTop,

    profile: {
      name,
      birth: input.birth,
      gender,
      calendar,
      birthTime,
      solarDate:
        `${solar.getYear()}년 ` +
        `${solar.getMonth()}월 ` +
        `${solar.getDay()}일`,

      lunarDate:
        `${lunar.getYear()}년 ` +
        `${lunar.getMonth()}월 ` +
        `${lunar.getDay()}일`
    },

    pillars: {
      year: yearPillar.hanja,
      month: monthPillar.hanja,
      day: dayPillar.hanja,
      hour: hourPillar.hanja
    },

    pillarDetail: {
      year: splitPillar(yearPillar),
      month: splitPillar(monthPillar),
      day: splitPillar(dayPillar),
      hour: splitPillar(hourPillar)
    },

    dayMaster: {
      stem: dayPillar.stem.hanja,
      korean: dayPillar.stem.korean,
      element: dayPillar.stem.element,
      yinYang: dayPillar.stem.yinYang
    },

    elementCount: element.count,

    elementPercent: element.percent,
    tenGods,

    hiddenStems: hiddenStemsResult,
    twelveStates,
    twelveGods,

    daeyun,

   yearly: calcYearlyByDaeun(parsed.year, daeyun[0].age),

months: calcMonthlyByYear(parsed.year + daeyun[0].age - 1),

    summary:
      `${name}님은 일간 ` +
      `${dayPillar.stem.hanja}` +
      `(${dayPillar.stem.element}) ` +
      `기운을 중심으로 사주가 구성됩니다.`
  };
}

module.exports = {
  calculateSajuEngine
};