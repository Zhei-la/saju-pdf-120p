const { heavenlyStems } = require('../data/stems');
const { earthlyBranches } = require('../data/branches');

function getHourBranchIndex(hour) {
  if (hour >= 23 || hour < 1) return 0;   // 子
  if (hour < 3) return 1;                 // 丑
  if (hour < 5) return 2;                 // 寅
  if (hour < 7) return 3;                 // 卯
  if (hour < 9) return 4;                 // 辰
  if (hour < 11) return 5;                // 巳
  if (hour < 13) return 6;                // 午
  if (hour < 15) return 7;                // 未
  if (hour < 17) return 8;                // 申
  if (hour < 19) return 9;                // 酉
  if (hour < 21) return 10;               // 戌
  return 11;                              // 亥
}

function getHourPillar(dayStemIndex, hour) {
  const hourBranchIndex = getHourBranchIndex(hour);

  // 甲/己일 → 甲子시 시작
  // 乙/庚일 → 丙子시 시작
  // 丙/辛일 → 戊子시 시작
  // 丁/壬일 → 庚子시 시작
  // 戊/癸일 → 壬子시 시작

  const startHourStemIndex = (dayStemIndex % 5) * 2;
  const hourStemIndex = (startHourStemIndex + hourBranchIndex) % 10;

  const stem = heavenlyStems[hourStemIndex];
  const branch = earthlyBranches[hourBranchIndex];

  return {
    stem,
    branch,
    stemIndex: hourStemIndex,
    branchIndex: hourBranchIndex,
    hanja: stem.hanja + branch.hanja,
    korean: stem.korean + branch.korean
  };
}

module.exports = {
  getHourPillar,
  getHourBranchIndex
};