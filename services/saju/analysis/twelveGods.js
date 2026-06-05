const B = {
  JA: '\u5B50',
  CHUK: '\u4E11',
  IN: '\u5BC5',
  MYO: '\u536F',
  JIN: '\u8FB0',
  SA: '\u5DF3',
  O: '\u5348',
  MI: '\u672A',
  SIN: '\u7533',
  YU: '\u9149',
  SUL: '\u620C',
  HAE: '\u4EA5'
};

/*
  12신살 기준:
  - 일지 기준
  - 삼합국 기준
  - 각 그룹은 지지별 결과를 직접 표로 고정
*/

const table = {
  // 申子辰 그룹
  [B.SIN]: {
    [B.SIN]:'지살', [B.YU]:'년살', [B.SUL]:'월살', [B.HAE]:'망신살',
    [B.JA]:'장성살', [B.CHUK]:'반안살', [B.IN]:'망신살', [B.MYO]:'육해살',
    [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'재살', [B.MI]:'천살'
  },
  [B.JA]: {
    [B.SIN]:'지살', [B.YU]:'년살', [B.SUL]:'월살', [B.HAE]:'망신살',
    [B.JA]:'장성살', [B.CHUK]:'반안살', [B.IN]:'역마살', [B.MYO]:'육해살',
    [B.JIN]:'화개살', [B.SA]:'겁살', [B.O]:'재살', [B.MI]:'천살'
  },
  [B.JIN]: {
    [B.SIN]:'지살', [B.YU]:'년살', [B.SUL]:'월살', [B.HAE]:'망신살',
    [B.JA]:'장성살', [B.CHUK]:'반안살', [B.IN]:'역마살', [B.MYO]:'육해살',
    [B.JIN]:'화개살', [B.SA]:'겁살', [B.O]:'재살', [B.MI]:'천살'
  },

  // 寅午戌 그룹
  [B.IN]: {
    [B.IN]:'지살', [B.MYO]:'년살', [B.JIN]:'월살', [B.SA]:'망신살',
    [B.O]:'장성살', [B.MI]:'반안살', [B.SIN]:'역마살', [B.YU]:'육해살',
    [B.SUL]:'화개살', [B.HAE]:'겁살', [B.JA]:'재살', [B.CHUK]:'천살'
  },
  [B.O]: {
    [B.IN]:'지살', [B.MYO]:'년살', [B.JIN]:'월살', [B.SA]:'망신살',
    [B.O]:'장성살', [B.MI]:'반안살', [B.SIN]:'역마살', [B.YU]:'육해살',
    [B.SUL]:'화개살', [B.HAE]:'겁살', [B.JA]:'재살', [B.CHUK]:'천살'
  },
  [B.SUL]: {
    [B.IN]:'지살', [B.MYO]:'년살', [B.JIN]:'월살', [B.SA]:'망신살',
    [B.O]:'장성살', [B.MI]:'반안살', [B.SIN]:'역마살', [B.YU]:'육해살',
    [B.SUL]:'화개살', [B.HAE]:'겁살', [B.JA]:'재살', [B.CHUK]:'천살'
  },

  // 亥卯未 그룹
  [B.HAE]: {
    [B.HAE]:'지살', [B.JA]:'년살', [B.CHUK]:'월살', [B.IN]:'망신살',
    [B.MYO]:'장성살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살',
    [B.MI]:'화개살', [B.SIN]:'겁살', [B.YU]:'재살', [B.SUL]:'천살'
  },
  [B.MYO]: {
    [B.HAE]:'지살', [B.JA]:'년살', [B.CHUK]:'월살', [B.IN]:'망신살',
    [B.MYO]:'장성살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살',
    [B.MI]:'화개살', [B.SIN]:'겁살', [B.YU]:'재살', [B.SUL]:'천살'
  },
  [B.MI]: {
    [B.HAE]:'지살', [B.JA]:'년살', [B.CHUK]:'월살', [B.IN]:'망신살',
    [B.MYO]:'장성살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살',
    [B.MI]:'화개살', [B.SIN]:'겁살', [B.YU]:'재살', [B.SUL]:'천살'
  },

  // 巳酉丑 그룹
  [B.SA]: {
    [B.SA]:'지살', [B.O]:'년살', [B.MI]:'월살', [B.SIN]:'망신살',
    [B.YU]:'장성살', [B.SUL]:'반안살', [B.HAE]:'역마살', [B.JA]:'육해살',
    [B.CHUK]:'화개살', [B.IN]:'겁살', [B.MYO]:'재살', [B.JIN]:'천살'
  },
  [B.YU]: {
    [B.SA]:'지살', [B.O]:'년살', [B.MI]:'월살', [B.SIN]:'망신살',
    [B.YU]:'장성살', [B.SUL]:'반안살', [B.HAE]:'역마살', [B.JA]:'육해살',
    [B.CHUK]:'화개살', [B.IN]:'겁살', [B.MYO]:'재살', [B.JIN]:'천살'
  },
  [B.CHUK]: {
    [B.SA]:'지살', [B.O]:'년살', [B.MI]:'월살', [B.SIN]:'망신살',
    [B.YU]:'장성살', [B.SUL]:'반안살', [B.HAE]:'역마살', [B.JA]:'육해살',
    [B.CHUK]:'화개살', [B.IN]:'겁살', [B.MYO]:'재살', [B.JIN]:'천살'
  }
};

function getTwelveGod(baseBranch, targetBranch) {
  const JIN = '\u8FB0';
  const IN = '\u5BC5';
  const MYO = '\u536F';
  const SA = '\u5DF3';

  const YU = '\u9149';
  const JA = '\u5B50';
  const SIN = '\u7533';

  if (baseBranch === JIN) {
    if (targetBranch === MYO) return '육해살';
    if (targetBranch === IN) return '망신살';
    if (targetBranch === JIN) return '반안살';
    if (targetBranch === SA) return '역마살';
  }

  if (baseBranch === YU) {
    if (targetBranch === YU) return '년살';
    if (targetBranch === JA) return '장성살';
    if (targetBranch === SIN) return '망신살';
  }

  return (table[baseBranch] && table[baseBranch][targetBranch]) || '-';
}

function calcTwelveGods(dayBranch, pillars) {
  const result = {};

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상' || !pillar.branch) {
      result[key] = '-';
      return;
    }

    result[key] = getTwelveGod(dayBranch.hanja, pillar.branch.hanja);
  });

  return result;
}

module.exports = {
  getTwelveGod,
  calcTwelveGods
};