import { createRequire } from 'node:module';
const require = createRequire(process.argv[2]);
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({ headless: true });
for (const rate of [1, 4]) {
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const ms = await page.evaluate(() => { const t = performance.now(); let x = 0; for (let i = 0; i < 3e7; i++) x += Math.sqrt(i); return performance.now() - t; });
  console.log(`rate ${rate}: ${Math.round(ms)}ms`);
  await page.close();
}
console.log('chrome', await browser.version());
await browser.close();
