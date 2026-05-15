const fs = require('fs');

const file = 'public/report.html';
let s = fs.readFileSync(file, 'utf8');

const oldBlock = `
      // 한 페이지에 다 안 들어가는 경우 (chapter 본문이 너무 길 때) - 자르거나 비례 축소
      if (pdfH > 297) {
        // 297mm에 맞춰 비율 축소 (이미 splitContentIntoPages로 잘랐기 때문에 거의 발생 안 함)
        const scale = 297 / pdfH;
        const adjW = pdfW * scale;
        const adjH = 297;
        pdf.addImage(imgData, 'JPEG', (210 - adjW) / 2, 0, adjW, adjH);
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      }`;

const newBlock = `
      // 페이지 축소 금지
      // 내용이 길 경우 splitContentIntoPages 에서 다음 페이지로 넘긴다
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);`;

s = s.replace(oldBlock, newBlock);

fs.writeFileSync(file, s, 'utf8');

console.log('PDF scale bug fixed');
