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
    prompt: `전반적인 인생 흐름에 대해 다양한 관점에서 깊이 있게 상담해주세요.

다뤄야 할 주제:
- 타고난 성격과 기질 (겉모습과 속마음의 차이 포함)
- 인생을 살아가는 본인만의 스타일
- 가장 빛나는 장점 3가지 이상
- 조심해야 할 약점과 보완법
- 전반적인 인생 흐름 (30대/40대/50대 이후 구분)
- 지금 이 시점에서 가장 중요한 것
- 앞으로 다가올 중요한 전환점`
  },
  'love': {
    title: '연애/결혼',
    prompt: `연애와 결혼에 대해 다양한 주제로 풍성하게 상담해주세요.

다뤄야 할 주제:
- 연애할 때 본인의 스타일과 패턴
- 본인이 끌리는 이성의 타입 (외모, 성격, 직업 등)
- 본인과 잘 맞는 사람의 특징
- 절대 피해야 할 사람의 특징
- 연애에서 본인의 강점과 약점
- 결혼 시기 (가장 좋은 시기와 피해야 할 시기)
- 결혼 후 생활의 모습과 주의점
- 현재 연애운의 흐름`
  },
  'career': {
    title: '직업/커리어',
    prompt: `직업과 커리어에 대해 다양한 측면에서 깊이 있게 상담해주세요.

다뤄야 할 주제:
- 타고난 적성과 재능
- 가장 잘 맞는 직업군 3~5가지 (구체적으로)
- 직장에서의 본인 모습
- 상사/동료와의 관계에서 드러나는 특성
- 성공이 오는 시기와 방식
- 이직 좋은 시기와 조심할 시기
- 승진운
- 현재 직장에서 할 일
- 앞으로 커리어 성장 전략`
  },
  'money': {
    title: '재물/돈',
    prompt: `재물에 대해 다양한 관점에서 상담해주세요.

다뤄야 할 주제:
- 타고난 재물운의 크기와 특징
- 돈을 버는 본인만의 방식 (직장/사업/투자 중 뭐가 맞는지)
- 돈이 잘 들어오는 시기와 새는 시기
- 투자 성향 (안정형/공격형/균형형)
- 권장하는 재테크 방향
- 피해야 할 돈 관리 방식
- 금전운이 터지는 나이대
- 현재 재물 흐름과 앞으로 몇 년간 전망`
  },
  'health': {
    title: '건강',
    prompt: `건강에 대해 다양한 측면에서 상담해주세요.

다뤄야 할 주제:
- 오행 균형으로 본 취약 부위
- 구체적인 신체 기관 (간, 심장, 위장, 폐, 신장 중 약한 곳)
- 정신 건강과 스트레스 패턴
- 체질에 맞는 음식과 피해야 할 음식
- 권장하는 운동 방식
- 생활 리듬 조언
- 건강 주의해야 할 나이대
- 장기적 건강 관리 방향`
  },
  'business': {
    title: '사업운',
    prompt: `사업에 대해 다양한 주제로 상세하게 상담해주세요.

다뤄야 할 주제:
- 사업 적성 (있다/없다 명확히)
- 독립 성공 가능성
- 적합한 사업 분야 3가지 이상 (구체적으로)
- 사업 시작하기 좋은 시기
- 동업 여부 (해도 되는지, 누구와)
- 사업 운영 스타일
- 피해야 할 사업 형태
- 위기가 올 수 있는 시기와 대처법
- 확장 시기`
  },
  'study': {
    title: '학업/시험운',
    prompt: `학업과 시험에 대해 다양한 측면에서 상담해주세요.

다뤄야 할 주제:
- 학습 능력과 집중력 패턴
- 잘 맞는 공부 방식 (혼자/함께, 아침/밤)
- 시험운의 흐름
- 좋은 결과가 나오는 시기
- 슬럼프 올 수 있는 시기와 극복법
- 자격증/고시에 유리한지
- 진로 방향 추천
- 멘탈 관리법`
  },
  'move': {
    title: '이사/방향',
    prompt: `이사와 방향에 대해 다양하게 상담해주세요.

다뤄야 할 주제:
- 이사하기 좋은 시기와 피해야 할 시기
- 본인에게 유리한 방향 (동서남북 중)
- 현재 거주지 유지 vs 이사 중 뭐가 나은지
- 이직/직장 이동에도 좋은 시기
- 해외 진출 가능성
- 새 환경 적응 시 주의점
- 풍수지리적 조언
- 이사 후 기대할 수 있는 변화`
  },
  'children': {
    title: '자녀운',
    prompt: `자녀에 대해 다양하게 상담해주세요.

다뤄야 할 주제:
- 자녀와의 인연 (많다/적다)
- 자녀 수 경향
- 자녀가 어떤 특성을 가질지
- 자녀 교육에 맞는 방향 (엄격/자유)
- 자녀와의 관계에서 주의점
- 자녀 건강 관리 포인트
- 자녀가 성공할 분야
- 자녀와의 갈등 예방법`
  },
  'helper': {
    title: '귀인운',
    prompt: `인생의 귀인에 대해 다양하게 상담해주세요.

다뤄야 할 주제:
- 인생에서 도움을 주는 귀인의 특징 (나이대, 성별, 직업)
- 귀인을 만나는 시기
- 어떤 상황에서 귀인이 나타나는지
- 귀인을 알아보는 법
- 귀인을 잡는 법
- 반대로 피해야 할 사람의 특징
- 인간관계에서 조심할 점
- 귀인과 더불어 성장하는 법`
  },
  'year': {
    title: '2026년 운세',
    prompt: `2026년 한 해 흐름을 분기별로 풍성하게 상담해주세요.

다뤄야 할 주제:
- 2026년 전체 기운의 특징
- 1~3월 흐름 (일/재물/관계/건강)
- 4~6월 흐름 (일/재물/관계/건강)
- 7~9월 흐름 (일/재물/관계/건강)
- 10~12월 흐름 (일/재물/관계/건강)
- 올해 가장 좋은 시기
- 올해 가장 조심할 시기
- 올해 해야 할 일과 피해야 할 일`
  },
  'month': {
    title: '이번 달 운세',
    prompt: `현재 가장 가까운 한 달의 운세를 집중적으로 상담해주세요.

다뤄야 할 주제:
- 이번 달 전체 기운
- 일/커리어 흐름
- 재물운 흐름
- 인간관계 주의점
- 건강 주의점
- 좋은 날과 좋은 일
- 피해야 할 날과 피해야 할 일
- 한 달 간 실천할 수 있는 실질적 조언`
  }
};

async function personalConsult({ apiKey, saju, category, clientName, clientGender, length }) {
  const openai = new OpenAI({ apiKey });
  const cat = CONSULT_CATEGORIES[category] || CONSULT_CATEGORIES.general;
  const targetLength = parseInt(length) || 3000;
  // 한글 글자 1자 ≈ 1.5 토큰, 여유 있게
  const maxTokens = Math.min(Math.ceil(targetLength * 2.2) + 500, 6000);

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

  const SYSTEM = `당신은 30년 경력의 베테랑 사주 상담사입니다. 카톡으로 1:1 상담을 진행합니다.

[절대 규칙 - 반드시 지켜주세요]
1. 문장 끝에 마침표(.)를 절대 쓰지 마세요
2. 문장이 끝나면 다음 문장은 반드시 줄바꿈해서 새 줄에 시작하세요
3. 한 문장 = 한 줄이 원칙입니다
4. 문장 끝은 "~요", "~네요", "~어요", "~랍니다", "~세요" 같은 부드러운 종결어미로 끝내세요
5. 마크다운 기호(#, **, -, 숫자.) 절대 사용 금지
6. 이모지 사용 금지

[쉬운 말 규칙 - 가장 중요]
- 전문용어를 절대 쓰지 마세요: 갑목, 편관, 식상, 정인, 겁재, 비견, 십성, 지장간, 용신, 대운, 세운 등
- 꼭 쓸 수밖에 없으면 반드시 괄호로 쉬운 풀이를 붙이세요
  예: "용신(인생의 핵심이 되는 기운)", "대운(10년 단위의 큰 흐름)"
- "신강/신약" 대신 "기운이 강한/약한"으로
- "오행" 대신 "다섯 가지 기운"으로
- 초등학생도 이해할 수 있게 설명하세요
- 추상적인 말 대신 구체적이고 실생활에 적용 가능한 조언으로

[톤]
- 따뜻하고 친근한 상담사처럼
- 내담자의 이름을 자주 부르면서 상담
- 진심으로 걱정하고 응원하는 느낌
- 단정적이지 않게 "~경향이 있어요", "~하실 수 있어요"

[분량 및 구조]
- 반드시 ${targetLength}자 내외로 풍성하게 작성 (중요!)
- 요청된 모든 주제를 빠짐없이 다루기
- 각 주제마다 여러 줄로 자세히 설명
- 주제가 바뀔 때는 문단을 비워서 구분
- 인사 → 여러 주제 상세 상담 → 마무리 격려 순서

[작성 예시 - 이 스타일로]
김가영 님, 사주를 찬찬히 살펴봤어요

김가영 님은 타고나기를 감정이 깊고 진중하신 편이에요
겉으로는 밝아 보이시지만 속으로는 쉽게 마음을 열지 않으세요
한 번 정이 들면 오래 가는 타입이라 주변에서 신중하다는 말을 들으실 거예요

(이런 식으로 마침표 없이, 한 문장마다 줄바꿈, 전문용어 없이 쉬운 말로)`;

  const userMsg = `${sajuInfo}

상담 주제: ${cat.title}
${cat.prompt}

위 사주를 바탕으로 ${clientName}님께 ${cat.title} 상담을 해주세요.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.88,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: userMsg }
    ]
  });
  return { title: cat.title, content: res.choices[0].message.content };
}

async function personalConsultFollowup({ apiKey, saju, clientName, clientGender, category, initialResult, history, question }) {
  const openai = new OpenAI({ apiKey });

  const sajuInfo = `[상담자 사주 정보]
이름: ${clientName} (${clientGender})
사주: ${saju.fullKorean}
일간: ${saju.dayMaster?.korean}(${saju.dayMaster?.element})
오행: 목${saju.elements?.목} 화${saju.elements?.화} 토${saju.elements?.토} 금${saju.elements?.금} 수${saju.elements?.수}
신강/신약: ${saju.strength?.label}
용신: ${saju.yongShin?.element}

[첫 상담 요약 - 이걸 기반으로 이어서 답변]
주제: ${CONSULT_CATEGORIES[category]?.title || '종합'}
${initialResult.slice(0, 1500)}`;

  const SYSTEM = `당신은 30년 경력의 사주 상담사입니다. 고객이 처음 상담을 받은 후 추가 질문을 하고 있습니다.
이전 상담 내용을 기억하면서 이어서 상담하세요.

[절대 규칙]
1. 마침표(.) 절대 쓰지 마세요
2. 문장이 끝나면 반드시 줄바꿈해서 새 줄에 시작
3. 한 문장 = 한 줄
4. 문장 끝은 "~요", "~네요", "~어요"로
5. 마크다운 기호(#, **, -) 금지
6. 이모지 금지

[쉬운 말 규칙]
- 전문용어 절대 금지 (갑목, 편관, 용신, 대운, 신강 등)
- 꼭 써야 하면 괄호로 쉬운 풀이 추가
- 초등학생도 이해할 수 있게 설명

[톤]
- 따뜻한 상담사처럼 친근하게
- 상담자 이름을 부르며 답변
- 이전 상담 내용과 연결해서 답변
- 질문에 직접적으로 답변 (말 돌리지 말고)
- 단정적이지 않게 "~경향이 있어요"

[분량]
- 질문에 따라 5~15줄 정도 자연스럽게`;

  const messages = [
    { role: 'system', content: SYSTEM },
    { role: 'system', content: sajuInfo }
  ];

  // 이전 대화 (최근 6개)
  const recentHistory = history.slice(-6);
  for (const h of recentHistory) {
    messages.push({ role: h.role, content: h.content });
  }

  messages.push({ role: 'user', content: question });

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.88,
    max_tokens: 1500,
    messages
  });

  return res.choices[0].message.content;
}

// ─── 무료 사주 (스레드 홍보용) - Gemini 무료 API 사용 ───
async function freeThreadReading({ apiKey, saju, clientName, question, length }) {
  const lengthMap = { short: 300, medium: 500, long: 800 };
  const targetLen = lengthMap[length] || 1000;

  const sajuInfo = `[사주 정보 - 내부 참고용]
이름: ${clientName || '익명'}
사주: ${saju.fullKorean}
일간: ${saju.dayMaster?.korean}(${saju.dayMaster?.element})
오행: 목${saju.elements?.목} 화${saju.elements?.화} 토${saju.elements?.토} 금${saju.elements?.금} 수${saju.elements?.수}
신강/신약: ${saju.strength?.label}
용신: ${saju.yongShin?.element}
올해(2026년): 병오년`;

  const SYSTEM_INSTRUCTION = `당신은 SNS(스레드)에서 무료 사주를 봐주는 친근한 사주 상담사입니다.

[절대 규칙]
1. 반드시 반말로 답변 (존댓말 절대 금지)
2. 문장 끝에 마침표(.) 절대 쓰지 마세요
3. 문장이 끝나면 반드시 줄바꿈해서 새 줄에 시작
4. 한 문장 = 한 줄
5. 문장 끝은 "~어", "~야", "~네", "~지", "~거든", "~더라" 같은 친근한 반말 어미
6. 마크다운 기호(#, **, -, 숫자.) 절대 금지
7. 이모지는 1~2개 정도만 가끔 OK
8. 전문용어(갑목, 편관, 용신 등) 절대 금지

[톤]
- 친한 친구가 사주 봐주듯 친근하고 따뜻하게
- 이름이 있으면 이름을 부르며 이야기
- 단정적이지 않게 "~한 편이야", "~할 수 있어"

[분량]
- 약 ${targetLen}자 내외로 작성
- 질문이 있으면 그 질문에 집중 답변
- 질문이 없으면 올해 전반적인 운세 + 주의점 + 조언

[예시]
안녕 홍길동

사주 보니까 너는 감정이 깊고 진중한 편이야
겉으로는 밝아 보여도 속마음은 쉽게 드러내지 않지

올해는 전반적으로 흐름이 나쁘지 않아
봄에 좋은 인연이나 기회가 들어올 수 있어
다만 감정 기복이 있을 수 있으니 무리하지 말고 쉬어가면서 가자

(반말 + 마침표 없음 + 줄바꿈)`;

  const userMsg = question
    ? `${sajuInfo}\n\n[고객 질문]\n${question}\n\n위 질문에 대해 사주를 바탕으로 친근한 반말로 답변해줘`
    : `${sajuInfo}\n\n질문이 없으니 올해 전반적인 운세와 조언을 친근한 반말로 봐줘`;

  // Gemini API 호출 (REST)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: 'user', parts: [{ text: userMsg }] }],
    generationConfig: {
      temperature: 0.92,
      maxOutputTokens: Math.ceil(targetLen * 2.5) + 300
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error('Gemini API 오류: ' + errText.slice(0, 200));
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 응답이 비어있습니다');
  return text;
}

module.exports = { consultAnswer, personalConsult, personalConsultFollowup, freeThreadReading, CONSULT_CATEGORIES };
