const { Solar, Lunar } = require('lunar-javascript');

const { getYearPillar } = require('./pillars/yearPillar');
const { getMonthPillar } = require('./pillars/monthPillar');
const { getDayPillar } = require('./pillars/dayPillar');
const { getHourPillar } = require('./pillars/hourPillar');

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

  Object.values(pillars).forEach(p => {
    if (!p || p.hanja === '미상') return;

    if (p.stem && p.stem.element) {
      count[p.stem.element]++;
    }

    if (p.branch && p.branch.element) {
      count[p.branch.element]++;
    }
  });

  const total = Object.values(count).reduce((a, b) => a + b, 0) || 1;

  const percent = {};

  Object.keys(count).forEach(k => {
    percent[k] = Math.round(count[k] / total * 1000) / 10;
  });

  return {
    count,
    percent
  };
}

function calcYearly(nowYear) {
  const list = [];

  for (let y = nowYear; y < nowYear + 10; y++) {
    const year = getYearPillar(y, 2, 4);

    list.push({
      year: y,
      pillar: year.hanja,
      korean: year.korean,
      label: '세운'
    });
  }

  return list;
}

function calcMonthly(nowYear) {
  const list = [];

  for (let m = 1; m <= 12; m++) {
    const year = getYearPillar(nowYear, m, 15);
    const month = getMonthPillar(year.stemIndex, m, 15);

    list.push({
      month: m + '월',
      pillar: month.hanja,
      korean: month.korean,
      label: '월운'
    });
  }

  return list;
}

function calculateSajuEngine(input) {
  const name = String(input.name || '').trim();

  if (!name) {
    throw new Error('이름을 입력해주세요.');
  }

  const gender = String(input.gender || '').trim();
  const calendar = String(input.calendar || '양력').trim();
  const birthTime = String(input.birthTime || '시간 모름').trim();

  const parsed = parseBirth(input.birth);

  let solar;

  if (calendar === '음력') {
    solar = Lunar
      .fromYmdHms(parsed.year, parsed.month, parsed.day, 12, 0, 0)
      .getSolar();
  } else {
    solar = Solar.fromYmdHms(parsed.year, parsed.month, parsed.day, 12, 0, 0);
  }

  const solarYear = solar.getYear();
  const solarMonth = solar.getMonth();
  const solarDay = solar.getDay();

  const hour = parseHour(birthTime);

  const yearPillar = getYearPillar(solarYear, solarMonth, solarDay);
  const monthPillar = getMonthPillar(
    yearPillar.stemIndex,
    solarMonth,
    solarDay
  );

  const dayPillar = getDayPillar(solarYear, solarMonth, solarDay);

  let hourPillar = {
    hanja: '미상',
    korean: '미상'
  };

  if (hour !== null) {
    hourPillar = getHourPillar(
  dayPillar.stem.index,
  hour.hour,
  hour.minute
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

  const daeyun = [];

  for (let i = 0; i < 10; i++) {
    const p = getMonthPillar(
      yearPillar.stemIndex,
      ((solarMonth + i) % 12) + 1,
      15
    );

    daeyun.push({
      age: 4 + i * 10,
      pillar: p.hanja,
      korean: p.korean,
      label: '대운'
    });
  }

  return {
    profile: {
      name,
      birth: input.birth,
      gender,
      calendar,
      birthTime,
      solarDate: `${solarYear}년 ${solarMonth}월 ${solarDay}일`,
      lunarDate: `${solar.getLunar().getYear()}년 ${solar.getLunar().getMonth()}월 ${solar.getLunar().getDay()}일`
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

    daeyun,
    yearly: calcYearly(nowYear),
    months: calcMonthly(nowYear),

    summary:
      `${name}님은 일간 ${dayPillar.stem.hanja}(${dayPillar.stem.element}) 기운을 중심으로 사주가 구성됩니다. ` +
      `현재 무료 리포트는 기본 만세력, 오행 분포, 대운·세운·월운의 흐름을 요약해서 보여드립니다. ` +
      `정확한 용신·기신과 세부 운세는 프리미엄 상담에서 더 깊게 볼 수 있습니다.`
  };
}

module.exports = {
  calculateSajuEngine
};