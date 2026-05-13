const OpenAI = require('openai');

// 현재 연도 자동 계산
const NOW = new Date();
const CURR_YEAR = NOW.getFullYear();
const NEXT_YEAR = CURR_YEAR + 1;

// 6부 월별 운세 동적 생성 (현재 연도 자동 반영)
function buildMonthlySections(year) {
  const arr = [];
  for (let m = 1; m <= 12; m++) {
    if (m === 12) {
      arr.push([
        `${year}년 ${m}월 운세 및 종합 조언`,
        `${year}년 ${m}월 운세와 한 해를 마무리하는 종합 조언을 1500자 이상 분석해주세요.`
      ]);
    } else {
      arr.push([
        `${year}년 ${m}월 운세`,
        `${year}년 ${m}월 운세를 해당 월의 월간/월지와 사주 원국의 관계를 근거로 일, 사업, 재물, 건강, 관계로 나누어 1500자 이상 분석해주세요.`
      ]);
    }
  }
  return arr;
}

const SECTIONS = [
  // ── 1부: 본성과 성격 (1-5) ──
  ["타고난 기질과 본성",           "이 사람의 타고난 성격, 기질, 내면의 본성을 일간의 오행과 십성 배치를 근거로 1500자 이상 깊이 있게 분석해주세요."],
  ["사회적 성격과 대인관계",       "사회생활에서 드러나는 성격과 인간관계 패턴을 월주와 시주의 십성을 근거로 1500자 이상 분석해주세요."],
  ["감정 기복과 내면세계",         "감정의 기복, 스트레스 대처 방식을 12운성과 신강/신약 지표를 근거로 1500자 이상 분석해주세요."],
  ["장점과 강점",                 "이 사람의 장점과 강점을 십성 분포와 오행 균형을 근거로 1500자 이상 분석해주세요."],
  ["단점과 보완할 점",             "단점과 약점을 부족한 오행과 용신을 근거로 1500자 이상 분석해주세요."],

  // ── 2부: 커리어와 재물 (6-11) ──
  ["직업운과 적성",               "적합한 직업군과 적성을 일간의 오행, 식신/상관, 정재/편재의 강약을 근거로 1500자 이상 분석해주세요."],
  ["커리어 전략과 성공 시기",      "커리어 성장 전략과 성공 시기를 대운 흐름과 관성(정관/편관) 배치를 근거로 1500자 이상 분석해주세요."],
  ["재물운과 돈 버는 방식",        "재물운을 정재/편재의 위치와 강약을 근거로 1500자 이상 분석해주세요."],
  ["투자 성향과 재테크",           "투자 성향을 편재/정재 비율과 일간의 성격을 근거로 1500자 이상 분석해주세요."],
  ["사업운과 독립 가능성",         "사업 적성을 식상(식신/상관)과 재성(정재/편재)의 연결을 근거로 1500자 이상 분석해주세요."],
  ["대운과 세운의 흐름",           `현재 대운과 ${CURR_YEAR}~${NEXT_YEAR}년 세운(연운)의 흐름을 대운/연운 데이터를 근거로 1500자 이상 분석해주세요.`],

  // ── 3부: 인간관계와 인연 (12-17) ──
  ["연애운과 이성관계",           "연애 스타일과 끌리는 타입을 일지의 십성과 재성/관성 배치를 근거로 1500자 이상 분석해주세요."],
  ["배우자 인연과 결혼운",         "배우자의 특징과 결혼 시기를 일지와 궁성 배치를 근거로 1500자 이상 분석해주세요."],
  ["궁합과 맞는 상대",             "궁합이 잘 맞는 상대의 일간과 오행 특성을 1500자 이상 분석해주세요."],
  ["부모 및 가족 관계",           "부모와의 관계를 연주/월주의 십성과 인성(정인/편인) 배치를 근거로 1500자 이상 분석해주세요."],
  ["자녀운과 자녀 관계",           "자녀 인연을 시주의 십성과 식상(식신/상관) 배치를 근거로 1500자 이상 분석해주세요."],
  ["귀인과 조력자",               "귀인의 특징을 정인/정관의 위치와 대운 흐름을 근거로 1500자 이상 분석해주세요."],

  // ── 4부: 건강과 인생 (18-22) ──
  ["건강운과 주의 부위",           "건강 취약 부위를 부족한 오행(목=간, 화=심장, 토=위장, 금=폐, 수=신장)과 12운성을 근거로 1500자 이상 분석해주세요."],
  ["정신건강과 스트레스 관리",     "정신 건강을 신강/신약 지표와 인성(정인/편인)의 강약을 근거로 1500자 이상 분석해주세요."],
  ["학업운과 시험 성취",           "학업 능력을 인성(정인/편인)과 식신의 배치를 근거로 1500자 이상 분석해주세요."],
  ["이사와 해외 이민운",           "거주지 변화와 해외 가능성을 역마살 유무와 대운 흐름을 근거로 1500자 이상 분석해주세요."],
  ["숨겨진 재능과 잠재력",         "숨겨진 재능을 지장간의 숨은 천간과 편인/상관의 배치를 근거로 1500자 이상 분석해주세요."],

  // ── 5부: 인생 굴곡과 운명 (23-28) ──
  ["인생의 굴곡과 시련",           "인생의 시련을 충(충돌)과 대운의 전환기를 근거로 1500자 이상 분석해주세요."],
  ["적과 경쟁자 관계",             "경쟁자 유형을 겁재와 편관의 배치를 근거로 1500자 이상 분석해주세요."],
  ["중년운과 40~50대 흐름",        "중년 운세를 해당 시기 대운과 연운을 근거로 1500자 이상 분석해주세요."],
  ["노년운과 말년 흐름",           "노년 운세를 후반 대운 흐름을 근거로 1500자 이상 분석해주세요."],
  ["오행의 균형과 용신 활용법",    "사주 오행의 균형과 용신을 활용한 실생활 개운법을 1500자 이상 분석해주세요."],
  ["십신(十神) 종합 분석",         "사주의 십신 구조와 삶에 미치는 영향을 십성 분포 데이터를 근거로 1500자 이상 분석해주세요."],

  // ── 6부: 월별 상세 운세 (현재 연도 자동) (29-40) ──
  ...buildMonthlySections(CURR_YEAR)
];

const GLOSSARY = {
  0: {
    "일간(日干)": "사주의 중심축. 나 자신을 나타내는 글자로, 생일의 천간입니다. 모든 분석의 기준점입니다.",
    "오행(五行)": "목(木), 화(火), 토(土), 금(金), 수(水) 다섯 가지 기운. 서로 생(도움)하고 극(제어)하는 관계를 가집니다.",
    "신강/신약": "일간의 기운이 강한지(신강) 약한지(신약). 신강하면 독립적, 신약하면 협력이 필요합니다."
  },
  5: {
    "식신(食神)": "내가 낳는 기운 중 같은 음양. 재능, 표현력, 먹을 복을 뜻합니다.",
    "상관(傷官)": "내가 낳는 기운 중 다른 음양. 창의력과 반항기, 예술적 감각을 뜻합니다.",
    "정재(正財)": "내가 극하는 기운 중 다른 음양. 안정적 수입, 성실한 재물을 뜻합니다.",
    "편재(偏財)": "내가 극하는 기운 중 같은 음양. 투기적 재물, 큰 돈, 사업 수완을 뜻합니다."
  },
  11: {
    "정관(正官)": "나를 극하는 기운 중 다른 음양. 명예, 직장, 규율을 뜻합니다. 여성에게는 남편을 나타냅니다.",
    "편관(七殺)": "나를 극하는 기운 중 같은 음양. 권력, 결단력, 경쟁을 뜻합니다.",
    "비견(比肩)": "나와 같은 오행·같은 음양. 동료, 경쟁자, 형제를 뜻합니다.",
    "겁재(劫財)": "나와 같은 오행·다른 음양. 경쟁적 동료, 재물 소모를 뜻합니다."
  },
  17: {
    "12운성": "일간이 각 지지에서 얼마나 강한지를 나타내는 12단계입니다. 장생(시작)→건록(전성기)→제왕(절정)→쇠(하락)→묘(저장)→절(끝)의 생명 주기를 따릅니다.",
    "정인(正印)": "나를 생하는 기운 중 다른 음양. 학업, 어머니, 보호를 뜻합니다.",
    "편인(偏印)": "나를 생하는 기운 중 같은 음양. 비정통 학문, 직감, 고독을 뜻합니다."
  },
  22: {
    "용신(用神)": "사주의 균형을 맞추기 위해 가장 필요한 오행입니다. 용신의 기운이 올 때 운이 좋아집니다.",
    "대운(大運)": "10년 단위로 바뀌는 큰 운의 흐름입니다. 인생의 큰 방향과 전환점을 나타냅니다.",
    "연운(年運/세운)": "매년 바뀌는 운의 흐름입니다. 대운과 연운이 합쳐져 그 해의 운세가 결정됩니다."
  },
  28: {
    "월운(月運)": "매달 바뀌는 운의 흐름입니다. 월간과 월지가 사주 원국과 어떻게 작용하는지로 판단합니다.",
    "충(沖)": "서로 반대되는 지지가 만나 부딪히는 것. 변화, 이동, 갈등의 에너지입니다.",
    "합(合)": "서로 끌리는 천간이나 지지가 만나 결합하는 것. 화합, 새로운 기운의 탄생입니다."
  }
};

function getGlossary(chapterIndex) {
  const keys = Object.keys(GLOSSARY).map(Number).sort((a, b) => a - b);
  let glossaryKey = 0;
  for (const k of keys) {
    if (chapterIndex >= k) glossaryKey = k;
    else break;
  }
  const terms = GLOSSARY[glossaryKey];
  if (!terms) return '';
  let text = '\n\n[용어 해설]\n';
  for (const [term, desc] of Object.entries(terms)) {
    text += `${term}: ${desc}\n`;
  }
  return text;
}

const SYSTEM = `당신은 30년 경력의 사주명리학 대가입니다. 만세력을 직접 뽑아가며 정통 명리학으로 사주를 해석하는 전문가이고, 수천 명의 사주를 봐온 경험이 있습니다.

이 리포트는 한 권당 정가 10만원 이상에 판매되는 프리미엄 상품입니다. 그에 걸맞는 깊이와 통찰을 보여주세요. 인터넷에 떠도는 일반론이 아닌, 이 사주만의 고유한 특징을 짚어내는 정밀한 해석이 필요합니다.

━━━━━━━━━━━━━━━━━━
핵심 원칙 - 정확성이 최우선
━━━━━━━━━━━━━━━━━━
1. 제공된 사주 원국(연월일시주), 천간지지, 오행, 십성, 지장간, 12운성, 신강신약, 용신, 대운, 연운 정보를 반드시 근거로 해석
2. 애매한 일반론("~할 수도 있어요") 금지 → 사주 데이터에 근거한 확정적 해석
3. 각 해석마다 "왜 그런지" 명리학적 근거를 구체적으로 제시
4. 예: "일간 병화가 월지 자수의 극을 받아 신약한 구조라, 추진력은 강하지만 체력이 따라주지 않는 경향이 있습니다"

━━━━━━━━━━━━━━━━━━
도입부 절대 금지 규칙 (가장 중요)
━━━━━━━━━━━━━━━━━━
다음과 같은 표현으로 답변을 시작하지 마세요. 모두 절대 금지입니다:
- "○○님의 사주를 분석해봤어요"
- "○○님의 사주를 살펴보면"
- "○○님은 ~~한 사주입니다"
- "안녕하세요" 같은 인사말
- "이번 챕터에서는", "이번 분석에서는"
- "○○님의 ~~을(를) 알아보겠습니다"
- 분석 항목을 그대로 다시 언급하는 메타 문장

대신 첫 문장은 곧바로 본론으로 들어가세요. 사주의 구체적 데이터(일간, 오행, 십성, 신강신약 등)를 직접 언급하면서 시작하세요.

좋은 첫 문장 예시:
- "일간 병화에 월지 자수가 자리잡고 있어 추운 겨울 태양과 같은 구조입니다."
- "오행 분포에서 수 기운이 40%로 몰려 있는 점이 가장 두드러집니다."
- "월간에 편재가 떠 있고 일지에 정인이 깔려 있어, 외향적 추진력과 내면의 안정감이 공존하는 구조입니다."

━━━━━━━━━━━━━━━━━━
문체 규칙
━━━━━━━━━━━━━━━━━━
1. 존댓말 ("~요", "~습니다", "~네요") - 전문 상담사 톤
2. 마침표는 자연스럽게 사용 OK
3. 전문용어는 한 번 쓰고 괄호로 쉬운 설명 추가 ("편관(관성, 책임감을 상징)")
4. 단정적이지 않게: "~경향이 있어요", "~가능성이 높아요", "~하실 분입니다"
5. 부정적인 것도 솔직히 다루되 반드시 극복법 제시

━━━━━━━━━━━━━━━━━━
분량 및 구조
━━━━━━━━━━━━━━━━━━
- 1500~2000자 내외 (10만원 퀄리티에 걸맞게 충실히)
- 3~5개 문단으로 자연스럽게 구분
- 각 문단은 5~8줄
- 첫 문단부터 즉시 본론(사주 특징) → 구체적 해석 → 결론(조언)

━━━━━━━━━━━━━━━━━━
절대 금지
━━━━━━━━━━━━━━━━━━
- 마크다운 기호 (#, ##, **, -, *, 숫자.) 절대 사용 금지
- 이모지 금지
- 소제목 쓸 땐 그냥 한 줄 텍스트로
- 뻔한 일반론 (누구에게나 해당하는 얘기) 금지
- 사주 정보 무시하고 작성하기 금지
- "분석해봤어요" 류의 도입 멘트 금지

━━━━━━━━━━━━━━━━━━
좋은 답변 예시
━━━━━━━━━━━━━━━━━━
일간 병화(丙火)에 월지 자수가 있어 겨울에 태어난 태양과 같은 구조입니다. 신약하지만 태양의 본성은 빛나는 것이라, 환경이 어려울수록 오히려 빛을 발하는 성향이 있어요.

오행 분포를 보면 수 기운이 40%로 강해 생각이 깊고 신중한 편이지만, 화 기운이 20%로 적어 결단력에서 머뭇거리실 수 있습니다. 월간에 편재가 있어 재물에 대한 감각은 타고나셨고, 특히 30대 후반부터 대운이 목 기운으로 흐르면서 본격적으로 기회가 열릴 구조입니다...

이런 식으로 구체적 데이터 + 해석 + 조언이 자연스럽게 섞이게 작성하세요. 첫 문장부터 도입 멘트 없이 바로 본론입니다.`;

function buildContext(userInfo) {
  const s = userInfo.saju;
  const daYunText = s.daYun.list.slice(1, 10).map(d =>
    `${d.startAge}세: ${d.ganZhiKor}(${d.ganZhi}) [${d.element}]`
  ).join(', ');
  const yearFortText = s.yearlyFortune.map(y =>
    `${y.year}년(${y.age}세): ${y.ganZhiKor}(${y.ganZhi}) [대운: ${y.daYunGanZhiKor}]`
  ).join(', ');

  return `[사주 원국]
이름: ${userInfo.name} (${userInfo.gender})
양력: ${s.solarDate} / 음력: ${s.lunarDate} / ${s.zodiac}띠
사주: ${s.fullHanja} (${s.fullKorean})
일간: ${s.dayMaster.korean}(${s.dayMaster.hanja}) - ${s.dayMaster.element}

[오행 분포]
목 ${s.elements.목}(${s.elementPercent.목}%), 화 ${s.elements.화}(${s.elementPercent.화}%), 토 ${s.elements.토}(${s.elementPercent.토}%), 금 ${s.elements.금}(${s.elementPercent.금}%), 수 ${s.elements.수}(${s.elementPercent.수}%)

[십성 배치 - 천간]
연간: ${s.shiShen.yearGan}, 월간: ${s.shiShen.monthGan}, 일간: 일주, 시간: ${s.shiShen.hourGan}

[십성 배치 - 지지]
연지: ${s.shiShen.yearZhi.join('·')}, 월지: ${s.shiShen.monthZhi.join('·')}, 일지: ${s.shiShen.dayZhi.join('·')}, 시지: ${s.shiShen.hourZhi.join('·')}

[지장간]
연: ${s.hideGan.year.join('·')}, 월: ${s.hideGan.month.join('·')}, 일: ${s.hideGan.day.join('·')}, 시: ${s.hideGan.hour.join('·')}

[12운성]
연: ${s.diShi.year}, 월: ${s.diShi.month}, 일: ${s.diShi.day}, 시: ${s.diShi.hour}

[신강/신약]
${s.strength.label} (${s.strength.ratio}%) - ${s.strength.description}

[용신]
${s.yongShin.element} - ${s.yongShin.reason}

[대운 흐름] (대운수: ${s.daYun.startAge}세)
${daYunText}

[연운 (세운)]
${yearFortText}

[십성 분포]
${Object.entries(s.shiShenCount).map(([k,v]) => `${k}: ${v}개`).join(', ')}`;
}

async function generateChapter(openai, userInfo, title, prompt, index, extraInstruction = '') {
  const ctx = buildContext(userInfo);
  const glossary = getGlossary(index);
  const userMsg = `${ctx}

━━━━━━━━━━━━━━━━━━
분석 항목: ${title}
━━━━━━━━━━━━━━━━━━
${prompt}${extraInstruction ? '\n\n[추가 요청사항]\n' + extraInstruction : ''}

작성 지침:
- 위 사주 원국의 구체적인 정보(일간, 월지, 오행, 십성, 용신 등)를 반드시 언급하며 해석
- "일반적으로 이런 사주는..." 같은 일반론 금지
- 이 사주의 고유한 특징을 정확히 짚어내기
- 1500~2000자 내외, 10만원 퀄리티에 걸맞는 깊이
- 마크다운 기호(#, **, -, 숫자.) 절대 금지
- 첫 문장부터 도입 멘트 없이 바로 본론 ("○○님의 사주를 분석해봤어요" 같은 시작 절대 금지)${glossary ? '\n\n이 챕터의 끝에 아래 용어 해설을 자연스럽게 한 문단 추가:\n' + glossary : ''}`;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.85,
        max_tokens: 2500,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userMsg }
        ]
      });
      return { title, content: res.choices[0].message.content };
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('rate limit') || msg.includes('Rate limit')) {
        if (attempt < 2) {
          console.log(`[챕터 ${index}] TPM 초과, 8초 대기 후 재시도...`);
          await new Promise(r => setTimeout(r, 8000));
          continue;
        }
      }
      throw err;
    }
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// type: 'full' (40챕터, 120p) | 'half' (앞 20챕터, 60p)
async function generateAllChapters(apiKey, userInfo, type = 'full') {
  const openai = new OpenAI({ apiKey });
  // 60p 옵션: 앞 20챕터만 (1부+2부+3부 일부)
  const sectionsToUse = type === 'half' ? SECTIONS.slice(0, 20) : SECTIONS;
  const results = new Array(sectionsToUse.length);
  const BATCH = 4; // gpt-4o는 TPM 제한 있어서 배치 4로 안전
  for (let i = 0; i < sectionsToUse.length; i += BATCH) {
    const batch = sectionsToUse.slice(i, i + BATCH);
    const promises = batch.map(([t, p], j) =>
      generateChapter(openai, userInfo, t, p, i + j).then(r => { results[i + j] = r; })
    );
    await Promise.all(promises);
    if (i + BATCH < sectionsToUse.length) {
      console.log(`[배치 ${Math.floor(i/BATCH)+1} 완료] 8초 대기...`);
      await sleep(8000); // gpt-4o TPM 보호
    }
  }
  return results;
}

async function regenerateChapter(apiKey, userInfo, index, extraInstruction) {
  const openai = new OpenAI({ apiKey });
  const [title, prompt] = SECTIONS[index];
  return await generateChapter(openai, userInfo, title, prompt, index, extraInstruction);
}

module.exports = { generateAllChapters, regenerateChapter, SECTIONS };
