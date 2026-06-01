const { toJdn } = require('../core/julian');
const { getGanjiByIndex, mod } = require('../data/ganji');

// 기준: 1984-02-02 = 甲子일
const BASE_JDN = toJdn(1984, 2, 2);

function getDayPillar(year, month, day) {
  const targetJdn = toJdn(year, month, day);
  const cycleIndex = mod(targetJdn - BASE_JDN, 60);

  return getGanjiByIndex(cycleIndex);
}

module.exports = {
  getDayPillar
};