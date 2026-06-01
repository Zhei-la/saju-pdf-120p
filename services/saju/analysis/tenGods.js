const generates = {
  목: '화',
  화: '토',
  토: '금',
  금: '수',
  수: '목'
};

const controls = {
  목: '토',
  토: '수',
  수: '화',
  화: '금',
  금: '목'
};

function getTenGod(dayStem, targetStem) {
  if (!dayStem || !targetStem) return '-';

  const dayElement = dayStem.element;
  const targetElement = targetStem.element;

  const sameYinYang =
    dayStem.yinYang === targetStem.yinYang;

  if (dayElement === targetElement) {
    return sameYinYang ? '비견' : '겁재';
  }

  if (generates[dayElement] === targetElement) {
    return sameYinYang ? '식신' : '상관';
  }

  if (controls[dayElement] === targetElement) {
    return sameYinYang ? '편재' : '정재';
  }

  if (controls[targetElement] === dayElement) {
    return sameYinYang ? '편관' : '정관';
  }

  if (generates[targetElement] === dayElement) {
    return sameYinYang ? '편인' : '정인';
  }

  return '-';
}

function getTenGodGroup(tenGod) {
  if (['비견', '겁재'].includes(tenGod)) return '비겁';
  if (['식신', '상관'].includes(tenGod)) return '식상';
  if (['편재', '정재'].includes(tenGod)) return '재성';
  if (['편관', '정관'].includes(tenGod)) return '관성';
  if (['편인', '정인'].includes(tenGod)) return '인성';
  return '-';
}

function calcTenGods(dayStem, pillars) {
  const result = {};
  const count = {
    비견: 0,
    겁재: 0,
    식신: 0,
    상관: 0,
    편재: 0,
    정재: 0,
    편관: 0,
    정관: 0,
    편인: 0,
    정인: 0
  };

  Object.entries(pillars).forEach(([key, pillar]) => {
    if (!pillar || pillar.hanja === '미상') {
      result[key] = '-';
      return;
    }

    const tenGod = getTenGod(dayStem, pillar.stem);
    result[key] = tenGod;

    if (count[tenGod] !== undefined) {
      count[tenGod]++;
    }
  });

  const total = Object.values(count).reduce((a, b) => a + b, 0) || 1;
  const percent = {};

  Object.keys(count).forEach(k => {
    percent[k] = Math.round(count[k] / total * 1000) / 10;
  });

  return {
    byPillar: result,
    count,
    percent
  };
}

module.exports = {
  getTenGod,
  getTenGodGroup,
  calcTenGods
};