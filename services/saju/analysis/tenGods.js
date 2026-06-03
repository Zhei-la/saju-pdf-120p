const branchMainStem = {
  子: '癸',
  丑: '己',
  寅: '甲',
  卯: '乙',
  辰: '戊',
  巳: '丙',
  午: '丁',
  未: '己',
  申: '庚',
  酉: '辛',
  戌: '戊',
  亥: '壬'
};

function getTenGod(dayStem, targetStem) {
  if (!dayStem || !targetStem) return '-';

  const key = dayStem.hanja + targetStem.hanja;

  const table = {
    甲甲:'비견', 甲乙:'겁재', 甲丙:'식신', 甲丁:'상관', 甲戊:'편재', 甲己:'정재', 甲庚:'편관', 甲辛:'정관', 甲壬:'편인', 甲癸:'정인',
    乙甲:'겁재', 乙乙:'비견', 乙丙:'상관', 乙丁:'식신', 乙戊:'정재', 乙己:'편재', 乙庚:'정관', 乙辛:'편관', 乙壬:'정인', 乙癸:'편인',
    丙甲:'편인', 丙乙:'정인', 丙丙:'비견', 丙丁:'겁재', 丙戊:'식신', 丙己:'상관', 丙庚:'편재', 丙辛:'정재', 丙壬:'편관', 丙癸:'정관',
    丁甲:'정인', 丁乙:'편인', 丁丙:'겁재', 丁丁:'비견', 丁戊:'상관', 丁己:'식신', 丁庚:'정재', 丁辛:'편재', 丁壬:'정관', 丁癸:'편관',
    戊甲:'편관', 戊乙:'정관', 戊丙:'편인', 戊丁:'정인', 戊戊:'비견', 戊己:'겁재', 戊庚:'식신', 戊辛:'상관', 戊壬:'편재', 戊癸:'정재',
    己甲:'정관', 己乙:'편관', 己丙:'정인', 己丁:'편인', 己戊:'겁재', 己己:'비견', 己庚:'상관', 己辛:'식신', 己壬:'정재', 己癸:'편재',
    庚甲:'편재', 庚乙:'정재', 庚丙:'편관', 庚丁:'정관', 庚戊:'편인', 庚己:'정인', 庚庚:'비견', 庚辛:'겁재', 庚壬:'식신', 庚癸:'상관',
    辛甲:'정재', 辛乙:'편재', 辛丙:'정관', 辛丁:'편관', 辛戊:'정인', 辛己:'편인', 辛庚:'겁재', 辛辛:'비견', 辛壬:'상관', 辛癸:'식신',
    壬甲:'식신', 壬乙:'상관', 壬丙:'편재', 壬丁:'정재', 壬戊:'편관', 壬己:'정관', 壬庚:'편인', 壬辛:'정인', 壬壬:'비견', 壬癸:'겁재',
    癸甲:'상관', 癸乙:'식신', 癸丙:'정재', 癸丁:'편재', 癸戊:'정관', 癸己:'편관', 癸庚:'정인', 癸辛:'편인', 癸壬:'겁재', 癸癸:'비견'
  };

  return table[key] || '-';
}

function getTenGodGroup(tenGod) {
  if (['비견', '겁재'].includes(tenGod)) return '비겁';
  if (['식신', '상관'].includes(tenGod)) return '식상';
  if (['편재', '정재'].includes(tenGod)) return '재성';
  if (['편관', '정관'].includes(tenGod)) return '관성';
  if (['편인', '정인'].includes(tenGod)) return '인성';
  return '-';
}

function findStemByHanja(hanja, heavenlyStems) {
  return heavenlyStems.find(s => s.hanja === hanja);
}

function calcTenGods(dayStem, pillars, heavenlyStems = []) {
  const stem = {};
  const branch = {};

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
      stem[key] = '-';
      branch[key] = '-';
      return;
    }

    const stemTenGod = getTenGod(dayStem, pillar.stem);
    stem[key] = stemTenGod;

    if (count[stemTenGod] !== undefined) count[stemTenGod]++;

    const mainStemHanja = pillar.branch ? branchMainStem[pillar.branch.hanja] : null;
    const mainStem = mainStemHanja ? findStemByHanja(mainStemHanja, heavenlyStems) : null;
    const branchTenGod = getTenGod(dayStem, mainStem);

    branch[key] = branchTenGod;

    if (count[branchTenGod] !== undefined) count[branchTenGod]++;
  });

  const total = Object.values(count).reduce((a, b) => a + b, 0) || 1;

  const percent = {};
  Object.keys(count).forEach(k => {
    percent[k] = Math.round(count[k] / total * 1000) / 10;
  });

  return {
    stem,
    branch,
    byPillar: stem,
    count,
    percent
  };
}

module.exports = {
  getTenGod,
  getTenGodGroup,
  calcTenGods,
  branchMainStem
};