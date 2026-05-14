const fs = require('fs');

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

/* 1) aiGenerator.js */
let ai = fs.readFileSync('services/aiGenerator.js', 'utf8');

if (!ai.includes('const REPORT_SECTIONS =')) {
  const insert = `
const REPORT_SECTIONS = {
  yearly: [
    ["타고난 사주 구조", "사주팔자 원국, 일간, 오행, 십신을 기반으로 타고난 기질과 성향을 깊이 설명해주세요."],
    ["올해 전체 운세 흐름", "올해 세운 흐름을 중심으로 가장 중요한 변화와 흐름을 설명해주세요."],
    ["올해 연애운", "연애 흐름, 인연운, 재회 가능성, 감정 변화를 설명해주세요."],
    ["올해 결혼운", "결혼 가능 시기, 배우자운, 관계 안정 흐름을 설명해주세요."],
    ["올해 재물운", "재물 흐름, 돈 들어오는 방식, 지출 주의 시기를 설명해주세요."],
    ["올해 직업운", "직장, 이직, 사업, 커리어 흐름을 설명해주세요."],
    ["올해 건강운", "오행 균형과 건강 흐름을 중심으로 설명해주세요."],
    ...buildMonthlySections(CURR_YEAR)
  ],

  deep: SECTIONS,

  love: [
    ["타고난 연애 성향", "일간, 일지, 십신 구조를 바탕으로 연애 성향을 깊게 설명해주세요."],
    ["감정 표현 방식", "감정을 표현하고 받아들이는 방식을 설명해주세요."],
    ["이상형 분석", "끌리는 사람의 유형과 연애 스타일을 설명해주세요."],
    ["반복되는 연애 패턴", "반복되기 쉬운 연애 문제와 흐름을 설명해주세요."],
    ["인연운이 들어오는 시기", "앞으로 인연이 들어오기 쉬운 시기를 설명해주세요."],
    ["재회운과 연락 흐름", "재회 가능성, 연락 흐름, 다시 이어질 때의 주의점을 설명해주세요."],
    ["연애에서 조심할 점", "감정, 말투, 집착, 거리감 등 주의점을 설명해주세요."],
    ...buildMonthlySections(CURR_YEAR)
  ],

  marriage: [
    ["타고난 결혼관", "사주 구조상 결혼을 바라보는 방식과 안정 욕구를 설명해주세요."],
    ["배우자운", "배우자 성향과 결혼 후 관계 흐름을 설명해주세요."],
    ["결혼 가능 시기", "결혼 가능성이 높아지는 시기를 설명해주세요."],
    ["결혼 전 조심할 흐름", "관계가 흔들리기 쉬운 흐름과 갈등 포인트를 설명해주세요."],
    ["결혼 후 운세 흐름", "결혼 이후 생활, 돈, 관계 안정성을 설명해주세요."],
    ["안정적인 관계를 만드는 법", "사주 균형에 맞는 관계 유지 방법을 설명해주세요."],
    ...buildMonthlySections(CURR_YEAR)
  ],

  money: [
    ["타고난 재물 구조", "정재, 편재, 식상, 관성 구조를 바탕으로 재물복을 설명해주세요."],
    ["돈 들어오는 방식", "고정수입, 성과급, 사업, 부업 중 어떤 돈 흐름이 맞는지 설명해주세요."],
    ["돈이 새는 패턴", "지출 습관, 투자 실수, 사람으로 인한 손실 가능성을 설명해주세요."],
    ["사업운", "사업 적성, 확장 가능성, 동업 주의점을 설명해주세요."],
    ["직장운", "조직 적응력, 승진, 이직 흐름을 설명해주세요."],
    ["투자 흐름", "투자 성향과 위험 관리 방향을 설명해주세요."],
    ...buildMonthlySections(CURR_YEAR)
  ],

  couple: [
    ["두 사람의 기본 궁합", "두 사람의 일간과 오행 흐름을 중심으로 궁합을 설명해주세요."],
    ["성향 차이", "서로 다른 성향과 부딪히는 지점을 설명해주세요."],
    ["감정 흐름", "관계 안에서 감정이 흐르는 방식과 오해 포인트를 설명해주세요."],
    ["갈등 포인트", "반복될 수 있는 갈등과 해결 방향을 설명해주세요."],
    ["오래 갈 수 있는 관계인지", "관계 지속 가능성과 현실적인 조건을 설명해주세요."],
    ["결혼 궁합", "결혼 후 생활 흐름과 안정 가능성을 설명해주세요."],
    ["재회 가능성", "헤어진 관계라면 다시 이어질 가능성과 주의점을 설명해주세요."],
    ...buildMonthlySections(CURR_YEAR)
  ],

  full: SECTIONS,
  half: SECTIONS.slice(0, 20)
};

`;
  ai = ai.replace('const GLOSSARY =', insert + 'const GLOSSARY =');
}

ai = ai.replace(
  "const sectionsToUse = type === 'half' ? SECTIONS.slice(0, 20) : SECTIONS;",
  "const sectionsToUse = REPORT_SECTIONS[type] || REPORT_SECTIONS.deep;"
);

write('services/aiGenerator.js', ai);


/* 2) server.js */
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  "const validType = (reportType === 'half') ? 'half' : 'full';",
  "const allowedReportTypes = ['yearly','deep','love','marriage','money','couple','full','half'];\n    const validType = allowedReportTypes.includes(reportType) ? reportType : 'deep';"
);

write('server.js', server);


/* 3) report.html */
let html = fs.readFileSync('public/report.html', 'utf8');

html = html.replace(
  "let selectedReportType = 'full'; // 'full' | 'half'",
  "let selectedReportType = 'deep';"
);

if (!html.includes('id="reportMenuSelect"')) {
  html = html.replace(
    '<div class="field">\n        <label>리포트 분량</label>',
    `<div class="field">
        <label>PDF 상담 메뉴</label>
        <select id="reportMenuSelect" onchange="selectReportType(this.value)">
          <option value="yearly">올해 신년운세 PDF · 50P 이상</option>
          <option value="deep" selected>인생 사주 심층분석 PDF · 120P 이상</option>
          <option value="love">연애운 PDF · 50P 이상</option>
          <option value="marriage">결혼운 PDF · 50P 이상</option>
          <option value="money">사업·직장·재물운 PDF · 50P 이상</option>
          <option value="couple">연인 궁합 PDF · 50P 이상</option>
        </select>
        <div style="font-size:11px;color:var(--muted);margin-top:6px;font-family:'Noto Sans KR',sans-serif;line-height:1.7;">
          · 선택한 메뉴에 맞춰 PDF 주제와 챕터가 달라집니다.<br>
          · 표기 페이지는 최소 기준이며, 내용에 따라 초과 생성될 수 있습니다.
        </div>
      </div>

      <div class="field">
        <label>리포트 분량</label>`
  );
}

write('public/report.html', html);

console.log('PDF menu split patch complete');
