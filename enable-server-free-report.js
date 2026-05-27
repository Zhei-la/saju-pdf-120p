const fs = require('fs');

const file = 'server.js';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(
  /const allowedReportTypes = \['yearly','deep','love','marriage','money','couple','full','half'\];/,
  `const allowedReportTypes = ['yearly','deep','love','marriage','money','couple','full','half','free'];`
);

fs.writeFileSync(file, s, 'utf8');

console.log('enabled free report type on server');
