import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, 'brand_assets');

const browser = await puppeteer.launch({ headless: 'new' });

async function shot(file, outputName, width = 900, height = 560) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  const url = 'file:///' + path.join(__dirname, file).replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(out, outputName), type: 'png' });
  await page.close();
  console.log('✓', outputName);
}

await shot('screenshot-lead-app.html',  'screenshot-lead-app.png',  900, 560);
await shot('screenshot-lead-flow.html', 'screenshot-lead-flow.png', 900, 340);

await browser.close();
console.log('Done.');
