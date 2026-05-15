const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `const userMsg = \`${ctx}`;

const helper = `
function getChapterMode(title) {
  if (/썸|애매/.test(title)) return \`
[이번 챕터 전용 방식: 썸 장면형]
- 성격 설명으로 시작하지 마세요.
- 답장 텐션, 읽씹, 먼저 연락할지 고민하는 장면으로 시작하세요.
- 호감 → 관찰 → 의미부여 → 거리조절 → 감정확인 흐름으로 전개하세요.
- "신중함", "배려형", "감정 숨김" 같은 성격 설명은 최소화하세요.
\`;

  if (/연락|답장|소통/.test(title)) return \`
[이번 챕터 전용 방식: 연락 심리 흐름형]
- 연락 상황 하나로 시작하세요.
- 기다림 → 의미부여 → 혼자 결론 → 다시 연락 고민 순서로 전개하세요.
- 말투 변화, 답장 속도, 카톡 확인 같은 행동을 구체적으로 쓰세요.
- 성향 설명보다 연락을 기다리는 심리 흐름을 중심으로 쓰세요.
\`;

  if (/재회|헤어짐/.test(title)) return \`
[이번 챕터 전용 방식: 재회 잔상형]
- 미련, 잔상, 다시 흔들리는 순간을 중심으로 쓰세요.
- 상대 SNS를 다시 보거나, 괜찮아진 줄 알았는데 다시 생각나는 장면을 넣으세요.
- 재회 가능성은 감정 잔존도와 연락 재개 흐름 중심으로 설명하세요.
- 일반적인 성격 설명은 피하세요.
\`;

  if (/갈등|싸우|멀어|거리/.test(title)) return \`
[이번 챕터 전용 방식: 갈등 반응형]
- 싸운 뒤 말투, 침묵, 연락 텀, 거리감 변화로 시작하세요.
- 서운해도 바로 말하지 못하는 장면, 갑자기 차분해지는 장면을 넣으세요.
- 감정 설명보다 태도 변화 중심으로 쓰세요.
\`;

  if (/오래|안정|유지|결혼/.test(title)) return \`
[이번 챕터 전용 방식: 안정기 관계형]
- 편안함, 신뢰, 책임감, 생활 리듬 중심으로 쓰세요.
- 설렘보다 오래 가는 조건과 현실적인 관계 유지 방식을 다루세요.
- 반복적인 감정 설명은 줄이고 관계가 안정되는 조건을 구체적으로 쓰세요.
\`;

  if (/상대|유형|궁합|맞는/.test(title)) return \`
[이번 챕터 전용 방식: 상대 시점형]
- 상대가 이 사람을 어떻게 느끼는지 먼저 보여주세요.
- 잘 맞는 사람과 부딪히는 사람을 행동 기준으로 구분하세요.
- 성격 설명보다 관계에서 실제로 편해지는 지점과 불편해지는 지점을 쓰세요.
\`;

  if (/시기|운|흐름|타이밍|인연/.test(title)) return \`
[이번 챕터 전용 방식: 운세 흐름형]
- 언제 가까워지는지, 언제 흔들리는지, 언제 연락운이 살아나는지 시간 흐름을 넣으세요.
- 심리 분석보다 미래 흐름, 인연 변화, 감정 변화 타이밍을 중심으로 쓰세요.
- 설렘과 기대감이 느껴지게 쓰세요.
\`;

  return \`
[이번 챕터 전용 방식: 장면 우선형]
- 성격 설명보다 실제 연애 장면으로 시작하세요.
- 같은 성향 반복을 피하고 제목에 맞는 한 가지 관점만 깊게 다루세요.
\`;
}
`;

if (!s.includes('function getChapterMode(title)')) {
  const insertAt = s.indexOf('async function generateChapter');
  s = s.slice(0, insertAt) + helper + '\n' + s.slice(insertAt);
}

if (!s.includes('${getChapterMode(title)}')) {
  s = s.replace(
    `분석 항목: ${title}
━━━━━━━━━━━━━━━━━━`,
    `분석 항목: ${title}
━━━━━━━━━━━━━━━━━━
${getChapterMode(title)}`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('added chapter mode based generation');
