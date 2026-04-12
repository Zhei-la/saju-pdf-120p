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
  CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_msgs_session ON messages(session_id);
`);

function hash(pw) { return crypto.createHash('sha256').update(pw + 'saju_salt_9923').digest('hex'); }

// ─── Users ───
function createUser(name, password) {
  const now = Date.now();
  try {
    const info = db.prepare(`INSERT INTO users (name, password_hash, status, created_at) VALUES (?, ?, 'pending', ?)`)
      .run(name, hash(password), now);
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
  return { id: row.id, name: row.name, status: row.status };
}
function getUser(id) { return db.prepare(`SELECT id, name, status, created_at, last_login_at FROM users WHERE id = ?`).get(id); }
function listAllUsers() {
  return db.prepare(`
    SELECT u.id, u.name, u.status, u.created_at, u.last_login_at,
      (SELECT COUNT(*) FROM reports WHERE user_id = u.id) as report_count,
      (SELECT COUNT(*) FROM chat_sessions WHERE user_id = u.id) as chat_count
    FROM users u ORDER BY u.created_at DESC
  `).all();
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
  return {
    totalReports: db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ?`).get(userId).c,
    todayReports: db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneDayAgo).c,
    weekReports: db.prepare(`SELECT COUNT(*) as c FROM reports WHERE user_id = ? AND created_at >= ?`).get(userId, oneWeekAgo).c,
    totalSessions: db.prepare(`SELECT COUNT(*) as c FROM chat_sessions WHERE user_id = ?`).get(userId).c,
    todayMessages: db.prepare(`
      SELECT COUNT(*) as c FROM messages m
      JOIN chat_sessions s ON s.id = m.session_id
      WHERE s.user_id = ? AND m.created_at >= ? AND m.role = 'assistant'
    `).get(userId, oneDayAgo).c,
    weekMessages: db.prepare(`
      SELECT COUNT(*) as c FROM messages m
      JOIN chat_sessions s ON s.id = m.session_id
      WHERE s.user_id = ? AND m.created_at >= ? AND m.role = 'assistant'
    `).get(userId, oneWeekAgo).c
  };
}

// ─── Cleanup ───
function cleanupOldReports() {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const info = db.prepare(`DELETE FROM reports WHERE last_accessed_at < ?`).run(cutoff);
  return info.changes;
}
cleanupOldReports();
setInterval(cleanupOldReports, 24 * 60 * 60 * 1000);

module.exports = {
  createUser, loginUser, getUser, listAllUsers, updateUserStatus, deleteUser,
  saveReport, listUserReports, getReport, deleteReport, updateMemo,
  createChatSession, listUserSessions, getChatSession, deleteChatSession,
  addMessage, getMessages,
  getUserStats, cleanupOldReports
};
