const fs = require('fs');

const p = 'server.js';
let s = fs.readFileSync(p, 'utf8');

const target = "app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));";
const insert = target + "\napp.get('/u/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'u.html')));";

if (!s.includes("app.get('/u/:slug'")) {
  s = s.replace(target, insert);
  fs.writeFileSync(p, s, 'utf8');
  console.log('u route added');
} else {
  console.log('u route already exists');
}
