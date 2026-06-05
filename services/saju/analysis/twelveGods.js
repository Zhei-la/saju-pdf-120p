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

const baseMap = {
  [B.JA]: {
    [B.JA]:'장성살', [B.CHUK]:'반안살', [B.IN]:'역마살', [B.MYO]:'육해살',
    [B.JIN]:'화개살', [B.SA]:'겁살', [B.O]:'재살', [B.MI]:'천살',
    [B.SIN]:'지살', [B.YU]:'년살', [B.SUL]:'월살', [B.HAE]:'망신살'
  },
  [B.O]: {
    [B.O]:'장성살', [B.MI]:'반안살', [B.SIN]:'역마살', [B.YU]:'육해살',
    [B.SUL]:'화개살', [B.HAE]:'겁살', [B.JA]:'재살', [B.CHUK]:'천살',
    [B.IN]:'지살', [B.MYO]:'년살', [B.JIN]:'월살', [B.SA]:'망신살'
  },
  [B.MYO]: {
    [B.MYO]:'육해살', [B.JIN]:'반안살', [B.SA]:'역마살', [B.O]:'육해살',
    [B.MI]:'화개살', [B.SIN]:'겁살', [B.YU]:'재살', [B.SUL]:'천살',
    [B.HAE]:'지살', [B.JA]:'년살', [B.CHUK]:'월살', [B.IN]:'망신살'
  },
  [B.YU]: {
    [B.YU]:'장성살', [B.SUL]:'반안살', [B.HAE]:'역마살', [B.JA]:'육해살',
    [B.CHUK]:'화개살', [B.IN]:'겁살', [B.MYO]:'재살', [B.JIN]:'천살',
    [B.SA]:'지살', [B.O]:'년살', [B.MI]:'월살', [B.SIN]:'망신살'
  }
};

const groupBase = {
  [B.SIN]:B.JA, [B.JA]:B.JA, [B.JIN]:B.MYO,
  [B.IN]:B.O, [B.O]:B.O, [B.SUL]:B.O,
  [B.HAE]:B.MYO, [B.MYO]:B.MYO, [B.MI]:B.MYO,
  [B.SA]:B.YU, [B.YU]:B.YU, [B.CHUK]:B.YU
};

function getTwelveGod(baseBranch, targetBranch) {
  const base = groupBase[baseBranch];
  if (!base) return '-';
  return (baseMap[base] && baseMap[base][targetBranch]) || '-';
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
