const { Solar, Lunar } = require('lunar-javascript');

const STEM_ELEMENT = {
  甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수',
  갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'
};

const BRANCH_ELEMENT = {
  子:'수',丑:'토',寅:'목',卯:'목',辰:'토',巳:'화',午:'화',未:'토',申:'금',酉:'금',戌:'토',亥:'수',
  자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'
};

function parseBirth(birth) {
  const m = String(birth || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);
  if (!m) throw new Error('생년월일 형식이 올바르지 않습니다.');
  return { year:Number(m[1]), month:Number(m[2]), day:Number(m[3]) };
}

function parseHour(birthTime) {
  if (!birthTime || String(birthTime).includes('모름')) return null;
  const m = String(birthTime).match(/(\d{1,2})/);
  return m ? Number(m[1]) : null;
}

function splitPillar(pillar) {
  if (!pillar || pillar === '미상') return { gan:'-', ji:'-', full:'미상' };
  return { gan:pillar[0], ji:pillar[1], full:pillar };
}

function calcElements(pillars) {
  const count = { 목:0, 화:0, 토:0, 금:0, 수:0 };

  Object.values(pillars).forEach(p => {
    if (!p || p === '미상') return;
    const gan = p[0];
    const ji = p[1];
    if (STEM_ELEMENT[gan]) count[STEM_ELEMENT[gan]]++;
    if (BRANCH_ELEMENT[ji]) count[BRANCH_ELEMENT[ji]]++;
  });

  const total = Object.values(count).reduce((a,b)=>a+b,0) || 1;
  const percent = {};
  Object.keys(count).forEach(k => {
    percent[k] = Math.round(count[k] / total * 1000) / 10;
  });

  return { count, percent };
}

function calcYearly(nowYear) {
  const list = [];
  for (let y = nowYear; y < nowYear + 10; y++) {
    const lunar = Solar.fromYmdHms(y, 2, 4, 12, 0, 0).getLunar();
    list.push({ year:y, pillar:lunar.getYearInGanZhi(), label:'세운' });
  }
  return list;
}

function calcMonthly(nowYear) {
  const list = [];
  for (let m = 1; m <= 12; m++) {
    const lunar = Solar.fromYmdHms(nowYear, m, 15, 12, 0, 0).getLunar();
    list.push({ month:m + '월', pillar:lunar.getMonthInGanZhi(), label:'월운' });
  }
  return list;
}

function calculateSajuEngine(input) {
  const name = String(input.name || '').trim();
  if (!name) throw new Error('이름을 입력해주세요.');

  const gender = String(input.gender || '').trim();
  const calendar = String(input.calendar || '양력').trim();
  const birthTime = String(input.birthTime || '시간 모름').trim();

  const { year, month, day } = parseBirth(input.birth);
  const hour = parseHour(birthTime);
  const calcHour = hour === null ? 12 : hour;

  let solar;

  if (calendar === '음력') {
    solar = Lunar.fromYmdHms(year, month, day, calcHour, 0, 0).getSolar();
  } else {
    solar = Solar.fromYmdHms(year, month, day, calcHour, 0, 0);
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const pillars = {
    year: ec.getYear(),
    month: ec.getMonth(),
    day: ec.getDay(),
    hour: hour === null ? '미상' : ec.getTime()
  };

  const element = calcElements(pillars);
  const dayMaster = splitPillar(pillars.day).gan;
  const dayElement = STEM_ELEMENT[dayMaster] || '';

  let daeyun = [];
  try {
    const genderNum = gender === '남성' ? 1 : 0;
    daeyun = ec.getYun(genderNum).getDaYun().slice(1, 11).map(d => ({
      age: d.getStartAge(),
      pillar: d.getGanZhi(),
      label: '대운'
    }));
  } catch (e) {
    daeyun = [];
  }

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
    pillars,
    pillarDetail: {
      year: splitPillar(pillars.year),
      month: splitPillar(pillars.month),
      day: splitPillar(pillars.day),
      hour: splitPillar(pillars.hour)
    },
    dayMaster: { stem: dayMaster, element: dayElement },
    elementCount: element.count,
    elementPercent: element.percent,
    daeyun,
    yearly: calcYearly(nowYear),
    months: calcMonthly(nowYear),
    summary:
      `${name}님은 일간 ${dayMaster}(${dayElement || '오행'}) 기운을 중심으로 사주가 구성됩니다. ` +
      `현재 무료 리포트는 기본 만세력, 오행 분포, 대운·세운·월운의 흐름을 요약해서 보여드립니다. ` +
      `정확한 용신·기신과 세부 운세는 프리미엄 상담에서 더 깊게 볼 수 있습니다.`
  };
}

module.exports = { calculateSajuEngine };