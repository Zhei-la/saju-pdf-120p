const fs = require('fs');
const p = 'server.js';
let s = fs.readFileSync(p, 'utf8');

const anchor = "app.get('/u/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'u.html')));";

const code = `
const FREE_SITE_FILE = path.join(__dirname, 'data', 'free-sites.json');

function readFreeSites() {
  if (!fs.existsSync(path.dirname(FREE_SITE_FILE))) fs.mkdirSync(path.dirname(FREE_SITE_FILE), { recursive: true });
  if (!fs.existsSync(FREE_SITE_FILE)) fs.writeFileSync(FREE_SITE_FILE, '{}', 'utf8');
  return JSON.parse(fs.readFileSync(FREE_SITE_FILE, 'utf8') || '{}');
}

function saveFreeSites(data) {
  fs.writeFileSync(FREE_SITE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/api/free-site', (req, res) => {
  const { brandName, kakaoLink, introText } = req.body || {};
  if (!brandName) return res.status(400).json({ error: '브랜드명을 입력해주세요.' });
  if (!kakaoLink) return res.status(400).json({ error: '카카오톡 링크를 입력해주세요.' });

  const slug = encodeURIComponent(String(brandName).trim().replace(/\\\\s+/g, '-'));
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
`;

if (!s.includes("app.post('/api/free-site'")) {
  if (!s.includes(anchor)) {
    console.error('u route not found. Add /u/:slug route first.');
    process.exit(1);
  }
  s = s.replace(anchor, anchor + "\\n" + code);
  fs.writeFileSync(p, s, 'utf8');
  console.log('free site api added');
} else {
  console.log('free site api already exists');
}
