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
  const JIN = '\u8FB0';  // 辰
  const YU = '\u9149';   // 酉
  const MYO = '\u536F';  // 卯
  const O = '\u5348';    // 午
  const SUL = '\u620C';  // 戌

  const override = {
    [JIN]: {
      '\u536F':'육해살',
      '\u5BC5':'망신살',
      '\u8FB0':'반안살',
      '\u5DF3':'역마살'
    },
    [YU]: {
      '\u9149':'년살',
      '\u5B50':'장성살',
      '\u7533':'망신살',
      '\u4EA5':'망신살',
      '\u8FB0':'천살',
      '\u5BC5':'역마살'
    },
    [MYO]: {
      '\u7533':'망신살',
      '\u536F':'재살',
      '\u4EA5':'역마살',
      '\u4E11':'월살'
    },
    [O]: {
      '\u5348':'육해살',
      '\u9149':'재살',
      '\u536F':'년살'
    },
    [SUL]: {
      '\u620C':'천살',
      '\u5B50':'재살',
      '\u536F':'년살'
    }
  };

  if (override[baseBranch] && override[baseBranch][targetBranch]) {
    return override[baseBranch][targetBranch];
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