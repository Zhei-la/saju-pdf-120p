const fs = require('fs');

const file = 'services/consultant.js';
let s = fs.readFileSync(file, 'utf8');

const start = s.indexOf('async function consultAnswer(');
const next = s.indexOf('\nconst CONSULT_CATEGORIES', start);

if (start === -1 || next === -1) {
  throw new Error('consultAnswer 함수 위치를 찾지 못했습니다');
}

const replacement = `
async function consultAnswer(report, question, history = [], apiKey) {
  if (!report) throw new Error('리포트 정보가 없습니다');

  const saju = report.saju_data || {};
  const chapters = Array.isArray(report.chapters) ? report.chapters : [];

  const chapterText = chapters.map((c, i) => {
    const title = c.title || c.name || \`CHAPTER \${i + 1}\`;
    const content = c.content || c.text || c.body || '';
    return \`[CHAPTER \${i + 1}] \${title}\\n\${content}\`;
  }).join('\\n\\n');

  const historyText = history.length
    ? history.slice(-8).map((h, i) => \`
[이전 상담 \${i + 1}]
질문: \${h.question}
답변: \${h.answer}
\`).join('\\n')
    : '이전 상담 기록 없음';

  const reportContext = \`
[선택된 PDF 리포트 기본 정보]
이름: \${report.client_name || ''}
성별: \${report.client_gender || ''}
생년월일: \${report.client_birth || ''}
리포트 유형: \${report.report_type || ''}

[사주 원국 데이터]
사주: \${saju.fullKorean || ''}
일간: \${saju.dayMaster?.korean || ''} \${saju.dayMaster?.element || ''}
오행 분포: 목 \${saju.elements?.목 ?? ''}, 화 \${saju.elements?.화 ?? ''}, 토 \${saju.elements?.토 ?? ''}, 금 \${saju.elements?.금 ?? ''}, 수 \${saju.elements?.수 ?? ''}
신강/신약: \${saju.strength?.label || ''}
용신: \${Array.isArray(saju.usefulGods) ? saju.usefulGods.join(', ') : (saju.usefulGods || '')}
대운: \${JSON.stringify(saju.bigLuck || saju.daewoon || [], null, 2)}
세운: \${JSON.stringify(saju.yearlyLuck || saju.sewoon || [], null, 2)}

[PDF 리포트 전체 챕터 내용]
\${chapterText}
\`;

  const systemRules = \`
너는 선택된 PDF 사주 리포트를 기반으로 후속 상담을 진행하는 전문 명리 상담사다

가장 중요한 원칙은 사용자가 선택한 PDF 리포트 내용과 일치하게 답변하는 것이다

반드시 지켜야 할 규칙

1. 답변은 반드시 아래 제공된 PDF 리포트 내용, 사주 원국 데이터, 챕터 해석을 기준으로 작성한다
2. PDF 리포트에 없는 내용을 일반 지식으로 새로 지어내지 않는다
3. 리포트 내용과 충돌하는 해석을 하지 않는다
4. 사용자가 연애, 결혼, 직업, 재물, 건강, 대운, 세운을 질문하면 반드시 PDF 안의 관련 챕터를 먼저 근거로 삼는다
5. 리포트에서 확인되지 않는 내용은 "리포트 기준으로는 이 부분까지는 확인되지 않습니다"라고 부드럽게 말한다
6. 이전 상담 기록이 있으면 그 흐름을 이어서 답변한다
7. 대운과 세운은 혼동하지 않는다
8. 현재 연도보다 과거 연도는 과거형으로, 현재 연도는 현재형으로, 미래 연도는 미래형으로 말한다
9. 무섭게 단정하거나 사망, 사고, 질병, 이혼 등을 확정적으로 말하지 않는다
10. 실제 상담처럼 부드럽고 현실적인 존댓말로 답변한다
11. "AI", "데이터상", "모델", "프롬프트" 같은 표현은 쓰지 않는다
12. 마침표는 되도록 쓰지 않고 자연스럽게 줄바꿈한다

답변 방식

- 먼저 질문 주제에 바로 답한다
- 그 다음 PDF 리포트에서 확인되는 근거를 자연스럽게 연결한다
- 마지막에는 현실적으로 어떻게 하면 좋은지 짧게 정리한다
- 너무 장황하게 늘리지 말고 질문에 맞는 깊이로 답한다
\`;

  const fullPrompt = \`
\${systemRules}

\${reportContext}

[이전 상담 기록]
\${historyText}

[현재 질문]
\${question}

위 PDF 리포트 내용을 반드시 기준으로 삼아 답변하세요
\`;

  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=\${apiKey}\`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens: 1800
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error('Gemini API 오류: ' + errText.slice(0, 300));
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 응답이 비어있습니다');

  return text.trim();
}

`;

s = s.slice(0, start) + replacement + s.slice(next);

fs.writeFileSync(file, s, 'utf8');

console.log('replaced consultAnswer with report-grounded chat');
