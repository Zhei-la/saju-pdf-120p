const fs = require('fs');

const file = 'public/chat.html';
let s = fs.readFileSync(file, 'utf8');

// 채팅 레이아웃 CSS 보강
if (!s.includes('/* chat layout fix */')) {
  s = s.replace(
    '</style>',
`/* chat layout fix */
body {
  min-height: 100vh;
  overflow: hidden;
}

.chat-layout,
.chat-wrap,
.main,
.container {
  height: calc(100vh - 64px);
}

.chat-main,
.chat-panel,
.conversation,
#chatMain,
#chatPanel {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: #f8efe2;
}

.messages,
#messages,
#chatMessages {
  flex: 1;
  overflow-y: auto;
  padding: 28px 34px 120px;
}

.chat-empty,
.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a745c;
  font-size: 15px;
  text-align: center;
}

.chat-input,
.input-area,
#chatInputArea {
  position: fixed;
  left: 320px;
  right: 0;
  bottom: 0;
  background: #fffaf2;
  border-top: 1px solid #d8c29a;
  padding: 18px 24px;
  display: flex;
  gap: 10px;
  box-sizing: border-box;
}

.chat-input textarea,
.input-area textarea,
#messageInput {
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  resize: none;
  border: 1px solid #d8c29a;
  padding: 14px;
  font-size: 14px;
  font-family: 'Noto Sans KR', sans-serif;
  background: #fff;
}

.chat-input button,
.input-area button,
#sendBtn {
  width: 110px;
  border: 0;
  background: #b8860b;
  color: #1a1209;
  font-weight: 700;
  cursor: pointer;
}

.message,
.msg {
  max-width: 760px;
  margin-bottom: 18px;
  padding: 15px 18px;
  line-height: 1.85;
  font-size: 14px;
  white-space: pre-wrap;
}

.message.user,
.msg.user {
  margin-left: auto;
  background: #fff;
  border: 1px solid #d8c29a;
}

.message.ai,
.msg.ai,
.message.assistant,
.msg.assistant {
  margin-right: auto;
  background: #f4ead7;
  border: 1px solid #d8c29a;
}

.sidebar,
.chat-sidebar {
  width: 320px;
  min-width: 320px;
}
</style>`
  );
}

fs.writeFileSync(file, s, 'utf8');

console.log('fixed chat layout styling');
