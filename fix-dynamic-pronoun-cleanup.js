const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const marker = `const userMsg = \`${ctx}`;

const inject = `const clientName = userInfo.name || '내담자';
  `;

if (!s.includes(`const clientName = userInfo.name || '내담자';`)) {
  s = s.replace(marker, inject + marker);
}

s = s.replace(
`      content = content`,
`      const clientName = userInfo.name || '내담자';
      content = content`
);

s = s.replace(
`.replace(/결론적으로,?/g, '')`,
`.replace(/그녀에게는/g, clientName + ' 님에게는')
        .replace(/그녀는/g, clientName + ' 님은')
        .replace(/그녀의/g, clientName + ' 님의')
        .replace(/그녀가/g, clientName + ' 님이')
        .replace(/그녀를/g, clientName + ' 님을')
        .replace(/그녀와/g, clientName + ' 님과')
        .replace(/그녀에게/g, clientName + ' 님에게')
        .replace(/그녀/g, clientName + ' 님')
        .replace(/상대과/g, '상대와')
        .replace(/\\n큰\\n/g, '\\n')
        .replace(/결론적으로,?/g, '')`
);

if (!s.includes('절대 "그녀"라는 표현을 사용하지 마세요.')) {
  s = s.replace(
    `- 여성이라도 "그녀"라고 쓰지 말고, 필요하면 "내담자", "본인", 또는 입력된 이름을 사용하세요.`,
    `- 절대 "그녀"라는 표현을 사용하지 마세요.
- 여성이라도 3인칭 표현을 쓰지 말고, 필요하면 입력된 내담자 이름 또는 "본인"을 사용하세요.
- 이름은 꼭 필요한 곳에서만 사용하고, 한 문단 안에서 반복하지 마세요.`
  );
}

fs.writeFileSync(file, s, 'utf8');
console.log('fixed dynamic pronoun cleanup');
