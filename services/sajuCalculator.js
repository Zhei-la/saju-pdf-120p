const { Solar, Lunar } = require('lunar-javascript');

// ── 한자 → 한글 변환 맵 ──
const HAN_TO_KOR = { '甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계',
  '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해' };
const FIVE = { '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수',
  '寅':'목','卯':'목','巳':'화','午':'화','辰':'토','戌':'토','丑':'토','未':'토','申':'금','酉':'금','亥':'수','子':'수' };
const SSHIP_KOR = { '比肩':'비견','劫财':'겁재','食神':'식신','伤官':'상관','偏财':'편재','正财':'정재',
  '七杀':'편관','正官':'정관','偏印':'편인','正印':'정인','日主':'일주' };
const DISHI_KOR = { '长生':'장생','沐浴':'목욕','冠带':'관대','临官':'건록','帝旺':'제왕',
  '衰':'쇠','病':'병','死':'사','墓':'묘','绝':'절','胎':'태','养':'양' };

const toKor = gz => gz ? gz.split('').map(c => HAN_TO_KOR[c] || c).join('') : '';
const shiShenKor = ss => SSHIP_KOR[ss] || ss || '';
const diShiKor = ds => DISHI_KOR[ds] || ds || '';
const arrShiShen = arr => (Array.isArray(arr) ? arr : [arr]).map(s => shiShenKor(s));

function calculateSaju({ year, month, day, hour, minute, isLunar, gender }) {
  // 1. 기본 만세력 계산
  let solar;
  if (isLunar) {
    const lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  }
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const genderNum = (gender === '여성' || gender === '여') ? 1 : 0;

  // 2. 사주 4기둥
  const pillars = { year: ec.getYear(), month: ec.getMonth(), day: ec.getDay(), hour: ec.getTime() };
  const dayGan = pillars.day[0]; // 일간 천간

  // 3. 오행 카운트
  const elements = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  Object.values(pillars).forEach(p => p.split('').forEach(c => { if(FIVE[c]) elements[FIVE[c]]++; }));
  const total = Object.values(elements).reduce((a,b) => a+b, 0);
  const elementPercent = {};
  for (const [k, v] of Object.entries(elements)) {
    elementPercent[k] = total > 0 ? Math.round(v / total * 1000) / 10 : 0;
  }

  // 4. 십성 (천간/지지)
  const shiShen = {
    yearGan: shiShenKor(ec.getYearShiShenGan()),
    monthGan: shiShenKor(ec.getMonthShiShenGan()),
    dayGan: '일주',
    hourGan: shiShenKor(ec.getTimeShiShenGan()),
    yearZhi: arrShiShen(ec.getYearShiShenZhi()),
    monthZhi: arrShiShen(ec.getMonthShiShenZhi()),
    dayZhi: arrShiShen(ec.getDayShiShenZhi()),
    hourZhi: arrShiShen(ec.getTimeShiShenZhi())
  };

  // 5. 지장간
  const hideGan = {
    year: ec.getYearHideGan().map(g => `${toKor(g)}(${FIVE[g]})`),
    month: ec.getMonthHideGan().map(g => `${toKor(g)}(${FIVE[g]})`),
    day: ec.getDayHideGan().map(g => `${toKor(g)}(${FIVE[g]})`),
    hour: ec.getTimeHideGan().map(g => `${toKor(g)}(${FIVE[g]})`)
  };

  // 6. 12운성
  const diShi = {
    year: diShiKor(ec.getYearDiShi()),
    month: diShiKor(ec.getMonthDiShi()),
    day: diShiKor(ec.getDayDiShi()),
    hour: diShiKor(ec.getTimeDiShi())
  };

  // 7. 신강/신약 판정 (간이 계산)
  const dayElement = FIVE[dayGan];
  const sameElements = { '목':['목'], '화':['화','목'], '토':['토','화'], '금':['금','토'], '수':['수','금'] };
  const helpElements = sameElements[dayElement] || [dayElement];
  let helpScore = 0, totalScore = 0;
  Object.values(pillars).forEach(p => {
    p.split('').forEach(c => {
      if (FIVE[c]) {
        totalScore++;
        if (helpElements.includes(FIVE[c])) helpScore++;
      }
    });
  });
  // 건록/제왕이면 추가 점수
  const strongDiShi = ['건록','제왕','관대','장생'];
  if (strongDiShi.includes(diShi.month)) helpScore += 1.5;
  if (strongDiShi.includes(diShi.day)) helpScore += 1;
  totalScore += 2.5;
  const strengthRatio = Math.round(helpScore / totalScore * 100);
  const isStrong = strengthRatio >= 50;

  // 8. 용신 추론 (억부용신 기준 - 간이)
  const COUNTER_MAP = { '목':'금', '화':'수', '토':'목', '금':'화', '수':'토' };
  const HELP_MAP = { '목':'수', '화':'목', '토':'화', '금':'토', '수':'금' };
  let yongShin, yongShinReason;
  if (isStrong) {
    // 신강 → 일간 기운을 빼는 오행이 용신
    const weakest = Object.entries(elements).sort((a,b) => a[1]-b[1])[0][0];
    yongShin = COUNTER_MAP[dayElement] || weakest;
    yongShinReason = `신강한 사주이므로 일간(${dayElement})의 기운을 억제하는 ${yongShin}이 억부용신입니다.`;
  } else {
    // 신약 → 일간을 도와주는 오행이 용신
    yongShin = HELP_MAP[dayElement] || dayElement;
    yongShinReason = `신약한 사주이므로 일간(${dayElement})의 기운을 보강하는 ${yongShin}이 억부용신입니다.`;
  }

  // 9. 대운 계산
  let daYunList = [];
  try {
    const yun = ec.getYun(genderNum);
    const startInfo = `${yun.getStartYear()}년 ${yun.getStartMonth()}월 ${yun.getStartDay()}일`;
    const daYunArr = yun.getDaYun();
    daYunList = daYunArr.map(dy => ({
      startAge: dy.getStartAge(),
      ganZhi: dy.getGanZhi(),
      ganZhiKor: toKor(dy.getGanZhi()),
      element: dy.getGanZhi() ? `${FIVE[dy.getGanZhi()[0]] || ''}/${FIVE[dy.getGanZhi()[1]] || ''}` : ''
    }));
    // 대운수(대운 시작 나이)
    var daYunStartAge = daYunArr.length > 1 ? daYunArr[1].getStartAge() : 0;
  } catch(e) { daYunStartAge = 0; }

  // 10. 연운 (2024~2026)
  let yearlyFortune = [];
  try {
    const yun = ec.getYun(genderNum);
    const daYunArr = yun.getDaYun();
    for (const dy of daYunArr) {
      const liuNian = dy.getLiuNian();
      for (const ln of liuNian) {
        const y = ln.getYear();
        if (y >= 2024 && y <= 2030) {
          yearlyFortune.push({
            year: y,
            age: ln.getAge(),
            ganZhi: ln.getGanZhi(),
            ganZhiKor: toKor(ln.getGanZhi()),
            daYunGanZhi: dy.getGanZhi(),
            daYunGanZhiKor: toKor(dy.getGanZhi())
          });
        }
      }
    }
  } catch(e) {}

  // 11. 십성 분포 (비율 계산)
  const allShiShen = [
    shiShen.yearGan, shiShen.monthGan, shiShen.hourGan,
    ...shiShen.yearZhi, ...shiShen.monthZhi, ...shiShen.dayZhi, ...shiShen.hourZhi
  ].filter(s => s && s !== '일주');
  const shiShenCount = {};
  allShiShen.forEach(s => { shiShenCount[s] = (shiShenCount[s] || 0) + 1; });

  return {
    solarDate: `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일`,
    lunarDate: `${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`,
    pillars, elements, elementPercent,
    dayMaster: { hanja: dayGan, korean: HAN_TO_KOR[dayGan], element: FIVE[dayGan] },
    zodiac: lunar.getYearShengXiao(),
    fullHanja: `${pillars.year}년 ${pillars.month}월 ${pillars.day}일 ${pillars.hour}시`,
    fullKorean: `${toKor(pillars.year)}년 ${toKor(pillars.month)}월 ${toKor(pillars.day)}일 ${toKor(pillars.hour)}시`,
    shiShen,
    hideGan,
    diShi,
    strength: {
      isStrong,
      ratio: strengthRatio,
      label: isStrong ? '신강' : '신약',
      description: isStrong
        ? `일간의 기운이 강합니다 (${strengthRatio}%). 자기 주도적이고 독립적입니다.`
        : `일간의 기운이 약합니다 (${strengthRatio}%). 협력과 지원이 중요합니다.`
    },
    yongShin: { element: yongShin, reason: yongShinReason },
    daYun: { startAge: daYunStartAge, list: daYunList },
    yearlyFortune,
    shiShenCount
  };
}

module.exports = { calculateSaju };
