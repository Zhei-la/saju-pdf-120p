require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { calculateSaju } = require('./services/sajuCalculator');
const { generateAllChapters, regenerateChapter } = require('./services/aiGenerator');
const { consultAnswer, personalConsult, personalConsultFollowup, freeThreadReading, CONSULT_CATEGORIES } = require('./services/consultant');
const db = require('./services/db');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/free-site', (req, res) => {
  try {
    const fsx = require('fs');
    const pathx = require('path');

    const body = req.body || {};
    const brandName = String(body.brandName || '').trim();
    const kakaoLink = String(body.kakaoLink || '').trim();
    const introText = String(body.introText || '').trim();

    if (!brandName) {
      return res.status(400).json({ error: '브랜드명을 입력해주세요.' });
    }

    if (!kakaoLink) {
      return res.status(400).json({ error: '카카오톡 링크를 입력해주세요.' });
    }

    const slug = encodeURIComponent(brandName.replace(/\s+/g, '-'));
    const dir = pathx.join(process.cwd(), 'data');
    const saveFile = pathx.join(dir, 'free-sites.json');

    if (!fsx.existsSync(dir)) {
      fsx.mkdirSync(dir, { recursive: true });
    }

    let sites = {};
    if (fsx.existsSync(saveFile)) {
      try {
        sites = JSON.parse(fsx.readFileSync(saveFile, 'utf8') || '{}');
      } catch (e) {
        sites = {};
      }
    }

    sites[slug] = {
      slug,
      brandName,
      kakaoLink,
      introText,
      updatedAt: new Date().toISOString()
    };

    fsx.writeFileSync(saveFile, JSON.stringify(sites, null, 2), 'utf8');

    return res.json({
      ok: true,
      site: sites[slug],
      url: '/u/' + slug
    });
  } catch (err) {
    console.error('FREE_SITE_SAVE_ERROR', err);
    return res.status(500).json({
      error: '무료사주 웹사이트 저장 중 서버 오류',
      detail: err.message
    });
  }
});

app.get('/api/free-site/:slug', (req, res) => {
  try {
    const fsx = require('fs');
    const pathx = require('path');
    const saveFile = pathx.join(process.cwd(), 'data', 'free-sites.json');

    if (!fsx.existsSync(saveFile)) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    const sites = JSON.parse(fsx.readFileSync(saveFile, 'utf8') || '{}');
    const site = sites[req.params.slug];

    if (!site) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    return res.json({ site });
  } catch (err) {
    console.error('FREE_SITE_LOAD_ERROR', err);
    return res.status(500).json({
      error: '무료사주 웹사이트 조회 중 서버 오류',
      detail: err.message
    });
  }
});

app.get('/u/:slug', (req, res) => {
  res.sendFile(require('path').join(process.cwd(), 'public', 'u.html'));
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const FREE_SITE_FILE = path.join(__dirname, 'data', 'free-sites.json');

function readFreeSites() {
  if (!fs.existsSync(path.dirname(FREE_SITE_FILE))) fs.mkdirSync(path.dirname(FREE_SITE_FILE), { recursive: true });
  if (!fs.existsSync(FREE_SITE_FILE)) fs.writeFileSync(FREE_SITE_FILE, '{}', 'utf8');
  return JSON.parse(fs.readFileSync(FREE_SITE_FILE, 'utf8') || '{}');
}

function saveFreeSites(data) {
  fs.writeFileSync(FREE_SITE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/u/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'u.html'));
});

app.post('/api/free-site', (req, res) => {
  const { brandName, kakaoLink, introText } = req.body || {};
  if (!brandName) return res.status(400).json({ error: '브랜드명을 입력해주세요.' });
  if (!kakaoLink) return res.status(400).json({ error: '카카오톡 링크를 입력해주세요.' });

  const slug = encodeURIComponent(String(brandName).trim().replace(/\s+/g, '-'));
  const sites = readFreeSites();

  sites[slug] = {
    slug,
    brandName,
    kakaoLink,
    introText: introText || '',
    updatedAt: new Date().toISOString()
  };

  saveFreeSites(sites);
  res.json({ site: sites[slug], url: '/u/' + slug });
});

app.get('/api/free-site/:slug', (req, res) => {
  const sites = readFreeSites();
  const site = sites[req.params.slug];
  if (!site) return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
  res.json({ site });
});

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'loopy1234';

app.use(express.json({ limit: '4mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));

// 관리자 계정 초기화
db.ensureAdmin(ADMIN_PASSWORD);
db.ensureReviewTokens();

// ─── 세션 관리 (메모리) ───
const sessions = new Map(); // token → { userId, isAdmin }
function makeToken() { return crypto.randomBytes(32).toString('hex'); }

function requireUser(req, res, next) {
  const token = req.headers['x-auth-token'];
  const s = sessions.get(token);
  if (!s || !s.userId) return res.status(401).json({ error: '로그인이 필요합니다' });
  req.userId = s.userId;
  req.isAdmin = s.isAdmin;
  next();
}
function requireAdmin(req, res, next) {
  const token = req.headers['x-auth-token'];
  const s = sessions.get(token);
  if (!s || !s.isAdmin) return res.status(403).json({ error: '관리자 권한 필요' });
  next();
}

// ─── 인증 ───
app.post('/api/signup', (req, res) => {
  try {
    const { name, password, passwordConfirm } = req.body;
    if (!name || !password) return res.status(400).json({ error: '이름과 비밀번호를 입력해주세요' });
    if (password.length < 4) return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다' });
    if (password !== passwordConfirm) return res.status(400).json({ error: '비밀번호가 일치하지 않습니다' });
    const user = db.createUser(name, password);
    res.json({ ok: true, message: '가입 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/login', (req, res) => {
  try {
    const { name, password } = req.body;
    const user = db.loginUser(name, password);
    const token = makeToken();
    sessions.set(token, { userId: user.id, isAdmin: user.isAdmin });
    res.json({ ok: true, token, user });
  } catch (e) { res.status(401).json({ error: e.message }); }
});

app.post('/api/logout', requireUser, (req, res) => {
  sessions.delete(req.headers['x-auth-token']);
  res.json({ ok: true });
});

app.get('/api/me', requireUser, (req, res) => {
  const user = db.getUser(req.userId);
  if (!user) return res.status(404).json({ error: '없음' });
  res.json({ user: {
    id: user.id, name: user.name, status: user.status,
    isAdmin: !!user.is_admin, brandName: user.brand_name || '',
    reviewToken: user.review_token,
    reportPrice: user.report_price || 0,
    reportPriceHalf: user.report_price_half || 0
  }});
});

// 브랜드 이름 저장
app.post('/api/me/brand', requireUser, (req, res) => {
  db.updateBrandName(req.userId, req.body.brandName || '');
  res.json({ ok: true });
});

// 리포트 가격 저장
app.post('/api/me/price', requireUser, (req, res) => {
  db.updateReportPrice(req.userId, req.body.price || 0, req.body.priceHalf || 0);
  res.json({ ok: true });
});

// ─── 대시보드 통계 ───
app.get('/api/stats', requireUser, (req, res) => {
  res.json({
    stats: db.getUserStats(req.userId),
    reviewStats: db.getReviewStats(req.userId),
    revenue: db.getRevenueStats(req.userId)
  });
});

// ─── 무료 기본사주 PDF 계산 전용 ───
app.post('/api/generate-free-saju-only', requireUser, (req, res) => {
  try {
    const { name, gender, year, month, day, hour, minute, isLunar, timeUnknown } = req.body;
    if (!name || !year || !month || !day) {
      return res.status(400).json({ error: '이름과 생년월일은 필수입니다' });
    }

    const saju = calculateSaju({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null ? null : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar,
      gender: gender || '남성'
    });

    const chapters = [
      { title: '사주로 보는 나는 어떤 사람일까', body: '기본 성향은 사주 원국의 일간과 오행 균형을 중심으로 봅니다. 이 무료 리포트에서는 타고난 기질, 강한 기운, 약한 기운을 간단히 확인할 수 있습니다.' },
      { title: '조심해야 할 기본 흐름', body: '강한 기운은 장점이 되지만 과해질 때는 고집이나 무리한 선택으로 나타날 수 있습니다. 약한 기운은 생활 습관과 선택 방식으로 보완하는 것이 좋습니다.' },
      { title: '금전운은 어떨까', body: '금전운은 돈이 들어오는 방식과 새는 방식을 함께 봅니다. 충동적인 지출보다 계획적인 관리가 중요하며, 사람 관계로 인한 지출을 주의하는 것이 좋습니다.' },
      { title: '내 사주에 이성은 많을까', body: '이성운은 단순히 많고 적음보다 어떤 관계가 들어오고 유지되는지를 봅니다. 현실 조건과 감정 온도가 맞을 때 관계가 더 깊어질 수 있습니다.' },
      { title: '대운 십성풀이', body: '대운은 10년 단위로 바뀌는 큰 흐름입니다. 현재 대운에 따라 일, 돈, 관계, 환경 변화의 방향이 달라질 수 있습니다.' }
    ];

    res.json({ ok: true, saju, chapters });
  } catch (e) {
    console.error('무료 기본사주 계산 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── 리포트 생성 ───
app.post('/api/generate', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;

    const requestedType = reportType || 'deep';

    if (
      requestedType !== 'free' &&
      (!apiKey || !apiKey.startsWith('sk-'))
    ) {
      return res.status(400).json({ error: '올바른 OpenAI API 키를 입력해주세요' });
    }
    if (!name || !year || !month || !day) return res.status(400).json({ error: '이름과 생년월일은 필수입니다' });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null ? null : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '남성'
    });

    const userInfo = { name, gender: gender || '남성', saju, timeUnknown: !!timeUnknown, city: city || 'seoul' };
    const allowedReportTypes = ['yearly','deep','love','marriage','money','couple','full','half','free'];
    const validType = allowedReportTypes.includes(reportType) ? reportType : 'deep';
    console.log(`[생성] user=${req.userId} ${name} type=${validType}`);
    const chapters = await generateAllChapters(apiKey, userInfo, validType);

    let reportId = null;
    try {
      reportId = db.saveReport({
        userId: req.userId, clientName: name, clientGender: gender || '남성',
        clientBirth: saju.solarDate, sajuData: saju, chapters,
        reportType: validType
      });
    } catch (e) { console.error('DB 저장 실패:', e.message); }

    res.json({ ok: true, userInfo, chapters, reportId, reportType: validType });
  } catch (e) {
    console.error('생성 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/regenerate', requireUser, async (req, res) => {
  try {
    const { apiKey, userInfo, index, instruction } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: 'API 키가 없습니다' });
    const chapter = await regenerateChapter(apiKey, userInfo, parseInt(index), instruction || '');
    res.json({ ok: true, chapter });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── 내 리포트 목록 ───
app.get('/api/reports', requireUser, (req, res) => {
  res.json({ reports: db.listUserReports(req.userId) });
});

app.get('/api/reports/:id', requireUser, (req, res) => {
  const report = db.getReport(parseInt(req.params.id), req.userId);
  if (!report) return res.status(404).json({ error: '없음' });
  res.json({ report });
});

app.delete('/api/reports/:id', requireUser, (req, res) => {
  db.deleteReport(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

app.post('/api/reports/:id/memo', requireUser, (req, res) => {
  db.updateMemo(parseInt(req.params.id), req.userId, req.body.memo || '');
  res.json({ ok: true });
});

// ─── 채팅 세션 ───
app.get('/api/sessions', requireUser, (req, res) => {
  res.json({ sessions: db.listUserSessions(req.userId) });
});

app.post('/api/sessions', requireUser, (req, res) => {
  const { reportId, title } = req.body;
  if (!reportId) return res.status(400).json({ error: 'reportId 필요' });
  const report = db.getReport(parseInt(reportId), req.userId);
  if (!report) return res.status(404).json({ error: '리포트 없음' });
  const sessionId = db.createChatSession(req.userId, parseInt(reportId),
    title || `${report.client_name} 상담`);
  res.json({ ok: true, sessionId });
});

app.get('/api/sessions/:id/messages', requireUser, (req, res) => {
  const session = db.getChatSession(parseInt(req.params.id), req.userId);
  if (!session) return res.status(404).json({ error: '세션 없음' });
  const messages = db.getMessages(session.id);
  const report = db.getReport(session.report_id, req.userId);
  res.json({ session, messages, report });
});

app.delete('/api/sessions/:id', requireUser, (req, res) => {
  db.deleteChatSession(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

app.post('/api/sessions/:id/chat', requireUser, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { question, apiKey } = req.body;
    if (!question) return res.status(400).json({ error: '질문 비어있음' });
    if (!apiKey) return res.status(400).json({ error: 'Gemini API 키가 필요합니다' });

    const session = db.getChatSession(sessionId, req.userId);
    if (!session) return res.status(404).json({ error: '세션 없음' });
    const report = db.getReport(session.report_id, req.userId);
    if (!report) return res.status(404).json({ error: '리포트 없음' });

    // 이전 메시지를 히스토리로 구성
    const prevMessages = db.getMessages(sessionId);
    const history = [];
    for (let i = 0; i < prevMessages.length - 1; i += 2) {
      if (prevMessages[i]?.role === 'user' && prevMessages[i+1]?.role === 'assistant') {
        history.push({ question: prevMessages[i].content, answer: prevMessages[i+1].content });
      }
    }

    const answer = await consultAnswer(report, question, history, apiKey);
    db.addMessage(sessionId, 'user', question);
    db.addMessage(sessionId, 'assistant', answer);
    res.json({ ok: true, answer });
  } catch (e) {
    console.error('채팅 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── 개인 상담 ───
app.get('/api/consult-categories', (req, res) => {
  const cats = Object.entries(CONSULT_CATEGORIES).map(([key, v]) => ({ key, title: v.title }));
  res.json({ categories: cats });
});

app.post('/api/personal-consult', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, category, length } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI API 키를 입력해주세요' });
    if (!name || !year || !month || !day) return res.status(400).json({ error: '이름과 생년월일은 필수입니다' });
    if (!category) return res.status(400).json({ error: '상담 분야를 선택해주세요' });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null ? null : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '남성'
    });

    const result = await personalConsult({
      apiKey, saju, category,
      clientName: name, clientGender: gender || '남성',
      length
    });

    // DB 저장
    const consultId = db.createPersonalConsult({
      userId: req.userId,
      clientName: name,
      clientGender: gender || '남성',
      sajuData: saju,
      category,
      initialResult: result.content
    });
    // 첫 메시지로 초기 결과 저장
    db.addPersonalMessage(consultId, 'assistant', result.content);

    res.json({ ok: true, result, saju, consultId });
  } catch (e) {
    console.error('개인상담 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 개인상담 목록
app.get('/api/personal-consults', requireUser, (req, res) => {
  res.json({ consults: db.listPersonalConsults(req.userId) });
});

// 개인상담 불러오기 (이전 대화 포함)
app.get('/api/personal-consults/:id', requireUser, (req, res) => {
  const consult = db.getPersonalConsult(parseInt(req.params.id), req.userId);
  if (!consult) return res.status(404).json({ error: '없음' });
  const messages = db.getPersonalMessages(consult.id);
  res.json({ consult, messages });
});

// 개인상담 후속 질문
app.post('/api/personal-consults/:id/chat', requireUser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, apiKey } = req.body;
    if (!question) return res.status(400).json({ error: '질문이 비어있습니다' });
    if (!apiKey) return res.status(400).json({ error: 'Gemini API 키가 필요합니다' });

    const consult = db.getPersonalConsult(id, req.userId);
    if (!consult) return res.status(404).json({ error: '없음' });
    const history = db.getPersonalMessages(id);

    const answer = await personalConsultFollowup({
      apiKey,
      saju: consult.saju_data,
      clientName: consult.client_name,
      clientGender: consult.client_gender,
      category: consult.category,
      initialResult: consult.initial_result,
      history,
      question
    });

    db.addPersonalMessage(id, 'user', question);
    db.addPersonalMessage(id, 'assistant', answer);
    res.json({ ok: true, answer });
  } catch (e) {
    console.error('후속 상담 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 개인상담 삭제
app.delete('/api/personal-consults/:id', requireUser, (req, res) => {
  db.deletePersonalConsult(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

// ─── 무료 사주 (스레드용) ───
// 텍스트에서 생년월일/시간/성별 파싱
function parseTextInfo(text) {
  if (!text) return {};
  const result = {};

  // 이름 추출 (앞쪽 짧은 단어 or "이름:" 패턴)
  const nameMatch = text.match(/이름[:\s]*([가-힣]{2,5})/) || text.match(/^([가-힣]{2,4})(?:\s|,|입니다)/);
  if (nameMatch) result.name = nameMatch[1];

  // 성별
  if (/여자|여성|여/.test(text) && !/남/.test(text)) result.gender = '여성';
  else if (/남자|남성|남/.test(text) && !/여/.test(text)) result.gender = '남성';
  else result.gender = '남성';

  // 양음력
  result.isLunar = /음력/.test(text);

  // 생년월일 (여러 패턴)
  // 2000년 5월 15일 / 2000.05.15 / 20000515 / 2000-05-15
  let m = text.match(/(\d{4})[년.\-\/\s]+(\d{1,2})[월.\-\/\s]+(\d{1,2})/);
  if (!m) m = text.match(/(\d{4})(\d{2})(\d{2})/);
  if (m) {
    result.year = parseInt(m[1]);
    result.month = parseInt(m[2]);
    result.day = parseInt(m[3]);
  }

  // 시간 (오전/오후 포함)
  const timeMatch = text.match(/(오전|오후)?\s*(\d{1,2})[시:](\d{0,2})?/);
  if (timeMatch) {
    let h = parseInt(timeMatch[2]);
    if (timeMatch[1] === '오후' && h < 12) h += 12;
    if (timeMatch[1] === '오전' && h === 12) h = 0;
    if (h >= 0 && h <= 23) {
      result.hour = h;
      result.minute = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    }
  }

  // 시간모름
  if (/시간\s*모름|시간\s*몰라|몇시|몇\s*시/.test(text)) {
    result.timeUnknown = true;
  }

  // 질문 추출 (생년월일 다음에 나오는 긴 문장)
  const qMatch = text.match(/[?？!]([^?？!]{10,})/) || null;
  // 또는 전체 텍스트에서 질문스러운 부분
  const questionKeywords = /올해|내년|언제|어떻게|어떨|결혼|연애|취업|이직|돈|재물|건강|궁금|봐줘|봐주세요|해줘/;
  if (questionKeywords.test(text)) {
    // 마지막 문장들 중 질문 추출
    result.question = text.slice(-300).replace(/\d{4}[년.\-\/][^.]*/, '').trim();
  }

  return result;
}

app.post('/api/free-reading/parse', requireUser, (req, res) => {
  const { text } = req.body;
  res.json({ parsed: parseTextInfo(text || '') });
});

app.post('/api/free-reading/generate', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, question, length } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Gemini API 키 필요' });
    if (!year || !month || !day) return res.status(400).json({ error: '생년월일이 필요합니다' });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null ? null : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '남성'
    });

    const content = await freeThreadReading({
      apiKey, saju,
      clientName: name || '',
      question: question || '',
      length: length || 'medium'
    });
    res.json({ ok: true, content, saju });
  } catch (e) {
    console.error('무료사주 오류:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── 홍보 스니펫 ───
app.get('/api/promo-snippets', requireUser, (req, res) => {
  res.json({ snippets: db.listPromoSnippets(req.userId) });
});

app.post('/api/promo-snippets', requireUser, (req, res) => {
  const { title, link, text, linkPosition } = req.body;
  if (!title || !text) return res.status(400).json({ error: '제목과 내용은 필수입니다' });
  const id = db.createPromoSnippet(req.userId, title, link || '', text, linkPosition || 'below');
  res.json({ ok: true, id });
});

app.put('/api/promo-snippets/:id', requireUser, (req, res) => {
  const { title, link, text, linkPosition } = req.body;
  if (!title || !text) return res.status(400).json({ error: '제목과 내용은 필수입니다' });
  db.updatePromoSnippet(parseInt(req.params.id), req.userId, title, link || '', text, linkPosition || 'below');
  res.json({ ok: true });
});

app.delete('/api/promo-snippets/:id', requireUser, (req, res) => {
  db.deletePromoSnippet(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

// ─── 후기 (공개 - 로그인 불필요) ───
app.get('/api/review-info/:token', (req, res) => {
  const user = db.getUserByReviewToken(req.params.token);
  if (!user) return res.status(404).json({ error: '유효하지 않은 링크입니다' });
  res.json({
    brandName: user.brand_name || `${user.name}사주`,
    ownerName: user.name
  });
});

app.post('/api/review-submit/:token', (req, res) => {
  try {
    const user = db.getUserByReviewToken(req.params.token);
    if (!user) return res.status(404).json({ error: '유효하지 않은 링크입니다' });
    const { writerName, rating, content } = req.body;
    if (!writerName || !writerName.trim()) return res.status(400).json({ error: '이름을 입력해주세요' });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: '별점을 선택해주세요' });
    if (!content || !content.trim()) return res.status(400).json({ error: '후기 내용을 입력해주세요' });
    if (writerName.length > 20) return res.status(400).json({ error: '이름은 20자 이내로 입력해주세요' });
    if (content.length > 1000) return res.status(400).json({ error: '후기는 1000자 이내로 입력해주세요' });
    db.createReview(user.id, writerName.trim(), parseInt(rating), content.trim());
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── 내 후기 관리 ───
app.get('/api/my/reviews', requireUser, (req, res) => {
  res.json({
    reviews: db.listUserReviews(req.userId),
    stats: db.getReviewStats(req.userId)
  });
});

app.delete('/api/my/reviews/:id', requireUser, (req, res) => {
  db.deleteReview(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

// ─── 총관리자 ───
app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json({ users: db.listAllUsers() });
});

app.post('/api/admin/users/:id/approve', requireAdmin, (req, res) => {
  db.updateUserStatus(parseInt(req.params.id), 'active');
  res.json({ ok: true });
});

app.post('/api/admin/users/:id/reject', requireAdmin, (req, res) => {
  db.updateUserStatus(parseInt(req.params.id), 'rejected');
  res.json({ ok: true });
});

app.post('/api/admin/users/:id/disable', requireAdmin, (req, res) => {
  db.updateUserStatus(parseInt(req.params.id), 'disabled');
  res.json({ ok: true });
});

app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  db.deleteUser(parseInt(req.params.id));
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🔮 제일라 사주 AI 플랫폼: http://localhost:${PORT}`);
  console.log(`👤 총관리자: 김가영 (비밀번호는 Railway Variables에서 관리)`);
});
