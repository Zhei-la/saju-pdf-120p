const { heavenlyStems } = require('../data/stems');
const { earthlyBranches } = require('../data/branches');

function mod(n, m) {
  return ((n % m) + m) % m;
}

// 주의:
// 현재 1차 버전은 입춘 "날짜" 기준입니다.
// 최종 버전에서는 한국천문연구원 절입 "시각" 데이터로 교체해야 합니다.
function isBeforeIpchun(month, day) {
  if (month < 2) return true;
  if (month === 2 && day < 4) return true;
  return false;
}

function getYearPillar(year, month, day) {
  const sajuYear = isBeforeIpchun(month, day) ? year - 1 : year;

  const stemIndex = mod(sajuYear - 4, 10);
  const branchIndex = mod(sajuYear - 4, 12);

  const stem = heavenlyStems[stemIndex];
  const branch = earthlyBranches[branchIndex];

  return {
    sajuYear,
    stem,
    branch,
    stemIndex,
    branchIndex,
    hanja: stem.hanja + branch.hanja,
    korean: stem.korean + branch.korean,
    note: '입춘 날짜 기준 1차 계산'
  };
}

module.exports = {
  getYearPillar
};