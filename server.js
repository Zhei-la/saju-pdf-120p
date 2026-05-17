require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { calculateSaju } = require('./services/sajuCalculator');
const { generateAllChapters, regenerateChapter } = require('./services/aiGenerator');
const { consultAnswer, personalConsult, personalConsultFollowup, freeThreadReading, CONSULT_CATEGORIES } = require('./services/consultant');
const db = require('./services/db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'loopy1234';

app.use(express.json({ limit: '4mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));

// 愿由ъ옄 怨꾩젙 珥덇린??
db.ensureAdmin(ADMIN_PASSWORD);
db.ensureReviewTokens();

// ??? ?몄뀡 愿由?(硫붾え由? ???
const sessions = new Map(); // token ??{ userId, isAdmin }
function makeToken() { return crypto.randomBytes(32).toString('hex'); }

function requireUser(req, res, next) {
  const token = req.headers['x-auth-token'];
  const s = sessions.get(token);
  if (!s || !s.userId) return res.status(401).json({ error: '濡쒓렇?몄씠 ?꾩슂?⑸땲?? });
  req.userId = s.userId;
  req.isAdmin = s.isAdmin;
  next();
}
function requireAdmin(req, res, next) {
  const token = req.headers['x-auth-token'];
  const s = sessions.get(token);
  if (!s || !s.isAdmin) return res.status(403).json({ error: '愿由ъ옄 沅뚰븳 ?꾩슂' });
  next();
}

// ??? ?몄쬆 ???
app.post('/api/signup', (req, res) => {
  try {
    const { name, password, passwordConfirm } = req.body;
    if (!name || !password) return res.status(400).json({ error: '?대쫫怨?鍮꾨?踰덊샇瑜??낅젰?댁＜?몄슂' });
    if (password.length < 4) return res.status(400).json({ error: '鍮꾨?踰덊샇??4???댁긽?댁뼱???⑸땲?? });
    if (password !== passwordConfirm) return res.status(400).json({ error: '鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎' });
    const user = db.createUser(name, password);
    res.json({ ok: true, message: '媛???좎껌???꾨즺?섏뿀?듬땲?? 愿由ъ옄 ?뱀씤 ???댁슜 媛?ν빀?덈떎.' });
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
  if (!user) return res.status(404).json({ error: '?놁쓬' });
  res.json({ user: {
    id: user.id, name: user.name, status: user.status,
    isAdmin: !!user.is_admin, brandName: user.brand_name || '',
    reviewToken: user.review_token,
    reportPrice: user.report_price || 0,
    reportPriceHalf: user.report_price_half || 0
  }});
});

// 釉뚮옖???대쫫 ???
app.post('/api/me/brand', requireUser, (req, res) => {
  db.updateBrandName(req.userId, req.body.brandName || '');
  res.json({ ok: true });
});

// 由ы룷??媛寃????
app.post('/api/me/price', requireUser, (req, res) => {
  db.updateReportPrice(req.userId, req.body.price || 0, req.body.priceHalf || 0);
  res.json({ ok: true });
});

// ??? ??쒕낫???듦퀎 ???
app.get('/api/stats', requireUser, (req, res) => {
  res.json({
    stats: db.getUserStats(req.userId),
    reviewStats: db.getReviewStats(req.userId),
    revenue: db.getRevenueStats(req.userId)
  });
});

// ??? 由ы룷???앹꽦 ???
app.post('/api/generate', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, timeUnknown, city, reportType } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: '?щ컮瑜?OpenAI API ?ㅻ? ?낅젰?댁＜?몄슂' });
    if (!name || !year || !month || !day) return res.status(400).json({ error: '?대쫫怨??앸뀈?붿씪? ?꾩닔?낅땲?? });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null
        ? null
        : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '?⑥꽦'
    });

    const userInfo = { name, gender: gender || '?⑥꽦', saju, timeUnknown: !!timeUnknown, city: city || 'seoul' };
    const allowedReportTypes = ['yearly','deep','love','marriage','money','couple','full','half'];
    const validType = allowedReportTypes.includes(reportType) ? reportType : 'deep';
    console.log(`[?앹꽦] user=${req.userId} ${name} type=${validType}`);
    const chapters = await generateAllChapters(apiKey, userInfo, validType);

    let reportId = null;
    try {
      reportId = db.saveReport({
        userId: req.userId, clientName: name, clientGender: gender || '?⑥꽦',
        clientBirth: saju.solarDate, sajuData: saju, chapters,
        reportType: validType
      });
    } catch (e) { console.error('DB ????ㅽ뙣:', e.message); }

    res.json({ ok: true, userInfo, chapters, reportId, reportType: validType });
  } catch (e) {
    console.error('?앹꽦 ?ㅻ쪟:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/regenerate', requireUser, async (req, res) => {
  try {
    const { apiKey, userInfo, index, instruction } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: 'API ?ㅺ? ?놁뒿?덈떎' });
    const chapter = await regenerateChapter(apiKey, userInfo, parseInt(index), instruction || '');
    res.json({ ok: true, chapter });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ??? ??由ы룷??紐⑸줉 ???
app.get('/api/reports', requireUser, (req, res) => {
  res.json({ reports: db.listUserReports(req.userId) });
});

app.get('/api/reports/:id', requireUser, (req, res) => {
  const report = db.getReport(parseInt(req.params.id), req.userId);
  if (!report) return res.status(404).json({ error: '?놁쓬' });
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

// ??? 梨꾪똿 ?몄뀡 ???
app.get('/api/sessions', requireUser, (req, res) => {
  res.json({ sessions: db.listUserSessions(req.userId) });
});

app.post('/api/sessions', requireUser, (req, res) => {
  const { reportId, title } = req.body;
  if (!reportId) return res.status(400).json({ error: 'reportId ?꾩슂' });
  const report = db.getReport(parseInt(reportId), req.userId);
  if (!report) return res.status(404).json({ error: '由ы룷???놁쓬' });
  const sessionId = db.createChatSession(req.userId, parseInt(reportId),
    title || `${report.client_name} ?곷떞`);
  res.json({ ok: true, sessionId });
});

app.get('/api/sessions/:id/messages', requireUser, (req, res) => {
  const session = db.getChatSession(parseInt(req.params.id), req.userId);
  if (!session) return res.status(404).json({ error: '?몄뀡 ?놁쓬' });
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
    if (!question) return res.status(400).json({ error: '吏덈Ц 鍮꾩뼱?덉쓬' });
    if (!apiKey) return res.status(400).json({ error: 'Gemini API ?ㅺ? ?꾩슂?⑸땲?? });

    const session = db.getChatSession(sessionId, req.userId);
    if (!session) return res.status(404).json({ error: '?몄뀡 ?놁쓬' });
    const report = db.getReport(session.report_id, req.userId);
    if (!report) return res.status(404).json({ error: '由ы룷???놁쓬' });

    // ?댁쟾 硫붿떆吏瑜??덉뒪?좊━濡?援ъ꽦
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
    console.error('梨꾪똿 ?ㅻ쪟:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ??? 媛쒖씤 ?곷떞 ???
app.get('/api/consult-categories', (req, res) => {
  const cats = Object.entries(CONSULT_CATEGORIES).map(([key, v]) => ({ key, title: v.title }));
  res.json({ categories: cats });
});

app.post('/api/personal-consult', requireUser, async (req, res) => {
  try {
    const { apiKey, name, gender, year, month, day, hour, minute, isLunar, category, length } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-')) return res.status(400).json({ error: 'OpenAI API ?ㅻ? ?낅젰?댁＜?몄슂' });
    if (!name || !year || !month || !day) return res.status(400).json({ error: '?대쫫怨??앸뀈?붿씪? ?꾩닔?낅땲?? });
    if (!category) return res.status(400).json({ error: '?곷떞 遺꾩빞瑜??좏깮?댁＜?몄슂' });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null
        ? null
        : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '?⑥꽦'
    });

    const result = await personalConsult({
      apiKey, saju, category,
      clientName: name, clientGender: gender || '?⑥꽦',
      length
    });

    // DB ???
    const consultId = db.createPersonalConsult({
      userId: req.userId,
      clientName: name,
      clientGender: gender || '?⑥꽦',
      sajuData: saju,
      category,
      initialResult: result.content
    });
    // 泥?硫붿떆吏濡?珥덇린 寃곌낵 ???
    db.addPersonalMessage(consultId, 'assistant', result.content);

    res.json({ ok: true, result, saju, consultId });
  } catch (e) {
    console.error('媛쒖씤?곷떞 ?ㅻ쪟:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 媛쒖씤?곷떞 紐⑸줉
app.get('/api/personal-consults', requireUser, (req, res) => {
  res.json({ consults: db.listPersonalConsults(req.userId) });
});

// 媛쒖씤?곷떞 遺덈윭?ㅺ린 (?댁쟾 ????ы븿)
app.get('/api/personal-consults/:id', requireUser, (req, res) => {
  const consult = db.getPersonalConsult(parseInt(req.params.id), req.userId);
  if (!consult) return res.status(404).json({ error: '?놁쓬' });
  const messages = db.getPersonalMessages(consult.id);
  res.json({ consult, messages });
});

// 媛쒖씤?곷떞 ?꾩냽 吏덈Ц
app.post('/api/personal-consults/:id/chat', requireUser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, apiKey } = req.body;
    if (!question) return res.status(400).json({ error: '吏덈Ц??鍮꾩뼱?덉뒿?덈떎' });
    if (!apiKey) return res.status(400).json({ error: 'Gemini API ?ㅺ? ?꾩슂?⑸땲?? });

    const consult = db.getPersonalConsult(id, req.userId);
    if (!consult) return res.status(404).json({ error: '?놁쓬' });
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
    console.error('?꾩냽 ?곷떞 ?ㅻ쪟:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 媛쒖씤?곷떞 ??젣
app.delete('/api/personal-consults/:id', requireUser, (req, res) => {
  db.deletePersonalConsult(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

// ??? 臾대즺 ?ъ＜ (?ㅻ젅?쒖슜) ???
// ?띿뒪?몄뿉???앸뀈?붿씪/?쒓컙/?깅퀎 ?뚯떛
function parseTextInfo(text) {
  if (!text) return {};
  const result = {};

  // ?대쫫 異붿텧 (?욎そ 吏㏃? ?⑥뼱 or "?대쫫:" ?⑦꽩)
  const nameMatch = text.match(/?대쫫[:\s]*([媛-??{2,5})/) || text.match(/^([媛-??{2,4})(?:\s|,|?낅땲??/);
  if (nameMatch) result.name = nameMatch[1];

  // ?깅퀎
  if (/?ъ옄|?ъ꽦|??.test(text) && !/??.test(text)) result.gender = '?ъ꽦';
  else if (/?⑥옄|?⑥꽦|??.test(text) && !/??.test(text)) result.gender = '?⑥꽦';
  else result.gender = '?⑥꽦';

  // ?묒쓬??
  result.isLunar = /?뚮젰/.test(text);

  // ?앸뀈?붿씪 (?щ윭 ?⑦꽩)
  // 2000??5??15??/ 2000.05.15 / 20000515 / 2000-05-15
  let m = text.match(/(\d{4})[??\-\/\s]+(\d{1,2})[??\-\/\s]+(\d{1,2})/);
  if (!m) m = text.match(/(\d{4})(\d{2})(\d{2})/);
  if (m) {
    result.year = parseInt(m[1]);
    result.month = parseInt(m[2]);
    result.day = parseInt(m[3]);
  }

  // ?쒓컙 (?ㅼ쟾/?ㅽ썑 ?ы븿)
  const timeMatch = text.match(/(?ㅼ쟾|?ㅽ썑)?\s*(\d{1,2})[??](\d{0,2})?/);
  if (timeMatch) {
    let h = parseInt(timeMatch[2]);
    if (timeMatch[1] === '?ㅽ썑' && h < 12) h += 12;
    if (timeMatch[1] === '?ㅼ쟾' && h === 12) h = 0;
    if (h >= 0 && h <= 23) {
      result.hour = h;
      result.minute = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    }
  }

  // ?쒓컙紐⑤쫫
  if (/?쒓컙\s*紐⑤쫫|?쒓컙\s*紐곕씪|紐뉗떆|紐?s*??.test(text)) {
    result.timeUnknown = true;
  }

  // 吏덈Ц 異붿텧 (?앸뀈?붿씪 ?ㅼ쓬???섏삤??湲?臾몄옣)
  const qMatch = text.match(/[?竊?]([^?竊?]{10,})/) || null;
  // ?먮뒗 ?꾩껜 ?띿뒪?몄뿉??吏덈Ц?ㅻ윭??遺遺?
  const questionKeywords = /?ы빐|?대뀈|?몄젣|?대뼸寃??대뼥|寃고샎|?곗븷|痍⑥뾽|?댁쭅|???щЪ|嫄닿컯|沅곴툑|遊먯쨾|遊먯＜?몄슂|?댁쨾/;
  if (questionKeywords.test(text)) {
    // 留덉?留?臾몄옣??以?吏덈Ц 異붿텧
    result.question = text.slice(-300).replace(/\d{4}[??\-\/][^.]*/, '').trim();
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
    if (!apiKey) return res.status(400).json({ error: 'Gemini API ???꾩슂' });
    if (!year || !month || !day) return res.status(400).json({ error: '?앸뀈?붿씪???꾩슂?⑸땲?? });

    const saju = calculateSaju({
      year: parseInt(year), month: parseInt(month), day: parseInt(day),
      hour: timeUnknown || hour === '' || hour == null
        ? null
        : parseInt(hour),
      minute: parseInt(minute) || 0,
      isLunar: !!isLunar, gender: gender || '?⑥꽦'
    });

    const content = await freeThreadReading({
      apiKey, saju,
      clientName: name || '',
      question: question || '',
      length: length || 'medium'
    });
    res.json({ ok: true, content, saju });
  } catch (e) {
    console.error('臾대즺?ъ＜ ?ㅻ쪟:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ??? ?띾낫 ?ㅻ땲?????
app.get('/api/promo-snippets', requireUser, (req, res) => {
  res.json({ snippets: db.listPromoSnippets(req.userId) });
});

app.post('/api/promo-snippets', requireUser, (req, res) => {
  const { title, link, text, linkPosition } = req.body;
  if (!title || !text) return res.status(400).json({ error: '?쒕ぉ怨??댁슜? ?꾩닔?낅땲?? });
  const id = db.createPromoSnippet(req.userId, title, link || '', text, linkPosition || 'below');
  res.json({ ok: true, id });
});

app.put('/api/promo-snippets/:id', requireUser, (req, res) => {
  const { title, link, text, linkPosition } = req.body;
  if (!title || !text) return res.status(400).json({ error: '?쒕ぉ怨??댁슜? ?꾩닔?낅땲?? });
  db.updatePromoSnippet(parseInt(req.params.id), req.userId, title, link || '', text, linkPosition || 'below');
  res.json({ ok: true });
});

app.delete('/api/promo-snippets/:id', requireUser, (req, res) => {
  db.deletePromoSnippet(parseInt(req.params.id), req.userId);
  res.json({ ok: true });
});

// ??? ?꾧린 (怨듦컻 - 濡쒓렇??遺덊븘?? ???
app.get('/api/review-info/:token', (req, res) => {
  const user = db.getUserByReviewToken(req.params.token);
  if (!user) return res.status(404).json({ error: '?좏슚?섏? ?딆? 留곹겕?낅땲?? });
  res.json({
    brandName: user.brand_name || `${user.name}?ъ＜`,
    ownerName: user.name
  });
});

app.post('/api/review-submit/:token', (req, res) => {
  try {
    const user = db.getUserByReviewToken(req.params.token);
    if (!user) return res.status(404).json({ error: '?좏슚?섏? ?딆? 留곹겕?낅땲?? });
    const { writerName, rating, content } = req.body;
    if (!writerName || !writerName.trim()) return res.status(400).json({ error: '?대쫫???낅젰?댁＜?몄슂' });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: '蹂꾩젏???좏깮?댁＜?몄슂' });
    if (!content || !content.trim()) return res.status(400).json({ error: '?꾧린 ?댁슜???낅젰?댁＜?몄슂' });
    if (writerName.length > 20) return res.status(400).json({ error: '?대쫫? 20???대궡濡??낅젰?댁＜?몄슂' });
    if (content.length > 1000) return res.status(400).json({ error: '?꾧린??1000???대궡濡??낅젰?댁＜?몄슂' });
    db.createReview(user.id, writerName.trim(), parseInt(rating), content.trim());
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ??? ???꾧린 愿由????
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

// ??? 珥앷?由ъ옄 ???
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
  console.log(`?뵰 ?쒖씪???ъ＜ AI ?뚮옯?? http://localhost:${PORT}`);
  console.log(`?뫀 珥앷?由ъ옄: 源媛??(鍮꾨?踰덊샇??Railway Variables?먯꽌 愿由?`);
});



