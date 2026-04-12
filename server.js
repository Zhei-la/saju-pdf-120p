require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { calculateSaju } = require('./services/sajuCalculator');
const { generateAllChapters, regenerateChapter } = require('./services/aiGenerator');
const { consultAnswer } = require('./services/consultant');
const db = require('./services/db');

const app = express();
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
    reviewToken: user.review_token, reportPrice: user.report_price || 0
  }});
});

// 브랜드 이름 저장
app.post('/api/me/brand', requireUser, (req, res) => {
  db.updateBrandName(req.userId, req.body.brandName || '');
  res.json({ ok: true });
});

// 리포트 가격 저장
app.post('/api/me/price', requireUser, (req, res) => {
  db.updateReportPrice(req.userId, req.body.price || 0);
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

// ─── 리포트 생성 ───
app.post('/api/generate', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: '올바른 OpenAI API 키를 입력해주세요' });
    if (!name || !year || !month || !day) return res.status(400).json({ error: '이름과 생년월일은 필수입니다' });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: hour === '' || hour == null ? 12 : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '남성'
    });

    const userInfo = { name, gender: gender || '남성', saju, timeUnknown: !!timeUnknown, city: city || 'seoul' };
    console.log(`[생성] user=${req.userId} ${name}`);
    const chapters = await generateAllChapters(apiKey, userInfo);

    let reportId = null;
    try {
      reportId = db.saveReport({
        userId: req.userId, clientName: name, clientGender: gender || '남성',
        clientBirth: saju.solarDate, sajuData: saju, chapters
      });
    } catch (e) { console.error('DB 저장 실패:', e.message); }

    res.json({ ok: true, userInfo, chapters, reportId });
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
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI 키 필요' });

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
  console.log(`👤 총관리자 로그인: name=김가영, pw=${ADMIN_PASSWORD}`);
});
