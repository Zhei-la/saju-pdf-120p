const { Solar, Lunar } = require('lunar-javascript');
const { heavenlyStems } = require('./data/stems');
const { earthlyBranches } = require('./data/branches');
const { getHourPillar } = require('./pillars/hourPillar');

function parseBirth(birth) {
  const m = String(birth || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);
  if (!m) throw new Error('생년월일 형식이 올바르지 않습니다.');
  return { year:Number(m[1]), month:Number(m[2]), day:Number(m[3]) };
}

function parseHour(birthTime) {
  if (!birthTime || String(birthTime).includes('모름')) return null;
  const text = String(birthTime);

  if (text.includes('자시')) return { hour:0, minute:0 };
  if (text.includes('축시')) return { hour:2, minute:0 };
  if (text.includes('인시')) return { hour:4, minute:0 };
  if (text.includes('묘시')) return { hour:6, minute:0 };
  if (text.includes('진시')) return { hour:8, minute:0 };
  if (text.includes('사시')) return { hour:10, minute:0 };
  if (text.includes('오시')) return { hour:12, minute:0 };
  if (text.includes('미시')) return { hour:14, minute:0 };
  if (text.includes('신시')) return { hour:16, minute:0 };
  if (text.includes('유시')) return { hour:18, minute:0 };
  if (text.includes('술시')) return { hour:20, minute:0 };
  if (text.includes('해시')) return { hour:22, minute:0 };

  const m = text.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return { hour:Number(m[1]), minute:Number(m[2]) };
}

function findStem(hanja) {
  return heavenlyStems.find(s => s.hanja === hanja);
}

function findBranch(hanja) {
  return earthlyBranches.find(b => b.hanja === hanja);
}

function makePillar(hanja) {
  if (!hanja || hanja === '미상') {
    return { hanja:'미상', korean:'미상' };
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
    return { gan:'-', ji:'-', full:'미상' };
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
  const count = { 목:0, 화:0, 토:0, 금:0, 수:0 };

  Object.values(pillars).forEach(p => {
    if (!p || p.hanja === '미상') return;
    if (p.stem?.element) count[p.stem.element]++;
    if (p.branch?.element) count[p.branch.element]++;
  });

  const total = Object.values(count).reduce((a,b)=>a+b,0) || 1;
  const percent = {};

  Object.keys(count).forEach(k => {
    percent[k] = Math.round(count[k] / total * 1000) / 10;
  });

  return { count, percent };
}

function ganjiFromLunarDate(year, month, day) {
  return Solar.fromYmdHms(year, month, day, 12, 0, 0)
    .getLunar()
    .getEightChar();
}

function calcYearly(nowYear) {
  const list = [];
  for (let y = nowYear; y < nowYear + 10; y++) {
    const ec = ganjiFromLunarDate(y, 2, 4);
    list.push({
      year:y,
      pillar:ec.getYear(),
      label:'세운'
    });
  }
  return list;
}

function calcMonthly(nowYear) {
  const list = [];
  for (let m = 1; m <= 12; m++) {
    const ec = ganjiFromLunarDate(nowYear, m, 15);
    list.push({
      month:m + '월',
      pillar:ec.getMonth(),
      label:'월운'
    });
  }
  return list;
}

function calculateSajuEngine(input) {
  const name = String(input.name || '').trim();
  if (!name) throw new Error('이름을 입력해주세요.');

  const gender = String(input.gender || '').trim();
  const calendar = String(input.calendar || '양력').trim();
  const birthTime = String(input.birthTime || '시간 모름').trim();

  const parsed = parseBirth(input.birth);
  const hourObj = parseHour(birthTime);
  const calcHour = hourObj ? hourObj.hour : 12;

  let solar;

  if (calendar === '음력') {
    solar = Lunar
      .fromYmdHms(parsed.year, parsed.month, parsed.day, calcHour, 0, 0)
      .getSolar();
  } else {
    solar = Solar.fromYmdHms(parsed.year, parsed.month, parsed.day, calcHour, 0, 0);
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const yearPillar = makePillar(ec.getYear());
  const monthPillar = makePillar(ec.getMonth());
  const dayPillar = makePillar(ec.getDay());

  let hourPillar = { hanja:'미상', korean:'미상' };

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

  const element = calcElements(pillars);
  const nowYear = new Date().getFullYear();

  return {
    profile: {
      name,
      birth: input.birth,
      gender,
      calendar,
      birthTime,
      solarDate: `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일`,
      lunarDate: `${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`
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

    daeyun: [],
    yearly: calcYearly(nowYear),
    months: calcMonthly(nowYear),

    summary:
      `${name}님은 일간 ${dayPillar.stem.hanja}(${dayPillar.stem.element}) 기운을 중심으로 사주가 구성됩니다. ` +
      `무료 리포트에서는 기본 만세력과 오행 분포를 먼저 보여드립니다.`
  };
}

module.exports = { calculateSajuEngine };