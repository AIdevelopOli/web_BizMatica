const puppeteer = require('puppeteer');
const path = require('path');

const shots = [
  { file: 'screenshot-lead-app-cs.html',     out: 'brand_assets/screenshot-lead-app-cs.png',     w: 900, h: 580 },
  { file: 'screenshot-lead-app-sk.html',     out: 'brand_assets/screenshot-lead-app-sk.png',     w: 900, h: 580 },
  { file: 'screenshot-lead-flow-cs.html',    out: 'brand_assets/screenshot-lead-flow-cs.png',    w: 900, h: 260 },
  { file: 'screenshot-lead-flow-sk.html',    out: 'brand_assets/screenshot-lead-flow-sk.png',    w: 900, h: 260 },
  { file: 'screenshot-lead-report-cs.html',  out: 'brand_assets/screenshot-lead-report-cs.png',  w: 900, h: 560 },
  { file: 'screenshot-lead-report-sk.html',  out: 'brand_assets/screenshot-lead-report-sk.png',  w: 900, h: 560 },
  { file: 'screenshot-gmail-draft-cs.html',  out: 'brand_assets/screenshot-gmail-draft-cs.png',  w: 900, h: 640 },
  { file: 'screenshot-gmail-draft-sk.html',  out: 'brand_assets/screenshot-gmail-draft-sk.png',  w: 900, h: 640 },
  { file: 'screenshot-flow-diagram-cs.html', out: 'brand_assets/screenshot-flow-diagram-cs.png', w: 900, h: 320 },
  { file: 'screenshot-flow-diagram-sk.html', out: 'brand_assets/screenshot-flow-diagram-sk.png', w: 900, h: 320 },
  { file: 'screenshot-followup-email-cs.html',    out: 'brand_assets/screenshot-followup-email-cs.png',    w: 900, h: 640 },
  { file: 'screenshot-followup-email-sk.html',    out: 'brand_assets/screenshot-followup-email-sk.png',    w: 900, h: 640 },
  { file: 'screenshot-followup-flow-cs.html',     out: 'brand_assets/screenshot-followup-flow-cs.png',     w: 900, h: 260 },
  { file: 'screenshot-followup-flow-sk.html',     out: 'brand_assets/screenshot-followup-flow-sk.png',     w: 900, h: 260 },
  { file: 'screenshot-followup-sequence-cs.html', out: 'brand_assets/screenshot-followup-sequence-cs.png', w: 900, h: 580 },
  { file: 'screenshot-followup-sequence-sk.html', out: 'brand_assets/screenshot-followup-sequence-sk.png', w: 900, h: 580 },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const s of shots) {
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
    const absPath = path.resolve(s.file).split('\\').join('/');
    await page.goto('file:///' + absPath, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: s.out, clip: { x: 0, y: 0, width: s.w, height: s.h } });
    console.log('done:', s.out);
  }
  await browser.close();
})();
