const branches = [
  '\u5B50', '\u4E11', '\u5BC5', '\u536F',
  '\u8FB0', '\u5DF3', '\u5348', '\u672A',
  '\u7533', '\u9149', '\u620C', '\u4EA5'
];

const twelveGodsOrder = [
  '겁살', '재살', '천살', '지살',
  '년살', '월살', '망신살', '장성살',
  '반안살', '역마살', '육해살', '화개살'
];

const startByGroup = {
  water: '\u5DF3',
  wood: '\u7533',
  fire: '\u4EA5',
  metal: '\u5BC5'
};

function getSamhapGroup(branch) {
  if (['\u7533', '\u5B50', '\u8FB0'].includes(branch)) return 'water';
  if (['\u4EA5', '\u536F', '\u672A'].includes(branch)) return 'wood';
  if (['\u5BC5', '\u5348', '\u620C'].includes(branch)) return 'fire';
  if (['\u5DF3', '\u9149', '\u4E11'].includes(branch)) return 'metal';
  return null;
}

function getTwelveGod(baseBranch, targetBranch) {
  const group = getSamhapGroup(baseBranch);
  if (!group) return '-';

  const startIndex = branches.indexOf(startByGroup[group]);
  const targetIndex = branches.indexOf(targetBranch);

  if (startIndex < 0 || targetIndex < 0) return '-';

  const offset = (targetIndex - startIndex + 12) % 12;
  return twelveGodsOrder[offset] || '-';
}

function calcTwelveGods(pillars, options = {}) {
  const basis = options.basis || 'yearBranch';

  const baseBranch =
    basis === 'dayBranch' ? pillars.day && pillars.day.branch :
    basis === 'monthBranch' ? pillars.month && pillars.month.branch :
    pillars.year && pillars.year.branch;

  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!baseBranch || !pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = '-';
      return;
    }

    result[key] = getTwelveGod(baseBranch.hanja, pillar.branch.hanja);
  });

  return result;
}

module.exports = {
  getTwelveGod,
  calcTwelveGods
};
