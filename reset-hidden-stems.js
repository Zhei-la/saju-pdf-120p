const fs = require('fs');

const file = 'services/saju/analysis/hiddenStems.js';

const code = `
const hiddenStems = {
  子: ['癸'],
  丑: ['癸', '辛', '己'],
  寅: ['戊', '丙', '甲'],
  卯: ['甲', '乙'],
  辰: ['乙', '癸', '戊'],
  巳: ['戊', '庚', '丙'],
  午: ['丙', '丁', '己'],
  未: ['丁', '乙', '己'],
  申: ['戊', '壬', '庚'],
  酉: ['庚', '辛'],
  戌: ['辛', '丁', '戊'],
  亥: ['戊', '甲', '壬']
};

function getHiddenStems(branchHanja) {
  return hiddenStems[branchHanja] || [];
}

module.exports = {
  hiddenStems,
  getHiddenStems
};
`;

fs.writeFileSync(file, code.trim() + '\\n', 'utf8');

console.log('hiddenStems.js reset');
