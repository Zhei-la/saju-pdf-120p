const fs = require('fs');

const file = 'public/chat.html';
let s = fs.readFileSync(file, 'utf8');

//
// 1. welcomeView 높이 제한
//
s = s.replace(
`.welcome {
    flex: 1;`,
`.welcome {
    flex: 1;
    min-height: 0;`
);

//
// 2. chatView 강제 flex 구조
//
s = s.replace(
`<div class="chat hidden" id="chatView">`,
`<div class="chat hidden" id="chatView" style="height:100%;min-height:0;">`
);

//
// 3. msgsBox 높이 강제
//
s = s.replace(
`<div class="msgs" id="msgsBox"></div>`,
`<div class="msgs" id="msgsBox" style="flex:1;overflow-y:auto;min-height:0;"></div>`
);

//
// 4. openSession에서 hidden 제거 확실히
//
s = s.replace(
`document.getElementById('chatView').style.display = 'flex';`,
`const chatView = document.getElementById('chatView');
chatView.classList.remove('hidden');
chatView.style.display = 'flex';
chatView.style.flex = '1';
chatView.style.minHeight = '0';`
);

//
// 5. welcome 숨김 확실히
//
s = s.replace(
`document.getElementById('welcomeView').style.display = 'none';`,
`const welcome = document.getElementById('welcomeView');
welcome.classList.add('hidden');
welcome.style.display = 'none';`
);

fs.writeFileSync(file, s, 'utf8');

console.log('fixed chat view rendering');
