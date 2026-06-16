const SAJU_CONFIG = {
  timezone: 'Asia/Seoul',

  solarTermTime: 'korean_standard_time',

  // 포스텔러 기준: 23:30~01:30 자시, 이후 2시간 단위
  hourBranchMode: 'korea_30min_adjusted',

  dayChangeMode: 'midnight_day_change',

  allowAdvancedOptions: true,

  hourRanges: [
    { branch: '\u5B50', korean: '자', start: '23:30', end: '01:30' },
    { branch: '\u4E11', korean: '축', start: '01:30', end: '03:30' },
    { branch: '\u5BC5', korean: '인', start: '03:30', end: '05:30' },
    { branch: '\u536F', korean: '묘', start: '05:30', end: '07:30' },
    { branch: '\u8FB0', korean: '진', start: '07:30', end: '09:30' },
    { branch: '\u5DF3', korean: '사', start: '09:30', end: '11:30' },
    { branch: '\u5348', korean: '오', start: '11:30', end: '13:30' },
    { branch: '\u672A', korean: '미', start: '13:30', end: '15:30' },
    { branch: '\u7533', korean: '신', start: '15:30', end: '17:30' },
    { branch: '\u9149', korean: '유', start: '17:30', end: '19:30' },
    { branch: '\u620C', korean: '술', start: '19:30', end: '21:30' },
    { branch: '\u4EA5', korean: '해', start: '21:30', end: '23:30' }
  ],

  dayChangeModes: {
    midnight_day_change: {
      name: '자정 기준',
      description: '00:00 기준으로 일주를 변경합니다.'
    },
    late_zi_next_day: {
      name: '야자시 다음날 적용',
      description: '23:30부터 다음 날 일주를 적용합니다.'
    },
    split_zi: {
      name: '조자시/야자시 분리',
      description: '23:30~23:59는 야자시, 00:00~01:29는 조자시로 봅니다.'
    }
  }
};

module.exports = {
  SAJU_CONFIG
};
