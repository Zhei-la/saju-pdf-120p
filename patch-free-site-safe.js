const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

const safeApi = `
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/free-site', (req, res) => {
  try {
    const fsx = require('fs');
    const pathx = require('path');

    const body = req.body || {};
    const brandName = String(body.brandName || '').trim();
    const kakaoLink = String(body.kakaoLink || '').trim();
    const introText = String(body.introText || '').trim();

    if (!brandName) {
      return res.status(400).json({ error: '브랜드명을 입력해주세요.' });
    }

    if (!kakaoLink) {
      return res.status(400).json({ error: '카카오톡 링크를 입력해주세요.' });
    }

    const slug = encodeURIComponent(brandName.replace(/\\s+/g, '-'));
    const dir = pathx.join(process.cwd(), 'data');
    const saveFile = pathx.join(dir, 'free-sites.json');

    if (!fsx.existsSync(dir)) {
      fsx.mkdirSync(dir, { recursive: true });
    }

    let sites = {};
    if (fsx.existsSync(saveFile)) {
      try {
        sites = JSON.parse(fsx.readFileSync(saveFile, 'utf8') || '{}');
      } catch (e) {
        sites = {};
      }
    }

    sites[slug] = {
      slug,
      brandName,
      kakaoLink,
      introText,
      updatedAt: new Date().toISOString()
    };

    fsx.writeFileSync(saveFile, JSON.stringify(sites, null, 2), 'utf8');

    return res.json({
      ok: true,
      site: sites[slug],
      url: '/u/' + slug
    });
  } catch (err) {
    console.error('FREE_SITE_SAVE_ERROR', err);
    return res.status(500).json({
      error: '무료사주 웹사이트 저장 중 서버 오류',
      detail: err.message
    });
  }
});

app.get('/api/free-site/:slug', (req, res) => {
  try {
    const fsx = require('fs');
    const pathx = require('path');
    const saveFile = pathx.join(process.cwd(), 'data', 'free-sites.json');

    if (!fsx.existsSync(saveFile)) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    const sites = JSON.parse(fsx.readFileSync(saveFile, 'utf8') || '{}');
    const site = sites[req.params.slug];

    if (!site) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    return res.json({ site });
  } catch (err) {
    console.error('FREE_SITE_LOAD_ERROR', err);
    return res.status(500).json({
      error: '무료사주 웹사이트 조회 중 서버 오류',
      detail: err.message
    });
  }
});

app.get('/u/:slug', (req, res) => {
  res.sendFile(require('path').join(process.cwd(), 'public', 'u.html'));
});
`;

if (!s.includes('FREE_SITE_SAVE_ERROR')) {
  s = s.replace('const app = express();', 'const app = express();\n' + safeApi);
  fs.writeFileSync(file, s, 'utf8');
  console.log('safe free site api inserted');
} else {
  console.log('safe free site api already exists');
}
