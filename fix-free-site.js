const fs = require('fs');
const p = 'server.js';
let s = fs.readFileSync(p, 'utf8');

const inject = `
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

  const slug = encodeURIComponent(String(brandName).trim().replace(/\\s+/g, '-'));
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
  s = s.replace("const app = express();", "const app = express();\n" + inject);
  fs.writeFileSync(p, s, 'utf8');
  console.log('free site route and api added');
} else {
  console.log('already exists');
}
