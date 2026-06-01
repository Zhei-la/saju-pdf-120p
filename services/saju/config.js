const SAJU_CONFIG = {
  timezone: 'Asia/Seoul',

  solarTermTime: 'korean_standard_time',

  hourBranchMode: 'korea_30min_adjusted',

  dayChangeMode: 'midnight_day_change',

  allowAdvancedOptions: true,

  hourRanges: [
    {
      branch: '子',
      korean: '자',
      start: '23:30',
      end: '01:30'
    },
    {
      branch: '丑',
      korean: '축',
      start: '01:30',
      end: '03:30'
    },
    {
      branch: '寅',
      korean: '인',
      start: '03:30',
      end: '05:30'
    },
    {
      branch: '卯',
      korean: '묘',
      start: '05:30',
      end: '07:30'
    },
    {
      branch: '辰',
      korean: '진',
      start: '07:30',
      end: '09:30'
    },
    {
      branch: '巳',
      korean: '사',
      start: '09:30',
      end: '11:30'
    },
    {
      branch: '午',
      korean: '오',
      start: '11:30',
      end: '13:30'
    },
    {
      branch: '未',
      korean: '미',
      start: '13:30',
      end: '15:30'
    },
    {
      branch: '申',
      korean: '신',
      start: '15:30',
      end: '17:30'
    },
    {
      branch: '酉',
      korean: '유',
      start: '17:30',
      end: '19:30'
    },
    {
      branch: '戌',
      korean: '술',
      start: '19:30',
      end: '21:30'
    },
    {
      branch: '亥',
      korean: '해',
      start: '21:30',
      end: '23:30'
    }
  ],

  dayChangeModes: {
    midnight_day_change: {
      name: '자정 기준',
      description:
        '23:30~23:59는 자시지만 당일 일주 유지'
    },

    late_zi_next_day: {
      name: '야자시 다음날 적용',
      description:
        '23:30부터 다음 날 일주 적용'
    },

    split_zi: {
      name: '조자시/야자시 분리',
      description:
        '23:30~23:59 야자시, 00:00~01:29 조자시'
    }
  }
};

module.exports = {
  SAJU_CONFIG
};