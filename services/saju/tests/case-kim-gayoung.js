const { calculateSajuEngine } = require('../index');

const result = calculateSajuEngine({
  name: '김가영',
  birth: '1999.02.21',
  gender: '여성',
  calendar: '양력',
  birthTime: '사시 09:00-11:00'
});

console.log(JSON.stringify({
  pillars: result.pillars,
  elementPercent: result.elementPercent,
  tenGods: result.tenGods,
  hiddenStems: result.hiddenStems,
  twelveStates: result.twelveStates,
  daeyun: result.daeyun
}, null, 2));

console.log('EXPECTED');
console.log(JSON.stringify({
  pillars: {
    year: '己卯',
    month: '丙寅',
    day: '甲辰',
    hour: '己巳'
  },
  elementPercent: {
    목: 37.5,
    화: 25,
    토: 37.5,
    금: 0,
    수: 0
  },
  daeyun: ['丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉','甲戌','乙亥','丙子']
}, null, 2));