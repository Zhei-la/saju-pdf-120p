const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DB_DIR = process.env.DB_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const db = new Database(path.join(DB_DIR, 'saju.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    is_admin INTEGER NOT NULL DEFAULT 0,
    brand_name TEXT DEFAULT '',
    review_token TEXT UNIQUE,
    created_at INTEGER NOT NULL,
    last_login_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    client_name TEXT NOT NULL,
    client_gender TEXT,
    client_birth TEXT,
    saju_data TEXT NOT NULL,
    chapters TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_accessed_at INTEGER NOT NULL,
    memo TEXT DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    report_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    writer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS personal_consults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    client_name TEXT NOT NULL,
    client_gender TEXT,
    saju_data TEXT NOT NULL,
    category TEXT NOT NULL,
    initial_result TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS personal_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consult_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (consult_id) REFERENCES personal_consults(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS promo_snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    link TEXT,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_msgs_session ON messages(session_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
  CREATE INDEX IF NOT EXISTS idx_pconsult_user ON personal_consults(user_id);
  CREATE INDEX IF NOT EXISTS idx_pmsg_consult ON personal_messages(consult_id);
`);

// 기존 DB 마이그레이션 (컬럼 추가)
try { db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0`); } catch(e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN brand_name TEXT DEFAULT ''`); } catch(e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN review_token TEXT`); } catch(e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN report_price INTEGER NOT NULL DEFAULT 0`); } catch(e) {}

function hash(pw) { return crypto.createHash('sha256').update(pw + 'saju_salt_9923').digest('hex'); }

// 관리자 계정 초기화 (김가영) — 서버 시작 시 자동 실행
function ensureAdmin(adminPassword) {
  const existing = db.prepare(`SELECT * FROM users WHERE name = ?`).get('김가영');
  if (!existing) {
    const token = crypto.randomBytes(16).toString('hex');
    db.prepare(`
      INSERT INTO users (name, password_hash, status, is_admin, review_token, created_at)
      VALUES (?, ?, 'active', 1, ?, ?)
    `).run('김가영', hash(adminPassword), token, Date.now());
    console.log('[관리자 계정 생성] 김가영');
  } else {
    db.prepare(`UPDATE users SET password_hash = ?, is_admin = 1, status = 'active' WHERE name = ?`)
      .run(hash(adminPassword), '김가영');
    // review_token 없거나 빈 문자열이면 새로 발급
    if (!existing.review_token || existing.review_token === '') {
      const token = crypto.randomBytes(16).toString('hex');
      db.prepare(`UPDATE users SET review_token = ? WHERE id = ?`).run(token, existing.id);
      console.log('[관리자 review_token 재발급]');
    }
  }
}

// 모든 사용자 중 review_token 없는 사람에게 자동 발급 (마이그레이션)
function ensureReviewTokens() {
  const users = db.prepare(`SELECT id FROM users WHERE review_token IS NULL OR review_token = ''`).all();
  for (const u of users) {
    const token = crypto.randomBytes(16).toString('hex');
    db.prepare(`UPDATE users SET review_token = ? WHERE id = ?`).run(token, u.id);
  }
  if (users.length > 0) console.log(`[review_token 마이그레이션] ${users.length}명 발급`);
}

// ─── Users ───
function createUser(name, password) {
  const now = Date.now();
  const reviewToken = crypto.randomBytes(16).toString('hex');
  try {
    const info = db.prepare(`
      INSERT INTO users (name, password_hash, status, review_token, created_at)
      VALUES (?, ?, 'pending', ?, ?)
    `).run(name, hash(password), reviewToken, now);
    return { id: info.lastInsertRowid, status: 'pending' };
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new Error('이미 사용 중인 이름입니다');
    throw e;
  }
}
function loginUser(name, password) {
  const row = db.prepare(`SELECT * FROM users WHERE name = ?`).get(name);
  if (!row) throw new Error('이름 또는 비밀번호가 틀렸습니다');
  if (row.password_hash !== hash(password)) throw new Error('이름 또는 비밀번호가 틀렸습니다');
  if (row.status === 'pending') throw new Error('아직 승인 대기 중입니다. 관리자 승인 후 이용 가능합니다');
  if (row.status === 'rejected') throw new Error('가입이 거부되었습니다');
  if (row.status === 'disabled') throw new Error('비활성화된 계정입니다');
  db.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(Date.now(), row.id);
  return { id: row.id, name: row.name, status: row.status, isAdmin: !!row.is_admin, brandName: row.brand_name || '', reviewToken: row.review_token };
}
function getUser(id) {
  return db.prepare(`SELECT id, name, status, is_admin, brand_name, review_token, report_price, created_at, last_login_at FROM users WHERE id = ?`).get(id);
}
function getUserByReviewToken(token) {
  return db.prepare(`SELECT id, name, brand_name FROM users WHERE review_token = ?`).get(token);
}
function updateBrandName(id, brandName) {
  db.prepare(`UPDATE users SET brand_name = ? WHERE id = ?`).run(brandName || '', id);
}
function updateReportPrice(id, price) {
  db.prepare(`UPDATE users SET report_price = ? WHERE id = ?`).run(parseInt(price) || 0, id);
}
function getRevenueStats(userId) {
  const user = db.prepare(`SELECT report_price FROM users WHERE id = ?`).get(userId);
  const price = user ? (user.report_price || 0) : 0;
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const today = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneDayAgo).c;
  const week = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneWeekAgo).c;
  const total = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ?`).get(userId).c;
  return {
    price,
    today: today * price,
    week: week * price,
    total: total * price
  };
}
function listAllUsers() {
  return db.prepare(`
    SELECT u.id, u.name, u.status, u.created_at, u.last_login_at,
      (SELECT COUNT(*) FROM reports WHERE user_id = u.id) as report_count,
      (SELECT COUNT(*) FROM chat_sessions WHERE user_id = u.id) as chat_count
    FROM users u
    WHERE u.is_admin = 0
    ORDER BY u.created_at DESC
  `).all();
}

// ─── Reviews ───
function createReview(userId, writerName, rating, content) {
  const info = db.prepare(`
    INSERT INTO reviews (user_id, writer_name, rating, content, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, writerName, rating, content, Date.now());
  return info.lastInsertRowid;
}
function listUserReviews(userId) {
  return db.prepare(`SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC`).all(userId);
}
function deleteReview(id, userId) {
  db.prepare(`DELETE FROM reviews WHERE id = ? AND user_id = ?`).run(id, userId);
}
function getReviewStats(userId) {
  const row = db.prepare(`
    SELECT COUNT(*) as total, AVG(rating) as avg_rating
    FROM reviews WHERE user_id = ?
  `).get(userId);
  return {
    total: row.total || 0,
    avgRating: row.avg_rating ? Math.round(row.avg_rating * 10) / 10 : 0
  };
}

// ─── 개인 상담 (Personal Consult) ───
function createPersonalConsult({ userId, clientName, clientGender, sajuData, category, initialResult }) {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO personal_consults (user_id, client_name, client_gender, saju_data, category, initial_result, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, clientName, clientGender, JSON.stringify(sajuData), category, initialResult, now, now);
  return info.lastInsertRowid;
}
function listPersonalConsults(userId) {
  return db.prepare(`
    SELECT id, client_name, client_gender, category, created_at, updated_at,
      (SELECT COUNT(*) FROM personal_messages WHERE consult_id = personal_consults.id) as msg_count
    FROM personal_consults WHERE user_id = ? ORDER BY updated_at DESC
  `).all(userId);
}
function getPersonalConsult(id, userId) {
  const row = db.prepare(`SELECT * FROM personal_consults WHERE id = ? AND user_id = ?`).get(id, userId);
  if (!row) return null;
  db.prepare(`UPDATE personal_consults SET updated_at = ? WHERE id = ?`).run(Date.now(), id);
  return { ...row, saju_data: JSON.parse(row.saju_data) };
}
function deletePersonalConsult(id, userId) {
  db.prepare(`DELETE FROM personal_consults WHERE id = ? AND user_id = ?`).run(id, userId);
}
function addPersonalMessage(consultId, role, content) {
  const now = Date.now();
  db.prepare(`INSERT INTO personal_messages (consult_id, role, content, created_at) VALUES (?, ?, ?, ?)`)
    .run(consultId, role, content, now);
  db.prepare(`UPDATE personal_consults SET updated_at = ? WHERE id = ?`).run(now, consultId);
}
function getPersonalMessages(consultId) {
  return db.prepare(`SELECT * FROM personal_messages WHERE consult_id = ? ORDER BY created_at ASC`).all(consultId);
}

// ─── 홍보 스니펫 ───
function createPromoSnippet(userId, title, link, text) {
  const info = db.prepare(`
    INSERT INTO promo_snippets (user_id, title, link, text, created_at) VALUES (?, ?, ?, ?, ?)
  `).run(userId, title, link || '', text, Date.now());
  return info.lastInsertRowid;
}
function listPromoSnippets(userId) {
  return db.prepare(`SELECT * FROM promo_snippets WHERE user_id = ? ORDER BY created_at DESC`).all(userId);
}
function deletePromoSnippet(id, userId) {
  db.prepare(`DELETE FROM promo_snippets WHERE id = ? AND user_id = ?`).run(id, userId);
}
function updateUserStatus(id, status) {
  db.prepare(`UPDATE users SET status = ? WHERE id = ?`).run(status, id);
}
function deleteUser(id) { db.prepare(`DELETE FROM users WHERE id = ?`).run(id); }

// ─── Reports ───
function saveReport({ userId, clientName, clientGender, clientBirth, sajuData, chapters }) {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO reports (user_id, client_name, client_gender, client_birth, saju_data, chapters, created_at, last_accessed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, clientName, clientGender, clientBirth, JSON.stringify(sajuData), JSON.stringify(chapters), now, now);
  return info.lastInsertRowid;
}
function listUserReports(userId) {
  return db.prepare(`
    SELECT id, client_name, client_gender, client_birth, created_at, last_accessed_at, memo,
      (SELECT COUNT(*) FROM chat_sessions WHERE report_id = reports.id) as session_count
    FROM reports WHERE user_id = ? ORDER BY last_accessed_at DESC
  `).all(userId);
}
function getReport(id, userId) {
  const row = db.prepare(`SELECT * FROM reports WHERE id = ? AND user_id = ?`).get(id, userId);
  if (!row) return null;
  db.prepare(`UPDATE reports SET last_accessed_at = ? WHERE id = ?`).run(Date.now(), id);
  return { ...row, saju_data: JSON.parse(row.saju_data), chapters: JSON.parse(row.chapters) };
}
function deleteReport(id, userId) {
  db.prepare(`DELETE FROM reports WHERE id = ? AND user_id = ?`).run(id, userId);
}
function updateMemo(id, userId, memo) {
  db.prepare(`UPDATE reports SET memo = ? WHERE id = ? AND user_id = ?`).run(memo, id, userId);
}

// ─── Chat Sessions ───
function createChatSession(userId, reportId, title) {
  const now = Date.now();
  const info = db.prepare(`
    INSERT INTO chat_sessions (user_id, report_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
  `).run(userId, reportId, title, now, now);
  return info.lastInsertRowid;
}
function listUserSessions(userId) {
  return db.prepare(`
    SELECT s.*, r.client_name,
      (SELECT COUNT(*) FROM messages WHERE session_id = s.id) as msg_count
    FROM chat_sessions s
    LEFT JOIN reports r ON r.id = s.report_id
    WHERE s.user_id = ?
    ORDER BY s.updated_at DESC
  `).all(userId);
}
function getChatSession(sessionId, userId) {
  return db.prepare(`SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?`).get(sessionId, userId);
}
function deleteChatSession(sessionId, userId) {
  db.prepare(`DELETE FROM chat_sessions WHERE id = ? AND user_id = ?`).run(sessionId, userId);
}
function addMessage(sessionId, role, content) {
  const now = Date.now();
  db.prepare(`INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)`)
    .run(sessionId, role, content, now);
  db.prepare(`UPDATE chat_sessions SET updated_at = ? WHERE id = ?`).run(now, sessionId);
}
function getMessages(sessionId) {
  return db.prepare(`SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC`).all(sessionId);
}

// ─── Stats ───
function getUserStats(userId) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const todayRep = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneDayAgo).c;
  const weekRep = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneWeekAgo).c;
  const totalRep = db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ?`).get(userId).c;
  const todayMsg = db.prepare(`
    SELECT COUNT(*) as c FROM messages m JOIN chat_sessions s ON s.id = m.session_id
    WHERE s.user_id = ? AND m.created_at >= ? AND m.role = 'assistant'
  `).get(userId, oneDayAgo).c;
  const weekMsg = db.prepare(`
    SELECT COUNT(*) as c FROM messages m JOIN chat_sessions s ON s.id = m.session_id
    WHERE s.user_id = ? AND m.created_at >= ? AND m.role = 'assistant'
  `).get(userId, oneWeekAgo).c;
  const totalMsg = db.prepare(`
    SELECT COUNT(*) as c FROM messages m JOIN chat_sessions s ON s.id = m.session_id
    WHERE s.user_id = ? AND m.role = 'assistant'
  `).get(userId).c;
  return {
    todayCombined: todayRep + todayMsg,
    weekCombined: weekRep + weekMsg,
    totalConsults: totalRep + totalMsg,
    todayReports: todayRep, weekReports: weekRep, totalReports: totalRep,
    todayMessages: todayMsg, weekMessages: weekMsg, totalMessages: totalMsg
  };
}

// ─── Cleanup ───
function cleanupOldReports() {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const r1 = db.prepare(`DELETE FROM reports WHERE last_accessed_at < ?`).run(cutoff);
  const r2 = db.prepare(`DELETE FROM personal_consults WHERE updated_at < ?`).run(cutoff);
  return r1.changes + r2.changes;
}
cleanupOldReports();
setInterval(cleanupOldReports, 24 * 60 * 60 * 1000);

module.exports = {
  ensureAdmin, ensureReviewTokens,
  createUser, loginUser, getUser, getUserByReviewToken, listAllUsers, updateUserStatus, deleteUser,
  updateBrandName, updateReportPrice,
  saveReport, listUserReports, getReport, deleteReport, updateMemo,
  createChatSession, listUserSessions, getChatSession, deleteChatSession,
  addMessage, getMessages,
  getUserStats, getRevenueStats, cleanupOldReports,
  createReview, listUserReviews, deleteReview, getReviewStats,
  createPersonalConsult, listPersonalConsults, getPersonalConsult,
  deletePersonalConsult, addPersonalMessage, getPersonalMessages,
  createPromoSnippet, listPromoSnippets, deletePromoSnippet
};
