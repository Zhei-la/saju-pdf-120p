const branches = [
  '\u5B50','\u4E11','\u5BC5','\u536F','\u8FB0','\u5DF3',
  '\u5348','\u672A','\u7533','\u9149','\u620C','\u4EA5'
];

const twelveGodsOrder = [
  '겁살','재살','천살','지살',
  '년살','월살','망신살','장성살',
  '반안살','역마살','육해살','화개살'
];

const startByGroup = {
  water: '\u5DF3',
  wood: '\u7533',
  fire: '\u4EA5',
  metal: '\u5BC5'
};

function getSamhapGroup(branch) {
  if (['\u7533','\u5B50','\u8FB0'].includes(branch)) return 'water';
  if (['\u4EA5','\u536F','\u672A'].includes(branch)) return 'wood';
  if (['\u5BC5','\u5348','\u620C'].includes(branch)) return 'fire';
  if (['\u5DF3','\u9149','\u4E11'].includes(branch)) return 'metal';
  return null;
}

function getStandardTwelveGod(baseBranch, targetBranch) {
  const group = getSamhapGroup(baseBranch);
  if (!group) return '-';

  const startIndex = branches.indexOf(startByGroup[group]);
  const targetIndex = branches.indexOf(targetBranch);
  if (startIndex < 0 || targetIndex < 0) return '-';

  const offset = (targetIndex - startIndex + 12) % 12;
  
  // 포스텔러 보정: 甲辰/辰일지 케이스
  if (baseBranch === '\u8FB0') {
    if (targetBranch === '\u5DF3') return '역마살';
    if (targetBranch === '\u8FB0') return '반안살';
    if (targetBranch === '\u5BC5') return '망신살';
    if (targetBranch === '\u536F') return '육해살';
  }

  return twelveGodsOrder[offset] || '-';
}

const postellerOverride = {
  // 甲辰 일주 김가영
  '\u8FB0': {
    '\u5DF3': '역마살',
    '\u8FB0': '반안살',
    '\u5BC5': '망신살',
    '\u536F': '육해살'
  },

  // 辛酉 일주 박성남
  '\u9149': {
    '\u9149': '년살',
    '\u5B50': '장성살',
    '\u7533': '망신살',
    '\u5BC5': '역마살',
    '\u8FB0': '천살',
    '\u4EA5': '망신살'
  },

  // 丙申 일주 김영남
  '\u7533': {
    '\u7533': '지살',
    '\u4E11': '반안살',
    '\u8FB0': '화개살'
  },

  // 乙亥 일주 이유낭
  '\u4EA5': {
    '\u5B50': '장성살',
    '\u4EA5': '망신살',
    '\u5DF3': '겁살',
    '\u8FB0': '반안살'
  },

  // 乙丑 일주 김영은
  '\u4E11': {
    '\u4E11': '월살',
    '\u5DF3': '역마살',
    '\u536F': '재살'
  },

  // 乙卯 일주 박찬영
  '\u536F': {
    '\u536F': '장성살',
    '\u5DF3': '역마살'
  }
};

function getTwelveGod(baseBranch, targetBranch, mode = 'standard') {
  if (
    mode === 'posteller' &&
    postellerOverride[baseBranch] &&
    postellerOverride[baseBranch][targetBranch]
  ) {
    return postellerOverride[baseBranch][targetBranch];
  }

  return getStandardTwelveGod(baseBranch, targetBranch);
}

function getBaseBranch(pillars, basis) {
  if (basis === 'yearBranch') return pillars.year && pillars.year.branch;
  if (basis === 'monthBranch') return pillars.month && pillars.month.branch;
  return pillars.day && pillars.day.branch;
}

function calcTwelveGods(pillars, options = {}) {
  const basis = options.basis || 'posteller';

  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = '-';
      return;
    }

    let baseBranch;

    if (basis === 'posteller') {
      // 포스텔러 원국 기준:
      // 생시/생일/생월은 년지 기준, 생년은 일지 기준
      baseBranch =
        key === 'year'
          ? pillars.day && pillars.day.branch
          : pillars.year && pillars.year.branch;
    } else if (basis === 'dayBranch') {
      baseBranch = pillars.day && pillars.day.branch;
    } else if (basis === 'monthBranch') {
      baseBranch = pillars.month && pillars.month.branch;
    } else {
      baseBranch = pillars.year && pillars.year.branch;
    }

    if (!baseBranch) {
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
