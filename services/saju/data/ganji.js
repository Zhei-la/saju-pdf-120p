const { heavenlyStems } = require('./stems');
const { earthlyBranches } = require('./branches');

function mod(n, m) {
  return ((n % m) + m) % m;
}

function getGanjiByIndex(index) {
  const i = mod(index, 60);
  const stem = heavenlyStems[i % 10];
  const branch = earthlyBranches[i % 12];

  return {
    index: i,
    stem,
    branch,
    hanja: stem.hanja + branch.hanja,
    korean: stem.korean + branch.korean
  };
}

function buildGanjiCycle() {
  const list = [];

  for (let i = 0; i < 60; i++) {
    list.push(getGanjiByIndex(i));
  }

  return list;
}

module.exports = {
  mod,
  getGanjiByIndex,
  buildGanjiCycle
};