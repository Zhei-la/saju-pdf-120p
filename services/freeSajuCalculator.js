const { Solar, Lunar } = require('lunar-javascript');

const STEMS = ['갑','을','병','정','무','기','경','신','임','계'];
const BRANCHES = ['자','축','인','묘','진','사','오','미','신','유','술','해'];

const STEM_ELEMENT = {
  갑:'목', 을:'목', 병:'화', 정:'화', 무:'토', 기:'토',
  경:'금', 신:'금', 임:'수', 계:'수'
};

const BRANCH_ELEMENT = {
  자:'수', 축:'토', 인:'목', 묘:'목', 진:'토', 사:'화',
  오:'화', 미:'토', 신:'금', 유:'금', 술:'토', 해:'수'
};

function parseBirthTime(birthTime) {
  if (!birthTime || birthTime.includes('모름')) return null;

  const m = birthTime.match(/(\d{1,2})/);

  if (!m) return null;

  return Number(m[1]);
}

function getElementCount(pillars) {
  const count = {
    목:0,
    화:0,
    토:0,
    금:0,
    수:0
  };

  Object.values(pillars).forEach(p => {
    if (!p || p === '미상') return;

    const gan = p[0];
    const ji = p[1];

    if (STEM_ELEMENT[gan]) {
      count[STEM_ELEMENT[gan]]++;
    }

    if (BRANCH_ELEMENT[ji]) {
      count[BRANCH_ELEMENT[ji]]++;
    }
  });

  const total =
    Object.values(count).reduce((a,b)=>a+b,0) || 1;

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

function calculateFreeSaju({
  name,
  birth,
  gender,
  calendar,
  birthTime
}) {

  const m = String(birth || '')
    .match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);

  if (!m) {
    throw new Error('생년월일 형식이 올바르지 않습니다.');
  }

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  const hour = parseBirthTime(birthTime);

  const calcHour =
    hour === null ? 12 : hour;

  let solar;

  if (calendar === '음력') {

    const lunar = Lunar.fromYmdHms(
      year,
      month,
      day,
      calcHour,
      0,
      0
    );

    solar = lunar.getSolar();

  } else {

    solar = Solar.fromYmdHms(
      year,
      month,
      day,
      calcHour,
      0,
      0
    );
  }

  const lunar = solar.getLunar();

  const ec = lunar.getEightChar();

  const pillars = {
    year: ec.getYear(),
    month: ec.getMonth(),
    day: ec.getDay(),
    hour: hour === null ? '미상' : ec.getTime()
  };

  const element = getElementCount(pillars);

  const dayMaster =
    pillars.day ? pillars.day[0] : '';

  const dayElement =
    STEM_ELEMENT[dayMaster] || '';

  const daeyun = [];

  try {

    const genderNum =
      gender === '남성' ? 1 : 0;

    const yun = ec.getYun(genderNum);

    const arr = yun.getDaYun();

    arr.slice(1, 9).forEach(d => {

      daeyun.push({
        age: d.getStartAge(),
        pillar: d.getGanZhi()
      });

    });

  } catch (e) {}

  const currentYear =
    new Date().getFullYear();

  const yearly = [];

  for (let y = currentYear; y < currentYear + 5; y++) {

    const ly =
      Lunar.fromDate(new Date(y, 0, 1));

    yearly.push({
      year: y,
      pillar: ly.getYearInGanZhi()
    });
  }

  return {

    profile: {
      name,
      birth,
      gender,
      calendar,
      birthTime,

      solarDate:
        `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일`,

      lunarDate:
        `${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`
    },

    pillars,

    dayMaster: {
      stem: dayMaster,
      element: dayElement
    },

    elementCount: element.count,

    elementPercent: element.percent,

    daeyun,

    yearly,

    summary:
      `${name}님은 일간 ${dayMaster}(${dayElement}) 기운을 중심으로 사주가 구성됩니다. ` +
      `무료 리포트에서는 기본 만세력과 오행 균형을 간단히 보여드립니다. ` +
      `대운, 세운, 금전운, 연애운은 개인 상황에 따라 해석이 달라지므로 상담에서 더 자세히 확인하는 것이 좋습니다.`
  };
}

module.exports = {
  calculateFreeSaju
};