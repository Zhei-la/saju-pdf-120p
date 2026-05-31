const fs = require('fs');
const p = 'server.js';
let s = fs.readFileSync(p, 'utf8');

s = s.replaceAll("app.get('/api/free-site/:slug'", "app.get('/api/free-site-disabled/:slug'");

const route = `
app.get('/api/free-site/:slug', (req, res) => {
  try {
    const fsx = require('fs');
    const pathx = require('path');
    const saveFile = pathx.join(process.cwd(), 'data', 'free-sites.json');

    if (!fsx.existsSync(saveFile)) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    const sites = JSON.parse(fsx.readFileSync(saveFile, 'utf8') || '{}');

    const raw = req.params.slug;
    const encoded = encodeURIComponent(raw);
    const decoded = decodeURIComponent(raw);

    const site = sites[raw] || sites[encoded] || sites[decoded];

    if (!site) {
      return res.status(404).json({ error: '사이트를 찾을 수 없습니다.' });
    }

    return res.json({ site });
  } catch (err) {
    console.error('FREE_SITE_LOAD_ERROR', err);
    return res.status(500).json({ error: '조회 오류', detail: err.message });
  }
});
`;

if (!s.includes("const encoded = encodeURIComponent(raw);")) {
  s = s.replace("app.get('/u/:slug'", route + "\napp.get('/u/:slug'");
}

fs.writeFileSync(p, s, 'utf8');
console.log('fixed');
