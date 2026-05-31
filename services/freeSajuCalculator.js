const { Solar, Lunar } = require('lunar-javascript');

const STEMS = ['갑','을','병','정','무','기','경','신','임','계'];
const BRANCHES = ['자','축','인','묘','진','사','오','미','신','유','술','해'];

const STEM_ELEMENT = {
  甲:'목',
  乙:'목',
  丙:'화',
  丁:'화',
  戊:'토',
  己:'토',
  庚:'금',
  辛:'금',
  壬:'수',
  癸:'수',

  갑:'목',
  을:'목',
  병:'화',
  정:'화',
  무:'토',
  기:'토',
  경:'금',
  신:'금',
  임:'수',
  계:'수'
};

const BRANCH_ELEMENT = {
  子:'수',
  丑:'토',
  寅:'목',
  卯:'목',
  辰:'토',
  巳:'화',
  午:'화',
  未:'토',
  申:'금',
  酉:'금',
  戌:'토',
  亥:'수',

  자:'수',
  축:'토',
  인:'목',
  묘:'목',
  진:'토',
  사:'화',
  오:'화',
  미:'토',
  신:'금',
  유:'금',
  술:'토',
  해:'수'
};

function parseBirth(birth) {
  const m = String(birth || '').match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);
  if (!m) throw new Error('생년월일 형식이 올바르지 않습니다.');
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3])
  };
}

function parseHour(birthTime) {
  if (!birthTime || birthTime.includes('모름')) return null;
  const m = String(birthTime).match(/(\d{1,2})/);
  return m ? Number(m[1]) : null;
}

function getElementPercent(pillars) {
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

function ganjiByYear(year) {
  const idx = year - 1984;
  return STEMS[((idx % 10) + 10) % 10] + BRANCHES[((idx % 12) + 12) % 12];
}

function calculateFreeSaju(input) {
  const name = String(input.name || '').trim();
  const gender = String(input.gender || '').trim();
  const calendar = String(input.calendar || '양력').trim();
  const birthTime = String(input.birthTime || '시간 모름').trim();

  if (!name) throw new Error('이름을 입력해주세요.');

  const { year, month, day } = parseBirth(input.birth);
  const hour = parseHour(birthTime);
  const calcHour = hour === null ? 12 : hour;

  let solar;

  if (calendar === '음력') {
    const lunarInput = Lunar.fromYmdHms(year, month, day, calcHour, 0, 0);
    solar = lunarInput.getSolar();
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

  const element = getElementPercent(pillars);
  const dayMaster = pillars.day ? pillars.day[0] : '';
  const dayElement = STEM_ELEMENT[dayMaster] || '';

  const yearly = [];
  const now = new Date().getFullYear();
  for (let y = now; y < now + 5; y++) {
    yearly.push({
      year: y,
      pillar: ganjiByYear(y)
    });
  }

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
    dayMaster: {
      stem: dayMaster,
      element: dayElement
    },
    elementCount: element.count,
    elementPercent: element.percent,
    yearly,
    summary:
      `${name}님은 일간 ${dayMaster}(${dayElement || '오행'}) 기운을 중심으로 사주가 구성됩니다. ` +
      `무료 리포트에서는 기본 만세력과 오행 균형을 간단히 보여드립니다. ` +
      `대운, 세운, 금전운, 연애운은 개인 상황에 따라 해석이 달라지므로 상담에서 더 자세히 확인하는 것이 좋습니다.`
  };
}

module.exports = { calculateFreeSaju };