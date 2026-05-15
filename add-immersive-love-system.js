const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

/* =========================
   몰입형 디테일 DB 추가
========================= */

if (!s.includes('LOVE_REAL_DETAIL_POOL')) {

const detailPool = `
const LOVE_REAL_DETAIL_POOL = [
  "좋아할수록 오히려 침착한 척하는 편입니다.",
  "답장 속도보다 말투 변화를 더 신경 쓰는 편입니다.",
  "읽씹은 괜찮은 척 넘기지만 혼자 오래 곱씹는 경우가 많습니다.",
  "상대 반응이 평소와 달라지면 쉽게 눈치채는 편입니다.",
  "확신이 없으면 먼저 표현하기보다 타이밍만 재는 경우가 많습니다.",
  "좋아하는 마음이 커질수록 표현보다 관찰이 먼저 나옵니다.",
  "연락이 뜸해지면 아닌 척해도 계속 신경 쓰게 되는 편입니다.",
  "상대 말 한마디를 오래 기억하는 경우가 많습니다.",
  "감정이 커질수록 더 차분한 척하려는 모습이 나타납니다.",
  "갑자기 거리감이 느껴지면 혼자 여러 가능성을 생각하게 됩니다.",
  "좋아하는 사람이 생기면 일상 리듬까지 영향을 받는 편입니다.",
  "관계 흐름이 달라졌다고 느끼면 예민해지는 시기가 생길 수 있습니다."
];

const LOVE_IMMERSION_LINES = [
  "이 시기에는 예상하지 못한 감정 변화가 들어올 가능성이 있습니다.",
  "갑자기 가까워지는 관계 흐름이 만들어질 수 있는 시기입니다.",
  "상대 역시 감정을 다시 의식하기 시작할 가능성이 있습니다.",
  "연락 하나에도 감정 온도가 크게 달라질 수 있는 흐름입니다.",
  "잠잠했던 관계가 다시 움직이기 시작할 가능성이 있습니다.",
  "생각보다 빠르게 감정 거리가 가까워질 수 있는 시기입니다.",
  "무심했던 관계가 다시 이어질 흐름도 들어올 수 있습니다."
];
`;

s = detailPool + '\n\n' + s;
}

/* =========================
   랜덤 디테일 삽입 함수
========================= */

if (!s.includes('injectLoveImmersionDetails')) {

const helper = `
function injectLoveImmersionDetails(text) {
  try {
    const shuffled = [...LOVE_REAL_DETAIL_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const immersion = LOVE_IMMERSION_LINES[
      Math.floor(Math.random() * LOVE_IMMERSION_LINES.length)
    ];

    const insertText = '\\n\\n' +
      shuffled.map(v => '- ' + v).join('\\n') +
      '\\n\\n' + immersion + '\\n';

    const paragraphs = text.split('\\n');

    if (paragraphs.length > 3) {
      paragraphs.splice(2, 0, insertText);
    }

    return paragraphs.join('\\n');
  } catch (e) {
    return text;
  }
}
`;

s += '\n\n' + helper;
}

/* =========================
   연애운 결과 생성 후 삽입
========================= */

if (!s.includes('injectLoveImmersionDetails(resultText)')) {

s = s.replace(
  `return resultText;`,
  `if (
      reportType === 'love' ||
      reportLabel?.includes('연애')
    ) {
      resultText = injectLoveImmersionDetails(resultText);
    }

    return resultText;`
);

}

/* =========================
   브랜드 감성 문구 추가
========================= */

if (!s.includes('LOVE_BRAND_LINES')) {

const branding = `
const LOVE_BRAND_LINES = [
  "사랑은 늘 감정보다 조금 늦게 깨닫게 됩니다.",
  "가까워지는 감정은 대부분 조용히 시작됩니다.",
  "연애의 흐름은 생각보다 작은 감정에서 시작됩니다.",
  "마음이 깊어질수록 사람은 더 조심스러워지기도 합니다."
];
`;

s = branding + '\n\n' + s;
}

/* =========================
   섹션 시작 감성 문구
========================= */

if (!s.includes('getLoveBrandLine')) {

const brandHelper = `
function getLoveBrandLine() {
  return LOVE_BRAND_LINES[
    Math.floor(Math.random() * LOVE_BRAND_LINES.length)
  ];
}
`;

s += '\n\n' + brandHelper;
}

fs.writeFileSync(file, s, 'utf8');

console.log('added immersive love detail system');
