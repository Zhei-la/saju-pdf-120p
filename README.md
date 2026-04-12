# 🔮 사주팔자 리포트 v2

사용자가 본인 OpenAI 키로 20챕터 사주 리포트를 생성하고, 페이지별로 편집/재생성 후 PDF로 저장하는 웹 서비스.

## 주요 기능
- ✅ 본인 OpenAI 키 입력 (브라우저 로컬 저장, 저장 후 자동 접힘)
- ✅ 만세력 자동 계산 (양력/음력 지원)
- ✅ 20챕터 병렬 생성 (GPT-4o-mini, 약 1~2분)
- ✅ 챕터별 직접 편집 + AI 재생성 (추가 지시사항 가능)
- ✅ 한글 완벽 지원 PDF 저장 (html2canvas + jsPDF)
- ❌ 이메일 기능 없음 (PDF 저장만)

## 로컬 실행
```bash
npm install
npm start
```
http://localhost:3000 접속

## Railway 배포
1. GitHub에 push
2. Railway → New Project → Deploy from GitHub repo
3. 환경변수 불필요 (API 키는 사용자가 직접 입력)
4. 자동 배포 완료

## OpenAI API 키 발급 방법
1. https://platform.openai.com/signup 가입
2. https://platform.openai.com/settings/organization/billing/overview 에서 결제 수단 등록 + $5 충전
3. https://platform.openai.com/api-keys 에서 키 생성
4. `sk-proj-...` 키 복사 → 웹 페이지에 붙여넣기

## 구조
```
saju-v2/
├── server.js
├── services/
│   ├── sajuCalculator.js   # lunar-javascript 만세력
│   └── aiGenerator.js      # GPT-4o-mini 생성/재생성
└── public/
    └── index.html          # 3단계 UI (키/입력/미리보기편집)
```

## API 엔드포인트
- `POST /api/generate` - 20챕터 일괄 생성
- `POST /api/regenerate` - 개별 챕터 재생성 (지시사항 포함)
