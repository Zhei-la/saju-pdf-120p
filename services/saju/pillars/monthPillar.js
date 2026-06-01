const { heavenlyStems } = require('../data/stems');
const { earthlyBranches } = require('../data/branches');

const MONTH_BRANCHES = [
  '寅', '卯', '辰', '巳', '午', '未',
  '申', '酉', '戌', '亥', '子', '丑'
];

const FIRST_MONTH_STEM_BY_YEAR_STEM = {
  0: 2, // 甲년 → 丙寅월
  5: 2, // 己년 → 丙寅월

  1: 4, // 乙년 → 戊寅월
  6: 4, // 庚년 → 戊寅월

  2: 6, // 丙년 → 庚寅월
  7: 6, // 辛년 → 庚寅월

  3: 8, // 丁년 → 壬寅월
  8: 8, // 壬년 → 壬寅월

  4: 0, // 戊년 → 甲寅월
  9: 0  // 癸년 → 甲寅월
};

function getMonthIndexByDate(month, day) {
  // 1차 버전: 절기 날짜 근사 기준
  // 최종 버전: 절입 "시각" 데이터로 교체 필요

  if ((month === 2 && day >= 4) || (month === 3 && day < 6)) return 0;   // 寅
  if ((month === 3 && day >= 6) || (month === 4 && day < 5)) return 1;   // 卯
  if ((month === 4 && day >= 5) || (month === 5 && day < 6)) return 2;   // 辰
  if ((month === 5 && day >= 6) || (month === 6 && day < 6)) return 3;   // 巳
  if ((month === 6 && day >= 6) || (month === 7 && day < 7)) return 4;   // 午
  if ((month === 7 && day >= 7) || (month === 8 && day < 8)) return 5;   // 未
  if ((month === 8 && day >= 8) || (month === 9 && day < 8)) return 6;   // 申
  if ((month === 9 && day >= 8) || (month === 10 && day < 8)) return 7;  // 酉
  if ((month === 10 && day >= 8) || (month === 11 && day < 7)) return 8; // 戌
  if ((month === 11 && day >= 7) || (month === 12 && day < 7)) return 9; // 亥
  if ((month === 12 && day >= 7) || (month === 1 && day < 6)) return 10; // 子

  return 11; // 丑, 소한~입춘 전
}

function getBranchByHanja(hanja) {
  return earthlyBranches.find(b => b.hanja === hanja);
}

function getMonthPillar(yearStemIndex, month, day) {
  const monthIndex = getMonthIndexByDate(month, day);
  const firstMonthStemIndex = FIRST_MONTH_STEM_BY_YEAR_STEM[yearStemIndex];

  const stemIndex = (firstMonthStemIndex + monthIndex) % 10;
  const branchHanja = MONTH_BRANCHES[monthIndex];
  const branch = getBranchByHanja(branchHanja);
  const stem = heavenlyStems[stemIndex];

  return {
    monthIndex,
    stem,
    branch,
    stemIndex,
    branchIndex: branch.index,
    hanja: stem.hanja + branch.hanja,
    korean: stem.korean + branch.korean,
    note: '절기 날짜 근사 기준 1차 계산'
  };
}

module.exports = {
  getMonthPillar,
  getMonthIndexByDate
};