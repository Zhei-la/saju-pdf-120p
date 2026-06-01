const { heavenlyStems } = require('../data/stems');
const { earthlyBranches } = require('../data/branches');
const { SAJU_CONFIG } = require('../config');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getHourBranchIndexByMinutes(totalMinutes) {
  const ranges = SAJU_CONFIG.hourRanges;

  for (const range of ranges) {
    const start = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);

    const inRange =
      start < end
        ? totalMinutes >= start && totalMinutes < end
        : totalMinutes >= start || totalMinutes < end;

    if (inRange) {
      return earthlyBranches.find(b => b.hanja === range.branch).index;
    }
  }

  return null;
}

function getHourBranchIndex(hour, minute = 0) {
  const totalMinutes = hour * 60 + minute;

  if (SAJU_CONFIG.hourBranchMode === 'korea_30min_adjusted') {
    return getHourBranchIndexByMinutes(totalMinutes);
  }

  if (hour >= 23 || hour < 1) return 0;
  if (hour < 3) return 1;
  if (hour < 5) return 2;
  if (hour < 7) return 3;
  if (hour < 9) return 4;
  if (hour < 11) return 5;
  if (hour < 13) return 6;
  if (hour < 15) return 7;
  if (hour < 17) return 8;
  if (hour < 19) return 9;
  if (hour < 21) return 10;
  return 11;
}

function getHourPillar(dayStemIndex, hour, minute = 0) {
  const hourBranchIndex = getHourBranchIndex(hour, minute);

  if (hourBranchIndex === null || hourBranchIndex === undefined) {
    return {
      hanja: '미상',
      korean: '미상'
    };
  }

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