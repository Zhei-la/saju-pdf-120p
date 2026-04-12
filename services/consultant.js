const OpenAI = require('openai');

// 챕터 제목 → 카테고리 매핑 (간단한 키워드 선별용)
function selectRelevantChapters(chapters, question) {
  const q = question.toLowerCase();
  const keywords = {
    성격: [0, 1, 2, 3, 4],
    본성: [0, 1, 2, 3, 4],
    기질: [0, 1, 2, 3, 4],
    대인: [1, 15],
    친구: [1, 15],
    직업: [5, 6, 9],
    커리어: [5, 6, 9],
    일: [5, 6, 9],
    취업: [5, 6],
    이직: [5, 6],
    사업: [9, 7],
    창업: [9, 7],
    돈: [7, 8, 9],
    재물: [7, 8, 9],
    재테크: [8],
    투자: [8],
    대운: [10, 22, 23, 24, 25],
    운세: [10, 22, 23, 24, 25],
    연애: [11, 12, 13],
    이성: [11, 12],
    결혼: [12, 13],
    배우자: [12, 13],
    궁합: [13],
    가족: [14],
    부모: [14],
    자녀: [15],
    아이: [15],
    귀인: [16],
    건강: [17, 18],
    몸: [17],
    정신: [18],
    스트레스: [18],
    공부: [19],
    학업: [19],
    시험: [19],
    이사: [20],
    해외: [20],
    재능: [21],
    시련: [22, 23],
    경쟁: [23],
    중년: [24],
    노년: [25],
    용신: [26],
    오행: [26],
    십신: [27]
  };

  const hitSet = new Set();
  for (const [key, idx] of Object.entries(keywords)) {
    if (q.includes(key)) idx.forEach(i => hitSet.add(i));
  }

  // 월별 언급 체크
  const monthMatch = q.match(/(\d+)월/);
  if (monthMatch) {
    const m = parseInt(monthMatch[1]);
    if (m >= 1 && m <= 12) hitSet.add(27 + m); // 챕터 28~39번이 1~12월
  }
  if (q.includes('2025') || q.includes('올해') || q.includes('내년')) {
    for (let i = 28; i < 40; i++) hitSet.add(i);
  }

  // 아무것도 안 걸리면 기본 5개 (본성, 직업, 재물, 연애, 대운)
  if (hitSet.size === 0) [0, 5, 7, 11, 10].forEach(i => hitSet.add(i));

  // 최대 6개로 제한 (토큰 절약)
  const selected = Array.from(hitSet).slice(0, 6).sort((a, b) => a - b);
  return selected.map(i => chapters[i]).filter(Boolean);
}

const CONSULTATION_SYSTEM = `당신은 따뜻하고 친절한 사주 상담사입니다. 카카오톡 채팅으로 고객과 1:1 상담을 진행합니다.

아래 원칙을 반드시 지켜주세요:

[상담 톤]
- 진짜 사람처럼, 친근하고 따뜻한 반말 섞인 존댓말로 대답합니다.
- "~하세요", "~이에요", "~더라고요" 같은 부드러운 말투를 씁니다.
- 상담사가 카톡으로 답하듯이 자연스럽게, 길지 않게 답변합니다. (보통 3~6줄)
- 질문자의 감정에 먼저 공감한 후 답변합니다.

[절대 금지]
- "갑목 일간이라서", "식신이 강하여" 같은 전문용어 나열 금지.
- "~~라는 것은 사주에서~~" 같은 설명조 금지.
- 마크다운 기호(#, *, -, 숫자.) 절대 사용 금지.
- 이모지 사용 금지.
- "리포트에 나와 있듯이" 같은 제3자 시점 금지.

[답변 방식]
- 사주 원국과 리포트 내용을 내부적으로만 참고하고, 겉으로는 평범한 상담사처럼 답합니다.
- 질문에 직접적으로 답하세요. "당신의 상황이라면 이렇게 하는 게 좋아요" 식으로.
- 긍정적인 가능성을 먼저 언급하고, 주의점은 부드럽게 덧붙입니다.
- 단정적이지 않게, "~할 수 있어요", "~경향이 있어요" 같은 여지를 남기는 표현을 씁니다.

예시:
질문: "내년에 이직해도 될까요?"
나쁜 답: "2026년은 병오년으로 편관이 강하게 들어와 직장 변동이 있을 수 있습니다."
좋은 답: "이직 생각하고 계시는군요. 내년 흐름 보니까 변화의 기운이 들어와서 움직이기 나쁘지 않은 시기예요. 다만 급하게 결정하기보단 3~4월 지나고 나서 움직이시는 게 더 안정적일 것 같아요. 지금 일이 많이 힘드세요?"`;

async function consultAnswer(report, question, history = [], apiKey) {
  const openai = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
  const saju = report.saju_data;
  const chapters = report.chapters;
  const relevantChapters = selectRelevantChapters(chapters, question);

  // 내부 참고용 사주 정보
  const sajuInfo = `[내부 참고 - 상담자 정보]
이름: ${report.name} (${report.gender})
사주: ${saju.fullKorean}
일간: ${saju.dayMaster?.korean}(${saju.dayMaster?.element})
신강/신약: ${saju.strength?.label}
용신: ${saju.yongShin?.element}
오행: 목${saju.elements?.목} 화${saju.elements?.화} 토${saju.elements?.토} 금${saju.elements?.금} 수${saju.elements?.수}

[관련 리포트 챕터 요약]
${relevantChapters.map(c => `■ ${c.title}\n${c.content.slice(0, 600)}...`).join('\n\n')}`;

  const messages = [
    { role: 'system', content: CONSULTATION_SYSTEM },
    { role: 'system', content: sajuInfo }
  ];

  // 이전 대화 히스토리 (최근 5개만)
  const recentHistory = history.slice(-5);
  for (const h of recentHistory) {
    messages.push({ role: 'user', content: h.question });
    messages.push({ role: 'assistant', content: h.answer });
  }

  messages.push({ role: 'user', content: question });

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.9,
    max_tokens: 800,
    messages
  });

  return res.choices[0].message.content;
}

const CONSULT_CATEGORIES = {
  'general': {
    title: '종합 운세',
    prompt: '전반적인 인생 운세, 성격, 장단점, 앞으로의 흐름을 상담사 톤으로 정리해주세요.'
  },
  'love': {
    title: '연애/결혼',
    prompt: '연애 스타일, 이상형, 배우자 인연, 결혼 시기, 궁합을 상담사 톤으로 정리해주세요.'
  },
  'career': {
    title: '직업/커리어',
    prompt: '적성, 적합한 직업, 커리어 성장 방향, 이직/승진 시기를 상담사 톤으로 정리해주세요.'
  },
  'money': {
    title: '재물/돈',
    prompt: '재물운, 돈을 버는 방식, 투자 성향, 재테크 방향을 상담사 톤으로 정리해주세요.'
  },
  'health': {
    title: '건강',
    prompt: '건강 취약 부위, 정신 건강, 관리법, 조심해야 할 시기를 상담사 톤으로 정리해주세요.'
  },
  'business': {
    title: '사업운',
    prompt: '사업 적성, 독립 가능성, 적합한 사업 분야, 시작 시기를 상담사 톤으로 정리해주세요.'
  }
};

async function personalConsult({ apiKey, saju, category, clientName, clientGender }) {
  const openai = new OpenAI({ apiKey });
  const cat = CONSULT_CATEGORIES[category] || CONSULT_CATEGORIES.general;

  const sajuInfo = `[사주 정보]
이름: ${clientName} (${clientGender})
사주: ${saju.fullKorean} (${saju.fullHanja})
일간: ${saju.dayMaster?.korean}(${saju.dayMaster?.element})
오행: 목${saju.elements?.목} 화${saju.elements?.화} 토${saju.elements?.토} 금${saju.elements?.금} 수${saju.elements?.수}
신강/신약: ${saju.strength?.label} (${saju.strength?.ratio}%)
용신: ${saju.yongShin?.element}
십성(천간): ${saju.shiShen?.yearGan}, ${saju.shiShen?.monthGan}, 일주, ${saju.shiShen?.hourGan}
12운성: ${saju.diShi?.year}, ${saju.diShi?.month}, ${saju.diShi?.day}, ${saju.diShi?.hour}
대운: ${(saju.daYun?.list || []).slice(1, 6).map(d => d.startAge + '세 ' + d.ganZhiKor).join(', ')}`;

  const SYSTEM = `당신은 따뜻하고 친절한 사주 상담사입니다. 1:1 개인 상담을 진행합니다.

[상담 톤]
- 진짜 사람처럼 따뜻하고 친근한 존댓말로 대답합니다
- 내담자의 이름을 부르며 상담합니다
- 전문용어("갑목 일간", "편관" 등)는 절대 쓰지 않습니다
- 마크다운 기호(#, **, -, 숫자.) 절대 사용 금지
- 이모지 사용 금지
- 자연스러운 문단으로 작성
- 구체적이고 실질적인 조언 포함
- 긍정적인 가능성 먼저, 주의점은 부드럽게
- 단정적이지 않게 "~경향이 있어요", "~할 수 있어요"

[구조]
다음 형식으로 약 1500~2000자 내외로 작성:
1. 인사와 전체적인 느낌 (한 문단)
2. 핵심 상담 내용 (여러 문단, 가장 중요)
3. 실질적인 조언 (한두 문단)
4. 마무리 격려 (짧게)

소제목은 쓰지 말고 자연스러운 문단 흐름으로 연결합니다.`;

  const userMsg = `${sajuInfo}

상담 주제: ${cat.title}
${cat.prompt}

위 사주를 바탕으로 ${clientName}님께 ${cat.title} 상담을 해주세요.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.85,
    max_tokens: 2500,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: userMsg }
    ]
  });
  return { title: cat.title, content: res.choices[0].message.content };
}

module.exports = { consultAnswer, personalConsult, CONSULT_CATEGORIES };
