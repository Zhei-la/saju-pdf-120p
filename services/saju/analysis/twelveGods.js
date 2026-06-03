const twelveGodNames = [
  '장성살',
  '반안살',
  '역마살',
  '육해살',
  '화개살',
  '겁살',
  '재살',
  '천살',
  '지살',
  '년살',
  '월살',
  '망신살'
];

// 삼합 그룹 기준
const groupStart = {
  申: '子',
  子: '子',
  辰: '子',

  寅: '午',
  午: '午',
  戌: '午',

  亥: '卯',
  卯: '卯',
  未: '卯',

  巳: '酉',
  酉: '酉',
  丑: '酉'
};

const branchOrder = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

function getTwelveGod(baseBranch, targetBranch) {
  const startBranch = groupStart[baseBranch];

  if (!startBranch) return '-';

  const startIndex = branchOrder.indexOf(startBranch);
  const targetIndex = branchOrder.indexOf(targetBranch);

  if (startIndex === -1 || targetIndex === -1) return '-';

  const diff = (targetIndex - startIndex + 12) % 12;

  return twelveGodNames[diff] || '-';
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